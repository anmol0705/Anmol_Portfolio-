'use client';

import { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshTransmissionMaterial, Sphere, Float, PerformanceMonitor } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { useMobile } from '@/hooks/use-mobile';
import { useAudio } from '@/context/AudioContext';

// ============================================================================
// DATA STREAM PARTICLES — orbit around the glass core
// ============================================================================
function DataStream() {
  const pointsRef = useRef<THREE.Points>(null);

  const particleData = useMemo(() => {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const cyan = new THREE.Color('#06b6d4');
    const violet = new THREE.Color('#8b5cf6');
    const white = new THREE.Color('#e4e4e7');

    for (let i = 0; i < count; i++) {
      const radius = 1.8 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      positions[i * 3] = radius * Math.cos(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.cos(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.sin(phi);

      const t = Math.random();
      const color = t < 0.5
        ? cyan.clone().lerp(violet, t * 2)
        : violet.clone().lerp(white, (t - 0.5) * 2);

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    return { positions, colors };
  }, []);

  // Strict WebGL Cleanup
  useEffect(() => {
    return () => {
      // Allow garbage collection for the heavy typed arrays
      (particleData as any).positions = null;
      (particleData as any).colors = null;
    };
  }, [particleData]);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.05;
      pointsRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.03) * 0.1;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particleData.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[particleData.colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ============================================================================
// WIREFRAME SHELL — geometric cage around the core
// ============================================================================
function WireframeSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(2.2, 1), []);
  const material = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#06b6d4',
    wireframe: true,
    transparent: true,
    opacity: 0.06,
  }), []);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.08;
      meshRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.05) * 0.15;
    }
  });

  return <mesh ref={meshRef} geometry={geometry} material={material} />;
}

// ============================================================================
// INNER CORE — emissive nucleus that glows through the glass
// ============================================================================
function InnerCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => new THREE.SphereGeometry(1, 32, 32), []);
  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#22d3ee',
    emissive: '#06b6d4',
    emissiveIntensity: 2.5,
    toneMapped: false,
  }), []);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const scale = 0.3 + Math.sin(clock.getElapsedTime() * 1.5) * 0.05;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return <mesh ref={meshRef} geometry={geometry} material={material} />;
}

// ============================================================================
// GLASS CORE — MeshTransmissionMaterial sphere
// ============================================================================
function GlassCore({ mouseX, mouseY, audioFrequency }: { mouseX: number; mouseY: number; audioFrequency: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);

  const customUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAudioFrequency: { value: 0 },
    }),
    []
  );

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.1;
      meshRef.current.rotation.x = mouseY * 0.2;
      meshRef.current.rotation.z = mouseX * 0.15;
    }
    // Update the custom shader uniform
    customUniforms.uTime.value = clock.getElapsedTime();
    customUniforms.uAudioFrequency.value = audioFrequency;
  });

  const onBeforeCompile = useCallback(
    (shader: any) => {
      // 1. Inject custom uniform
      shader.uniforms.uTime = customUniforms.uTime;
      shader.uniforms.uAudioFrequency = customUniforms.uAudioFrequency;

      // 2. Add uniform declaration to vertex shader
      shader.vertexShader = `
        uniform float uTime;
        uniform float uAudioFrequency;
        ${shader.vertexShader}
      `;

      // 3. Inject vertex displacement logic
      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
        #include <begin_vertex>
        
        // 3D Sine wave pulse/distortion (Audio Reactive Baseline)
        float frequency = 2.0;
        // Amp up the distortion massively when the bass hits via uAudioFrequency
        float amplitude = 0.08 + (uAudioFrequency * 0.4); 
        float speed = 1.5;
        
        float pulse = sin(position.x * frequency + uTime * speed) * 
                      sin(position.y * frequency + uTime * speed * 0.8) * 
                      sin(position.z * frequency + uTime * speed * 1.2);
                      
        // Displace along the surface normal
        transformed += normal * (pulse * amplitude);
        `
      );

      // 4. Inject into fragment shader to glow on bass hits
      shader.fragmentShader = `
        uniform float uTime;
        uniform float uAudioFrequency;
        ${shader.fragmentShader}
      `;

      // Hook into the very end of the fragment shader for standard materials
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <dithering_fragment>',
        `
        #include <dithering_fragment>
        
        // Add a pulsing cybenertic blue glow proportional to the audio frequency
        vec3 glowColor = vec3(0.024, 0.714, 0.835); // #06b6d4 (cyan)
        gl_FragColor.rgb += glowColor * (uAudioFrequency * 0.5);
        `
      );
    },
    [customUniforms]
  );

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <Sphere ref={meshRef} args={[1.2, 64, 64]}>
        <MeshTransmissionMaterial
          ref={materialRef}
          onBeforeCompile={onBeforeCompile}
          transmission={1}
          roughness={0.05}
          thickness={0.8}
          ior={1.5}
          chromaticAberration={0.06}
          distortion={0.3}
          distortionScale={0.4}
          temporalDistortion={0.1}
          color="#0a1628"
          attenuationColor="#06b6d4"
          attenuationDistance={0.6}
          backside
          samples={8}
          resolution={512}
        />
      </Sphere>
    </Float>
  );
}

// ============================================================================
// SCENE CONTENT — composes all 3D elements
// ============================================================================
interface SceneContentProps {
  mouseX: number;
  mouseY: number;
  scrollProgress: number;
  audioFrequency: number;
}

function SceneContent({ mouseX, mouseY, scrollProgress, audioFrequency }: SceneContentProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { gl } = useThree();

  // WebGL Renderer disposal on unmount to prevent invisible memory leaks
  useEffect(() => {
    return () => {
      // Only strictly dispose if the R3F component totally unmounts
      gl.dispose();
    };
  }, [gl]);

  useFrame(() => {
    if (groupRef.current) {
      const scale = 1 + scrollProgress * 15;
      groupRef.current.scale.setScalar(scale);
    }
  });

  return (
    <>
      {/* Ambient fill */}
      <ambientLight intensity={0.15} />

      {/* Key light — follows mouse */}
      <pointLight
        position={[mouseX * 4, mouseY * 4, 4]}
        intensity={1.5}
        color="#06b6d4"
      />

      {/* Rim lights */}
      <pointLight position={[-6, 4, 4]} intensity={0.3} color="#8b5cf6" />
      <pointLight position={[6, -4, -4]} intensity={0.2} color="#22d3ee" />

      {/* Zoomable group */}
      <group ref={groupRef}>
        {/* Glass core (refracts everything behind it) */}
        <GlassCore mouseX={mouseX} mouseY={mouseY} audioFrequency={audioFrequency} />

        {/* Data stream particles */}
        <DataStream />

        {/* Wireframe shell */}
        <WireframeSphere />

        {/* Emissive nucleus (glows through glass) */}
        <InnerCore />
      </group>
    </>
  );
}

// ============================================================================
// POST-PROCESSING — Bloom + Chromatic Aberration
// ============================================================================
function PostEffects({ scrollProgress }: { scrollProgress: number }) {
  const offsetRef = useRef(new THREE.Vector2(0, 0));

  useFrame(() => {
    const intensity = scrollProgress * 0.004;
    offsetRef.current.set(intensity, intensity);
  });

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        luminanceThreshold={0.9}
        luminanceSmoothing={0.4}
        intensity={0.6}
        blendFunction={BlendFunction.ADD}
      />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={offsetRef.current}
        radialModulation={false}
        modulationOffset={0}
      />
    </EffectComposer>
  );
}

// ============================================================================
// MAIN HERO SCENE COMPONENT
// ============================================================================
interface HeroSceneProps {
  scrollProgress?: number;
}

export default function HeroScene({ scrollProgress = 0 }: HeroSceneProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [dpr, setDpr] = useState<[number, number]>([1, 2]); // Dynamic DPR for performance
  const { audioFrequency } = useAudio();
  const isMobile = useMobile();

  // Track mouse
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Update clock
  useEffect(() => {
    const updateTime = () => {
      const el = document.getElementById('current-time');
      if (el) el.textContent = new Date().toTimeString().split(' ')[0];
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      id="hero-scene"
      className="absolute inset-0 z-0"
      style={{
        background: 'radial-gradient(ellipse at center, #0d1117 0%, #000000 70%)',
        opacity: 1 - Math.pow(scrollProgress, 3),
      }}
    >
      {/* Subtle dot grid */}
      <div className="absolute inset-0 terminal-grid opacity-30" />

      {/* Scan line */}
      <div className="absolute inset-0 scan-line pointer-events-none" />

      {/* Film grain */}
      <div className="absolute inset-0 noise-overlay pointer-events-none" />

      {/* Three.js Canvas with Accessibility labels */}
      <Canvas
        camera={{ position: [0, 0, isMobile ? 6.5 : 5.5], fov: 50 }}
        dpr={dpr}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
        aria-label="Interactive 3D Glass Core Visualization"
        role="img"
      >
        <PerformanceMonitor
          onDecline={() => setDpr([1, 1])}
          onIncline={() => setDpr([1, 2])}
        />
        <SceneContent
          mouseX={mousePosition.x}
          mouseY={mousePosition.y}
          scrollProgress={scrollProgress}
          audioFrequency={audioFrequency}
        />
        <PostEffects scrollProgress={scrollProgress} />
      </Canvas>

      {/* Hero Text Overlay */}
      <div
        id="hero-text-overlay"
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10"
      >
        <div className="text-center px-4">
          {/* Status tag */}
          <div className="flex items-center justify-center gap-2 mb-8" aria-hidden="true">
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
            <span className="text-accent/50 font-mono text-xs tracking-[0.4em] uppercase">
              System Online
            </span>
          </div>

          {/* Main title — display font */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-bold tracking-tight mb-4 select-all">
            <span className="text-white">QUANT</span>
            <span className="text-accent text-glow-accent">_</span>
          </h1>

          {/* Subtitle */}
          <p className="text-muted-better md:text-lg font-mono tracking-[0.2em] uppercase mb-12">
            Developer · Quant · Algorithm Architect
          </p>

          {/* Scroll indicator */}
          <div className="flex flex-col items-center gap-3 animate-bounce" aria-hidden="true">
            <span className="text-accent/40 font-mono text-xs tracking-[0.3em] uppercase">
              Scroll to explore
            </span>
            <svg className="w-5 h-5 text-accent/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>

      {/* Corner HUD elements */}
      <div className="absolute top-4 left-4 text-white/20 font-mono text-[10px] space-y-0.5 pointer-events-none" aria-hidden="true">
        <div>LAT: 40.7128°</div>
        <div>LNG: -74.0060°</div>
      </div>
      <div className="absolute top-4 right-4 text-white/20 font-mono text-[10px] text-right space-y-0.5 pointer-events-none" aria-hidden="true">
        <div id="current-time">00:00:00</div>
        <div>UTC-5</div>
      </div>
      <div className="absolute bottom-4 left-4 text-white/20 font-mono text-[10px] space-y-0.5 pointer-events-none" aria-hidden="true">
        <div>SYS.BUILD.2025</div>
        <div>REV.2.1.0</div>
      </div>
      <div className="absolute bottom-4 right-4 text-white/20 font-mono text-[10px] text-right space-y-0.5 pointer-events-none" aria-hidden="true">
        <div>FPS: {dpr[1] === 2 ? '60+' : '<60'}</div>
        <div>RENDER: ACTIVE</div>
      </div>
    </div>
  );
}
