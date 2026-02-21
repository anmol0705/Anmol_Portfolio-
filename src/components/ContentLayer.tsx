'use client';

import { useRef, useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Cpu,
  Database,
  Globe,
  Server,
  Code2,
  TrendingUp,
  Github,
  Linkedin,
  Mail,
  Terminal,
  Zap,
  Target,
  Award,
  BookOpen
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================
interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  tech: string[];
  icon: React.ReactNode;
  status: 'deployed' | 'research' | 'active';
  metrics?: { label: string; value: string }[];
}

interface Stat {
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
}

// ============================================================================
// PROJECTS DATA
// ============================================================================
const projects: Project[] = [
  {
    id: 'lstm-forecaster',
    title: 'LSTM Stock Forecaster',
    category: 'Research',
    description: 'Deep learning model for financial time-series prediction. Utilizes LSTM networks with attention mechanisms for multi-step ahead forecasting.',
    tech: ['Python', 'TensorFlow', 'Pandas', 'NumPy'],
    icon: <TrendingUp className="w-5 h-5" />,
    status: 'research',
    metrics: [
      { label: 'RMSE', value: '0.0234' },
      { label: 'Accuracy', value: '87.3%' }
    ]
  },
  {
    id: 'hft-engine',
    title: 'HFT Engine',
    category: 'C++',
    description: 'High-frequency trading engine with nanosecond-latency order matching. Custom memory allocator and lock-free data structures.',
    tech: ['C++20', 'Linux', 'DPDK', 'FPGA'],
    icon: <Zap className="w-5 h-5" />,
    status: 'active',
    metrics: [
      { label: 'Latency', value: '47ns' },
      { label: 'Throughput', value: '1.2M/s' }
    ]
  },
  {
    id: 'coderank-arena',
    title: 'CodeRank Arena',
    category: 'MERN',
    description: 'Real-time competitive coding platform with WebSocket-based multiplayer. Advanced code execution sandbox with container isolation.',
    tech: ['React', 'Node.js', 'MongoDB', 'Docker'],
    icon: <Target className="w-5 h-5" />,
    status: 'deployed',
    metrics: [
      { label: 'Users', value: '12K+' },
      { label: 'Matches', value: '45K+' }
    ]
  },
  {
    id: 'sentiment-api',
    title: 'Sentiment-Metric API',
    category: 'Go',
    description: 'Financial news sentiment analyzer processing 10K+ articles daily. NLP pipeline with custom financial entity recognition.',
    tech: ['Go', 'Redis', 'PostgreSQL', 'NLP'],
    icon: <Database className="w-5 h-5" />,
    status: 'deployed',
    metrics: [
      { label: 'Articles/day', value: '12K' },
      { label: 'Latency', value: '23ms' }
    ]
  },
  {
    id: 'quant-dashboard',
    title: 'Quant Dashboard',
    category: 'React',
    description: 'Real-time market data visualization platform with custom charting engine. Supports 50+ technical indicators and algorithmic strategy backtesting.',
    tech: ['React', 'D3.js', 'WebSocket', 'Charts'],
    icon: <BookOpen className="w-5 h-5" />,
    status: 'active',
    metrics: [
      { label: 'Indicators', value: '50+' },
      { label: 'Data feeds', value: '15' }
    ]
  },
  {
    id: 'algo-visualizer',
    title: 'Algo-Visualizer',
    category: 'JavaScript',
    description: 'Interactive visualization of pathfinding and sorting algorithms. Educational platform with step-by-step execution and complexity analysis.',
    tech: ['JavaScript', 'Canvas', 'WebGL', 'Algorithms'],
    icon: <Code2 className="w-5 h-5" />,
    status: 'deployed',
    metrics: [
      { label: 'Algorithms', value: '25' },
      { label: 'Views', value: '89K' }
    ]
  },
  {
    id: 'ecommerce-suite',
    title: 'E-Commerce Suite',
    category: 'MERN',
    description: 'Scalable retail engine handling 100K+ concurrent users. Microservices architecture with event-driven inventory management.',
    tech: ['React', 'Node.js', 'MongoDB', 'AWS'],
    icon: <Globe className="w-5 h-5" />,
    status: 'deployed',
    metrics: [
      { label: 'Concurrent', value: '100K' },
      { label: 'Uptime', value: '99.9%' }
    ]
  }
];

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
    <div className="group relative p-4 bg-obsidian/50 border border-neon/10 rounded-lg hover:border-neon/30 transition-all duration-300">
      <div className="flex items-center gap-3 mb-2">
        <div className="text-neon">{icon}</div>
        <span className="font-mono text-white text-sm">{name}</span>
      </div>
      <p className="text-white/40 text-xs font-mono mb-3">{description}</p>
      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-neon to-terminal-cyan transition-all duration-500"
          style={{ width: `${level}%` }}
        />
      </div>
      <div className="mt-1 text-right">
        <span className="text-neon/60 font-mono text-xs">{level}%</span>
      </div>
    </div>
  );
}

// ============================================================================
// PROJECT CARD
// ============================================================================
interface ProjectCardProps {
  project: Project;
  index: number;
}

function ProjectCard({ project, index }: ProjectCardProps) {
  const statusColors = {
    deployed: 'bg-neon/20 text-neon border-neon/30',
    research: 'bg-cyber/20 text-cyber border-cyber/30',
    active: 'bg-terminal-cyan/20 text-terminal-cyan border-terminal-cyan/30'
  };

  return (
    <Card className="group relative bg-obsidian/80 border border-neon/10 rounded-xl overflow-hidden hover:border-neon/40 transition-all duration-500 hover:glow-neon">
      {/* Index number */}
      <div className="absolute top-4 right-4 text-neon/20 font-mono text-4xl font-bold">
        {String(index + 1).padStart(2, '0')}
      </div>

      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-neon/10 flex items-center justify-center text-neon group-hover:bg-neon/20 transition-colors">
              {project.icon}
            </div>
            <div>
              <h3 className="font-display font-semibold text-white group-hover:text-neon transition-colors">
                {project.title}
              </h3>
              <span className="text-xs font-mono text-white/40">{project.category}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-white/60 text-sm font-mono leading-relaxed mb-4">
          {project.description}
        </p>

        {/* Metrics */}
        {project.metrics && (
          <div className="flex gap-4 mb-4">
            {project.metrics.map((metric) => (
              <div key={metric.label} className="bg-white/5 rounded px-3 py-2">
                <div className="text-neon font-mono text-sm font-bold">{metric.value}</div>
                <div className="text-white/40 font-mono text-xs">{metric.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tech stack */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech.map((tech) => (
            <Badge
              key={tech}
              variant="outline"
              className="text-xs font-mono border-neon/20 text-neon/70 hover:border-neon/40"
            >
              {tech}
            </Badge>
          ))}
        </div>

        {/* Status */}
        <div className="flex items-center justify-between">
          <Badge className={`text-xs font-mono border ${statusColors[project.status]}`}>
            {project.status.toUpperCase()}
          </Badge>
          <button className="text-neon/50 hover:text-neon font-mono text-xs flex items-center gap-1 transition-colors">
            View Project
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </CardContent>
    </Card>
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

  return (
    <div
      id="content-layer"
      className="relative z-20"
      style={{
        background: '#000000'
      }}
    >
      {/* Top edge gradient */}
      <div className="h-32 bg-gradient-to-b from-transparent to-obsidian" />

      {/* Main content wrapper */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ================================================================ */}
        {/* ABOUT SECTION */}
        {/* ================================================================ */}
        <section id="about" ref={aboutRef} className="py-24 md:py-32">
          {/* Section header */}
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neon/30 to-transparent" />
            <h2 className="text-neon font-mono text-sm tracking-[0.3em] uppercase">
              About
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neon/30 to-transparent" />
          </div>

          {/* Title with typewriter */}
          <div className="mb-12">
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4">
              {typedText}
              <span className={`text-neon ${showCursor ? 'opacity-100' : 'opacity-0'}`}>_</span>
            </h3>
            <p className="text-lg text-white/60 font-mono max-w-3xl leading-relaxed">
              <span className="text-neon">&gt;</span> Quantitative developer specializing in high-frequency trading systems,
              algorithmic optimization, and machine learning applications in finance.
              Competitive programmer with a passion for elegant solutions to complex problems.
            </p>
          </div>

          {/* Bloomberg Terminal Style Stats */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="w-4 h-4 text-neon" />
              <span className="font-mono text-xs text-neon/60 tracking-wider">PERFORMANCE_METRICS</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className="bg-obsidian border border-neon/10 rounded-lg p-4 hover:border-neon/30 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/40 font-mono text-xs">{stat.label}</span>
                    <span className="text-neon font-mono text-xs">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="text-2xl font-display font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  {stat.change && (
                    <div className={`font-mono text-xs flex items-center gap-1 ${stat.positive ? 'text-neon' : 'text-red-400'}`}>
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
            <div className="flex items-center gap-2 mb-4">
              <Cpu className="w-4 h-4 text-neon" />
              <span className="font-mono text-xs text-neon/60 tracking-wider">TECH_STACK</span>
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
                icon={<Database className="w-4 h-4" />}
                description="Systems & Microservices"
              />
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* PROJECTS SECTION */}
        {/* ================================================================ */}
        <section id="projects" className="py-24 md:py-32">
          {/* Section header */}
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyber/30 to-transparent" />
            <h2 className="text-cyber font-mono text-sm tracking-[0.3em] uppercase">
              Projects
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyber/30 to-transparent" />
          </div>

          {/* Title */}
          <div className="mb-12">
            <h3 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              <span className="text-cyber">$</span> Project_Folio
            </h3>
            <p className="text-lg text-white/60 font-mono max-w-3xl">
              <span className="text-cyber">&gt;</span> A curated selection of systems, tools, and experiments.
              Each project represents a unique challenge solved with precision and creativity.
            </p>
          </div>

          {/* Project grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </section>

        {/* ================================================================ */}
        {/* CONTACT SECTION */}
        {/* ================================================================ */}
        <section id="contact" className="py-24 md:py-32">
          {/* Section header */}
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-terminal-cyan/30 to-transparent" />
            <h2 className="text-terminal-cyan font-mono text-sm tracking-[0.3em] uppercase">
              Contact
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-terminal-cyan/30 to-transparent" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Terminal style contact */}
            <div>
              <h3 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
                <span className="text-terminal-cyan">&gt;</span> Let&apos;s Connect
              </h3>
              <p className="text-white/60 font-mono mb-8">
                Ready to collaborate on groundbreaking projects? Let&apos;s discuss how we can push the boundaries of technology together.
              </p>

              {/* Terminal command */}
              <div className="bg-obsidian border border-neon/20 rounded-lg p-4 font-mono text-sm">
                <div className="flex items-center gap-2 mb-3 border-b border-neon/10 pb-3">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="ml-2 text-white/40 text-xs">quant@portfolio ~ %</span>
                </div>
                <div className="space-y-2">
                  <div className="text-white/60">
                    <span className="text-neon">$</span> cat contact.json
                  </div>
                  <div className="text-terminal-cyan">
                    {'{'}
                  </div>
                  <div className="pl-4 text-white/80">
                    <span className="text-cyber">&quot;email&quot;</span>: <span className="text-neon">&quot;hello@quant.dev&quot;</span>,
                  </div>
                  <div className="pl-4 text-white/80">
                    <span className="text-cyber">&quot;github&quot;</span>: <span className="text-neon">&quot;github.com/quant&quot;</span>,
                  </div>
                  <div className="pl-4 text-white/80">
                    <span className="text-cyber">&quot;linkedin&quot;</span>: <span className="text-neon">&quot;linkedin.com/in/quant&quot;</span>
                  </div>
                  <div className="text-terminal-cyan">
                    {'}'}
                  </div>
                  <div className="text-white/60 mt-4">
                    <span className="text-neon">$</span> echo &quot;Ready to collaborate!&quot; <span className="cursor-blink">▊</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Social links */}
            <div className="flex flex-col justify-center">
              <div className="space-y-4">
                {/* GitHub */}
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-4 bg-obsidian border border-neon/10 rounded-lg hover:border-neon/30 transition-all hover:glow-neon"
                >
                  <div className="w-12 h-12 rounded-lg bg-neon/10 flex items-center justify-center text-neon group-hover:bg-neon/20 transition-colors">
                    <Github className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-display font-semibold text-white group-hover:text-neon transition-colors">GitHub</div>
                    <div className="text-white/40 font-mono text-sm">@quant</div>
                  </div>
                  <svg className="w-5 h-5 text-neon/50 ml-auto group-hover:text-neon transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-4 bg-obsidian border border-neon/10 rounded-lg hover:border-neon/30 transition-all hover:glow-neon"
                >
                  <div className="w-12 h-12 rounded-lg bg-neon/10 flex items-center justify-center text-neon group-hover:bg-neon/20 transition-colors">
                    <Linkedin className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-display font-semibold text-white group-hover:text-neon transition-colors">LinkedIn</div>
                    <div className="text-white/40 font-mono text-sm">Connect professionally</div>
                  </div>
                  <svg className="w-5 h-5 text-neon/50 ml-auto group-hover:text-neon transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>

                {/* Email */}
                <a
                  href="mailto:hello@quant.dev"
                  className="group flex items-center gap-4 p-4 bg-obsidian border border-neon/10 rounded-lg hover:border-neon/30 transition-all hover:glow-neon"
                >
                  <div className="w-12 h-12 rounded-lg bg-neon/10 flex items-center justify-center text-neon group-hover:bg-neon/20 transition-colors">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-display font-semibold text-white group-hover:text-neon transition-colors">Email</div>
                    <div className="text-white/40 font-mono text-sm">hello@quant.dev</div>
                  </div>
                  <svg className="w-5 h-5 text-neon/50 ml-auto group-hover:text-neon transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* FOOTER */}
        {/* ================================================================ */}
        <footer className="py-12 border-t border-neon/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-white/40 font-mono text-sm">
              © 2024 Quant Portfolio. All systems operational.
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-neon rounded-full animate-pulse" />
                <span className="text-neon/60 font-mono text-xs">ONLINE</span>
              </div>
              <div className="text-white/20 font-mono text-xs">
                v1.0.0 | Built with Next.js
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
