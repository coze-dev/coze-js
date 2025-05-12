import { AudioProcessor } from 'agora-rte-extension';

/**
 * BaseAudioProcessor
 */
abstract class BaseAudioProcessor extends AudioProcessor {
  abstract startRecording(): void;

  abstract stopRecording(): void;

  abstract destroy(): void;
}

export default BaseAudioProcessor;
