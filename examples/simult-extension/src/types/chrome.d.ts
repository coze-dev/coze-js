// Type definitions for Chrome extension API
interface Chrome {
  runtime: {
    onMessage: {
      addListener: (
        callback: (
          message: any,
          sender: any,
          sendResponse: (response?: any) => void,
        ) => boolean | void,
      ) => void;
    };
    sendMessage: (
      message: any,
      responseCallback?: (response: any) => void,
    ) => void;
  };
  storage: {
    local: {
      get: (
        keys: string | string[] | object | null,
        callback: (items: { [key: string]: any }) => void,
      ) => void;
      set: (items: object, callback?: () => void) => void;
    };
  };
}

declare global {
  var chrome: Chrome;
}
