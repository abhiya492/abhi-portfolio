import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Html, useGLTF, useTexture, MeshReflectorMaterial } from '@react-three/drei';
import { gsap } from 'gsap';
import * as THREE from 'three';

// This component represents a 3D section with project details
const ProjectSection = ({ position, rotation, title, description, image, onClick, active }) => {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  // Handle hover animations
  useEffect(() => {
    if (groupRef.current) {
      gsap.to(groupRef.current.position, {
        y: hovered ? position[1] + 0.1 : position[1],
        duration: 0.5,
        ease: 'power2.out'
      });
      
      gsap.to(groupRef.current.rotation, {
        z: hovered ? rotation[2] + 0.05 : rotation[2],
        duration: 0.5,
        ease: 'power2.out'
      });
    }
  }, [hovered, position, rotation]);

  // Handle active state
  useEffect(() => {
    if (groupRef.current) {
      gsap.to(groupRef.current.scale, {
        x: active ? 1.1 : 1,
        y: active ? 1.1 : 1,
        z: active ? 1.1 : 1,
        duration: 0.5,
        ease: 'back.out(1.7)'
      });
    }
  }, [active]);

  const texture = useTexture(image);

  return (
    <group 
      ref={groupRef} 
      position={position} 
      rotation={rotation} 
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Project panel */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2, 1, 0.05]} />
        <meshStandardMaterial 
          color={hovered ? "#ffffff" : "#f0f0f0"} 
          metalness={0.5} 
          roughness={0.2}
          envMapIntensity={0.8}
        />
      </mesh>
      
      {/* Project image */}
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[1.8, 0.8]} />
        <meshBasicMaterial map={texture} transparent opacity={0.9} />
      </mesh>
      
      {/* Project title */}
      <Text
        position={[0, -0.6, 0.1]}
        fontSize={0.1}
        color="#333333"
        font="/fonts/inter-bold.woff"
        anchorX="center"
        anchorY="middle"
      >
        {title}
      </Text>
      
      {/* Interactive info button */}
      {hovered && (
        <Html position={[0.8, 0.3, 0.1]}>
          <div className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg w-[200px] text-xs">
            <h3 className="font-bold text-sm">{title}</h3>
            <p className="mt-1">{description}</p>
          </div>
        </Html>
      )}
    </group>
  );
};

// Main Portfolio Model
const PortfolioModel = ({ projects }) => {
  const [activeProject, setActiveProject] = useState(null);
  const floorRef = useRef();
  const { camera } = useThree();
  
  // Animate camera based on mouse position
  useFrame(({ mouse }) => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.x * 0.5, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouse.y * 0.5 + 1, 0.05);
    camera.lookAt(0, 0, 0);
    
    if (floorRef.current) {
      floorRef.current.rotation.z += 0.001;
    }
  });

  return (
    <>
      {/* Environment lighting */}
      <ambientLight intensity={0.5} />
      <spotLight 
        position={[5, 5, 5]} 
        intensity={1} 
        castShadow 
        penumbra={0.5} 
        angle={0.3}
      />
      
      {/* Reflective floor */}
      <mesh 
        ref={floorRef} 
        position={[0, -1.5, 0]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        receiveShadow
      >
        <circleGeometry args={[6, 64]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={60}
          roughness={1}
          depthScale={1.2}
          color="#101010"
          metalness={0.8}
        />
      </mesh>
      
      {/* Project sections arranged in a circle */}
      {projects.map((project, index) => {
        const angle = (index / projects.length) * Math.PI * 2;
        const radius = 3;
        return (
          <ProjectSection
            key={project.id}
            position={[
              radius * Math.cos(angle),
              0,
              radius * Math.sin(angle)
            ]}
            rotation={[0, -angle + Math.PI, 0]}
            title={project.title}
            description={project.description}
            image={project.image}
            onClick={() => setActiveProject(index === activeProject ? null : index)}
            active={index === activeProject}
          />
        );
      })}
    </>
  );
};

export default PortfolioModel; 