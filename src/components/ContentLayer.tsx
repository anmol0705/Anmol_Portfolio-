'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Cpu,
  Globe,
  Server,
  Code2,
  Github,
  Linkedin,
  Mail,
  Terminal,
} from 'lucide-react';
import ProjectsSection from './ProjectsSection';

gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// TYPES
// ============================================================================
interface Stat {
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
}

// ============================================================================
// STATS DATA
// ============================================================================
const stats: Stat[] = [
  { label: 'Lines of Code', value: '847K', change: '+12.3K', positive: true },
  { label: 'Competitions Won', value: '127', change: '+5', positive: true },
  { label: 'Open Source Stars', value: '3.2K', change: '+234', positive: true },
  { label: 'System Uptime', value: '99.97%', positive: true },
];

// ============================================================================
// TECH STACK ITEM
// ============================================================================
interface TechItemProps {
  name: string;
  level: number;
  icon: React.ReactNode;
  description: string;
}

function TechItem({ name, level, icon, description }: TechItemProps) {
  return (
    <div className="group relative p-4 bg-surface border border-white/[0.04] rounded-xl hover:border-accent/15 transition-all duration-500">
      <div className="flex items-center gap-3 mb-2">
        <div className="text-accent/60">{icon}</div>
        <span className="font-mono text-white/80 text-sm">{name}</span>
      </div>
      <p className="text-white/25 text-xs font-mono mb-3">{description}</p>
      <div className="h-px bg-white/[0.04] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-accent/60 to-accent/20 transition-all duration-700"
          style={{ width: `${level}%` }}
        />
      </div>
      <div className="mt-1.5 text-right">
        <span className="text-accent/30 font-mono text-xs">{level}%</span>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN CONTENT LAYER
// ============================================================================
export default function ContentLayer() {
  const [typedText, setTypedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [typewriterStarted, setTypewriterStarted] = useState(false);
  const aboutRef = useRef<HTMLElement>(null);
  const projectsIntroRef = useRef<HTMLDivElement>(null);
  const fullText = 'The Alpha';

  // Start typewriter only when About section scrolls into view
  useEffect(() => {
    const el = aboutRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTypewriterStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Run typewriter once triggered
  useEffect(() => {
    if (!typewriterStarted) return;
    let index = 0;
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setTypedText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100);
    return () => clearInterval(timer);
  }, [typewriterStarted]);

  // Cursor blink
  useEffect(() => {
    const timer = setInterval(() => setShowCursor((p) => !p), 530);
    return () => clearInterval(timer);
  }, []);

  // ── Projects intro scroll-driven title reveal ──────────────────────────
  useEffect(() => {
    const intro = projectsIntroRef.current;
    if (!intro) return;

    const label = intro.querySelector('.projects-intro-label');
    const title = intro.querySelector('.projects-intro-title');
    const line = intro.querySelector('.projects-intro-line');

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: intro,
          start: 'top 80%',
          end: 'bottom 30%',
          scrub: 1,
        },
      });

      // Line grows in from 0 height
      if (line) {
        tl.fromTo(
          line,
          { scaleY: 0, opacity: 0 },
          { scaleY: 1, opacity: 1, duration: 0.3, ease: 'power2.out' },
          0
        );
      }

      // Label fades in and slides up
      if (label) {
        tl.fromTo(
          label,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.3, ease: 'power3.out' },
          0.05
        );
      }

      // Title fades in from below, then continues moving up
      if (title) {
        tl.fromTo(
          title,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' },
          0.1
        );
        // Second phase: gently push upward + slight dim as we approach the pin
        tl.to(
          title,
          { y: -30, opacity: 0.7, duration: 0.3, ease: 'power2.inOut' },
          0.6
        );
      }
    }, intro);

    return () => ctx.revert();
  }, []);

  return (
    <div
      id="content-layer"
      className="relative z-20 bg-black"
    >
      {/* Top edge gradient removed to allow Hero background to bleed through smoothly */}

      {/* ================================================================ */}
      {/* ABOUT SECTION                                                    */}
      {/* ================================================================ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section id="about" ref={aboutRef} className="py-24 md:py-32">
          {/* Section header */}
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-px bg-accent/20" />
            <h2 className="text-accent/50 font-mono text-xs tracking-[0.3em] uppercase">
              About
            </h2>
            <div className="flex-1 h-px bg-white/[0.04]" />
          </div>

          {/* Title with typewriter */}
          <div className="mb-16">
            <h3 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6 tracking-tight">
              {typedText}
              <span className={`text-accent ${showCursor ? 'opacity-100' : 'opacity-0'}`}>_</span>
            </h3>
            <p className="text-lg text-white/30 font-mono max-w-3xl leading-relaxed">
              <span className="text-accent/40">&gt;</span> Quantitative developer specializing in high-frequency trading systems,
              algorithmic optimization, and machine learning applications in finance.
              Competitive programmer with a passion for elegant solutions to complex problems.
            </p>
          </div>

          {/* Stats — Bloomberg Terminal Style */}
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-6">
              <Terminal className="w-4 h-4 text-accent/40" />
              <span className="font-mono text-xs text-white/20 tracking-wider">PERFORMANCE_METRICS</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className="bg-surface border border-white/[0.04] rounded-xl p-5 hover:border-accent/10 transition-all duration-500"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white/25 font-mono text-xs">{stat.label}</span>
                    <span className="text-accent/20 font-mono text-xs">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="text-3xl font-display font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  {stat.change && (
                    <div className={`font-mono text-xs flex items-center gap-1 ${stat.positive ? 'text-accent/60' : 'text-red-400/60'}`}>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                      {stat.change}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Cpu className="w-4 h-4 text-accent/40" />
              <span className="font-mono text-xs text-white/20 tracking-wider">TECH_STACK</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <TechItem
                name="C++"
                level={95}
                icon={<Code2 className="w-4 h-4" />}
                description="Competitive Programming & Systems"
              />
              <TechItem
                name="Python"
                level={92}
                icon={<Server className="w-4 h-4" />}
                description="ML/AI & Quantitative Analysis"
              />
              <TechItem
                name="MERN"
                level={88}
                icon={<Globe className="w-4 h-4" />}
                description="Full-Stack Web Development"
              />
              <TechItem
                name="Go"
                level={85}
                icon={<Cpu className="w-4 h-4" />}
                description="Systems & Microservices"
              />
            </div>
          </div>
        </section>
      </div>

      {/* ================================================================ */}
      {/* TRANSITION BRIDGE: About → Projects                              */}
      {/* Scroll-driven title reveal — draws the eye into Projects         */}
      {/* ================================================================ */}
      <div
        ref={projectsIntroRef}
        className="relative flex flex-col items-center justify-center py-32 md:py-44"
      >
        {/* Animated vertical accent line */}
        <div
          className="projects-intro-line w-px h-20 bg-gradient-to-b from-transparent via-accent/30 to-accent/50 mb-8 origin-top"
          style={{ transform: 'scaleY(0)' }}
        />

        {/* Animated label */}
        <div className="projects-intro-label flex items-center gap-3 mb-4 opacity-0">
          <div className="w-8 h-px bg-accent/30" />
          <span className="text-accent/50 font-mono text-xs tracking-[0.3em] uppercase">
            Case Studies
          </span>
          <div className="w-8 h-px bg-accent/30" />
        </div>

        {/* Animated title */}
        <h2
          className="projects-intro-title text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white/90 tracking-tight text-center opacity-0"
        >
          High-Performance Engineering
        </h2>
      </div>

      {/* ================================================================ */}
      {/* PROJECTS SECTION — horizontal scroll                             */}
      {/* ================================================================ */}
      <ProjectsSection />

      {/* Fade back into vertical flow after Projects */}
      <div className="h-24 md:h-32 bg-gradient-to-b from-black to-black" />

      {/* ================================================================ */}
      {/* CONTACT SECTION                                                  */}
      {/* ================================================================ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section id="contact" className="py-24 md:py-32">
          {/* Section header */}
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-px bg-accent/20" />
            <h2 className="text-accent/50 font-mono text-xs tracking-[0.3em] uppercase">
              Contact
            </h2>
            <div className="flex-1 h-px bg-white/[0.04]" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Terminal style contact */}
            <div>
              <h3 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 tracking-tight">
                <span className="text-accent/50">&gt;</span> Let&apos;s Connect
              </h3>
              <p className="text-white/30 font-mono mb-8 text-sm leading-relaxed">
                Ready to collaborate on groundbreaking projects? Let&apos;s discuss how we can push the boundaries of technology together.
              </p>

              {/* Terminal command */}
              <div className="bg-surface border border-white/[0.04] rounded-xl p-5 font-mono text-sm">
                <div className="flex items-center gap-2 mb-4 border-b border-white/[0.04] pb-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                  <span className="ml-2 text-white/20 text-xs">quant@portfolio ~ %</span>
                </div>
                <div className="space-y-2">
                  <div className="text-white/30">
                    <span className="text-accent/50">$</span> cat contact.json
                  </div>
                  <div className="text-accent/40">{'{'}</div>
                  <div className="pl-4 text-white/50">
                    <span className="text-violet-400/60">&quot;email&quot;</span>: <span className="text-accent/70">&quot;hello@quant.dev&quot;</span>,
                  </div>
                  <div className="pl-4 text-white/50">
                    <span className="text-violet-400/60">&quot;github&quot;</span>: <span className="text-accent/70">&quot;github.com/quant&quot;</span>,
                  </div>
                  <div className="pl-4 text-white/50">
                    <span className="text-violet-400/60">&quot;linkedin&quot;</span>: <span className="text-accent/70">&quot;linkedin.com/in/quant&quot;</span>
                  </div>
                  <div className="text-accent/40">{'}'}</div>
                  <div className="text-white/30 mt-4">
                    <span className="text-accent/50">$</span> echo &quot;Ready to collaborate!&quot; <span className="cursor-blink">▊</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Social links */}
            <div className="flex flex-col justify-center">
              <div className="space-y-3">
                {/* GitHub */}
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-4 bg-surface border border-white/[0.04] rounded-xl hover:border-accent/15 transition-all duration-500"
                >
                  <div className="w-11 h-11 rounded-lg bg-accent/5 flex items-center justify-center text-accent/50 group-hover:bg-accent/10 group-hover:text-accent transition-all duration-500">
                    <Github className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-display font-semibold text-white/80 group-hover:text-accent transition-colors duration-300">GitHub</div>
                    <div className="text-white/20 font-mono text-xs">@quant</div>
                  </div>
                  <svg className="w-4 h-4 text-white/10 ml-auto group-hover:text-accent/40 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-4 bg-surface border border-white/[0.04] rounded-xl hover:border-accent/15 transition-all duration-500"
                >
                  <div className="w-11 h-11 rounded-lg bg-accent/5 flex items-center justify-center text-accent/50 group-hover:bg-accent/10 group-hover:text-accent transition-all duration-500">
                    <Linkedin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-display font-semibold text-white/80 group-hover:text-accent transition-colors duration-300">LinkedIn</div>
                    <div className="text-white/20 font-mono text-xs">Connect professionally</div>
                  </div>
                  <svg className="w-4 h-4 text-white/10 ml-auto group-hover:text-accent/40 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>

                {/* Email */}
                <a
                  href="mailto:hello@quant.dev"
                  className="group flex items-center gap-4 p-4 bg-surface border border-white/[0.04] rounded-xl hover:border-accent/15 transition-all duration-500"
                >
                  <div className="w-11 h-11 rounded-lg bg-accent/5 flex items-center justify-center text-accent/50 group-hover:bg-accent/10 group-hover:text-accent transition-all duration-500">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-display font-semibold text-white/80 group-hover:text-accent transition-colors duration-300">Email</div>
                    <div className="text-white/20 font-mono text-xs">hello@quant.dev</div>
                  </div>
                  <svg className="w-4 h-4 text-white/10 ml-auto group-hover:text-accent/40 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* FOOTER                                                          */}
        {/* ================================================================ */}
        <footer className="py-12 border-t border-white/[0.04]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-white/20 font-mono text-xs">
              © 2025 Quant Portfolio. All systems operational.
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-accent/40 rounded-full animate-pulse" />
                <span className="text-accent/30 font-mono text-xs">ONLINE</span>
              </div>
              <div className="text-white/10 font-mono text-xs">
                v2.0.0 | Built with Next.js
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
