import {
  createMicrophoneAudioTrack,
  type IMicrophoneAudioTrack,
} from 'agora-rtc-sdk-ng/esm';

class PcmRecorder {
  private audioTrack: IMicrophoneAudioTrack | undefined;
  private stream: MediaStream | undefined;
  private recording = false;
  private audioContext: AudioContext;
  private sourceNode: MediaStreamAudioSourceNode | undefined;
  private processorNode: ScriptProcessorNode | undefined;
  private analyserNode: AnalyserNode | undefined;

  constructor() {
    this.audioContext = new AudioContext();
  }

  async begin({ deviceId }: { deviceId?: string | undefined }) {
    // Get microphone audio track
    this.audioTrack = await createMicrophoneAudioTrack({
      AEC: true,
      ANS: true,
      AGC: true,
      microphoneId: deviceId,
    });

    this.stream = new MediaStream([this.audioTrack.getMediaStreamTrack()]);
  }

  pause() {
    // Pause recording
    if (this.recording) {
      this.disconnectAudioNodes();
      this.recording = false;
    }
  }

  private disconnectAudioNodes() {
    if (this.processorNode) {
      this.processorNode.disconnect();
      this.processorNode = undefined;
    }

    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode = undefined;
    }

    if (this.analyserNode) {
      this.analyserNode.disconnect();
      this.analyserNode = undefined;
    }
  }

  async record(
    chunkProcessor?: (data: { raw: ArrayBuffer }) => void,
    bufferSize = 4096,
  ) {
    if (!this.audioTrack || !this.stream) {
      throw new Error('audioTrack is not initialized');
    }

    // Ensure AudioContext is in running state
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    // Create audio source node
    this.sourceNode = this.audioContext.createMediaStreamSource(this.stream);

    // Create analyzer node for audio data
    this.analyserNode = this.audioContext.createAnalyser();
    this.analyserNode.fftSize = 2048;

    // Create processor node
    // Note: ScriptProcessorNode is deprecated, but still a practical choice until AudioWorklet is widely supported
    this.processorNode = this.audioContext.createScriptProcessor(
      bufferSize,
      1, // Mono input
      1, // Mono output
    );

    // Connect nodes
    this.sourceNode.connect(this.analyserNode);
    this.analyserNode.connect(this.processorNode);
    this.processorNode.connect(this.audioContext.destination);

    // Set up audio processing callback
    this.processorNode.onaudioprocess = audioProcessingEvent => {
      if (!this.recording) {
        return;
      }

      // Get input buffer
      const { inputBuffer } = audioProcessingEvent;

      // Get left channel data (mono recording)
      const inputData = inputBuffer.getChannelData(0);

      // Convert to 16-bit PCM
      const pcmData = this.floatTo16BitPCM(inputData);

      // Send data
      chunkProcessor?.({ raw: pcmData });
    };

    this.recording = true;
  }

  resume() {
    // Resume recording
    if (!this.recording && this.stream) {
      this.record();
    }
  }

  end() {
    // Stop recording
    this.pause();
  }

  quit() {
    // Exit recording
    this.pause();
    this.audioTrack?.close();
    this.stream?.getTracks().forEach(track => track.stop());

    // Close audio context
    if (this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
  }

  getStatus() {
    // Get recording status
    if (!this.sourceNode) {
      return 'ended';
    } else if (!this.recording) {
      return 'paused';
    } else {
      return 'recording';
    }
  }

  async requestPermission() {
    const permissionStatus = await navigator.permissions.query({
      name: 'microphone' as PermissionName,
    });
    if (permissionStatus.state === 'denied') {
      window.alert('You must grant microphone access to use this feature.');
    } else if (permissionStatus.state === 'prompt') {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      } catch (e) {
        window.alert('You must grant microphone access to use this feature.');
      }
    }
    return true;
  }

  async listDevices() {
    if (
      !navigator.mediaDevices ||
      !('enumerateDevices' in navigator.mediaDevices)
    ) {
      throw new Error('Could not request user devices');
    }
    await this.requestPermission();
    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioDevices = devices.filter(device => device.kind === 'audioinput');
    const defaultDeviceIndex = audioDevices.findIndex(
      device => device.deviceId === 'default',
    );
    const deviceList = [];
    if (defaultDeviceIndex !== -1) {
      let defaultDevice = audioDevices.splice(defaultDeviceIndex, 1)[0];
      const existingIndex = audioDevices.findIndex(
        device => device.groupId === defaultDevice.groupId,
      );
      if (existingIndex !== -1) {
        defaultDevice = audioDevices.splice(existingIndex, 1)[0];
      }
      // defaultDevice.default = true;
      deviceList.push(defaultDevice);
    }
    return deviceList.concat(audioDevices);
  }

  floatTo16BitPCM(float32Array: Float32Array) {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    let offset = 0;
    for (let i = 0; i < float32Array.length; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    return buffer;
  }
}

export default PcmRecorder;
