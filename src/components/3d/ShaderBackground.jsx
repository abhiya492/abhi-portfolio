/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';

const defaultVertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const particlesFragmentShader = `
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uIntensity;
  uniform float uSpeed;
  
  varying vec2 vUv;
  
  // A simple noise function
  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }
  
  void main() {
    // Initialize the uniforms with defaults if they're undefined
    vec3 colorA = uColorA;
    vec3 colorB = uColorB;
    float intensity = uIntensity;
    float speed = uSpeed;
    
    // Default values if uniforms are undefined
    if (length(colorA) == 0.0) colorA = vec3(0.1, 0.3, 0.9);
    if (length(colorB) == 0.0) colorB = vec3(0.3, 0.8, 1.0);
    if (intensity == 0.0) intensity = 0.8;
    if (speed == 0.0) speed = 0.3;
    
    vec2 uv = vUv;
    
    // Create animated noise pattern
    float n = 0.0;
    
    // Multiple layers of noise
    for (float i = 1.0; i < 5.0; i++) {
      float t = uTime * speed * 0.1 * i;
      n += noise(uv * i + t) / i;
    }
    
    // Add some shape/pattern
    n *= sin(uv.x * 10.0) * 0.5 + 0.5;
    n *= sin(uv.y * 8.0) * 0.5 + 0.5;
    
    // Apply intensity
    n *= intensity;
    
    // Mix colors based on noise
    vec3 finalColor = mix(colorA, colorB, n);
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

const gradientFragmentShader = `
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  uniform float uSpeed;
  
  varying vec2 vUv;
  
  void main() {
    // Initialize the uniforms with defaults if they're undefined
    vec3 colorA = uColorA;
    vec3 colorB = uColorB;
    vec3 colorC = uColorC;
    float speed = uSpeed;
    
    // Default values if uniforms are undefined
    if (length(colorA) == 0.0) colorA = vec3(0.1, 0.3, 0.9);
    if (length(colorB) == 0.0) colorB = vec3(0.3, 0.8, 1.0);
    if (length(colorC) == 0.0) colorC = vec3(0.5, 0.2, 0.8);
    if (speed == 0.0) speed = 0.3;
    
    // Animated gradient
    float t = sin(uTime * speed) * 0.5 + 0.5;
    vec3 color1 = mix(colorA, colorB, t);
    vec3 color2 = mix(colorB, colorC, t);
    
    // Radial gradient
    float dist = length(vUv - vec2(0.5));
    float circle = smoothstep(0.5, 0.2, dist);
    
    vec3 finalColor = mix(color1, color2, circle);
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

const getShaderByType = (type) => {
  switch(type) {
    case 'particles':
      return particlesFragmentShader;
    case 'gradient':
      return gradientFragmentShader;
    default:
      return particlesFragmentShader;
  }
};

const ShaderBackground = ({ 
  shader = 'particles',
  intensity = 0.8,
  speed = 0.3,
  themeColors = {
    primary: '#4285F4',
    secondary: '#34A853',
    accent1: '#FBBC05',
    accent2: '#EA4335',
    background: '#050a12'
  }
}) => {
  const meshRef = useRef();
  const materialRef = useRef();
  const { size } = useThree();
  
  useEffect(() => {
    if (!materialRef.current) return;
    
    const material = materialRef.current;
    
    // Convert theme hex colors to THREE.Color (RGB vector)
    if (material.uniforms.uColorA) {
      material.uniforms.uColorA.value = new THREE.Color(themeColors.primary || '#4285F4');
    }
    
    if (material.uniforms.uColorB) {
      material.uniforms.uColorB.value = new THREE.Color(themeColors.secondary || '#34A853');
    }
    
    if (material.uniforms.uColorC) {
      material.uniforms.uColorC.value = new THREE.Color(themeColors.accent1 || '#FBBC05');
    }
    
    if (material.uniforms.uIntensity) {
      material.uniforms.uIntensity.value = intensity;
    }
    
    if (material.uniforms.uSpeed) {
      material.uniforms.uSpeed.value = speed;
    }
  }, [themeColors, intensity, speed]);
  
  // Create appropriate uniforms for the selected shader
  const getUniforms = () => {
    const baseUniforms = {
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color(themeColors.primary || '#4285F4') },
      uColorB: { value: new THREE.Color(themeColors.secondary || '#34A853') },
      uSpeed: { value: speed }
    };
    
    if (shader === 'particles') {
      return {
        ...baseUniforms,
        uIntensity: { value: intensity }
      };
    } else if (shader === 'gradient') {
      return {
        ...baseUniforms,
        uColorC: { value: new THREE.Color(themeColors.accent1 || '#FBBC05') }
      };
    }
    
    return baseUniforms;
  };
  
  useEffect(() => {
    let animationFrameId;
    const startTime = Date.now();
    
    const animate = () => {
      if (materialRef.current) {
        materialRef.current.uniforms.uTime.value = (Date.now() - startTime) / 1000;
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[size.width, size.height, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={defaultVertexShader}
        fragmentShader={getShaderByType(shader)}
        uniforms={getUniforms()}
      />
    </mesh>
  );
};

export default ShaderBackground;