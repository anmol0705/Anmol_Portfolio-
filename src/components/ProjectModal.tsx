'use client';

import { useRef, useEffect, useCallback, ReactNode } from 'react';
import { gsap } from 'gsap';
import ReactMarkdown from 'react-markdown';
import { X, ExternalLink, Github } from 'lucide-react';

// ============================================================================
// PROJECT DETAIL MODAL — glassmorphic overlay with README
// ============================================================================
export interface ProjectData {
    id: string;
    title: string;
    category: string;
    description: string;
    tech: string[];
    status: 'deployed' | 'active' | 'research';
    metrics: { label: string; value: string }[];
    readme: string;
    github?: string;
    live?: string;
}

interface ProjectModalProps {
    project: ProjectData | null;
    onClose: () => void;
}

// Magnetic Button Wrapper Hook Logic
function MagneticButton({ children, onClick, className }: { children: ReactNode, onClick?: () => void, className?: string }) {
    const ref = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const hoverConfig = { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)' };
        const resetConfig = { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)' };

        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const { height, width, left, top } = el.getBoundingClientRect();
            const x = clientX - (left + width / 2);
            const y = clientY - (top + height / 2);

            gsap.to(el, { ...hoverConfig, x: x * 0.4, y: y * 0.4 });
        };

        const handleMouseLeave = () => {
            gsap.to(el, resetConfig);
        };

        el.addEventListener('mousemove', handleMouseMove);
        el.addEventListener('mouseleave', handleMouseLeave);
        return () => {
            el.removeEventListener('mousemove', handleMouseMove);
            el.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <button ref={ref} onClick={onClick} className={`magnetic-btn ${className || ''}`}>
            {children}
        </button>
    );
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const contentMaskRef = useRef<HTMLDivElement>(null);

    // Animate in with custom bezier curves
    useEffect(() => {
        if (!project || !overlayRef.current || !panelRef.current) return;

        // Use Custom ease string directly supported by GSAP inside Expo or CustomEase
        // Awwwards-style luxury easing map: 'power4.inOut', 'expo.out', CustomEase equivalents
        const LUX_OUT = "cubic-bezier(0.16, 1, 0.3, 1)";
        const duration = 0.8;

        gsap.fromTo(
            overlayRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.5, ease: 'power2.out' }
        );

        gsap.fromTo(
            panelRef.current,
            { opacity: 0, y: 80, scale: 0.95, rotationX: 5 },
            { opacity: 1, y: 0, scale: 1, rotationX: 0, duration: duration, ease: LUX_OUT, delay: 0.05, transformPerspective: 1000 }
        );

        // Staggered reveal for internal text
        if (contentMaskRef.current) {
            gsap.fromTo(
                contentMaskRef.current.children,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: duration, ease: LUX_OUT, stagger: 0.05, delay: 0.15 }
            );
        }
    }, [project]);

    // Close with animation
    const handleClose = useCallback(() => {
        if (!overlayRef.current || !panelRef.current) {
            onClose();
            return;
        }
        const LUX_IN = "cubic-bezier(0.85, 0, 0.15, 1)";

        gsap.to(panelRef.current, {
            opacity: 0,
            y: 40,
            scale: 0.95,
            duration: 0.4,
            ease: LUX_IN,
        });
        gsap.to(overlayRef.current, {
            opacity: 0,
            duration: 0.4,
            ease: 'power2.in',
            delay: 0.1,
            onComplete: onClose,
        });
    }, [onClose]);

    // Escape key cleanup
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [handleClose]);

    if (!project) return null;

    const statusColors: Record<string, string> = {
        deployed: 'bg-accent/15 text-accent border-accent/20',
        active: 'bg-violet-500/15 text-violet-400 border-violet-500/20',
        research: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    };

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-[90] flex items-center justify-center p-4 md:p-8"
            style={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
                onClick={handleClose}
                aria-hidden="true"
            />

            {/* Panel */}
            <div
                ref={panelRef}
                className="relative z-10 w-full max-w-4xl max-h-[85vh] overflow-y-auto glass-strong rounded-2xl shadow-2xl"
                data-lenis-prevent
            >
                {/* Header */}
                <div className="sticky top-0 z-20 glass-strong rounded-t-2xl px-6 py-4 flex items-center justify-between border-b border-white/5 mx-auto">
                    <div className="flex items-center gap-3">
                        <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-mono border ${statusColors[project.status] || ''}`}
                        >
                            {project.status.toUpperCase()}
                        </span>
                        <span className="text-muted-better font-mono text-xs">{project.category}</span>
                    </div>

                    <MagneticButton
                        onClick={handleClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-colors border border-white/10"
                    >
                        <X className="w-4 h-4" />
                    </MagneticButton>
                </div>

                {/* Mask wrapper for staggered GSAP text animations */}
                <div ref={contentMaskRef}>
                    {/* Title + CTAs */}
                    <div className="px-6 md:px-10 pt-8 pb-6 border-b border-white/5">
                        <h2 id="modal-title" className="text-4xl md:text-5xl font-display font-bold text-white mb-3 tracking-tight">
                            {project.title}
                        </h2>
                        <p className="text-muted-better font-mono text-sm mb-8 max-w-2xl leading-relaxed">{project.description}</p>

                        {/* Tech badges */}
                        <div className="flex flex-wrap gap-2 mb-8">
                            {project.tech.map((t) => (
                                <span
                                    key={t}
                                    className="px-2.5 py-1 bg-accent/5 border border-accent/10 rounded-md text-accent/70 font-mono text-xs shadow-sm shadow-accent/5"
                                >
                                    {t}
                                </span>
                            ))}
                        </div>

                        {/* CTA buttons */}
                        <div className="flex gap-4">
                            {project.github && (
                                <a
                                    href={project.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-accent/30 rounded-lg text-sm font-mono text-white/80 hover:text-accent transition-all duration-300"
                                >
                                    <Github className="w-4 h-4" />
                                    View Source
                                </a>
                            )}
                            {project.live && (
                                <a
                                    href={project.live}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center gap-2 px-5 py-2.5 bg-accent/10 hover:bg-accent/20 border border-accent/30 hover:border-accent/50 rounded-lg text-sm font-mono text-accent transition-all duration-300 glow-accent"
                                >
                                    <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    Launch Deployment
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Metrics */}
                    <div className="px-6 md:px-10 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 border-b border-white/5 bg-black/20">
                        {project.metrics.map((m) => (
                            <div key={m.label} className="text-left py-1">
                                <div className="text-white/40 font-mono text-xs uppercase tracking-widest mb-1">{m.label}</div>
                                <div className="text-2xl font-display font-bold text-accent drop-shadow-md">{m.value}</div>
                            </div>
                        ))}
                    </div>

                    {/* README rendered with react-markdown */}
                    <div className="px-6 md:px-10 py-10">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-sm shadow-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-sm shadow-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-sm shadow-green-500/20" />
                            <span className="ml-3 text-white/30 font-mono text-xs tracking-widest">README.md</span>
                        </div>
                        <div className="prose prose-invert prose-sm md:prose-base max-w-none">
                            <ReactMarkdown>{project.readme}</ReactMarkdown>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
