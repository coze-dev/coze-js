import { type AxiosRequestConfig, type GenericAbortSignal } from 'axios';

export enum EventName {
  Fail = 'fail',
  Success = 'success',
  Open = 'open',
  Chunk = 'chunk',
}

export interface EventMessage<T = unknown> {
  event: EventName;
  data?: T;
  error?: Error;
}

export type EventHandler = (msg: EventMessage) => void;

export interface RequestConfig
  extends Pick<AxiosRequestConfig, 'headers' | 'data'> {
  url: string;
  method?: 'GET' | 'POST';
  signal?: GenericAbortSignal;
}
