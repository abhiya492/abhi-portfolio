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
  useGLTF,
  Text
} from '@react-three/drei';
import { Suspense, useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { useThreeContext } from './ThreeProvider';

// A component for animated 3D text
const AnimatedText = ({ text, position, rotation, color, size = 0.5, hoverColor = '#4285F4' }) => {
  const textRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [error, setError] = useState(false);
  const [fallbackError, setFallbackError] = useState(false);
  const { fonts } = useThreeContext() || { fonts: {} };
  
  // First check if we need to use fallback
  useEffect(() => {
    if (!fonts || !fonts.defaultFont) {
      console.warn("No font available in ThreeContext for AnimatedText. Using fallback text.");
      setError(true);
    }
  }, [fonts]);
  
  // Animation effect for hover
  useEffect(() => {
    if (textRef.current && textRef.current.material) {
      try {
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
      } catch (e) {
        console.warn("Error animating text in HeroScene:", e);
      }
    }
  }, [hovered, color, hoverColor, rotation]);

  // Handle errors loading the web font
  const handleFontError = () => {
    console.warn("Failed to load web font. Using HTML fallback.");
    setFallbackError(true);
  };
  
  // Complete fallback to HTML when all 3D options fail
  if (error && fallbackError) {
    return (
      <Html position={position} transform rotation={rotation} center>
        <div 
          style={{
            color: hovered ? hoverColor : color,
            fontSize: `${size * 20}px`,
            fontWeight: 'bold',
            fontFamily: 'Arial, sans-serif',
            whiteSpace: 'nowrap',
            userSelect: 'none',
            cursor: 'pointer'
          }}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          {text}
        </div>
      </Html>
    );
  }
  
  // Fallback to regular 3D text if there's an error with 3D font
  if (error) {
    return (
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <Text
          color={hovered ? hoverColor : color}
          fontSize={size}
          position={position}
          rotation={rotation}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZFhjA.woff2"
          anchorX="center"
          anchorY="middle"
          onError={handleFontError}
        >
          {text}
        </Text>
      </Float>
    );
  }
  
  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <Text3D
        ref={textRef}
        font="https://threejs.org/examples/fonts/helvetiker_regular.typeface.json"
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
        <meshStandardMaterial color={color} />
      </Text3D>
    </Float>
  );
};

// Floating laptop component
const FloatingLaptop = ({ position = [0, 0, 0], scale = 1 }) => {
  const laptopRef = useRef();
  
  // Animation loop for floating effect
  useFrame(({ clock }) => {
    if (laptopRef.current) {
      try {
        laptopRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
        laptopRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.1;
        laptopRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime()) * 0.1;
      } catch (e) {
        // Ignore animation errors
      }
    }
  });
  
  // Simple laptop model
  return (
    <group ref={laptopRef} position={position} scale={[scale, scale, scale]}>
      {/* Laptop base */}
      <mesh castShadow receiveShadow position={[0, -0.1, 0]}>
        <boxGeometry args={[2, 0.1, 1.5]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      
      {/* Laptop screen */}
      <group position={[0, 0.5, -0.7]} rotation={[Math.PI / 6, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[2, 1, 0.1]} />
          <meshStandardMaterial color="#222" />
        </mesh>
        
        {/* Screen content */}
        <mesh position={[0, 0, 0.06]}>
          <planeGeometry args={[1.9, 0.9]} />
          <meshBasicMaterial color="#2a2a42">
            <Html
              transform
              occlude
              distanceFactor={1.5}
              position={[0, 0, 0.01]}
              style={{
                width: '320px',
                height: '150px',
                fontSize: '8px',
                padding: '10px',
                color: '#8DEBFF',
                fontFamily: 'monospace'
              }}
            >
              <div>
                <pre style={{ margin: 0, fontSize: '5px' }}>
                  {`
// Portfolio Code
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function Portfolio() {
  return (
    <div className="portfolio">
      <h1>Welcome to my 3D Portfolio</h1>
      <Canvas>
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} />
        <Shapes />
      </Canvas>
    </div>
  );
}
                  `}
                </pre>
              </div>
            </Html>
          </meshBasicMaterial>
        </mesh>
      </group>
    </group>
  );
};

// Floating avatar component
const FloatingAvatar = ({ position = [0, 0, 0], scale = 1, imageUrl = '/images/avatar.jpg' }) => {
  const avatarRef = useRef();
  const [texture, setTexture] = useState(null);
  const [error, setError] = useState(false);
  
  // Load texture
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    
    // Create a fallback texture first
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    // Draw a simple avatar placeholder
    ctx.fillStyle = '#2a2a42';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#8DEBFF';
    ctx.beginPath();
    ctx.arc(canvas.width/2, canvas.height/2, canvas.width/4, 0, Math.PI * 2);
    ctx.fill();
    
    const fallbackTexture = new THREE.CanvasTexture(canvas);
    setTexture(fallbackTexture); // Set fallback immediately
    
    // Then try to load the actual texture
    try {
      loader.load(
        imageUrl,
        (loadedTexture) => {
          setTexture(loadedTexture);
        },
        undefined,
        (err) => {
          console.error('Error loading avatar texture:', err);
          setError(true);
          // Fallback texture is already set, so nothing to do here
        }
      );
    } catch (err) {
      console.error('Exception loading texture:', err);
      // Fallback texture is already set, so nothing to do here
    }
  }, [imageUrl]);
  
  // Animation loop for rotating effect
  useFrame(({ clock }) => {
    if (avatarRef.current) {
      try {
        avatarRef.current.rotation.y = clock.getElapsedTime() * 0.3;
        avatarRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime()) * 0.1;
      } catch (e) {
        // Ignore animation errors
      }
    }
  });
  
  return (
    <group ref={avatarRef} position={position} scale={[scale, scale, scale]}>
      {texture && (
        <mesh castShadow>
          <circleGeometry args={[1, 32]} />
          <meshStandardMaterial map={texture} />
        </mesh>
      )}
    </group>
  );
};

// Main 3D Scene Component
const HeroScene = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [sceneLoaded, setSceneLoaded] = useState(false);
  
  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Mark scene as loaded after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setSceneLoaded(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 10], fov: 50 }}>
      <Suspense fallback={<Html center>Loading 3D scene...</Html>}>
        <color attach="background" args={['#0a0a1a']} />
        
        <PresentationControls
          global
          rotation={[0.1, 0, 0]}
          polar={[-Math.PI / 4, Math.PI / 4]}
          azimuth={[-Math.PI / 4, Math.PI / 4]}
          config={{ mass: 2, tension: 400 }}
          snap={{ mass: 4, tension: 400 }}
        >
          <group position={[0, 0, 0]}>
            {/* Main title */}
            <AnimatedText 
              text="PORTFOLIO" 
              position={[0, 2, 0]} 
              rotation={[0, 0, 0]} 
              color="#ffffff" 
              hoverColor="#8DEBFF"
              size={0.8}
            />
            
            {/* 3D Objects */}
            {sceneLoaded && !isMobile && (
              <>
                <FloatingLaptop position={[-2, 0, 0]} scale={0.8} />
                <FloatingAvatar position={[2, 0, 0]} scale={1} />
              </>
            )}
            
            {/* Animated tagline */}
            <AnimatedText 
              text="FULL STACK DEVELOPER" 
              position={[0, -2, 0]} 
              rotation={[0, 0, 0]} 
              color="#8f9ba8" 
              hoverColor="#8DEBFF"
              size={0.3}
            />
          </group>
        </PresentationControls>
        
        {/* Environment and lighting */}
        <ambientLight intensity={0.5} />
        <spotLight position={[5, 5, 5]} angle={0.15} penumbra={1} castShadow />
        <Stars radius={100} depth={50} count={5000} factor={4} />
        <ContactShadows 
          rotation-x={Math.PI / 2}
          position={[0, -4, 0]}
          opacity={0.75}
          width={30}
          height={30}
          blur={2.5}
          far={4}
        />
      </Suspense>
      
      {/* Controls */}
      <OrbitControls makeDefault enableZoom={false} />
    </Canvas>
  );
};

export default HeroScene; 