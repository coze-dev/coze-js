import { Fragment } from "react";

import cls from "classnames";
import { View } from "@tarojs/components";
import { type ChatMessageGroup } from "@/libs/types";
import { useConversationStore, useIsMobile } from "@/libs/provider";
import { SectionPrologueGroup, TopPrologueGroup } from "./prologue-group";
import { ChatGroup } from "./chat-group";
import styles from "./index.module.less";

const ChatGroups = ({
  chatMessageGroups,
  className,
}: {
  chatMessageGroups: ChatMessageGroup[];
  className?: string;
  id?: string;
}) => {
  const { hasInProcessChatMessageGroup, sectionId } = useConversationStore(
    (store) => ({
      hasInProcessChatMessageGroup: !!store.inProcessChatMessageGroup,
      sectionId: store.sectionId,
    })
  );
  return (
    <View className={cls(styles["chat-group"], className)}>
      {chatMessageGroups.map((item, index) => (
        <Fragment key={item.id}>
          <ChatGroup
            chatGroup={item}
            isLastMessage={
              index === chatMessageGroups.length - 1 &&
              !hasInProcessChatMessageGroup
            }
            isShowSuggestion={
              // 如果是最后一个，同时没有进行中消息，同时section是一条数据，则展示suggestion;
              index === chatMessageGroups.length - 1 &&
              !hasInProcessChatMessageGroup &&
              sectionId === item.sectionId
            }
          />
          <SectionPrologueGroup
            chatMessageGroupNow={item}
            chatMessageGroupNext={chatMessageGroups[index + 1]}
          />
        </Fragment>
      ))}
    </View>
  );
};
const InProcessingChatMessageGroup = () => {
  const { inProcessChatMessageGroup } = useConversationStore((store) => ({
    inProcessChatMessageGroup: store.inProcessChatMessageGroup,
  }));
  if (!inProcessChatMessageGroup) {
    return null;
  }
  return (
    <ChatGroup
      chatGroup={inProcessChatMessageGroup}
      isLastMessage={true}
      isProcessing={true}
      isShowSuggestion={true}
    />
  );
};

export const ChatGroupList = () => {
  const { chatMessageGroups } = useConversationStore((store) => ({
    chatMessageGroups: store.chatMessageGroups,
  }));
  const isMobile = useIsMobile();
  return (
    <View
      className={cls(styles.container, {
        [styles.mobile]: isMobile,
      })}
    >
      <TopPrologueGroup />
      <ChatGroups chatMessageGroups={chatMessageGroups} />
      <InProcessingChatMessageGroup />
    </View>
  );
};
