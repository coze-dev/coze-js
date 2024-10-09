const fetch = window.fetch.bind(window);
const FormData = window.FormData;
const crypto = window.crypto;
const File = window.File;
const Blob = window.Blob;

type RequestInit = Parameters<typeof fetch>[1];
type Response = ReturnType<typeof fetch>;
type FileLike = File | Blob;
const isBrowser = typeof window !== 'undefined';

export { fetch, FormData, type RequestInit, type Response, type FileLike, isBrowser, crypto, File };
