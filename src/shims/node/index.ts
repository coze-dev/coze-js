import { fetch, FormData, type RequestInit, type Response, File } from 'undici';
import * as crypto from 'crypto';

type FileLike = File;
const isBrowser = typeof window !== 'undefined';

export { fetch, FormData, type RequestInit, type Response, type FileLike, isBrowser, crypto, File };
