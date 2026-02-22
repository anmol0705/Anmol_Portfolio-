'use client';

import React, { createContext, useContext, useRef, useState, useEffect, useCallback } from 'react';

// ============================================================================
// TYPES
// ============================================================================
interface AudioEngineContextType {
    isMuted: boolean;
    toggleMute: () => void;
    audioFrequency: number;
}

// Rename to AudioEngineContext to avoid shadowing the browser's native AudioContext
const AudioEngineContext = createContext<AudioEngineContextType>({
    isMuted: true,
    toggleMute: () => { },
    audioFrequency: 0,
});

// ============================================================================
// PROVIDER
// ============================================================================
export function AudioProvider({ children }: { children: React.ReactNode }) {
    const [isMuted, setIsMuted] = useState(true);
    // Use 'any' for the ref type to avoid collision with our React context name
    const audioCtxRef = useRef<any>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const dataArrayRef = useRef<Uint8Array | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);
    const reqFrameRef = useRef<number>(0);
    const [audioFrequency, setAudioFrequency] = useState(0);

    const initAudio = useCallback(() => {
        if (audioCtxRef.current) return;

        const AC = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AC();
        audioCtxRef.current = ctx;

        const analyser = ctx.createAnalyser();
        analyser.fftSize = 128;
        analyser.smoothingTimeConstant = 0.8;
        analyserRef.current = analyser;
        dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);

        // Three-oscillator sci-fi drone
        const osc1 = ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(45, ctx.currentTime);

        const osc2 = ctx.createOscillator();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(46.5, ctx.currentTime);

        const osc3 = ctx.createOscillator();
        osc3.type = 'sawtooth';
        osc3.frequency.setValueAtTime(22.5, ctx.currentTime);

        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.1, ctx.currentTime);

        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(0.3, ctx.currentTime);
        lfo.connect(lfoGain);

        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0, ctx.currentTime);

        osc1.connect(masterGain);
        osc2.connect(masterGain);
        osc3.connect(masterGain);
        lfoGain.connect(masterGain.gain);
        masterGain.connect(analyser);
        analyser.connect(ctx.destination);

        gainNodeRef.current = masterGain;

        osc1.start();
        osc2.start();
        osc3.start();
        lfo.start();
    }, []);

    const toggleMute = useCallback(() => {
        if (isMuted) {
            if (!audioCtxRef.current) initAudio();
            if (audioCtxRef.current?.state === 'suspended') {
                audioCtxRef.current.resume();
            }
            if (gainNodeRef.current && audioCtxRef.current) {
                gainNodeRef.current.gain.setTargetAtTime(0.4, audioCtxRef.current.currentTime, 1.5);
            }
            setIsMuted(false);
        } else {
            if (gainNodeRef.current && audioCtxRef.current) {
                gainNodeRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.5);
            }
            setTimeout(() => setIsMuted(true), 500);
        }
    }, [isMuted, initAudio]);

    // Frequency sampling loop
    useEffect(() => {
        const update = () => {
            if (!isMuted && analyserRef.current && dataArrayRef.current) {
                analyserRef.current.getByteFrequencyData(dataArrayRef.current as any);
                const bassEnd = 6;
                let sum = 0;
                for (let i = 0; i < bassEnd; i++) {
                    sum += dataArrayRef.current[i];
                }
                setAudioFrequency(sum / (bassEnd * 255));
            } else {
                setAudioFrequency((prev) => Math.max(0, prev - 0.05));
            }
            reqFrameRef.current = requestAnimationFrame(update);
        };

        reqFrameRef.current = requestAnimationFrame(update);
        return () => {
            if (reqFrameRef.current) cancelAnimationFrame(reqFrameRef.current);
        };
    }, [isMuted]);

    return (
        <AudioEngineContext.Provider value={{ isMuted, toggleMute, audioFrequency }}>
            {children}
        </AudioEngineContext.Provider>
    );
}

export function useAudio() {
    return useContext(AudioEngineContext);
}
