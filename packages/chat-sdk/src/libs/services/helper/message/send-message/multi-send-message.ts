import { type EnterMessage, RoleType, type ObjectStringItem } from "@coze/api";
import {
  RawMessageType,
  type RawMessage,
  ChooseFileInfo,
  FileTypeEnum,
  type AudioRaw,
} from "@/libs/types";
import {
  convertToMinChatError,
  logger,
  MiniChatError,
  MiniChatErrorCode,
} from "@/libs/utils";
import { RawSendMessage } from "./raw-send-message";

export { RawMessageType, type RawMessage };
export interface ObjectStringItemMix {
  type: "file" | "image";
  name?: string;
  size?: string;
  file_url: string;
  file_id?: string;
  file_info?: ChooseFileInfo;
}

export class MultiSendMessage extends RawSendMessage {
  async sendTextMessage(content: string, historyMessages?: EnterMessage[]) {
    const message: EnterMessage = {
      role: RoleType.User,
      content,
      content_type: "text",
    };
    this.sendStartMessage(message);
    this.sendMessage(message, historyMessages);
  }
  async sendFileMessage(
    files: ChooseFileInfo[],
    historyMessages?: EnterMessage[]
  ) {
    const content: ObjectStringItemMix[] = files
      .map((item) => this.packFileObject(item))
      .filter((item) => !!item) as ObjectStringItemMix[];
    const message: EnterMessage = {
      role: RoleType.User,
      content: content as ObjectStringItem[],
      content_type: "object_string",
    };
    this.sendStartMessage(message);
    const fileList = await this.uploadFile(files);
    if (!fileList) {
      //失败了。
      this.sendErrorEvent(
        new MiniChatError(-1, this.i18n.t("sendMessageUploadFailed"))
      );
      return;
    }
    this.messageSended.content = JSON.stringify(fileList);
    message.content = JSON.stringify(
      fileList.map((item) => ({
        type: item.type,
        file_id: item.file_id,
      }))
    );

    // @ts-expect-error -- linter-disable-autofix
    message.content = content;
    this.sendStartMessage({
      ...message,
    });

    this.sendMessage(message, historyMessages);
  }
  async sendAudioMessage(audio: AudioRaw, historyMessages?: EnterMessage[]) {
    logger.info("sendAudioMessage audio", audio);
    const message: EnterMessage = {
      role: RoleType.User,
      content: "",
      content_type: "text",
    };
    this.sendStartMessage({
      ...message,
      content: "",
      isAudioTranslatingToText: true,
    });
    try {
      const content = await this.translateAudioToText(audio);
      logger.debug("sendAudioMessage content", content);

      message.content = content;
      this.sendStartMessage({
        ...message,
        isAudioTranslatingToText: false,
      });

      this.sendMessage(message, historyMessages);
    } catch (error) {
      logger.error("sendAudioMessage", { error });
      const miniChatError = convertToMinChatError(error);
      const content = miniChatError?.getErrorMessageByI18n?.(
        this.i18n,
        {},
        this.i18n.t("sendMessageTranslationAudioFailed")
      );
      this.messageSended.isAudioTranslatingToText = false;
      this.messageSended.content = content;
      this.sendErrorEvent(miniChatError);
      return;
    }
  }

  private async translateAudioToText(audio: AudioRaw): Promise<string> {
    const res = await this.chatService.translation({
      file: {
        filePath: audio.tempFilePath,
        fileName: audio.fileName,
      },
    });
    if (!res.text) {
      throw new MiniChatError(
        MiniChatErrorCode.Audio_Translation_NoContent,
        this.i18n.t("sendMessageTranslationAudioNone")
      );
    }
    return res.text;
  }

  private async uploadFile(
    file: ChooseFileInfo[]
  ): Promise<ObjectStringItemMix[] | null> {
    const fileList: ObjectStringItemMix[] = [];
    let hasError = false;
    try {
      await Promise.all(
        file.map(async (item) => {
          const packResult = this.packFileObject(item);
          if (packResult) {
            const res = await this.chatService.upload({
              file: item.file,
            });
            packResult.file_id = res.id;
            fileList.push(packResult);
          }
        })
      );
    } catch (error) {
      hasError = true;
    }
    return hasError ? null : fileList;
  }
  private getObjectStringType(fileType: FileTypeEnum) {
    return fileType === FileTypeEnum.IMAGE ? "image" : "file";
  }
  private packFileObject(fileInfo: ChooseFileInfo): ObjectStringItemMix | null {
    const type = this.getObjectStringType(fileInfo.type);
    switch (type) {
      case "image": {
        return {
          type: "image",
          file_url: fileInfo.tempFilePath,
          file_info: fileInfo,
        };
      }
      case "file": {
        return {
          type: "file",
          // @ts-expect-error -- linter-disable-autofix
          name: fileInfo.file.name,
          // @ts-expect-error -- linter-disable-autofix
          size: fileInfo.file.size,
          file_url: fileInfo.tempFilePath,
          file_info: fileInfo,
        };
      }
      default: {
        return null;
      }
    }
  }
  async sendRawMessage(
    rawMessage: RawMessage,
    historyMessages?: EnterMessage[]
  ) {
    this.messageSended.rawMessage = rawMessage;
    switch (rawMessage.type) {
      case RawMessageType.TEXT: {
        return await this.sendTextMessage(rawMessage.data, historyMessages);
      }
      case RawMessageType.FILE: {
        return await this.sendFileMessage(rawMessage.data, historyMessages);
      }
      case RawMessageType.AUDIO: {
        return await this.sendAudioMessage(rawMessage.data, historyMessages);
      }
      default: {
        throw new MiniChatError(-1, "unknown message type");
      }
    }
  }
}
