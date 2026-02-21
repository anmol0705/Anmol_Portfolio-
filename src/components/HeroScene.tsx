'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useMobile } from '@/hooks/use-mobile';

// ============================================================================
// QUANTUM CORE SHADER - Vertex Shader
// ============================================================================
const quantumVertexShader = `
  uniform float uTime;
  uniform float uMouseX;
  uniform float uMouseY;
  
  varying vec3 vPosition;
  varying float vIntensity;
  varying float vDistance;
  
  //
  // GLSL textureless classic 3D noise
  //
  vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      
    float n_ = 1.0/7.0;
    vec3 ns = n_ * D.wyz - D.xzx;
    
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  
  void main() {
    vPosition = position;
    
    // Noise-based displacement
    float noise = snoise(position * 0.5 + uTime * 0.2);
    float noise2 = snoise(position * 1.0 - uTime * 0.15);
    
    // Mouse influence
    vec3 mouseInfluence = vec3(uMouseX * 0.3, uMouseY * 0.3, 0.0);
    float mouseDistance = length(position.xy - mouseInfluence.xy);
    
    // Pulsing effect
    float pulse = sin(uTime * 2.0 + length(position) * 2.0) * 0.5 + 0.5;
    
    // Calculate intensity for fragment shader
    vIntensity = (noise * 0.5 + 0.5) * pulse;
    vDistance = mouseDistance;
    
    // Displace vertices
    vec3 newPosition = position;
    newPosition += normal * noise * 0.3;
    newPosition += normal * noise2 * 0.15;
    newPosition += normal * pulse * 0.05;
    
    // Mouse attraction
    newPosition += normalize(mouseInfluence - position) * (1.0 / (mouseDistance + 1.0)) * 0.1;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    gl_PointSize = 2.0 + vIntensity * 3.0;
  }
`;

// ============================================================================
// QUANTUM CORE SHADER - Fragment Shader
// ============================================================================
const quantumFragmentShader = `
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  
  varying vec3 vPosition;
  varying float vIntensity;
  varying float vDistance;
  
  void main() {
    // Create circular point
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    if (dist > 0.5) discard;
    
    // Color gradient based on position and intensity
    float colorMix = sin(vPosition.y * 3.0 + uTime) * 0.5 + 0.5;
    vec3 color = mix(uColor1, uColor2, colorMix);
    color = mix(color, uColor3, vIntensity);
    
    // Soft edge
    float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
    alpha *= vIntensity * 0.8 + 0.2;
    
    // Glow effect
    float glow = exp(-dist * 3.0);
    color += uColor1 * glow * 0.5;
    
    gl_FragColor = vec4(color, alpha);
  }
`;

// ============================================================================
// QUANTUM CORE MESH COMPONENT
// ============================================================================
interface QuantumCoreProps {
  mouseX: number;
  mouseY: number;
}

function QuantumCore({ mouseX, mouseY }: QuantumCoreProps) {
  const meshRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();

  // Generate icosahedron points with subdivisions
  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(2, 20);
    const positions = geo.attributes.position.array;
    const normals = new Float32Array(positions.length);

    // Calculate normals
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];
      const len = Math.sqrt(x * x + y * y + z * z);
      normals[i] = x / len;
      normals[i + 1] = y / len;
      normals[i + 2] = z / len;
    }

    geo.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
    return geo;
  }, []);

  // Uniforms
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouseX: { value: 0 },
    uMouseY: { value: 0 },
    uColor1: { value: new THREE.Color('#00ff88') },
    uColor2: { value: new THREE.Color('#00ffff') },
    uColor3: { value: new THREE.Color('#ffcc00') },
  }), []);

  useFrame((state) => {
    if (meshRef.current) {
      // Rotate slowly
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.05;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.08;
    }

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uMouseX.value = mouseX;
      materialRef.current.uniforms.uMouseY.value = mouseY;
    }
  });

  return (
    <points ref={meshRef} geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={quantumVertexShader}
        fragmentShader={quantumFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ============================================================================
// DATA STREAM PARTICLES
// ============================================================================
function DataStream() {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 2000;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const cols = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      // Spherical distribution
      const radius = 3 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = radius * Math.cos(phi);

      // Color variation
      const colorChoice = Math.random();
      if (colorChoice < 0.5) {
        cols[i3] = 0;
        cols[i3 + 1] = 1;
        cols[i3 + 2] = 0.53;
      } else if (colorChoice < 0.8) {
        cols[i3] = 0;
        cols[i3 + 1] = 0.8;
        cols[i3 + 2] = 0.8;
      } else {
        cols[i3] = 1;
        cols[i3 + 1] = 0.8;
        cols[i3 + 2] = 0;
      }
    }

    return [pos, cols];
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#00ff88"
        size={0.02}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.6}
      />
    </Points>
  );
}

// ============================================================================
// WIREFRAME GEOMETRY
// ============================================================================
function WireframeSphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.8, 1]} />
      <meshBasicMaterial
        color="#00ff88"
        wireframe
        transparent
        opacity={0.15}
      />
    </mesh>
  );
}

// ============================================================================
// INNER CORE
// ============================================================================
function InnerCore() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshBasicMaterial
        color="#00ff88"
        transparent
        opacity={0.3}
      />
    </mesh>
  );
}

// ============================================================================
// SCENE SETUP
// ============================================================================
interface SceneContentProps {
  mouseX: number;
  mouseY: number;
  scrollProgress: number;
}

function SceneContent({ mouseX, mouseY, scrollProgress }: SceneContentProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Drive scale from scrollProgress
  useFrame(() => {
    if (groupRef.current) {
      const scale = 1 + scrollProgress * 20;
      groupRef.current.scale.setScalar(scale);
    }
  });
  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.2} />

      {/* Point light that follows mouse */}
      <pointLight
        position={[mouseX * 5, mouseY * 5, 3]}
        intensity={2}
        color="#00ff88"
      />

      {/* Secondary lights */}
      <pointLight position={[-5, 5, 5]} intensity={0.5} color="#00ffff" />
      <pointLight position={[5, -5, -5]} intensity={0.3} color="#ffcc00" />

      {/* Zoomable group — scales with scroll */}
      <group ref={groupRef}>
        {/* Main quantum core */}
        <QuantumCore mouseX={mouseX} mouseY={mouseY} />

        {/* Data stream particles */}
        <DataStream />

        {/* Wireframe shell */}
        <WireframeSphere />

        {/* Inner glowing core */}
        <InnerCore />
      </group>
    </>
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
  const isMobile = useMobile();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize to -1 to 1
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Update clock every second
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
        background: 'radial-gradient(ellipse at center, #0a0a0a 0%, #000000 100%)',
        opacity: 1 - Math.pow(scrollProgress, 3),
      }}
    >
      {/* Grid overlay */}
      <div className="absolute inset-0 terminal-grid opacity-50" />

      {/* Scan line effect */}
      <div className="absolute inset-0 scan-line pointer-events-none" />

      {/* Noise overlay */}
      <div className="absolute inset-0 noise-overlay pointer-events-none" />

      {/* Three.js Canvas */}
      <Canvas
        camera={{ position: [0, 0, isMobile ? 6 : 5], fov: 60 }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
        style={{ background: 'transparent' }}
      >
        <SceneContent
          mouseX={mousePosition.x}
          mouseY={mousePosition.y}
          scrollProgress={scrollProgress}
        />
      </Canvas>

      {/* Hero Text Overlay */}
      <div id="hero-text-overlay" className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
        <div className="text-center px-4">
          {/* Status indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="w-2 h-2 bg-neon rounded-full animate-pulse" />
            <span className="text-neon/60 font-mono text-xs tracking-[0.3em] uppercase">
              System Online
            </span>
          </div>

          {/* Main title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-4">
            <span className="text-white font-display">ANMOL JAIN</span>
            <span className="text-neon text-glow-neon">_</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/40 font-mono tracking-[0.2em] uppercase mb-8">
            Developer • Problem Solver • Algorithm Architect
          </p>

          {/* Scroll indicator */}
          <div className="flex flex-col items-center gap-2 animate-bounce mt-12">
            <span className="text-neon/40 font-mono text-xs tracking-[0.2em] uppercase">
              Scroll to explore
            </span>
            <svg
              className="w-6 h-6 text-neon/40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 text-neon/30 font-mono text-xs">
        <div>LAT: 40.7128°</div>
        <div>LNG: -74.0060°</div>
      </div>
      <div className="absolute top-4 right-4 text-neon/30 font-mono text-xs text-right">
        <div id="current-time">00:00:00</div>
        <div>EST</div>
      </div>
      <div className="absolute bottom-4 left-4 text-neon/30 font-mono text-xs">
        <div>SYS.BUILD.2024</div>
        <div>REV.1.0.0</div>
      </div>
      <div className="absolute bottom-4 right-4 text-neon/30 font-mono text-xs text-right">
        <div>FPS: 60</div>
        <div>RENDER: ACTIVE</div>
      </div>

      {/* Time update via effect instead of script tag */}
    </div>
  );
}
