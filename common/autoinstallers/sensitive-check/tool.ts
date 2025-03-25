import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';

const checkPath = path.resolve('./');

// 获取 commit log
function opensourceGetCommitLog(repoFolderPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    process.chdir(repoFolderPath);
    exec('git log -p > ./opensource_git_commit.log', (error, stdout) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}

// 删除 commit log
function opensourceRmCommitLog(repoFolderPath: string): void {
  const file = 'opensource_git_commit.log';
  const filePath = path.join(repoFolderPath, file);
  fs.unlinkSync(filePath);
}

function shouldIgnoreKeywords(ignoreListKeywords: string[], line: string): boolean {
  return ignoreListKeywords.some(ignoreKey => {
    const pattern = new RegExp(ignoreKey, 'i');
    return pattern.test(line);
  });
}

interface SensitiveCheckOptions {
  keywordsList: string[];
  ignoreListKeywords: string[];
  repoFolderPath: string;
  aigcKeywordsGroup1: string[];
  aigcKeywordsGroup2: string[];
}

async function checkSensitiveInformation({
  keywordsList,
  ignoreListKeywords,
  repoFolderPath,
  aigcKeywordsGroup1,
  aigcKeywordsGroup2
}: SensitiveCheckOptions): Promise<void> {
  const ignoredExtensions = ['.tgz', '.zip', '.tar', '.rar', '.gif', '.jpg', '.png',
                           '.jpeg', '.svg', '.tiff', '.raw', '.ico', '.webp', '.tga'];
  const ignoredPaths = ['/.git/', '/node_modules/', '/temp/', '/sensitive-check/'];

  function walkSync(dir: string) {
    // 检查是否应该忽略该文件
    if (ignoredPaths.some(p => dir.includes(p))) {
      return;
    }
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        walkSync(filePath);
      } else {
        // 检查是否应该忽略该文件
        if (ignoredExtensions.some(ext => file.endsWith(ext))) {
          return;
        }
        try {
          let cnt = 0;
          const content = fs.readFileSync(filePath, 'latin1');
          const lines = content.split('\n');

          lines.forEach((line, index) => {
            cnt = index + 1;
            if (!shouldIgnoreKeywords(ignoreListKeywords, line.trim())) {
              keywordsList.forEach(pattern => {
                const regex = new RegExp(pattern, 'i');
                const result = line.trim().match(regex);

                if (pattern === '(tokenizer|transformer|token_id|tokenid|attention_head).{0,20}') {
                  if (file.endsWith('.json') && result) {
                    logSensitiveInfo(filePath, cnt, result[0]);
                  }
                } else if (result) {
                  logSensitiveInfo(filePath, cnt, result[0]);
                }
              });
            }
          });

          // 检查 AIGC 关键词
          if (file.endsWith('.json')) {
            if (aigcKeywordsGroup1.every(keyword => content.includes(keyword))) {
              logAigcSensitiveInfo(filePath, aigcKeywordsGroup1);
            } else if (aigcKeywordsGroup2.every(keyword => content.includes(keyword))) {
              logAigcSensitiveInfo(filePath, aigcKeywordsGroup2);
            }
          }
        } catch (error) {
          console.error(`Error processing file ${filePath}:`, error);
        }
      }
    });
  }

  walkSync(repoFolderPath);
}

function logSensitiveInfo(filePath: string, line: number, sensitiveContent: string): void {
  const message = `File "${filePath}, line, ${line}," have some sensitive information: ${sensitiveContent}`;
  console.log('\x1b[36m%s\x1b[0m', message);
  fs.appendFileSync('./sensitive_info_result.txt', message + '\n', 'utf8');
}

function logAigcSensitiveInfo(filePath: string, keywords: string[]): void {
  const message = `File "${filePath} have some aigc sensitive information: ${JSON.stringify(keywords)}`;
  console.log('\x1b[36m%s\x1b[0m', message);
  fs.appendFileSync('./sensitive_info_result.txt', message + '\n', 'utf8');
}

function detectionResult(): void {
  if (!fs.existsSync('./sensitive_info_result.txt')) {
    console.log('=======Detection passed, no sensitive information found=======');
  }
}

async function main(path: string): Promise<void> {
  const repoFolderPath = path;

  await opensourceGetCommitLog(repoFolderPath);

  const keywordsList = [
    String.raw`npm\s{1,20}install.{1,30}`,
    String.raw`AKLT\w{43,44}`,
    String.raw`AKAP\w{43,44}`,
    String.raw`(tokenizer|transformer|token_id|tokenid|attention_head).{0,20}`,
    String.raw`(A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}`,
    String.raw`(LTAI)[a-z0-9]{20}`,
    String.raw`AKTP\w{43,44}`,
    String.raw`([^*<\s|:>]{0,7})(app_id|appid)([^]()!<>;/@&,]{0,10}[(=:]\s{0,6}[\"']{0,1}[0-9]{6,32}[\"']{0,1})`,
    String.raw`.{0,15}\.?byted.org.{0,20}`,
    String.raw`.{0,15}\.?bytedance.net.{0,20}`,
    String.raw`.{0,20}.bytedance\.feishu\.cn.{0,50}`,
    String.raw`.{0,20}.bytedance\.larkoffice\.com.{0,50}`,
    String.raw`(10\.\d{1,3}\.\d{1,3}\.\d{1,3})`,
    String.raw`([^*<\s|:>]{0,4})(testak|testsk|ak|sk|key|token|auth|pass|cookie|session|password|app_id|appid|secret_key|access_key|secretkey|accesskey|credential|secret|access)(\s{0,10}[(=:]\s{0,6}[\"']{0,1}(?=[a-zA-Z]*[0-9])(?=[0-9]*[a-zA-Z])[a-zA-Z0-9]{16,32}[\"']{0,1})`
  ];

  const aigcKeywordsGroup1 = ["token", "temp", "role"];
  const aigcKeywordsGroup2 = ["layer", "token", "head"];

  const ignoreListKeywords = [
    String.raw`[^*<>]{0,6}token[^]()!<>;/@&,]{0,10}[=:].{0,1}null,`,
    String.raw`.{0,5}user.{0,10}[=:].{0,1}null`,
    String.raw`.{0,5}pass.{0,10}[=:].{0,1}null`,
    String.raw`passport[=:]`,
    String.raw`[^*<>]{0,6}key[^]()!<>;/]{0,10}[=:].{0,1}string.{0,10}`,
    String.raw`.{0,5}user.{0,10}[=:].{0,1}string`,
    String.raw`.{0,5}pass.{0,10}[=:].{0,1}string`,
    String.raw`.{0,5}app_id[^]()!<>;/@&,]{0,10}[=:].{0,10}\+`,
    String.raw`.{0,5}appid[^]()!<>;/@&,]{0,10}[=:].{0,10}\+`
  ];

  await checkSensitiveInformation({
    keywordsList,
    ignoreListKeywords,
    repoFolderPath,
    aigcKeywordsGroup1,
    aigcKeywordsGroup2
  });

  detectionResult();
  opensourceRmCommitLog(repoFolderPath);
}

// 执行主函数
main(checkPath).catch(console.error);
