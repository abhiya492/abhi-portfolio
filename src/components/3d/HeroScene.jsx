import { Canvas, useFrame } from '@react-three/fiber';
import { 
  PresentationControls, 
  Float, 
  Environment, 
  ContactShadows, 
  Html, 
  Text3D, 
  Center, 
  OrbitControls,
  Stars,
  useGLTF
} from '@react-three/drei';
import { Suspense, useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import * as THREE from 'three';

// A component for animated 3D text
const AnimatedText = ({ text, position, rotation, color, size = 0.5, hoverColor = '#4285F4' }) => {
  const textRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useEffect(() => {
    if (textRef.current) {
      gsap.to(textRef.current.material, {
        color: hovered ? new THREE.Color(hoverColor) : new THREE.Color(color),
        duration: 0.3,
        ease: 'power2.out'
      });
      
      gsap.to(textRef.current.rotation, {
        y: hovered ? rotation[1] + 0.2 : rotation[1],
        duration: 0.5,
        ease: 'elastic.out(1, 0.7)'
      });
    }
  }, [hovered, color, hoverColor, rotation]);
  
  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <Text3D
        ref={textRef}
        font="/fonts/inter-bold.json"
        position={position}
        rotation={rotation}
        size={size}
        height={0.1}
        curveSegments={12}
        bevelEnabled
        bevelThickness={0.02}
        bevelSize={0.02}
        bevelOffset={0}
        bevelSegments={5}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {text}
        <meshStandardMaterial 
          color={color}
          metalness={0.8}
          roughness={0.2}
          envMapIntensity={1}
        />
      </Text3D>
    </Float>
  );
};

// Floating laptop model
const FloatingLaptop = ({ position = [0, 0, 0], scale = 1 }) => {
  const laptopRef = useRef();
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (laptopRef.current) {
      laptopRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.1;
      laptopRef.current.rotation.z = Math.sin(time * 0.2) * 0.05;
    }
  });
  
  return (
    <group ref={laptopRef} position={position} scale={scale}>
      {/* Laptop base */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2, 0.1, 1.5]} />
        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Laptop screen */}
      <group position={[0, 0.5, -0.7]} rotation={[Math.PI / 6, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[2, 1.2, 0.1]} />
          <meshStandardMaterial color="#222" metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* Screen content */}
        <mesh position={[0, 0, 0.06]}>
          <planeGeometry args={[1.8, 1]} />
          <meshBasicMaterial color="#0072FF" emissive="#0072FF" emissiveIntensity={0.5} />
        </mesh>
        
        {/* Code effect on screen */}
        <Html position={[0, 0, 0.07]} transform scale={0.14} rotation-x={-Math.PI / 6}>
          <div className="w-[400px] h-[200px] overflow-hidden font-mono text-white text-xs p-2 bg-black/80">
            <div className="text-green-400">{'const Portfolio = () => {'}</div>
            <div className="pl-4">{'const skills = ["React", "Three.js", "UI/UX", "Node.js"];'}</div>
            <div className="pl-4">{'const passions = ["Web Development", "3D Graphics", "Design"];'}</div>
            <div className="pl-4 text-yellow-300">{'return ('}</div>
            <div className="pl-8 text-blue-300">{'<div className="portfolio">'}</div>
            <div className="pl-12 text-purple-300">{'<h1>Hello, I\'m Abhishek</h1>'}</div>
            <div className="pl-12 text-purple-300">{'<p>Welcome to my world</p>'}</div>
            <div className="pl-8 text-blue-300">{'</div>'}</div>
            <div className="pl-4 text-yellow-300">{')'}</div>
            <div className="text-green-400">{'}'};</div>
          </div>
        </Html>
      </group>
    </group>
  );
};

// Floating avatar
const FloatingAvatar = ({ imageUrl, position = [0, 0, 0], scale = 1 }) => {
  const avatarRef = useRef();
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (avatarRef.current) {
      avatarRef.current.rotation.y = time * 0.3;
    }
  });
  
  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
      <group ref={avatarRef} position={position} scale={scale}>
        {/* Avatar circle */}
        <mesh castShadow>
          <sphereGeometry args={[0.8, 32, 32]} />
          <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.8} />
        </mesh>
        
        {/* Avatar image (using HTML for better image quality) */}
        <Html position={[0, 0, 0.85]} transform>
          <div 
            className="w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-lg"
            style={{ 
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
        </Html>
      </group>
    </Float>
  );
};

// Main 3D Hero scene component
const HeroScene = ({ avatarUrl = "/images/avatar-1.jpg" }) => {
  return (
    <div className="w-full h-[600px] lg:h-[800px]">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true }}
        className="bg-transparent"
      >
        <Suspense fallback={<Html center>Loading 3D experience...</Html>}>
          <color attach="background" args={['#050505']} />
          
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={0.5} />
          <spotLight 
            position={[5, 5, 5]} 
            angle={0.3} 
            penumbra={1} 
            intensity={1} 
            castShadow 
            shadow-mapSize={2048} 
          />
          
          <PresentationControls
            global
            rotation={[0.1, 0, 0]}
            polar={[-Math.PI / 3, Math.PI / 3]}
            azimuth={[-Math.PI / 3, Math.PI / 3]}
            config={{ mass: 2, tension: 400 }}
            snap={{ mass: 4, tension: 300 }}
          >
            <group position={[0, 0, 0]}>
              {/* Main text */}
              <AnimatedText 
                text="Portfolio" 
                position={[-2.5, 1.5, 0]} 
                rotation={[0, 0.2, 0]} 
                color="#ffffff" 
                size={0.7}
                hoverColor="#DB4437" 
              />
              
              <AnimatedText 
                text="Abhishek" 
                position={[-1.5, 0.8, 0.5]} 
                rotation={[0, -0.1, 0]} 
                color="#ffffff" 
                size={0.5}
                hoverColor="#4285F4" 
              />
              
              <AnimatedText 
                text="Developer" 
                position={[1.5, 0.7, 0]} 
                rotation={[0, 0.1, 0]} 
                color="#ffffff" 
                size={0.4}
                hoverColor="#0F9D58" 
              />
              
              {/* Elements */}
              <FloatingLaptop position={[0, -0.5, 0]} scale={0.8} />
              <FloatingAvatar imageUrl={avatarUrl} position={[2, -0.2, 1]} scale={0.6} />
              
              {/* Projects hint */}
              <AnimatedText 
                text="Scroll down" 
                position={[0, -2, 0]} 
                rotation={[0, 0, 0]} 
                color="#aaaaaa" 
                size={0.15}
                hoverColor="#ffffff" 
              />
            </group>
          </PresentationControls>
          
          {/* Background stars */}
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          
          {/* Shadows */}
          <ContactShadows 
            position={[0, -2, 0]} 
            opacity={0.4} 
            scale={10} 
            blur={2} 
            far={4} 
            resolution={256} 
            color="#000000" 
          />
          
          <Environment preset="night" />
        </Suspense>
      </Canvas>
      
      {/* Overlay text */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <div className="flex items-center gap-2 justify-center">
          <span className="relative w-2 h-2 rounded-full bg-emerald-500">
            <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping"></span>
          </span>
          <p className="text-zinc-400 text-sm tracking-wide">Available for work</p>
        </div>
        <div className="mt-40 flex justify-center gap-3">
          <button className="pointer-events-auto bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/20 flex items-center gap-2">
            <span className="material-icons text-sm">download</span>
            <span>Download Resume</span>
          </button>
          <button className="pointer-events-auto border border-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 flex items-center gap-2">
            <span className="material-icons text-sm">arrow_downward</span>
            <span>Scroll Down</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroScene; 