'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import dynamic from 'next/dynamic';

// Register GSAP plugins — client only
gsap.registerPlugin(ScrollTrigger);

// Dynamic imports (no SSR — these use browser APIs / WebGL)
const HeroScene = dynamic(() => import('@/components/HeroScene'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 z-0 bg-black flex items-center justify-center">
      <div className="w-16 h-16 border-2 border-neon border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

const ContentLayer = dynamic(() => import('@/components/ContentLayer'), {
  ssr: false,
});

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // stable refs
  const lenisRef = useRef<Lenis | null>(null);
  const rafFnRef = useRef<((time: number) => void) | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ── 1. Lenis smooth scroll ──────────────────────────────────────────────
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    // Keep GSAP ScrollTrigger positions in sync with Lenis virtual scroll
    lenis.on('scroll', ScrollTrigger.update);

    // Store RAF fn so we can remove it on cleanup
    const rafFn = (time: number) => lenis.raf(time * 1000);
    rafFnRef.current = rafFn;
    gsap.ticker.add(rafFn);
    gsap.ticker.lagSmoothing(0);

    // Small delay to ensure dynamic components mount before GSAP reads DOM
    const t = setTimeout(() => setIsLoaded(true), 300);

    return () => {
      clearTimeout(t);
      if (rafFnRef.current) gsap.ticker.remove(rafFnRef.current);
      lenis.destroy();
    };
  }, []);

  // ── 2. Cinematic zoom + all scroll animations ───────────────────────────
  useEffect(() => {
    if (!isLoaded) return;

    // Grab elements — wait for dynamic imports
    const zoomContainer = document.getElementById('zoom-pin-container');
    const heroTextOverlay = document.getElementById('hero-text-overlay');
    const progressBar = document.getElementById('progress-bar');

    if (!zoomContainer) return;

    // ── 2a. Cinematic pin + zoom ──────────────────────────────────────────
    const zoomTl = gsap.timeline({
      scrollTrigger: {
        trigger: zoomContainer,
        start: 'top top',
        end: '+=100%',
        scrub: 1.5,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        onUpdate: (self) => setScrollProgress(self.progress),
      },
    });

    // Hero text fades out in first 30% of the pin
    if (heroTextOverlay) {
      zoomTl.to(heroTextOverlay, {
        opacity: 0,
        y: -30,
        ease: 'power2.inOut',
        duration: 0.3,
      }, 0);
    }

    // ── 2b. Progress bar — covers the whole page scroll ───────────────────
    if (progressBar) {
      ScrollTrigger.create({
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          gsap.set(progressBar, { scaleX: self.progress });
        },
      });
    }

    // ── 2c. Section reveal animations (in ContentLayer) ───────────────────
    // Use a small delay to ensure ContentLayer has mounted
    const revealTimeout = setTimeout(() => {
      const sections = document.querySelectorAll('#content-layer section');
      sections.forEach((section) => {
        const targets = section.querySelectorAll(
          'h2, h3, p, [data-reveal], .card-reveal'
        );
        if (targets.length === 0) return;

        gsap.fromTo(
          targets,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 82%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
      ScrollTrigger.refresh();
    }, 800);

    return () => {
      clearTimeout(revealTimeout);
      ScrollTrigger.getAll().forEach((t) => t.kill());
      zoomTl.kill();
    };
  }, [isLoaded]);

  // ── 3. Preloader out ────────────────────────────────────────────────────
  useEffect(() => {
    if (!isLoaded) return;
    const preloader = document.getElementById('preloader');
    if (!preloader) return;
    gsap.to(preloader, {
      opacity: 0,
      duration: 0.6,
      delay: 0.2,
      onComplete: () => {
        preloader.style.display = 'none';
      },
    });
  }, [isLoaded]);

  // ── Helpers ─────────────────────────────────────────────────────────────
  const scrollTo = useCallback((target: string) => {
    lenisRef.current?.scrollTo(target, { offset: -80 });
  }, []);

  // ── JSX ─────────────────────────────────────────────────────────────────
  return (
    <div ref={containerRef} className="relative bg-black">

      {/* ── Preloader ───────────────────────────────────────────────────── */}
      <div
        id="preloader"
        className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center"
      >
        <div className="relative">
          <div className="w-24 h-24 border border-neon/20 rounded-full" />
          <div className="absolute inset-0 w-24 h-24 border border-neon border-t-transparent rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-neon rounded-full animate-pulse" />
          </div>
        </div>
        <div className="mt-8 text-center space-y-1">
          <div className="text-neon font-mono text-xs tracking-[0.4em] uppercase">
            Initializing
          </div>
          <div className="text-white/30 font-mono text-xs">QUANTUM_CORE v1.0.0</div>
        </div>
        {/* Loading bar */}
        <div className="mt-6 w-40 h-px bg-white/10 overflow-hidden rounded-full">
          <div
            className="h-full bg-neon animate-[loading_1.2s_ease-in-out_infinite]"
            style={{ width: '60%' }}
          />
        </div>
        <style>{`
          @keyframes loading {
            0%   { transform: translateX(-200%); }
            100% { transform: translateX(300%); }
          }
        `}</style>
      </div>

      {/* ── Navigation ──────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-8 py-4 mix-blend-normal">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded border border-neon/50 flex items-center justify-center">
              <span className="text-neon font-bold font-mono text-xs">Q</span>
            </div>
            <span className="font-mono font-semibold text-white/80 text-sm tracking-widest hidden sm:block">
              ANMOL JAIN
            </span>
          </div>

          <div className="flex items-center gap-8">
            {['ABOUT', 'PROJECTS', 'CONTACT'].map((label) => (
              <button
                key={label}
                onClick={() => scrollTo(`#${label.toLowerCase()}`)}
                className="text-white/50 hover:text-neon font-mono text-xs tracking-widest transition-colors hidden md:block"
              >
                {label}
              </button>
            ))}
            <div className="flex items-center gap-2 px-3 py-1.5 border border-neon/20 rounded-full bg-black/60 backdrop-blur-sm">
              <div className="w-1.5 h-1.5 bg-neon rounded-full animate-pulse" />
              <span className="text-neon/60 font-mono text-xs">SYS.ACTIVE</span>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Scroll progress bar ─────────────────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-40 h-px bg-white/5">
        <div
          id="progress-bar"
          className="h-full bg-gradient-to-r from-neon via-terminal-cyan to-cyber origin-left"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>

      {/* ── CINEMATIC ZOOM SECTION ──────────────────────────────────────── */}
      {/*   GSAP pins this div for 100vh of scroll duration              */}
      <div
        id="zoom-pin-container"
        className="relative w-full h-screen"
      >
        <HeroScene scrollProgress={scrollProgress} />
      </div>

      {/* ── CONTENT (normal document flow — creates scroll height) ──────── */}
      <div className="relative z-10 bg-black">
        <ContentLayer />
      </div>

    </div>
  );
}
