import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function AmbientSound() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const startSoundscape = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Master output gain
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.0001, ctx.currentTime);
      master.connect(ctx.destination);
      masterGainRef.current = master;

      // Warm dusk drone fundamental (55Hz — A1)
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(55, ctx.currentTime);

      const osc1Gain = ctx.createGain();
      osc1Gain.gain.setValueAtTime(0.18, ctx.currentTime);
      osc1.connect(osc1Gain);
      osc1Gain.connect(master);
      osc1.start();
      osc1Ref.current = osc1;

      // Harmonic overtone (110.4Hz — subtle beating effect)
      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(110.4, ctx.currentTime);

      const osc2Filter = ctx.createBiquadFilter();
      osc2Filter.type = 'lowpass';
      osc2Filter.frequency.setValueAtTime(220, ctx.currentTime);

      const osc2Gain = ctx.createGain();
      osc2Gain.gain.setValueAtTime(0.08, ctx.currentTime);
      osc2.connect(osc2Filter);
      osc2Filter.connect(osc2Gain);
      osc2Gain.connect(master);
      osc2.start();
      osc2Ref.current = osc2;

      // Filtered soft dusk noise (mimicking distant wind / paper grain)
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.997 * b0 + white * 0.05;
        b1 = 0.985 * b1 + white * 0.06;
        b2 = 0.950 * b2 + white * 0.08;
        output[i] = (b0 + b1 + b2) * 0.04;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(320, ctx.currentTime);
      noiseFilter.Q.setValueAtTime(0.8, ctx.currentTime);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.05, ctx.currentTime);

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(master);
      noiseSource.start();
      noiseSourceRef.current = noiseSource;

      // Smooth fade in
      master.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + 3.0);
      setIsPlaying(true);
    } catch (e) {
      console.warn('Ambient audio init failed:', e);
    }
  };

  const stopSoundscape = () => {
    if (audioCtxRef.current && masterGainRef.current) {
      const ctx = audioCtxRef.current;
      const master = masterGainRef.current;
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
      master.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);

      setTimeout(() => {
        try {
          ctx.close();
        } catch {}
        audioCtxRef.current = null;
        masterGainRef.current = null;
        osc1Ref.current = null;
        osc2Ref.current = null;
        noiseSourceRef.current = null;
        setIsPlaying(false);
      }, 1250);
    } else {
      setIsPlaying(false);
    }
  };

  const toggleSound = () => {
    if (isPlaying) {
      stopSoundscape();
    } else {
      startSoundscape();
    }
  };

  // Pause automatically when tab is hidden
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && audioCtxRef.current && audioCtxRef.current.state === 'running') {
        audioCtxRef.current.suspend();
      } else if (!document.hidden && audioCtxRef.current && audioCtxRef.current.state === 'suspended' && isPlaying) {
        audioCtxRef.current.resume();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch {}
      }
    };
  }, [isPlaying]);

  return (
    <button
      type="button"
      onClick={toggleSound}
      className="dusk-audio-toggle"
      title={isPlaying ? 'Mute dusk atmospheric tone' : 'Unmute dusk atmospheric tone (ambient soundscape)'}
      aria-label={isPlaying ? 'Mute ambient sound' : 'Unmute ambient sound'}
    >
      {isPlaying ? (
        <>
          <Volume2 size={15} className="dusk-audio-icon active" />
          <span className="dusk-audio-label">ATMOSPHERE ON</span>
          <span className="dusk-audio-pulse" />
        </>
      ) : (
        <>
          <VolumeX size={15} className="dusk-audio-icon" />
          <span className="dusk-audio-label">SOUND</span>
        </>
      )}
    </button>
  );
}
