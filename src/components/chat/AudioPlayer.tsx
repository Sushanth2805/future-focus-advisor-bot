
import React, { useRef } from 'react';

interface AudioPlayerProps {
  onAudioEnd: () => void;
}

const AudioPlayer = ({ onAudioEnd }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  const playAudio = (audioContent: string) => {
    try {
      const audioBlob = new Blob([Uint8Array.from(atob(audioContent), c => c.charCodeAt(0))], {
        type: 'audio/mp3'
      });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
        
        audioRef.current.onended = () => {
          onAudioEnd();
          URL.revokeObjectURL(audioUrl);
        };
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  // Expose methods through ref
  React.useImperativeHandle(audioRef, () => ({
    playAudio,
    stopAudio
  }));

  return <audio ref={audioRef} className="hidden" />;
};

export default AudioPlayer;
