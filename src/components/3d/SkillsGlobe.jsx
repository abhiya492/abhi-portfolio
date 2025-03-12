import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, ContactShadows, Cloud, useTexture, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useThreeContext } from './ThreeProvider';
import { randomRange } from '../../utils/three-utils';

// A point on the globe representing a skill
const SkillPoint = ({ skill, position, size = 0.15, color = '#4285F4' }) => {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const ref = useRef();

  // Animation for when skill is hovered
  useEffect(() => {
    if (ref.current) {
      if (hovered) {
        ref.current.scale.set(1.5, 1.5, 1.5);
      } else {
        ref.current.scale.set(1, 1, 1);
      }
    }
  }, [hovered]);

  return (
    <group position={position}>
      {/* The skill point */}
      <mesh
        ref={ref}
        onClick={() => setClicked(!clicked)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[size, 16, 16]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={hovered ? 0.5 : 0.2} 
          toneMapped={false}
        />

        {/* Pulsating glow effect */}
        {hovered && (
          <PointLight 
            position={[0, 0, 0]} 
            color={color} 
            intensity={1} 
            distance={1} 
          />
        )}
      </mesh>

      {/* Skill name and details popup */}
      {(hovered || clicked) && (
        <Html position={[0, size * 2, 0]} center distanceFactor={10}>
          <div className="bg-black/80 backdrop-blur-md p-2 rounded-md text-white text-center">
            <div className="font-bold">{skill.name}</div>
            {clicked && (
              <div className="text-xs max-w-[150px] mt-1">{skill.description}</div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
};

// Custom point light with pulsating effect
const PointLight = ({ color, ...props }) => {
  const lightRef = useRef();
  
  useFrame(({ clock }) => {
    if (lightRef.current) {
      const time = clock.getElapsedTime();
      lightRef.current.intensity = 0.5 + Math.sin(time * 5) * 0.3;
    }
  });
  
  return <pointLight ref={lightRef} color={color} {...props} />;
};

// The globe containing all skill points
const SkillsGlobe = ({ radius = 2, skills }) => {
  const globeRef = useRef();
  const { theme } = useThreeContext();
  const [globePoints, setGlobePoints] = useState([]);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [autoRotate, setAutoRotate] = useState(true);
  
  // Texture for the globe
  const texture = useTexture({
    map: '/textures/globe_texture.jpg',
  }, (textures) => {
    // Handle texture loading if needed
    if (textures.map) {
      textures.map.wrapS = THREE.RepeatWrapping;
      textures.map.wrapT = THREE.RepeatWrapping;
    }
  });

  // Generate positions for skills on the globe surface
  useEffect(() => {
    const points = skills.map((skill, i) => {
      // Use fibonacci sphere distribution for even spacing
      const y = 1 - (i / (skills.length - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = Math.PI * 2 * i * 0.618033988749895; // golden ratio
      
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      
      // Get color based on skill category
      let color;
      switch(skill.category) {
        case 'Programming & Development':
          color = '#4285F4'; // Blue
          break;
        case 'Infrastructure & DevOps':
          color = '#0F9D58'; // Green
          break;
        case 'Databases & Data Management':
          color = '#DB4437'; // Red
          break;
        case 'System Design & Tools':
          color = '#F4B400'; // Yellow
          break;
        default:
          color = '#9C27B0'; // Purple for other
      }
      
      return {
        skill,
        position: [x * radius, y * radius, z * radius],
        color
      };
    });
    
    setGlobePoints(points);
  }, [skills, radius]);

  // Handle globe rotation
  useFrame(({ clock }) => {
    if (globeRef.current) {
      if (autoRotate) {
        // Smooth auto-rotation
        globeRef.current.rotation.y = clock.getElapsedTime() * 0.1;
      } else {
        // Manual rotation
        globeRef.current.rotation.x = rotation.x;
        globeRef.current.rotation.y = rotation.y;
      }
    }
  });

  // Handle mouse movement for interactive rotation
  const handleGlobePointerDown = (e) => {
    setAutoRotate(false);
    setRotation({
      x: globeRef.current.rotation.x,
      y: globeRef.current.rotation.y
    });
  };

  const handleGlobePointerUp = () => {
    setTimeout(() => setAutoRotate(true), 3000); // Resume auto-rotate after 3 seconds
  };

  const handleGlobePointerMove = (e) => {
    if (!autoRotate && e.buttons === 1) {
      setRotation({
        x: rotation.x + e.movementY * 0.01,
        y: rotation.y + e.movementX * 0.01
      });
    }
  };

  return (
    <group 
      ref={globeRef}
      onPointerDown={handleGlobePointerDown}
      onPointerUp={handleGlobePointerUp}
      onPointerMove={handleGlobePointerMove}
    >
      {/* The globe sphere */}
      <mesh>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial 
          color={theme.background} 
          metalness={0.2}
          roughness={0.8}
          opacity={0.1}
          transparent={true}
          wireframe={true}
        />
      </mesh>

      {/* Skill points on the globe */}
      {globePoints.map((point, i) => (
        <SkillPoint 
          key={i} 
          skill={point.skill} 
          position={point.position} 
          color={point.color}
        />
      ))}

      {/* Background clouds */}
      <Cloud position={[0, 0, 0]} speed={0.2} opacity={0.1} color={theme.primary} />
    </group>
  );
};

// Main component with Canvas
const SkillsGlobeScene = ({ skills }) => {
  const processedSkills = skills ? skills : [
    { name: 'React', category: 'Programming & Development', description: 'Frontend JavaScript library for building user interfaces' },
    { name: 'Node.js', category: 'Programming & Development', description: 'JavaScript runtime built on Chrome\'s V8 JavaScript engine' },
    { name: 'AWS', category: 'Infrastructure & DevOps', description: 'Cloud computing platform by Amazon' },
    { name: 'Docker', category: 'Infrastructure & DevOps', description: 'Platform for developing, shipping, and running applications in containers' },
    { name: 'MongoDB', category: 'Databases & Data Management', description: 'NoSQL database program using JSON-like documents' },
    { name: 'PostgreSQL', category: 'Databases & Data Management', description: 'Advanced open-source relational database' },
    { name: 'Git', category: 'System Design & Tools', description: 'Distributed version control system' },
    { name: 'Three.js', category: 'Programming & Development', description: '3D JavaScript library built on WebGL' },
  ];

  return (
    <div className="w-full h-[500px] lg:h-[700px]">
      <Canvas 
        camera={{ position: [0, 0, 6], fov: 45 }} 
        gl={{ antialias: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={0.5} />
        <SkillsGlobe skills={processedSkills} />
        <ContactShadows 
          position={[0, -3, 0]} 
          opacity={0.4} 
          scale={10} 
          blur={2} 
          far={3} 
        />
      </Canvas>
    </div>
  );
};

export default SkillsGlobeScene; 