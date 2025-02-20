import { useEffect, useMemo, useRef, useState } from 'react';

import { logger } from '@/libs/utils';
import { type ChatFrameworkProps, ChatType } from '@/libs/types';
import { useUpdateEffect } from '@/libs/hooks';

import { type IChatFlowProps } from '../type';
import { getToken } from '../helper/get-token';
import { getConnectorId } from '../helper/get-connector-id';
import { genErrorRender } from '../helper/gen-error-render';
import { ChatFlowService, getCustomAppInfo } from '../helper/chat-service';

import styles from './index.module.less';
export const useInitChat = (props: IChatFlowProps) => {
  const { project: projectInfo, userInfo } = props;
  const [hasReady, setHasReady] = useState(false);
  const [authProp, setAuthProp] = useState<ChatFrameworkProps['auth']>();
  const refService = useRef<ChatFlowService>();

  // The parameters will be changed immediately, so we don't code it in useEffect.
  refService.current?.updateChatFlowProps(props);
  const syncModifyChatProps: Omit<ChatFrameworkProps, 'auth'> = useMemo(
    () => ({
      chat: {
        appId: projectInfo?.id,
        type: projectInfo?.type === 'app' ? ChatType.App : ChatType.Bot,
        ...getCustomAppInfo(props),
      },
      user: userInfo,
      ui: {
        layout: props.areaUi?.layout || 'pc',
        isMiniCustomHeader: props?.areaUi?.isMiniCustomHeader,
        isReadonly: props?.areaUi?.isDisabled,
        header: {
          isNeed: false,
          ...(props?.areaUi?.header || {}),
        },
        footer: {
          containerClassName:
            props.project?.mode !== 'websdk'
              ? styles['footer-container']
              : undefined,

          ...props?.areaUi?.footer,
        },
        loading: {
          renderLoading: props?.areaUi?.renderLoading,
        },
        error: {
          renderError: genErrorRender(props),
        },
        chatSlot: {
          base: {
            maxWidth: 600,
          },
          input: props?.areaUi?.input,
          clearContext: props?.areaUi?.clearContext,
          clearMessage: props?.areaUi?.clearMessage,
          uploadBtn: props?.areaUi?.uploadBtn,
          message: props?.areaUi?.message,
        },
      },
      eventCallbacks: {
        onImageClick: props?.eventCallbacks?.onImageClick,
        onInitRetry: () => {
          setHasReady(false);
        },
        onThemeChange: props?.eventCallbacks?.onThemeChange,
        message: props?.eventCallbacks?.message,
      },
      setting: {
        ...(props?.setting || {}),
        onGetCustomChatService: chatServiceProps => {
          refService.current = new ChatFlowService(chatServiceProps, props);
          return refService.current;
        },
      },
    }),
    [props],
  );
  useEffect(() => {
    if (hasReady) {
      return;
    }

    // just check param for console, don't do any more;
    checkParam(props);
    (async () => {
      // getToken will never throw an exception, so we don't need to catch it;
      const { token, refreshToken } = await getToken(props);
      setAuthProp({
        // don't need to check token, because it will be checked in chat framework
        token: token as string,
        onRefreshToken: refreshToken as () => Promise<string>,
        connectorId: getConnectorId(props),
      });
      setHasReady(true);
    })();
  }, [hasReady]);

  useUpdateEffect(() => {
    logger.info('useInitChat reRender');
    setHasReady(false);
  }, [
    projectInfo?.id,
    projectInfo?.type,
    projectInfo?.conversationName,
    projectInfo?.mode,
    props?.workflow?.id,
  ]);
  return {
    hasReady,
    chatProps: Object.assign(syncModifyChatProps, { auth: authProp }),
  };
};

function checkParam(props: IChatFlowProps) {
  let error: Error | undefined;
  if (props?.project?.type === 'bot') {
    if (props?.project?.mode !== 'draft') {
      logger.error('mode must be draft when project type is bot');
    }
  } else {
    if (props?.auth?.type !== 'internal') {
      if (!props?.auth?.token) {
        logger.error('token is required when auth type is not internal');
      }
    }
  }
  return error;
}
