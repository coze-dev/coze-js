import { describe, expect, test } from "vitest";
import {
  MiniChatError,
  MiniChatErrorCode,
} from "../../../src/libs/utils/mini-chat-error";

describe("utils/mini-chat-error", () => {
  test("MiniChatError", async () => {
    const error = new MiniChatError(MiniChatErrorCode.Unknown, "test");
    expect(error.code).toBe(MiniChatErrorCode.Unknown);
  });
});
