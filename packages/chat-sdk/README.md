# Coze Chat Sdk

Official Chat SDK for [Coze](https://www.coze.com)（or [扣子](https://www.coze.cn)）.(Taro and Web)

## Quick Start

### 1. Installation

```sh
npm install @coze/chat-sdk
# or
pnpm install @coze/chat-sdk
```

### 2. Basic Usage For Taro

```javascript
import { View } from "@tarojs/components";
import { ChatFramework, ChatSlot, ChatType, Language } from "@coze/chat-sdk";

export default function Index() {
  return (
    <View className="height-100">
      <ChatFramework
        chat={{
          appId: "7329529575539572743",
          type: ChatType.Bot,
        }}
        setting={{
          apiBaseUrl: "https://api.coze.cn",
          language: Language.EN,
          requestHeader: {},
          logLevel: "debug",
        }}
        auth={{
          token: "##############",
          onRefreshToken: (oldToken) => {
            return "##############";
          },
        }}
        user={{
          id: "UserId123",
          name: "Mr.XXX",
          avatar:
            "https://sf16-passport-sg.ibytedtos.com/obj/user-avatar-alisg/e0622b06d99df6ead022ca4533ca631f.png",
        }}
      >
        <ChatSlot className={"chat-slot"} />
      </ChatFramework>
    </View>
  );
}
```

### 2. Basic Usage For Web

```javascript
import "@coze/chat-sdk/webCss";
import ChatSdk from "@coze/chat-sdk/webJs";
const { ChatFramework, ChatSlot, ChatType, Language } = ChatSdk;

export default function Index() {
  return (
    <div className="height-100">
      <ChatFramework
        chat={{
          appId: "7329529575539572743",
          type: ChatType.Bot,
        }}
        setting={{
          apiBaseUrl: "https://api.coze.cn",
          language: Language.EN,
          requestHeader: {},
          logLevel: "debug",
        }}
        auth={{
          token: "##############",
          onRefreshToken: (oldToken) => {
            return "##############";
          },
        }}
        user={{
          id: "UserId123",
          name: "Mr.XXX",
          avatar:
            "https://sf16-passport-sg.ibytedtos.com/obj/user-avatar-alisg/e0622b06d99df6ead022ca4533ca631f.png",
        }}
      >
        <ChatSlot className={"chat-slot"} />
      </ChatFramework>
    </div>
  );
}
```

### 3. Parameters Description

- `chat`
  - `appId` - The app id of the bot or the conversation.
  - `type` - The type of the chat.
- `setting`
  - `apiBaseUrl` - The base url of the api.
  - `cdnBaseUrlPath` - The base url path of the cdn. It must be provided. Below is the optional CDN address, you can also upload resources to your own server and fill in your own address. The original resources are in the `src/libs/assets/imgs` folder.
    - va: https://sf16-va.tiktokcdn.com/obj/eden-va2/rkzild_lgvj/ljhwZthlaukjlkulzlp/
    - sg: https://sf16-sg.tiktokcdn.com/obj/eden-sg/rkzild_lgvj/ljhwZthlaukjlkulzlp/
    - cn: https://lf3-static.bytednsdoc.com/obj/eden-cn/rkzild_lgvj/ljhwZthlaukjlkulzlp/
  - `language` - The language of the chat.
  - `requestHeader` - The request header of the api.
  - `logLevel` - The log level of the chat.
- `auth`
  - `token` - The token of the user.
  - `onRefreshToken` - The callback function to refresh the token.
- `user`
  - `id` - The id of the user.
  - `name` - The name of the user.
  - `avatar` - The avatar of the user.
- `ui`

  - `isMiniCustomHeader` - Whether to use the mini custom header. It's just for mini program.
  - `isReadonly` - Whether to use the readonly mode.
  - `header` - The config of the header

    - `isNeed` - Whether to show the header, default is true
    - `icon` - The icon of the header
    - `title` - The title of the header

  - `footer` - The config of the footer
    - `isNeed` - Whether to show the footer, default is true
    - `expressionText` - The text of the expression
    - `linkvars` - The link vars for the expression
  - `chatSlot` - The config of the chat slot
    - `input` - The config of the input
      - `isNeedAudio` - Whether to show the audio input, default is false
      - `isNeed` - Whether to show the input, default is true
      - `placeholder` - The placeholder of the input
      - `isNeedSendButton` - Whether to show the send button, default is true
  - `clearContext` - The config of the clear context
    - `isNeed` - Whether to show the clear context, default is true
    - `position` - The position of the clear context, default is InputLeft.
  - `clearMessage` - The config of the clear message
    - `isNeed` - Whether to show the clear message, default is true
    - `position` - The position of the clear message, default is headerRight.
  - `uploadBtn` - The config of the upload button
    - `isNeed` - Whether to show the upload button, default is true
