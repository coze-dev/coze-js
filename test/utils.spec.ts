import { post, ResponseError } from "../src/utils";

describe("post function", () => {
  it("should send a POST request with correct data", async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ success: true }),
    });

    const url = "https://api.example.com/data";
    const data = { key: "value" };
    const headers = { "Content-Type": "application/json" };

    await post(mockFetch, url, data, headers);

    expect(mockFetch).toHaveBeenCalledWith(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers,
    });
  });

  it("should throw ResponseError for non-ok responses", async () => {
    const errorMessage = "Bad Request";
    const mockFetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 400,
      statusText: "Bad Request",
      headers: {
        get: jest.fn().mockReturnValue("application/json"),
      },
      json: jest.fn().mockResolvedValue({ error: errorMessage }),
    });

    const url = "https://api.example.com/data";
    const data = { key: "value" };

    await expect(post(mockFetch, url, data)).rejects.toThrow(ResponseError);
    await expect(post(mockFetch, url, data)).rejects.toThrow(errorMessage);
  });

  it("should handle non-JSON error responses", async () => {
    const errorMessage = "Internal Server Error";
    const mockFetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      headers: {
        get: jest.fn().mockReturnValue("text/plain"),
      },
      text: jest.fn().mockResolvedValue(errorMessage),
    });

    const url = "https://api.example.com/data";
    const data = { key: "value" };

    await expect(post(mockFetch, url, data)).rejects.toThrow(ResponseError);
    await expect(post(mockFetch, url, data)).rejects.toThrow(errorMessage);
  });

  it("should handle BodyInit data", async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ success: true }),
    });

    const url = "https://api.example.com/data";
    const data = new FormData();
    data.append("key", "value");

    await post(mockFetch, url, data);

    expect(mockFetch).toHaveBeenCalledWith(url, {
      method: "POST",
      body: data,
      headers: undefined,
    });
  });
});
