import { Coze } from "../src/index";

describe("formatHost Function Tests", () => {
  it("default", () => {
    const coze = new Coze({ api_key: "x" });
    expect(coze.chatV2).toBeInstanceOf(Function);
    expect(coze.chatV2Streaming).toBeInstanceOf(Function);
    expect(coze.chatV3).toBeInstanceOf(Function);
    expect(coze.chatV3Streaming).toBeInstanceOf(Function);
  });
});
