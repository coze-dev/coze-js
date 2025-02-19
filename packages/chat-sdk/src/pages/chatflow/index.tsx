import { View } from "@tarojs/components";
import { useEffect, useState } from "react";
import styles from "./index.module.less";
import { IChatFlowProps } from "@/chatflow/type";
import { ChatFlowFramework } from "@/chatflow";
import { ChatSlot, RawMessageType, useChatInfoStore } from "@/libs";
import UserIcon from "@/libs/ui-kit/assets/imgs/coze-logo.png";
import { useSendMessage } from "@/libs/services";
export const cnBotInfo = {
  appId: "7472176199100645402",
  workflowId: "7472209247696551955",
  apiBaseUrl: "https://api.coze.cn",
  conversationName: "Test3",
  tokenType: "external",
  token: "pat_CCit2upKNLH778OtaoAspgyYYh5clTvgYuAqR4rBQgXuzbCwmY4QjQWdFiGBvGlX",
};
export const enBotInfo = {
  appId: "7329529575539572743",
  apiBaseUrl: "https://api.coze.com",
  token: "pat_JKnvkrN7bzTvHHf9bYq8bnJPFIH4TFir9M4P7kMCBYhgwtHP8jf4hadNetEXXOU7",
};
export const boeBotInfo = {
  appId: "7440555625941631020",
  workflowId: "7441166757690064940",
  apiBaseUrl: "https://api-bot-boe.bytedance.net",
  tokenType: "internal",
  conversationName: "Chatflow3",
  token: "pat_nDifwbBHwz4PSIIvCAtBH9DSmr8RmymxPnhW0cuVrVUlcRwt9wPTnTVyos2bT4NA",
};

const botInfo = cnBotInfo;

// 美东： https://sf16-va.tiktokcdn.com/obj/eden-va2/rkzild_lgvj/ljhwZthlaukjlkulzlp/assets/imgs/chatflow-logo.png
// SG:   https://sf16-sg.tiktokcdn.com/obj/eden-sg/rkzild_lgvj/ljhwZthlaukjlkulzlp/assets/imgs/chatflow-logo.png
// CN:   https://lf3-static.bytednsdoc.com/obj/eden-cn/rkzild_lgvj/ljhwZthlaukjlkulzlp/assets/imgs/chatflow-logo.png
export default function Index() {
  const [workflow, setWorkflow] = useState({
    id: botInfo.workflowId,
    parameters: {},
  });
  const auth: IChatFlowProps["auth"] = {
    type: botInfo.tokenType || "internal",
    token: botInfo.token,
    refreshToken: () => {
      return botInfo.token;
    },
  };
  const setting: IChatFlowProps["setting"] = {
    // apiBaseUrl: "https://api.coze.cn",
    apiBaseUrl: botInfo.apiBaseUrl,
    //cdnBaseUrlPath:
    //  "https://sf16-va.tiktokcdn.com/obj/eden-va2/rkzild_lgvj/ljhwZthlaukjlkulzlp",
    logLevel: "debug",
    requestHeader: {
      "x-tt-env": "ppe_chatflow_role",
      "x-use-ppe": "1",
    },
  };
  const [onBoarding, setOnBoarding] = useState({
    // prologue:
    // "[stetsa](https://www.baidu.com)\n\n![45379212846b4c68b4286e5189a22b70.jpeg](https://www.coze.com/s/Zs8AutFQd/)\n\n尊敬的{{user_name}}，你好",
    // prologue: "123123",
    suggestions: [
      "asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf ",
    ],
  });
  const [userInfo, setUserInfo] = useState({
    id: "ID1234567890",
    name: "GaoTest",
    avatar: UserIcon,
    //"https://p6-passport.byteacctimg.com/img/user-avatar/04628af005e4ca4cecc9f106b4162b3a~300x300.image",
  });
  const [project, setProject] = useState<IChatFlowProps["project"]>({
    id: botInfo.appId,
    type: "app",
    conversationName: botInfo.conversationName || "asf",
    name: "https://www.coze.cn/space/7321567613585424403/project-ide/7459982518834446351/workflow/7459756038184026112",
    mode: "draft",
    //mode: "websdk",
    //iconUrl:
    //  "https://p6-passport.byteacctimg.com/img/user-avatar/04628af005e4ca4cecc9f106b4162b3a~300x300.image",
    onBoarding,
  });
  const [areaUi, setAreaUi] = useState<IChatFlowProps["areaUi"]>({
    layout: "pc",
    isDisabled: false,
    isMiniCustomHeader: false,
    clearContext: {
      isNeed: true,
    },
    clearMessage: {
      isNeed: true,
    },
    uploadBtn: {
      isNeed: true,
    },
    header: {
      isNeed: true,
      //icon: "https://p6-passport.byteacctimg.com/img/user-avatar/04628af005e4ca4cecc9f106b4162b3a~300x300.image",
      title: "Test",
      renderRightSlot: () => {
        return <div>asdf</div>;
      },
    },
    footer: {
      isNeed: true,
      /*expressionText: "Ai Test{{baidu}}",
      linkvars: {
        baidu: {
          text: "Baidu",
          link: "https://www.baidu.com",
        },
      },*/
    },
    renderLoading: () => {
      return <View className={styles.loading}>Loading</View>;
    },
    input: {
      placeholder: "请输入你的s问题",
      isNeed: true,
      isNeedTaskMessage: true,
      isNeedAudio: true,
      //defaultText: "Chatflow DefaultText",
      renderChatInputTopSlot: () => <div> Input Top Slot</div>,
    },
    /* bgInfo: {
      imgUrl:
        "https://p6-bot-sign.byteimg.com/tos-cn-i-v4nquku3lp/12c18226f4ca4ee2899509a43144f9aa.png~tplv-v4nquku3lp-image.image?rk3s=50ccb0c5&x-expires=1798892047&x-signature=C0MJ64WRnlPdD7Yg4UOGpgiKanI%3D",

      themeColor: "#322725",
    },*/
    //renderLoading: () => <div>Loading</div>,
  });
  console.log("chatflow props:", {
    workflow,
    project,
    userInfo,
    areaUi,
    setting,
    auth,
  });
  console.log("chatflow test func", {
    setOnBoarding,
    setUserInfo,
    setProject,
    setAreaUi,
    setWorkflow,
  });
  return (
    <View
      className={styles.container}
      onTouchStart={(e) => {
        e.stopPropagation(), e.preventDefault();
      }}
      onTouchMove={(e) => {
        e.stopPropagation(), e.preventDefault();
      }}
    >
      <View className={styles["chat-container"]}>
        <ChatFlowFramework
          {...{
            workflow,
            project: {
              ...project,
              caller: "CANVAS",
              onBoarding,
            },
            userInfo,
            areaUi,
            setting,
            auth,
            eventCallbacks: {
              onGetChatFlowExecuteId: (executeId) => {
                console.log("onGetChatFlowExecuteId:", executeId);
              },
              onImageClick: (extra) => {
                console.log("onImageClick:", extra);
              },
              onThemeChange: (type) => {
                console.log("onThemeChange", type);
              },
              onInitSuccess: () => {
                console.log("onInitSuccess。。。。");
              },
              message: {
                afterMessageReceivedFinish: (ck) => {
                  console.log("afterMessageReceivedFinish:", ck);
                },
              },
            },
          }}
        >
          <ChatFlowNode />
        </ChatFlowFramework>
      </View>
    </View>
  );
}

const ChatFlowNode = () => {
  const { sendMessage } = useSendMessage();
  const { isLoading, error } = useChatInfoStore((store) => ({
    isLoading: store.isLoading,
    error: store.error,
  }));
  useEffect(() => {
    if (isLoading === false && !error) {
      return; /*
      sendMessage({
        type: RawMessageType.TEXT,
        data: "123",
      });*/
    }
  }, [isLoading, error]);
  return <ChatSlot className={styles.ChatSlot} />;
};
