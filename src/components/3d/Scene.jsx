import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, ContactShadows, Html } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';

// Simple spinning box component
const SpinningBox = ({ position, color, speed = 1, scale = 1 }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * speed * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * speed * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.2} />
      </mesh>
    </Float>
  );
};

// Main Three.js scene component
const ThreeScene = () => {
  return (
    <div className="w-full h-[600px] lg:h-[700px]">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ 
          antialias: true,
          // Use compatible settings for newer Three.js versions
          outputColorSpace: THREE.SRGBColorSpace,
          toneMapping: THREE.NoToneMapping
        }}
        className="bg-transparent"
      >
        <Suspense fallback={<Html center>Loading 3D scene...</Html>}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          
          <SpinningBox position={[-2, 0, 0]} color="#4285F4" speed={1.2} scale={0.8} />
          <SpinningBox position={[0, 0, 0]} color="#DB4437" speed={1} scale={1} />
          <SpinningBox position={[2, 0, 0]} color="#0F9D58" speed={0.8} scale={0.8} />
          
          <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
          <Environment preset="city" />
          <OrbitControls enableZoom={false} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ThreeScene; 