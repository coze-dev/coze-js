import { createStyles } from 'antd-style';
const useStyle = createStyles(({ token, css }) => ({
  layout: css`
    width: 100%;
    min-width: 1000px;
    height: 722px;
    border-radius: ${token.borderRadius}px;
    display: flex;
    background: ${token.colorBgContainer};
    font-family: AlibabaPuHuiTi, ${token.fontFamily}, sans-serif;

    .ant-prompts {
      color: ${token.colorText};
    }
  `,
  menu: css`
    background: ${token.colorBgLayout}80;
    width: 280px;
    height: 100%;
    display: flex;
    flex-direction: column;
  `,
  conversations: css`
    padding: 0 12px;
    flex: 1;
    overflow-y: auto;
  `,
  chat: css`
    height: 100%;
    width: 100%;
    max-width: 700px;
    margin: 0 auto;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    padding: ${token.paddingLG}px;
    gap: 16px;
  `,
  messages: css`
    flex: 1;
  `,
  placeholder: css`
    padding-top: 32px;
    width: 652px;
  `,
  sender: css`
    box-shadow: ${token.boxShadow};
  `,
  logo: css`
    display: flex;
    height: 72px;
    align-items: center;
    justify-content: start;
    padding: 0 24px;
    box-sizing: border-box;

    img {
      width: 24px;
      height: 24px;
      display: inline-block;
    }

    span {
      display: inline-block;
      margin: 0 8px;
      font-weight: bold;
      color: ${token.colorText};
      font-size: 16px;
    }
  `,
  addBtn: css`
    background: #1677ff0f;
    border: 1px solid #1677ff34;
    width: calc(100% - 24px);
    margin: 0 12px 24px 12px;
  `,
}));

export default useStyle;
