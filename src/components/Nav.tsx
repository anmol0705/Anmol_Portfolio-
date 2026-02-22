'use client';

import { useAudio } from '@/context/AudioContext';
import { useCallback } from 'react';
import Lenis from 'lenis';

export default function Nav() {
    const { isMuted, toggleMute } = useAudio();

    const scrollTo = useCallback((target: string) => {
        // Basic fallback since Lenis is managed in page.tsx
        const el = document.querySelector(target);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-8 py-4 mix-blend-difference pointer-events-none">
            <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
                <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-md border border-accent/20 flex items-center justify-center">
                        <span className="text-accent/70 font-bold font-mono text-xs">Q</span>
                    </div>
                    <span className="font-display font-semibold text-white/60 text-sm tracking-wide hidden sm:block">
                        QUANT
                    </span>
                </div>

                <div className="flex items-center gap-8">
                    {['ABOUT', 'PROJECTS', 'CONTACT'].map((label) => (
                        <button
                            key={label}
                            onClick={() => scrollTo(`#${label.toLowerCase()}`)}
                            className="text-white/25 hover:text-accent font-mono text-[11px] tracking-[0.2em] transition-colors duration-300 hidden md:block"
                        >
                            {label}
                        </button>
                    ))}

                    {/* Audio Toggle */}
                    <button
                        onClick={toggleMute}
                        className={`flex items-center gap-2 px-3 py-1.5 border rounded-full glass transition-all duration-500 hover:border-accent/40 ${!isMuted ? 'border-accent/30 bg-accent/5' : 'border-white/[0.06]'}`}
                        aria-label="Toggle Background Audio"
                    >
                        <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${!isMuted ? 'bg-accent animate-pulse' : 'bg-white/20'}`} />
                        <span className={`font-mono text-[10px] transition-colors duration-300 ${!isMuted ? 'text-accent' : 'text-white/20'}`}>
                            SOUND: {isMuted ? 'OFF' : 'ON'}
                        </span>
                    </button>
                </div>
            </div>
        </nav>
    );
}
