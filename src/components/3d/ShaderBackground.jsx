import { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { shaderMaterial, OrthographicCamera } from '@react-three/drei';
import * as THREE from 'three';
import { extend } from '@react-three/fiber';

// Shader for an animated gradient effect
const GradientShaderMaterial = shaderMaterial(
  {
    time: 0,
    resolution: new THREE.Vector2(),
    colorA: new THREE.Color('#4285F4'),
    colorB: new THREE.Color('#34A853'),
    colorC: new THREE.Color('#FBBC05'),
    colorD: new THREE.Color('#EA4335'),
    speed: 0.5,
    intensity: 1.2
  },
  // Vertex shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform float time;
    uniform vec2 resolution;
    uniform vec3 colorA;
    uniform vec3 colorB;
    uniform vec3 colorC;
    uniform vec3 colorD;
    uniform float speed;
    uniform float intensity;
    
    varying vec2 vUv;
    
    void main() {
      vec2 uv = vUv;
      
      // Create a smooth noise pattern that changes over time
      float noise1 = sin(uv.x * 5.0 + time * speed) * sin(uv.y * 5.0 + time * speed) * 0.5 + 0.5;
      float noise2 = sin(uv.x * 7.0 - time * speed) * sin(uv.y * 7.0 - time * speed) * 0.5 + 0.5;
      
      // Blend between colors based on position and time
      vec3 color1 = mix(colorA, colorB, noise1);
      vec3 color2 = mix(colorC, colorD, noise2);
      vec3 finalColor = mix(color1, color2, sin(time * 0.3) * 0.5 + 0.5);
      
      finalColor *= intensity;
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
);

// Shader for a wave / ripple effect
const WaveShaderMaterial = shaderMaterial(
  {
    time: 0,
    resolution: new THREE.Vector2(),
    color: new THREE.Color('#1e293b'),
    accent: new THREE.Color('#3b82f6'),
    amplitude: 0.25,
    frequency: 8.0,
    speed: 0.5
  },
  // Vertex shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform float time;
    uniform vec2 resolution;
    uniform vec3 color;
    uniform vec3 accent;
    uniform float amplitude;
    uniform float frequency;
    uniform float speed;
    
    varying vec2 vUv;
    
    float wave(vec2 uv, float time, float frequency, float amplitude) {
      float x = uv.x * frequency + time * speed;
      float y = uv.y * frequency + time * speed * 0.7;
      return sin(x) * cos(y) * amplitude;
    }
    
    void main() {
      vec2 uv = vUv;
      
      // Create multiple overlapping waves
      float w1 = wave(uv, time, frequency, amplitude);
      float w2 = wave(uv * 1.2, time * 0.8, frequency * 0.8, amplitude * 0.8);
      float w3 = wave(uv * 0.8, time * 1.2, frequency * 1.2, amplitude * 0.6);
      
      float finalWave = (w1 + w2 + w3) / 3.0;
      
      // Create a gradient that follows the wave
      vec3 finalColor = mix(color, accent, finalWave * 0.5 + 0.5);
      
      // Add slight vignette effect
      float distance = length(uv - 0.5) * 2.0;
      float vignette = smoothstep(0.8, 2.0, distance);
      finalColor = mix(finalColor, color * 0.5, vignette);
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
);

// Shader for a particle field effect
const ParticleShaderMaterial = shaderMaterial(
  {
    time: 0,
    resolution: new THREE.Vector2(),
    mousePosition: new THREE.Vector2(0.5, 0.5),
    color: new THREE.Color('#ffffff'),
    backgroundColor: new THREE.Color('#0a0a1a'),
    density: 12.0,
    speed: 0.05,
    maxSize: 0.018
  },
  // Vertex shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform float time;
    uniform vec2 resolution;
    uniform vec2 mousePosition;
    uniform vec3 color;
    uniform vec3 backgroundColor;
    uniform float density;
    uniform float speed;
    uniform float maxSize;
    
    varying vec2 vUv;
    
    // Simple hash function for pseudo-randomness
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }
    
    // Distance function for particles
    float particle(vec2 uv, vec2 pos, float size) {
      return smoothstep(size, 0.0, length(uv - pos));
    }
    
    void main() {
      vec2 uv = vUv;
      vec3 finalColor = backgroundColor;
      
      // Create a grid of cells
      vec2 gridSize = vec2(density);
      vec2 cell = floor(uv * gridSize) / gridSize;
      vec2 cellUv = fract(uv * gridSize);
      
      // For each cell, potentially create a particle
      float cellRandom = hash(cell);
      
      if (cellRandom > 0.1) { // Only show particles in 90% of cells
        // Calculate particle position with some movement
        float timeOffset = cellRandom * 6.28;
        float moveX = sin(time * speed + timeOffset) * 0.2;
        float moveY = cos(time * speed * 0.7 + timeOffset) * 0.2;
        vec2 particlePos = cell + vec2(0.5) / gridSize + vec2(moveX, moveY) / gridSize;
        
        // Size based on random value and distance from mouse
        float distFromMouse = length(particlePos - mousePosition);
        float activationFactor = smoothstep(0.3, 0.0, distFromMouse);
        float size = mix(
          maxSize * 0.2 * (0.5 + cellRandom * 0.5), 
          maxSize * (0.8 + cellRandom * 0.2),
          activationFactor
        );
        
        // Draw the particle
        float brightness = particle(uv, particlePos, size);
        
        // Color variation based on position
        vec3 particleColor = mix(
          color, 
          color * vec3(0.8, 0.9, 1.2), 
          cellRandom
        );
        
        finalColor = mix(finalColor, particleColor, brightness);
        
        // Add subtle glow around particles
        float glow = particle(uv, particlePos, size * 3.0) * 0.1 * activationFactor;
        finalColor = mix(finalColor, particleColor * 0.5, glow);
      }
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
);

// Register shader materials
extend({ GradientShaderMaterial, WaveShaderMaterial, ParticleShaderMaterial });

// Component that applies and animates the shader
const ShaderPlane = ({ shader = 'gradient', mousePosition }) => {
  const meshRef = useRef();
  const materialRef = useRef();
  const { size } = useThree();
  
  // Update resolution when window resizes
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.resolution.set(size.width, size.height);
    }
  }, [size]);
  
  // Update mouse position in shader
  useEffect(() => {
    if (materialRef.current && materialRef.current.mousePosition && mousePosition) {
      materialRef.current.mousePosition.set(mousePosition.x, mousePosition.y);
    }
  }, [mousePosition]);
  
  // Animate the time uniform
  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.time = clock.getElapsedTime();
    }
  });
  
  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      
      {shader === 'gradient' && (
        <gradientShaderMaterial ref={materialRef} transparent={true} />
      )}
      
      {shader === 'wave' && (
        <waveShaderMaterial ref={materialRef} transparent={true} />
      )}
      
      {shader === 'particles' && (
        <particleShaderMaterial ref={materialRef} transparent={true} />
      )}
    </mesh>
  );
};

// Main component
const ShaderBackground = ({ 
  shader = 'gradient', 
  intensity = 1.0,
  speed = 0.5,
  themeColors = null,
  className = ''
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const containerRef = useRef();
  
  // Track mouse position to interact with the shader
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height; // Invert Y for shader coords
      
      setMousePosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Props for each shader type
  const getShaderProps = () => {
    const colors = themeColors || {
      primary: '#4285F4',
      secondary: '#34A853',
      accent1: '#FBBC05',
      accent2: '#EA4335',
      background: '#0a0a1a',
      foreground: '#ffffff'
    };
    
    switch (shader) {
      case 'gradient':
        return {
          colorA: new THREE.Color(colors.primary),
          colorB: new THREE.Color(colors.secondary),
          colorC: new THREE.Color(colors.accent1),
          colorD: new THREE.Color(colors.accent2),
          speed,
          intensity
        };
      case 'wave':
        return {
          color: new THREE.Color(colors.background),
          accent: new THREE.Color(colors.primary),
          amplitude: 0.25 * intensity,
          frequency: 8.0,
          speed
        };
      case 'particles':
        return {
          color: new THREE.Color(colors.foreground),
          backgroundColor: new THREE.Color(colors.background),
          density: 12.0 * Math.min(1.5, intensity),
          speed,
          maxSize: 0.018 * intensity
        };
      default:
        return {};
    }
  };
  
  return (
    <div 
      ref={containerRef}
      className={`w-full h-full absolute inset-0 ${className}`}
      style={{ zIndex: -1 }}
    >
      <Canvas>
        <OrthographicCamera makeDefault position={[0, 0, 5]} zoom={1} />
        <ShaderPlane 
          shader={shader} 
          mousePosition={mousePosition}
          {...getShaderProps()}
        />
      </Canvas>
    </div>
  );
};

export default ShaderBackground; 