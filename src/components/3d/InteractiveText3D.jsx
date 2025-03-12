import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text3D, Center, Float, PresentationControls, useMatcapTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useThreeContext } from './ThreeProvider';

// Text component with material and animations
const AnimatedText = ({ 
  text, 
  font, 
  size = 1, 
  depth = 0.2, 
  curveSegments = 5,
  bevelEnabled = true,
  bevelThickness = 0.05,
  bevelSize = 0.02,
  bevelOffset = 0,
  bevelSegments = 4,
  height = 'auto',
  color = '#4285F4',
  secondary = '#34A853',
  matcapIndex = 21,
  hoverMatcapIndex = 24,
  letterSpacing = 0,
  lineHeight = 1,
  glisten = true,
  floatIntensity = 0.5,
  floatSpeed = 1.5
}) => {
  const [hovered, setHovered] = useState(false);
  const [primary] = useMatcapTexture(matcapIndex, 1024);
  const [hover] = useMatcapTexture(hoverMatcapIndex, 1024);
  const groupRef = useRef();
  const materialRef = useRef();
  const textRef = useRef();
  
  // Add subtle animation to text
  useFrame(({ clock }) => {
    if (groupRef.current) {
      if (glisten && materialRef.current) {
        // Shift the matcap texture to create a glistening effect
        const t = clock.getElapsedTime() * 0.5;
        materialRef.current.normalScale.set(
          1 + Math.sin(t) * 0.2,
          1 + Math.cos(t * 0.7) * 0.2
        );
      }
      
      // Update the hover effect
      if (materialRef.current) {
        if (hovered) {
          materialRef.current.matcap = hover;
        } else {
          materialRef.current.matcap = primary;
        }
      }
    }
  });
  
  return (
    <Float 
      rotationIntensity={hovered ? floatIntensity * 1.5 : floatIntensity} 
      floatIntensity={hovered ? floatIntensity * 1.5 : floatIntensity}
      speed={floatSpeed}
    >
      <group 
        ref={groupRef}
        onPointerOver={() => setHovered(true)} 
        onPointerOut={() => setHovered(false)}
      >
        <Center>
          <Text3D
            ref={textRef}
            font={font}
            size={size}
            height={depth}
            curveSegments={curveSegments}
            bevelEnabled={bevelEnabled}
            bevelThickness={bevelThickness}
            bevelSize={bevelSize}
            bevelOffset={bevelOffset}
            bevelSegments={bevelSegments}
            letterSpacing={letterSpacing}
            lineHeight={lineHeight}
          >
            {text}
            <meshMatcapMaterial 
              ref={materialRef} 
              matcap={primary} 
              color={hovered ? secondary : color}
            />
          </Text3D>
        </Center>
      </group>
    </Float>
  );
};

// Individual words that can be animated separately
const AnimatedWords = ({ 
  text, 
  font, 
  wordsPerLine = 1,
  size = 1, 
  spacing = 0.5,
  verticalSpacing = 1.2,
  ...props 
}) => {
  // Split text into words
  const words = text.split(' ');
  const lines = [];
  
  // Group words into lines based on wordsPerLine
  for (let i = 0; i < words.length; i += wordsPerLine) {
    lines.push(words.slice(i, i + wordsPerLine).join(' '));
  }
  
  return (
    <group>
      {lines.map((line, lineIndex) => (
        <group key={lineIndex} position={[0, -lineIndex * size * verticalSpacing, 0]}>
          {line.split(' ').map((word, wordIndex) => {
            // Calculate position for each word
            const wordWidth = word.length * size * 0.5; // Approximate width
            const lineWidth = line.length * size * 0.5;
            const startX = -lineWidth / 2;
            const previousWordsWidth = line.split(' ')
              .slice(0, wordIndex)
              .join(' ').length * size * 0.5;
              
            const spacingWidth = wordIndex * spacing * size;
            const x = startX + previousWordsWidth + spacingWidth;
            
            return (
              <group key={`${lineIndex}-${wordIndex}`} position={[x, 0, 0]}>
                <AnimatedText 
                  text={word} 
                  font={font}
                  size={size}
                  {...props}
                />
              </group>
            );
          })}
        </group>
      ))}
    </group>
  );
};

// Custom cursor effect
const Cursor = ({ size = 0.5 }) => {
  const { camera } = useThree();
  const cursorRef = useRef();
  const [mousePosition, setMousePosition] = useState(new THREE.Vector3(0, 0, 0));
  const raycaster = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  
  useFrame(() => {
    if (cursorRef.current) {
      // Smoothly move the cursor toward the target position
      cursorRef.current.position.lerp(mousePosition, 0.1);
      
      // Add subtle animation
      const time = Date.now() * 0.001;
      cursorRef.current.scale.set(
        size * (1 + 0.1 * Math.sin(time * 2)),
        size * (1 + 0.1 * Math.sin(time * 2)),
        size * (1 + 0.1 * Math.sin(time * 2))
      );
    }
  });
  
  useEffect(() => {
    const handleMouseMove = (event) => {
      // Convert mouse position to normalized device coordinates
      const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );
      
      // Set up raycaster using camera and mouse position
      raycaster.setFromCamera(mouse, camera);
      
      // Calculate intersection with the plane
      const intersection = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersection);
      
      // Update cursor position
      setMousePosition(intersection);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [camera]);
  
  return (
    <mesh ref={cursorRef} position={[0, 0, 0]}>
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
    </mesh>
  );
};

// Main component
const InteractiveText3D = ({ 
  text, 
  type = 'single', // 'single', 'words', or 'characters'
  color = '#4285F4',
  secondary = '#34A853',
  height = 250,
  size = 0.5,
  matcapIndex = 21,
  hoverMatcapIndex = 24,
  showCursor = true,
  letterSpacing = 0,
  lineHeight = 1,
  wordsPerLine = 1,
  enableControls = true,
  backgroundColor = 'transparent',
  className = '',
  style = {}
}) => {
  const { fonts } = useThreeContext() || { fonts: {} };
  
  // Create style for container
  const containerStyle = {
    height: typeof height === 'number' ? `${height}px` : height,
    backgroundColor,
    ...style
  };
  
  // If fonts are not loaded yet, show loading message
  if (!fonts || !fonts['defaultFont']) {
    return (
      <div 
        className={`text-center flex items-center justify-center ${className}`}
        style={containerStyle}
      >
        <div className="text-blue-500">Loading 3D Text...</div>
      </div>
    );
  }
  
  return (
    <div 
      className={`relative overflow-hidden ${className}`} 
      style={containerStyle}
    >
      <Canvas 
        dpr={[1, 2]} 
        camera={{ position: [0, 0, 5], fov: 45 }}
      >
        {enableControls ? (
          <PresentationControls
            global
            config={{ mass: 2, tension: 400 }}
            snap={{ mass: 4, tension: 300 }}
            rotation={[0, 0, 0]}
            polar={[-Math.PI / 8, Math.PI / 8]}
            azimuth={[-Math.PI / 4, Math.PI / 4]}
          >
            {type === 'single' && (
              <AnimatedText 
                text={text}
                font={fonts['defaultFont']}
                size={size}
                color={color}
                secondary={secondary}
                matcapIndex={matcapIndex}
                hoverMatcapIndex={hoverMatcapIndex}
                letterSpacing={letterSpacing}
                lineHeight={lineHeight}
              />
            )}
            
            {type === 'words' && (
              <AnimatedWords 
                text={text}
                font={fonts['defaultFont']}
                size={size}
                color={color}
                secondary={secondary}
                matcapIndex={matcapIndex}
                hoverMatcapIndex={hoverMatcapIndex}
                letterSpacing={letterSpacing}
                lineHeight={lineHeight}
                wordsPerLine={wordsPerLine}
              />
            )}
          </PresentationControls>
        ) : (
          <>
            {type === 'single' && (
              <AnimatedText 
                text={text}
                font={fonts['defaultFont']}
                size={size}
                color={color}
                secondary={secondary}
                matcapIndex={matcapIndex}
                hoverMatcapIndex={hoverMatcapIndex}
                letterSpacing={letterSpacing}
                lineHeight={lineHeight}
              />
            )}
            
            {type === 'words' && (
              <AnimatedWords 
                text={text}
                font={fonts['defaultFont']}
                size={size}
                color={color}
                secondary={secondary}
                matcapIndex={matcapIndex}
                hoverMatcapIndex={hoverMatcapIndex}
                letterSpacing={letterSpacing}
                lineHeight={lineHeight}
                wordsPerLine={wordsPerLine}
              />
            )}
          </>
        )}
        
        {/* Lighting */}
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        
        {/* Interactive cursor */}
        {showCursor && <Cursor />}
      </Canvas>
    </div>
  );
};

export default InteractiveText3D; 