// src/hooks/useAudioAnalyser.ts
import { useRef, useCallback } from "react";

export function useAudioAnalyser() {
  const audioAnalyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  const initAnalyser = useCallback((media: unknown) => {
    if (!(media instanceof HTMLMediaElement)) {
      return;
    }
    if (audioContextRef.current) return;

    const ctx = new AudioContext();
    const source = ctx.createMediaElementSource(media);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    analyser.connect(ctx.destination);

    audioContextRef.current = ctx;
    sourceRef.current = source;
    audioAnalyserRef.current = analyser;
  }, []);

  return {
    audioAnalyserRef,
    initAnalyser,
  };
}
