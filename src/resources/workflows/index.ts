import { APIResource } from '../resource.js';
import { Runs } from './runs/index.js';

export class Workflows extends APIResource {
  runs: Runs = new Runs(this._client);
}

export * from './runs/index.js';
