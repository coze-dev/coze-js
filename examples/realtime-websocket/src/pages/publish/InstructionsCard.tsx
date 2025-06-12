/* eslint-disable */
import { Card, Typography } from 'antd';

const { Paragraph } = Typography;

export const InstructionsCard = () => {
  return (
    <Card
      title="使用说明"
      style={{ width: '100%', maxWidth: '800px', marginTop: '24px' }}
    >
      <Paragraph>
        <ol>
          <li>点击右上角"设置"按钮，配置 AppID 和 StreamID</li>
          <li>确保授予浏览器麦克风访问权限</li>
          <li>从下拉菜单中选择您想要使用的麦克风</li>
          <li>点击中央的麦克风按钮开始发布</li>
          <li>
            发布成功后，可以点击"语音播报"按钮生成可分享的链接和二维码
          </li>
          <li>您可以随时点击麦克风按钮切换静音状态</li>
          <li>完成后点击"结束会议"按钮停止发布</li>
        </ol>
      </Paragraph>
    </Card>
  );
};

export default InstructionsCard;
