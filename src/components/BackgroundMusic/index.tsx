// src/components/BackgroundMusic/index.tsx

import { useEffect, useRef, useState } from "react";

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const handleUserInteraction = () => {
      setHasInteracted(true);
    };

    window.addEventListener("click", handleUserInteraction);
    window.addEventListener("keydown", handleUserInteraction);

    return () => {
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("keydown", handleUserInteraction);
    };
  }, []);

  useEffect(() => {
    if (hasInteracted && audioRef.current) {
      audioRef.current.volume = 0.2;
      audioRef.current.loop = true;
      audioRef.current.play().catch((e) => {
        console.warn("Background music play failed:", e);
      });
    }
  }, [hasInteracted]);

  return (
    <audio ref={audioRef}>
      <source
        // TODO: Mention: https://pixabay.com/users/guilhermebernardes-24203804/
        src={`${import.meta.env.BASE_URL}audio/maintrack.mp3`}
        type="audio/mpeg"
      />
      Your browser does not support the audio element.
    </audio>
  );
}
