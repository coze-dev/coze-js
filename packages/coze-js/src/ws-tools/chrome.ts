// Type definitions for Chrome extension API
/* eslint-disable @typescript-eslint/no-explicit-any */
interface Chrome {
  runtime: {
    id: string;
    getURL: (path: string) => string;
    onMessage: {
      addListener: (
        callback: (
          message: any,
          sender: any,
          sendResponse: (response?: any) => void,
        ) => boolean,
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

// declare global {
//   var chrome: Chrome;
// }
// eslint-disable-next-line  @typescript-eslint/no-unused-vars
declare let chrome: Chrome;
