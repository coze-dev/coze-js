import { isWeb } from "../device";
import { logger } from "../logger";
import { H5RecorderManagerInstance } from "./h5-recorder-manager";
import { TaroRecorderManager } from "./taro-recorder-manager";
export { BaseRecorderManager, RecorderEvent } from "./type";
export const getRecorderManager = () => {
  if (isWeb) {
    logger.debug("get H5 recorder manager");

    return new H5RecorderManagerInstance();
  } else {
    logger.debug("get taro recorder manager");
    return new TaroRecorderManager();
  }
};
