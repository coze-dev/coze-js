# @byted-apaas/rush-ci

## 简介

负责处理apaas/monorepo内各个需要发布的package的发布流程，可配合 CI 完成自动化流程。

```
Rush monorepo intergration action toolkit

Positional arguments:
  <command>
    change             Generate changes in a simple way.
    increment          Increment run your scripts
    codecov            Generate codecov config to apps.yaml
    codeowners         Auto generate codeowners
    fix-require-context
                       fix require.context
    diff               Get diff files of specified branch
    rebase             Auto rebase and update submodule
    publish            publish packages in a simple way.
    cov                Detect coverage
    version            Version packages in a simple way.
    publish-public     Publish package to npm
    privacy-check      privacy check packages that need to be released for
                       public
    sync-flags         Pull all FeatureFlag meta from Lark FG platform and
                       generate as TS code.
    deploy-build-server
                       deploy build server to faas
    rush-json-check    check rush.json
    audit              Audit Merge Request
    report-ut-data     Report full coverage data
    tab-complete       Provides tab completion.

Optional arguments:
  -h, --help           Show this help message and exit.
```

## 命令集

### version

version 用于发布流程的一环，不适用于本地使用。

#### 发布 alpha 版本

```
rush-x version --tag alpha --pre alpha

```

#### 更多参数及用法

```text
usage: rush-x version [-h] [--pre PRE] --tag PRERELEASE_TAG
                      [--repo-name REPO_NAME] [-b DEFAULT_BRANCH] [--list]
                      [-w WEB_HOOK] [-a AUTHOR] [-f FROM_TAG] [--by-diff]
                      [--to TO_PACKAGE] [--patch-tag] [--independent]
                      [-p CHANGED_PATH]


Version packages in a simple way.

Optional arguments:
  -h, --help            Show this help message and exit.
  --pre PRE             预发布发布类型
  --tag PRERELEASE_TAG  需要发布的包的 tag，用于 npm tag
  --repo-name REPO_NAME
                        仓库名 (变更需要更新到代码仓库时需要) The default value is
                        "apaas/monorepo".
  -b DEFAULT_BRANCH, --default-branch DEFAULT_BRANCH
                        默认分支名称 The default value is "master".
  --list                仅输出会被发布的 package 列表，而不执行
  -w WEB_HOOK, --web-hook WEB_HOOK
                        发布结果的回调地址，需要支持 post 调用
  -a AUTHOR, --author AUTHOR
                        触发人邮箱前缀，用于配合 web-hook 使用
  -f FROM_TAG, --from-tag FROM_TAG
                        仅发布 projects 内对应 tag 的包
  --by-diff             是否按分支 diff 差异发布变更的包
  --to TO_PACKAGE       发布指定的包,例如 --to @byted-apaas/rush-x
  --patch-tag           是否更新版本到代码仓库
  --independent         只升级指定的包,而不更新下游依赖（谨慎使用）
  -p CHANGED_PATH, --changed-path CHANGED_PATH
                        变更文件列表所在文件路径
```

### publish

publish 用于发布流程的一环，不可直接调用，也不适用于本地做发布

#### 发布 alpha 版本

```
rush-x publish --tag alpha --sha e3s239d

```
#### 发布 beta 版本

```
rush-x publish --tag beta --sha e3s239d
```

#### 发布 stable 版本

```
rush-x publish --tag latest --sha e3s239d
```

#### 更多参数及用法

```text
usage: rush-x publish [-h] [--tag TAG] --sha SHA [--dist-tag]
                      [--mr-url MR_URL] [-w WEB_HOOK] [-a AUTHOR]


Publish packages in a simple way.

Optional arguments:
  -h, --help            Show this help message and exit.
  --tag TAG             需要发布的包的 tag,用于 npm tag
  --sha SHA             用于发布的 commitId
  --dist-tag            此模式下将会更新 pre-${tag} 为 ${tag}
  --mr-url MR_URL       版本合并产生的 MR（CI 内使用，用来绑定发布信息）;当指定该参数时，则进行信息更新，并不做发布使用
  -w WEB_HOOK, --web-hook WEB_HOOK
                        发布结果的回调地址，需要支持 post 调用
  -a AUTHOR, --author AUTHOR
                        触发人邮箱前缀，用于配合 web-hook 使用
```

### change

根据当前 `commit-message` 自动为涉及的需要发布的包生成/更新 `changes` 文件（根据当前 git 暂存区的文件计算涉及的包）

#### 使用示例

```
rush-x change -c "feat: update readme"
```

如果是需要将变更提交到上次commit，可以使用 `-a` 参数

```
rush-x change -a
```



#### 详细参数

```
usage: rush-x change [-h] [-c COMMIT_MESSAGE] [-a]

Generate changes in a simple way.

Optional arguments:
  -h, --help            Show this help message and exit.
  -c COMMIT_MESSAGE, --commit-msg COMMIT_MESSAGE
                        本次提交信息,默认读取 .git/COMMIT_EDITMSG
  -a, --amend-commit    是否 amend commit 阶段
```

### increment

用于增量执行 rush 命令

#### 使用示例

```
rush-x increment -f "["infra/rush-x/a.txt"]" --action build
```

#### 详细参数

```
usage: rush-x increment [-h] [-f CHANGED_FILES]
                        [--action {build,coverage,test:cov,lint}]


Increment run your scripts.

Optional arguments:
  -h, --help            Show this help message and exit.
  -f CHANGED_FILES, --changed-files CHANGED_FILES
                        变更文件列表
  --action {build,coverage,test:cov,lint}
                        支持的增量操作命令
```

### codecov

用于生成变更项目的覆盖率配置文件，会配和更新 apps.yaml

#### 使用示例

```
rush-x codecov -c 60 -d 50 -f "["infra/rush-x/a.txt"]"
```

#### 详细参数

```
usage: rush-x codecov [-h] [-c COVERAGE] [-d DIFF_COVERAGE] [-f CHANGED_FILES]

Generate codecov config

Optional arguments:
  -h, --help            Show this help message and exit.
  -c COVERAGE, --coverage COVERAGE
                        覆盖率
  -d DIFF_COVERAGE, --diff-coverage DIFF_COVERAGE
                        增量覆盖率
  -f CHANGED_FILES, --changed-files CHANGED_FILES
                        变更文件列表
```

### codeowners

用于更新仓库下的 CODEOWNERS 文件

#### 使用示例

```
rush-x codeowners
```

#### 详细参数

```
usage: rush-x codeowners [-h]

Auto generate codeowner

Optional arguments:
  -h, --help  Show this help message and exit.
```

### fix-require-context

修复代码中 require.context 使用

#### 使用示例
```
rush-x fix-require-context [-h] [-p PATH]
```

#### 详细参数

```
usage: rush-x fix-require-context [-h] [-p PATH]

fix require.context

Optional arguments:
  -h, --help            Show this help message and exit.
  -p PATH, --path PATH  path
```

### diff

用于获取两个分支之间的 diff 文件

#### 使用示例

```
rush-x diff -s feature/a -t master
```

该命令会使用到 `codebase` 的 `jwt` 来做权限校验，默认从环境变量 `process.env.CODEBASE_JWT` 读取

#### 详细参数

```
usage: rush-x diff [-h] [-n TOKEN] [-r REPO_NAME] [-s SOURCE_BRANCH]
                   [-t TARGET_BRANCH]


Get diff files of specified branch

Optional arguments:
  -h, --help            Show this help message and exit.
  -n TOKEN, --token TOKEN
                        codebase 的 user jwt
  -r REPO_NAME, --repo-name REPO_NAME
                        仓库名，比如 apaas/monorepo. The default value is
                        "apaas/monorepo".
  -s SOURCE_BRANCH, --source-branch SOURCE_BRANCH
                        需要 diff 的源分支,默认当前分支
  -t TARGET_BRANCH, --target-branch TARGET_BRANCH
                        需要 diff 的目标分支,默认 master. The default value is
                        "master".
```

### cov

检测指定包的增量覆盖率数据

#### 使用示例

```
rush-x cov -t @byted-apaas/rush-x
```

#### 详细参数
```
usage: rush-x cov [-h] [-t PACKAGE_NAME]

Detect coverage

Optional arguments:
  -h, --help            Show this help message and exit.
  -t PACKAGE_NAME, --to PACKAGE_NAME
                        需要检测的包名
  -a, --accurate        是否采用精确的 diff 计算方式 (实验性)
```

### publish-public

用于发布公网包

#### 使用示例
该命令需配合配置文件使用，配置文件定义在仓库根目录下的 publish-public.json 内

```
rush-x publish-public -g cli
// 把 cli 分组下的包发布到公网
```

#### 详细参数

```
usage: rush-x publish-public [-h] [-d] [-g GROUP]

Publish package to npm

Optional arguments:
  -h, --help            Show this help message and exit.
  -d, --dry-run         是否 dry run 模式
  -g GROUP, --group GROUP
                        指定需要发布的组名，如 -g cli, 会发布其对应的入口包
```

## 调试

```
rushx dev
// 例如调试 change
rushx dev change -h
```
### 调试发包

```
import { RushCICommandLine } from './index';

const rushCI = new RushCICommandLine();

rushCI.execute([
  'publish',
  '--repo-name',
  'apaas/monorepo',
  '--tag',
  'beta',
  '--prerelease-name',
  `beta.${Math.random().toString().slice(-6)}`,
  '--ignore-install',
  '--list-only',
]);
// 如果需要再自己分支测试发布 beta版本或正式版的效果 可以添加 `-b` 参数，值为自己分支
// 例如   '-b' 'chore/package-publish-1'
```

## 构建
发包是使用 `rushx build` 构建

项目内使用时请执行`rushx build:bootstrap`构建（请在文件修改后执行此命令，并将打包结果提交）