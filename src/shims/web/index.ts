const fetch = window.fetch.bind(window);
const FormData = window.FormData;

type RequestInit = Parameters<typeof fetch>[1];
type Response = ReturnType<typeof fetch>;
type FileLike = File;

export { fetch, FormData, type RequestInit, type Response, type FileLike };
