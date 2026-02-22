'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import dynamic from 'next/dynamic';
import Nav from '@/components/Nav';
import CustomCursor from '@/components/CustomCursor';

// Register GSAP plugins — client only
gsap.registerPlugin(ScrollTrigger);

// Dynamic imports (no SSR — these use browser APIs / WebGL)
const HeroScene = dynamic(() => import('@/components/HeroScene'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 z-0 bg-black flex items-center justify-center">
      <div className="w-16 h-16 border border-accent/20 border-t-accent rounded-full animate-spin" />
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

  // ── 2. Cinematic zoom + section reveal animations ───────────────────────
  useEffect(() => {
    if (!isLoaded) return;

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
        y: -50,
        ease: 'expo.inOut',
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

    // ── 2c. Section reveal animations (About + Contact only) ──────────────
    // Skip #projects — it has its own GSAP horizontal scroll
    const revealTimeout = setTimeout(() => {
      const sections = document.querySelectorAll('#content-layer section:not(#projects)');
      sections.forEach((section) => {
        // Headings get a clipPath wipe-in
        const headings = section.querySelectorAll('h2, h3');
        if (headings.length) {
          gsap.fromTo(
            headings,
            { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
            {
              clipPath: 'inset(0 0% 0 0)',
              opacity: 1,
              duration: 1.2,
              stagger: 0.1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        }

        // Other elements get a 3D perspective reveal
        const targets = section.querySelectorAll(
          'p, [data-reveal], .grid > div'
        );
        if (targets.length === 0) return;

        gsap.fromTo(
          targets,
          { y: 60, opacity: 0, rotateX: 4 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 1,
            stagger: 0.08,
            ease: 'power3.out',
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

  // ── 3. Preloader out (choreographed) ─────────────────────────────────
  useEffect(() => {
    if (!isLoaded) return;
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    const exitTl = gsap.timeline({
      onComplete: () => {
        preloader.style.display = 'none';
      },
    });

    // 1. Text slides up
    exitTl.to(preloader.querySelectorAll('div, span'), {
      y: -20,
      opacity: 0,
      duration: 0.4,
      stagger: 0.05,
      ease: 'power3.in',
    });

    // 2. Overlay wipes out via clipPath
    exitTl.to(preloader, {
      clipPath: 'inset(0 0 100% 0)',
      duration: 0.6,
      ease: 'expo.inOut',
    }, '-=0.1');
  }, [isLoaded]);

  // ── Helpers ─────────────────────────────────────────────────────────────
  const scrollTo = useCallback((target: string) => {
    lenisRef.current?.scrollTo(target, { offset: -80 });
  }, []);

  // ── JSX ─────────────────────────────────────────────────────────────────
  return (
    <div ref={containerRef} className="relative bg-black">

      {/* Custom Cursor (must be top-level for full-page coverage) */}
      <CustomCursor />
      {/* ── Preloader ───────────────────────────────────────────────────── */}
      <div
        id="preloader"
        className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center"
      >
        <div className="relative">
          <div className="w-20 h-20 border border-accent/10 rounded-full" />
          <div className="absolute inset-0 w-20 h-20 border border-accent/40 border-t-transparent rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-accent/60 rounded-full animate-pulse" />
          </div>
        </div>
        <div className="mt-8 text-center space-y-1">
          <div className="text-accent/40 font-mono text-xs tracking-[0.4em] uppercase">
            Initializing
          </div>
          <div className="text-white/15 font-mono text-[10px]">QUANTUM_CORE v2.0.0</div>
        </div>
        {/* Loading bar */}
        <div className="mt-6 w-32 h-px bg-white/[0.04] overflow-hidden rounded-full">
          <div
            className="h-full bg-accent/40 animate-[loading_1.5s_ease-in-out_infinite]"
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
      <Nav />

      {/* ── Scroll progress bar ─────────────────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-40 h-px bg-white/[0.03]">
        <div
          id="progress-bar"
          className="h-full bg-gradient-to-r from-accent/60 via-accent/40 to-violet-500/40 origin-left"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>

      {/* ── CINEMATIC ZOOM SECTION ──────────────────────────────────────── */}
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
