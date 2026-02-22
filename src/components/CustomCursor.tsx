'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useMobile } from '@/hooks/use-mobile';

// ============================================================================
// CUSTOM CURSOR — Awwwards-tier dual-ring magnetic cursor
// ============================================================================
export default function CustomCursor() {
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);
    const isMobile = useMobile();

    useEffect(() => {
        if (isMobile) return;

        const dot = dotRef.current;
        const ring = ringRef.current;
        if (!dot || !ring) return;

        // GSAP quickTo — 60fps interpolated cursor tracking
        const xDot = gsap.quickTo(dot, 'x', { duration: 0.15, ease: 'power2.out' });
        const yDot = gsap.quickTo(dot, 'y', { duration: 0.15, ease: 'power2.out' });
        const xRing = gsap.quickTo(ring, 'x', { duration: 0.4, ease: 'power3.out' });
        const yRing = gsap.quickTo(ring, 'y', { duration: 0.4, ease: 'power3.out' });

        const onMouseMove = (e: MouseEvent) => {
            xDot(e.clientX);
            yDot(e.clientY);
            xRing(e.clientX);
            yRing(e.clientY);
        };

        const onMouseEnterInteractive = () => {
            gsap.to(ring, {
                scale: 2.5,
                borderColor: 'rgba(6, 182, 212, 0.4)',
                duration: 0.4,
                ease: 'power3.out',
            });
            gsap.to(dot, {
                scale: 0,
                duration: 0.3,
                ease: 'power3.out',
            });
        };

        const onMouseLeaveInteractive = () => {
            gsap.to(ring, {
                scale: 1,
                borderColor: 'rgba(255, 255, 255, 0.15)',
                duration: 0.4,
                ease: 'power3.out',
            });
            gsap.to(dot, {
                scale: 1,
                duration: 0.3,
                ease: 'power3.out',
            });
        };

        window.addEventListener('mousemove', onMouseMove);

        // Attach hover listeners to all interactive elements
        const interactiveSelector = 'a, button, [role="button"], .hover-target, input, textarea';
        const interactives = document.querySelectorAll(interactiveSelector);
        interactives.forEach((el) => {
            el.addEventListener('mouseenter', onMouseEnterInteractive);
            el.addEventListener('mouseleave', onMouseLeaveInteractive);
        });

        // Re-observe DOM changes to attach to dynamically added elements
        const observer = new MutationObserver(() => {
            const newInteractives = document.querySelectorAll(interactiveSelector);
            newInteractives.forEach((el) => {
                el.removeEventListener('mouseenter', onMouseEnterInteractive);
                el.removeEventListener('mouseleave', onMouseLeaveInteractive);
                el.addEventListener('mouseenter', onMouseEnterInteractive);
                el.addEventListener('mouseleave', onMouseLeaveInteractive);
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            interactives.forEach((el) => {
                el.removeEventListener('mouseenter', onMouseEnterInteractive);
                el.removeEventListener('mouseleave', onMouseLeaveInteractive);
            });
            observer.disconnect();
        };
    }, [isMobile]);

    // Don't render on mobile
    if (isMobile) return null;

    return (
        <>
            {/* Inner dot */}
            <div
                ref={dotRef}
                className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
                style={{
                    width: 6,
                    height: 6,
                    marginLeft: -3,
                    marginTop: -3,
                    borderRadius: '50%',
                    backgroundColor: '#fff',
                }}
            />
            {/* Outer ring */}
            <div
                ref={ringRef}
                className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
                style={{
                    width: 36,
                    height: 36,
                    marginLeft: -18,
                    marginTop: -18,
                    borderRadius: '50%',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                }}
            />
        </>
    );
}
