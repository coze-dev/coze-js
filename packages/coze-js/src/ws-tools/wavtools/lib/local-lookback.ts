/**
 * Local audio loopback implementation using WebRTC peer connections
 * to create a local audio communication channel.
 */
class LocalLookback {
  pc1: RTCPeerConnection | undefined;
  pc2: RTCPeerConnection | undefined;
  remoteAudio: HTMLAudioElement;
  context: AudioContext | undefined;
  mic: MediaStreamAudioSourceNode | undefined;
  peer: MediaStreamAudioDestinationNode | undefined;
  isDebug: boolean;
  stream: MediaStream | undefined;

  /**
   * Initializes a new instance of LocalLookback
   * @param isDebug - Whether to enable debug logging
   */
  constructor(isDebug: boolean = false) {
    this.remoteAudio = document.createElement('audio');
    this.remoteAudio.setAttribute('autoplay', 'true');
    this.remoteAudio.setAttribute('muted', 'true');
    this.remoteAudio.setAttribute('style', 'display: none');
    document.body.appendChild(this.remoteAudio);

    this.isDebug = isDebug;

    // Unlock audio context for iOS devices
    this._unlockAudioContext();

    this.gotDescription1  = this.gotDescription1.bind(this);
    this.gotDescription2  = this.gotDescription2.bind(this);
  }

  /**
   * Establishes a connection between two RTCPeerConnection objects
   * to create a local audio loopback channel
   * @param context - The AudioContext to use for audio processing
   */
  connect(context: AudioContext) {
    const servers = undefined;
    const pc1 = new RTCPeerConnection(servers);
    this._debug('Created local peer connection object pc1');
    pc1.onicecandidate = e => this.onIceCandidate(pc1, e);
    const pc2 = new RTCPeerConnection(servers);
    this._debug('Created remote peer connection object pc2');
    pc2.onicecandidate = e => this.onIceCandidate(pc2, e);
    pc1.oniceconnectionstatechange = e => this.onIceStateChange(pc1, e);
    pc2.oniceconnectionstatechange = e => this.onIceStateChange(pc2, e);
    pc2.ontrack = this.gotRemoteStream.bind(this);

    const filteredStream = this.applyFilter(context);
    if(!filteredStream) {
       // Prevent resource leakage
      pc1.close();
      pc2.close();
      return;
    }
    filteredStream.getTracks().forEach(track => pc1.addTrack(track, filteredStream));
    pc1.createOffer().then(this.gotDescription1).catch(error => console.log(`createOffer failed: ${error}`));


    this.pc1 = pc1;
    this.pc2 = pc2;
  }

  /**
   * Starts the audio loopback by connecting the provided AudioWorkletNode
   * to the peer destination
   * @param streamNode - The AudioWorkletNode to connect to the peer destination
   */
  start(streamNode: AudioWorkletNode) {
    if(!this.context || !this.peer) {
      this._error('No audio context or peer found');
      return;
    }
    streamNode.connect(this.peer);
  }

  /**
   * Sets the media stream to be used for the loopback
   * @param stream - The MediaStream to use, or undefined to clear
   */
  setMediaStream(stream?: MediaStream) {
    this.stream = stream;
  }

  /**
   * Creates and connects audio processing nodes for the media stream
   * @param context - The AudioContext to use for creating audio nodes
   * @returns The processed MediaStream or undefined if no stream is available
   * @private
   */
  private applyFilter(context: AudioContext) {
    if(!this.stream) {
      this._error('No media stream found');
      return;
    }
    this.context = context;
    this.mic = this.context.createMediaStreamSource(this.stream);
    this.peer = this.context.createMediaStreamDestination();

    this.mic.connect(this.peer);
    return this.peer.stream;
  }


  /**
   * Handles the incoming remote stream from the peer connection
   * @param e - The RTCTrackEvent containing the remote stream
   * @private
   */
  private gotRemoteStream(e:RTCTrackEvent) {
    this._debug('pc2 received remote stream', e.streams[0])
    if (this.remoteAudio.srcObject !== e.streams[0]) {
      this.remoteAudio.srcObject = e.streams[0];
      this.remoteAudio.muted = false;
      this.remoteAudio.volume = 0.5;

      const playPromise = this.remoteAudio.play();
      if (playPromise) {
        playPromise.catch(err => {
          this._error('Failed to play audio:', err);
          // If autoplay is prevented, try unlocking the audio context again
          this._unlockAudioContext();
        });
      }
    }
  }

  /**
   * Handles the SDP offer from the first peer connection (pc1)
   * @param desc - The RTCSessionDescriptionInit containing the SDP offer
   * @private
   */
  private gotDescription1(desc:RTCSessionDescriptionInit) {
    this._debug(`Offer from pc1\n${desc.sdp}`);

    this.pc1?.setLocalDescription(desc);
    this.pc2?.setRemoteDescription(desc);
    this.pc2?.createAnswer()
        .then(this.gotDescription2)
        .catch(error => console.error(`createAnswer failed: ${error}`));
  }

  /**
   * Handles the SDP answer from the second peer connection (pc2)
   * @param desc - The RTCSessionDescriptionInit containing the SDP answer
   * @private
   */
  private gotDescription2(desc:RTCSessionDescriptionInit) {
    this._debug(`Answer from pc2\n${desc.sdp}`);
    this.pc2?.setLocalDescription(desc);
    this.pc1?.setRemoteDescription(desc);
  }


  /**
   * Processes ICE candidates and forwards them to the other peer connection
   * @param pc - The RTCPeerConnection that generated the candidate
   * @param event - The RTCPeerConnectionIceEvent containing the candidate
   * @private
   */
  private onIceCandidate(pc: RTCPeerConnection, event: RTCPeerConnectionIceEvent) {
    this.getOtherPc(pc)
        ?.addIceCandidate(event.candidate as RTCIceCandidateInit)
        .then(() => this.onAddIceCandidateSuccess(pc), err => this.onAddIceCandidateError(pc, err));
    this._debug(`${this.getName(pc)} ICE candidate:\n${event.candidate ? event.candidate.candidate : '(null)'}`);
  }

  /**
   * Returns the other peer connection (pc1 or pc2) based on the input
   * @param pc - The RTCPeerConnection to find the counterpart for
   * @returns The other RTCPeerConnection
   * @private
   */
  private getOtherPc(pc: RTCPeerConnection) {
    return (pc === this.pc1) ? this.pc2 : this.pc1;
  }

  /**
   * Returns the name ('pc1' or 'pc2') of the peer connection for logging
   * @param pc - The RTCPeerConnection to get the name for
   * @returns The name of the peer connection
   * @private
   */
  private getName(pc: RTCPeerConnection) {
    return (pc === this.pc1) ? 'pc1' : 'pc2';
  }

  /**
   * Handles successful addition of an ICE candidate
   * @param pc - The RTCPeerConnection that successfully added the candidate
   * @private
   */
  private onAddIceCandidateSuccess(pc: RTCPeerConnection) {
    this._debug(`${this.getName(pc)} addIceCandidate success`);
  }

  /**
   * Handles errors that occur when adding an ICE candidate
   * @param pc - The RTCPeerConnection that failed to add the candidate
   * @param error - The error that occurred
   * @private
   */
  private onAddIceCandidateError(pc: RTCPeerConnection, error: Error) {
    this._error(`${this.getName(pc)} addIceCandidate failed: ${error}`);
  }

  /**
   * Handles ICE connection state changes
   * @param pc - The RTCPeerConnection whose ICE state changed
   * @param event - The event object containing state change information
   * @private
   */
  private onIceStateChange(pc: RTCPeerConnection, event: Event) {
    if (pc) {
      this._debug(`${this.getName(pc)} ICE state: ${pc.iceConnectionState}`);
      this._debug('ICE state change event: ', event);
    }
  }

  /**
   * Logs debug information if debug mode is enabled
   * @param args - Arguments to pass to console.log
   * @private
   */
  private _debug(...args: any[]) {
    if (this.isDebug) {
      console.log(...args);
    }
  }

  /**
   * Logs error messages to the console
   * @param args - Arguments to pass to console.error
   * @private
   */
  private _error(...args: any[]) {
    console.error(...args);
  }

  /**
   * Attempts to unlock the audio context for iOS devices
   * Creates a silent audio element and plays it on user interaction
   * to bypass iOS autoplay restrictions
   * @private
   */
  private _unlockAudioContext() {
    // Create a silent audio element
    const silentSound = document.createElement('audio');
    silentSound.setAttribute('src', 'data:audio/mp3;base64,//MkxAAHiAICWABElBeKPL/RANb2w+yiT1g/gTok//lP/W/l3h8QO/OCdCqCW2Cw//MkxAQHkAIWUAhEmAQXWUOFW2dxPu//9mr60ElY5sseQ+xxesmHKtZr7bsqqX2L//MkxAgFwAYiQAhEAC2hq22d3///9FTV6tA36JdgBJoOGgc+7qvqej5EPomQ+RMn/QmSACAv7mcADf//MkxBQHAAYi8AhEAO193vt9KGOq+6qcT7hhfN5FTInmwk8RkqKImTM55pRQHQSq//MkxBsGkgoIAABHhTACIJLf99nVI///yuW1uBqWfEu7CgNPWGpUadBmZ////4sL//MkxCMHMAH9iABEmAsKioqKigsLCwtVTEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVV//MkxCkECAUYCAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV');
    silentSound.volume = 0.001; // Very low volume, essentially silent

    // Add event listeners for user interaction events
    const pageEvents = ['touchstart', 'touchend', 'mousedown', 'keydown'];
    const unlockAudio = () => {
      this._debug('User interaction detected, trying to unlock audio');
      const playPromise = silentSound.play();
      if (playPromise) {
        playPromise.catch(() => {
          // Catch error but don't handle it
        }).then(() => {
          // Also try to play the actual remote audio
          const remotePlayPromise = this.remoteAudio.play();
          if (remotePlayPromise) {
            remotePlayPromise.catch(() => {
              // Catch error but don't process it
            });
          }

          // Remove all event listeners once succeeded
          pageEvents.forEach(event => {
            document.removeEventListener(event, unlockAudio);
          });
          this._debug('Audio context unlocked');
        });
      }
    };

    // Add all event listeners
    pageEvents.forEach(event => {
      document.addEventListener(event, unlockAudio);
    });

    // Also try to play immediately
    setTimeout(() => {
      this._debug('Attempting initial audio unlock');
      unlockAudio();
    }, 100);
  }
}

export default LocalLookback;
