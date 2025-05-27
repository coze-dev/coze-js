import { Voices } from './voices/index';
import { Transcriptions } from './transcriptions/index';
import { Speech } from './speech/index';
import { Rooms } from './rooms/index';
import { APIResource } from '../resource';
import { VoiceprintGroups } from './voiceprint-groups';
import { TranslationRooms } from './translation-rooms';
import { Live } from './live';

export class Audio extends APIResource {
  rooms: Rooms = new Rooms(this._client);
  translationRooms: TranslationRooms = new TranslationRooms(this._client);
  live: Live = new Live(this._client);
  voices: Voices = new Voices(this._client);
  speech: Speech = new Speech(this._client);
  transcriptions: Transcriptions = new Transcriptions(this._client);
  voiceprintGroups: VoiceprintGroups = new VoiceprintGroups(this._client);
}

export * from './rooms/index';
export * from './voices/index';
export * from './transcriptions/index';
export * from './voiceprint-groups/index';
export * from './translation-rooms/index';
export * from './live/index';
