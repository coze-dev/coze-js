import { fetch, FormData, type RequestInit, type Response, type File } from 'undici';

type FileLike = File;
const isBrowser = typeof window !== 'undefined';

export { fetch, FormData, type RequestInit, type Response, type FileLike, isBrowser };
