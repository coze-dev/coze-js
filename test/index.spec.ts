import { Coze } from "../src/index";

describe("formatHost Function Tests", () => {
  it("default", () => {
    const coze = new Coze({ api_key: "x" });
    expect(coze.chat).toBeInstanceOf(Function);
  });
});
