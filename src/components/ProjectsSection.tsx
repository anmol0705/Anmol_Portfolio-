'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Code2, Server, Database, LineChart, Globe, Zap } from 'lucide-react';
import dynamic from 'next/dynamic';
import type { ProjectData } from './ProjectModal';

gsap.registerPlugin(ScrollTrigger);

const ProjectModal = dynamic(() => import('./ProjectModal'), { ssr: false });

// ============================================================================
// PROJECT DATA (Awwwards-level Technical Case Studies)
// ============================================================================
const projects: ProjectData[] = [
    {
        id: 'crml-v5',
        title: 'CRML v5.1',
        category: 'Python / Quant',
        description: 'Dual-Channel Hypergraph neural network for high-frequency equity price forecasting with dynamic volatility scaling.',
        tech: ['PyTorch', 'Hypergraphs', 'CUDA', 'ZMQ'],
        status: 'research',
        metrics: [
            { label: 'Sharpe', value: '3.42' },
            { label: 'Win Rate', value: '62.8%' },
            { label: 'Latency', value: '8ms' },
            { label: 'Params', value: '14M' },
        ],
        readme: `# CRML v5.1: Dual-Channel Hypergraph Forecasting

## Architectural Overview
Traditional graph neural networks fail to capture n-ary relationships in equities (e.g., sector-wide momentum coupled with macroeconomic shocks). CRML v5.1 introduces a **Dual-Channel Hypergraph Convolutional Network (DHGCN)**.

### The Mathematics
Instead of a standard adjacency matrix $A$, we compute an incidence matrix $H \\in \\mathbb{R}^{N \\times E}$ where edges connect arbitrarily many nodes. The dual-channel processes:
1. **Price-Action Channel**: High-frequency order book imbalances.
2. **Sentiment Channel**: NLP sentiment embeddings from real-time news.

### Performance Data
| Metric | Baseline (LSTM) | CRML v4 | **CRML v5.1** |
|--------|-----------------|---------|---------------|
| Information Ratio | 1.8 | 2.5 | **3.8** |
| Max Drawdown | 14% | 9% | **4.2%** |
| Inference Time | 12ms | 10ms | **8ms** |

## Implementation
Utilizes custom CUDA kernels for hyperedge message passing to achieve sub-10ms inference. Optimized over ZeroMQ pub/sub clusters.
`,
        github: 'https://github.com',
    },
    {
        id: 'ar-tiles',
        title: 'AR_Tiles (SAM2)',
        category: 'Computer Vision',
        description: 'Real-time augmented reality spatial mapping utilizing Meta\'s SAM2 (Segment Anything Model 2) for zero-shot video segmentation.',
        tech: ['SAM2', 'WebXR', 'Three.js', 'WASM'],
        status: 'active',
        metrics: [
            { label: 'FPS', value: '60' },
            { label: 'IoU', value: '0.94' },
            { label: 'Jitter', value: '<2px' },
            { label: 'Memory', value: '128MB' },
        ],
        readme: `# AR_Tiles: SAM2 Spatial Segmentation

## System Architecture
A zero-shot real-time video segmentation pipeline running directly in the browser via WebAssembly and WebGL compute shaders, powered by Meta's SAM2 architecture.

### Pipeline Stages
1. **Frame Capture**: \`Navigator.mediaDevices\` at 60fps / 1080p.
2. **Feature Extraction**: Lightweight MobileNetV3 backbone running in WASM.
3. **Prompt Encoding**: Dense grid point-prompting to simulate LiDAR depth.
4. **Mask Decoder (SAM2)**: WebGL-accelerated inference yielding spatio-temporal masks.

### WebGL Memory Management (Zero-Leak Policy)
To prevent VRAM leaks during continuous video streams, we implemented a custom ring buffer for WebGL textures, calling \`gl.deleteTexture()\` explicitly at the end of each frame lifecycle.

## Tech Specs
- **Backbone**: SAM2-Tiny (quantized to INT8)
- **Runtime**: ONNX Runtime Web
- **Rendering**: Custom React Three Fiber composite
`,
        live: 'https://example.com'
    },
    {
        id: 'project-nomad',
        title: 'Project Nomad',
        category: 'Distributed Systems',
        description: 'A globally distributed, Byzantine fault-tolerant order matching engine architecture designed for decentralized dark pools.',
        tech: ['Rust', 'Libp2p', 'Raft', 'Tokio'],
        status: 'deployed',
        metrics: [
            { label: 'Nodes', value: '450+' },
            { label: 'TPS', value: '12,500' },
            { label: 'Consensus', value: 'BFT-Raft' },
            { label: 'Finality', value: '400ms' },
        ],
        readme: `# Project Nomad: Decentralized Dark Pool

## Core Concept
Project Nomad solves the front-running problem in decentralized exchanges (DEXs) by implementing a Byzantine Fault-Tolerant (BFT) Raft consensus over an encrypted mempool.

### Cryptographic Architecture
Orders are encrypted using **Threshold Time-Lock Puzzles (TTLPs)**. The network must reach consensus on the ordering of transactions *before* the transactions can be decrypted via distributed key generation (DKG).

### System Topology
- **Validators (450+)**: Rust-based nodes utilizing \`libp2p\` for gossip protocol.
- **Relayers**: Stateless edge nodes for client connection termination.
- **Matching Engine**: Lock-free concurrent orderbook executing in deterministic Wasm enclaves.

## Scale
Successfully processed $1.2B in simulated daily trading volume during the testnet phase with 0% front-running incidence.
`,
        github: 'https://github.com',
    },
    {
        id: 'hft-engine',
        title: 'Venom HFT',
        category: 'C++ / Systems',
        description: 'Ultra-low-latency trading engine with FPGA co-processor integration. Sub-50ns order-to-wire latency.',
        tech: ['C++20', 'FPGA', 'Verilog', 'TCP/IP'],
        status: 'active',
        metrics: [
            { label: 'Latency', value: '47ns' },
            { label: 'Throughput', value: '1.2M/s' },
            { label: 'Uptime', value: '99.99%' },
            { label: 'Lines', value: '34K' },
        ],
        readme: `# Venom HFT Engine

## Overview
A production-grade high-frequency trading engine designed for sub-microsecond execution. Features kernel-bypass networking, lock-free data structures, and FPGA-accelerated order matching.

## Architecture
- **Core**: Lock-free SPSC queues with cache-line padding to prevent false sharing.
- **Network**: DPDK kernel bypass + custom TCP/IP stack implemented entirely in user-space.
- **FPGA**: Xilinx Alveo U250 for order validation and sub-10ns risk checks.

## Performance
| Metric | Value |
|--------|-------|
| Order-to-wire | 47ns p50 |
| Tick-to-trade | 890ns p99 |
| Message throughput | 1.2M msgs/sec |
`,
        github: 'https://github.com',
    },
    {
        id: 'coderank-arena',
        title: 'CodeRank Arena',
        category: 'Full-stack / Engine',
        description: 'Real-time competitive programming platform with live contests, ELO ranking, and containerized code execution.',
        tech: ['React', 'Node.js', 'MongoDB', 'Docker'],
        status: 'deployed',
        metrics: [
            { label: 'Users', value: '12K' },
            { label: 'Execution', value: 'Sandboxed' },
            { label: 'Contests', value: '240+' },
            { label: 'Submissions', value: '890K' },
        ],
        readme: `# CodeRank Arena

## Overview
A full-stack competitive programming platform featuring real-time contests, a custom judge system with sandboxed execution, and an ELO-based ranking algorithm.

## Features
- **Live Contests**: WebSocket-powered real-time standings
- **Code Editor**: Monaco with 15+ language support
- **Judge System**: Docker-sandboxed execution with strict \`cgroups\` resource Limits (Memory/CPU constraints).
- **Social**: Team formation, editorial discussions, user profiles

## Tech Stack
\`\`\`
Frontend: React + TypeScript + TailwindCSS
Backend: Node.js + Express + MongoDB
Realtime: Socket.IO + Redis pub/sub
Judge: Docker + custom Linux namespace sandboxing
\`\`\`
`,
        github: 'https://github.com',
        live: 'https://example.com',
    },
];

// ============================================================================
// ICON MAP
// ============================================================================
const iconMap: Record<string, React.ReactNode> = {
    'crml-v5': <LineChart className="w-5 h-5" />,
    'ar-tiles': <Globe className="w-5 h-5" />,
    'project-nomad': <Database className="w-5 h-5" />,
    'hft-engine': <Zap className="w-5 h-5" />,
    'coderank-arena': <Code2 className="w-5 h-5" />,
};

// ============================================================================
// SINGLE PROJECT POSTER — cinematic, asymmetric layout
// ============================================================================
function ProjectPoster({
    project,
    index,
    onSelect,
}: {
    project: ProjectData;
    index: number;
    onSelect: (p: ProjectData) => void;
}) {
    const statusColors: Record<string, string> = {
        deployed: 'text-accent border-accent/20',
        active: 'text-violet-400 border-violet-500/20',
        research: 'text-amber-400 border-amber-500/20',
    };

    return (
        <article
            className="project-panel flex-shrink-0 w-screen h-full flex items-center justify-center px-8 md:px-16 lg:px-24"
            aria-labelledby={`project-title-${project.id}`}
        >
            <div
                onClick={() => onSelect(project)}
                className="relative w-full max-w-5xl h-[70vh] flex flex-col justify-end p-8 md:p-12 cursor-pointer group hover-target"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') onSelect(project); }}
            >
                {/* Background gradient */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-surface via-obsidian to-black border border-white/[0.04] overflow-hidden transition-all duration-700 group-hover:border-accent/10">
                    {/* Subtle grid */}
                    <div className="absolute inset-0 terminal-grid opacity-20" />

                    {/* Oversized index number */}
                    <div className="absolute -top-8 -right-4 text-[14rem] md:text-[20rem] font-display font-bold text-white/[0.02] leading-none select-none pointer-events-none transition-transform duration-700 group-hover:scale-105 group-hover:-translate-x-4">
                        {String(index + 1).padStart(2, '0')}
                    </div>

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative z-10">
                    {/* Top meta */}
                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-accent/40">{iconMap[project.id] || <Server className="w-5 h-5" />}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono border ${statusColors[project.status]}`}>
                            {project.status.toUpperCase()}
                        </span>
                        <span className="text-white/30 font-mono text-xs">{project.category}</span>
                    </div>

                    {/* Title — massive, clips right edge. Uses nested spans for character-level GSAP animation potential */}
                    <h3
                        id={`project-title-${project.id}`}
                        className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white leading-[0.9] mb-4 transition-colors duration-300 group-hover:text-accent/90 whitespace-nowrap overflow-visible kinetic-text"
                    >
                        {project.title.split('').map((char, i) => (
                            <span key={i} className="kinetic-char transition-transform duration-500 group-hover:-translate-y-2 inline-block" style={{ transitionDelay: `${i * 20}ms` }}>
                                {char === ' ' ? '\u00A0' : char}
                            </span>
                        ))}
                    </h3>

                    {/* Description */}
                    <p className="text-white/50 font-mono text-sm md:text-base max-w-2xl mb-6 line-clamp-2 leading-relaxed">
                        {project.description}
                    </p>

                    {/* Tech + metrics bar */}
                    <div className="flex items-center gap-6 flex-wrap">
                        {/* Tech badges */}
                        <div className="flex gap-2">
                            {project.tech.slice(0, 3).map((t) => (
                                <span
                                    key={t}
                                    className="px-2 py-0.5 bg-white/[0.03] border border-white/[0.06] rounded text-white/40 font-mono text-xs"
                                >
                                    {t}
                                </span>
                            ))}
                        </div>

                        {/* Divider */}
                        <div className="hidden sm:block w-px h-4 bg-white/10" />

                        {/* Key metrics */}
                        <div className="hidden md:flex gap-6">
                            {project.metrics.slice(0, 2).map((m) => (
                                <div key={m.label} className="flex items-baseline gap-1.5">
                                    <span className="text-accent font-display font-bold text-lg leading-none">{m.value}</span>
                                    <span className="text-white/30 font-mono text-[10px] uppercase tracking-wider">{m.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* View CTA */}
                        <span className="ml-auto text-accent/50 font-mono text-xs group-hover:text-accent transition-colors">
                            CLICK TO EXPLORE &rarr;
                        </span>
                    </div>
                </div>
            </div>
        </article >
    );
}

// ============================================================================
// PROJECTS SECTION — horizontal GSAP scroll
// ============================================================================
export default function ProjectsSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

    // GSAP horizontal scroll hijack with strict cleanup
    useGSAP(
        () => {
            const track = trackRef.current;
            const section = sectionRef.current;
            if (!track || !section) return;

            const totalScroll = track.scrollWidth - window.innerWidth;

            const tween = gsap.to(track, {
                x: -totalScroll,
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    pin: true,
                    scrub: 1.5,
                    // Start pinning slightly before the section hits the top
                    // This prevents the jarring "snap" — the pin engages smoothly
                    start: 'top top',
                    end: () => `+=${totalScroll}`,
                    pinSpacing: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                },
            });

            return () => {
                tween.kill();
            };
        },
        { scope: sectionRef }
    );

    const handleSelect = useCallback((project: ProjectData) => {
        setSelectedProject(project);
        document.body.style.overflow = 'hidden';
    }, []);

    const handleClose = useCallback(() => {
        setSelectedProject(null);
        document.body.style.overflow = '';
    }, []);

    return (
        <>
            <section
                ref={sectionRef}
                id="projects"
                className="relative overflow-hidden bg-black"
                aria-label="Selected Engineering Case Studies"
                role="region"
            >
                {/* Section header — fixed while scrolling */}
                <header className="absolute top-8 left-8 md:left-16 z-10 pointer-events-none">
                    <div className="flex items-center gap-3 mb-2" aria-hidden="true">
                        <div className="w-8 h-px bg-accent/30" />
                        <span className="text-accent/50 font-mono text-xs tracking-[0.3em] uppercase">
                            Case Studies
                        </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-white/80 tracking-tight">
                        High-Performance Engineering
                    </h2>
                </header>

                {/* Scroll progress indicator */}
                <div className="absolute bottom-8 left-8 md:left-16 right-8 md:right-16 z-10 pointer-events-none" aria-hidden="true">
                    <div className="flex items-center gap-4">
                        <span className="text-white/25 font-mono text-xs">01</span>
                        <div className="flex-1 h-px bg-white/5 relative">
                            <div
                                className="h-full bg-accent/40 origin-left"
                                id="projects-progress"
                                style={{ transform: 'scaleX(0)' }}
                            />
                        </div>
                        <span className="text-white/25 font-mono text-xs">
                            {String(projects.length).padStart(2, '0')}
                        </span>
                    </div>
                </div>

                {/* Scrollable track */}
                <div
                    ref={trackRef}
                    className="flex items-stretch h-screen will-change-transform"
                >
                    {projects.map((project, index) => (
                        <ProjectPoster
                            key={project.id}
                            project={project}
                            index={index}
                            onSelect={handleSelect}
                        />
                    ))}
                </div>
            </section>

            {/* Modal */}
            <ProjectModal project={selectedProject} onClose={handleClose} />
        </>
    );
}
