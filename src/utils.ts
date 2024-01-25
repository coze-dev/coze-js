import type { Fetch } from "./interfaces.js";

class ResponseError extends Error {
  constructor(
    public error: string,
    public status_code: number
  ) {
    super(error);
    this.name = "ResponseError";

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ResponseError);
    }
  }
}

const checkOk = async (response: Response): Promise<void> => {
  if (!response.ok) {
    let message = `Error ${response.status}: ${response.statusText}`;
    let errorData: any = null;

    if (response.headers.get("content-type")?.includes("application/json")) {
      try {
        errorData = await response.json();
        message = errorData.error || message;
      } catch (error) {
        console.log("Failed to parse error response as JSON");
      }
    } else {
      try {
        console.log("Getting text from response");
        const textResponse = await response.text();
        message = textResponse || message;
      } catch (error) {
        console.log("Failed to get text from error response");
      }
    }

    throw new ResponseError(message, response.status);
  }
};

export const post = async (
  fetch: Fetch,
  url: string,
  data?: Record<string, unknown> | BodyInit,
  headers?: HeadersInit
): Promise<Response> => {
  const isRecord = (input: any): input is Record<string, unknown> => {
    return input !== null && typeof input === "object" && !Array.isArray(input);
  };

  const formattedData = isRecord(data) ? JSON.stringify(data) : data;

  const response = await fetch(url, {
    method: "POST",
    body: formattedData,
    headers,
  });

  await checkOk(response);

  return response;
};

export const parseJSON = async function* <T = unknown>(
  itr: ReadableStream<Uint8Array>
): AsyncGenerator<T> {
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  // event:message
  // data:<JSON>
  //
  // event:done
  // data:<EOF>
  for await (const chunk of itr as unknown as AsyncIterable<Uint8Array>) {
    buffer += decoder.decode(chunk);
    const parts = buffer.split("\n");

    buffer = parts.pop() ?? "";

    for (const part of parts) {
      if (part === "event:done") {
        yield { done: true } as any;
        return;
      }

      try {
        if (part === "event:message") {
          // ignore
          continue;
        }
        if (/^data:/.test(part)) {
          // 5 -> 'data:'.length
          yield JSON.parse(part.slice(5));
        }
      } catch (error) {
        console.warn("invalid json: ", part);
      }
    }
  }

  for (const part of buffer.split("\n").filter((p) => p !== "")) {
    try {
      yield JSON.parse(part);
    } catch (error) {
      console.warn("invalid json: ", part);
    }
  }
};
