/* eslint-disable */
import { useSubscribe } from './SubscribeContext';

export const AudioPlayer = () => {
  const { audioRef } = useSubscribe();

  return (
    <audio
      ref={audioRef}
      autoPlay
      playsInline
      style={{ display: 'none' }}
    />
  );
};

export default AudioPlayer;
