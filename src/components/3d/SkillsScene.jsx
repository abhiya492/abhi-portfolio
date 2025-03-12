import { Canvas, useFrame } from '@react-three/fiber';
import { 
  Environment, 
  Float, 
  Html, 
  PresentationControls, 
  ContactShadows,
  Text,
  Sphere
} from '@react-three/drei';
import { Suspense, useRef, useState } from 'react';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';
import { skillsData } from '../../data/portfolioData';

// Individual floating skill orb
const SkillOrb = ({ skill, index, totalSkills, onClick, isActive }) => {
  const orbRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  // Calculate position in a circular arrangement
  const angle = (index / totalSkills) * Math.PI * 2;
  const radius = 3;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  
  // Spring animations for interactive feedback
  const { scale, emissiveIntensity } = useSpring({
    scale: hovered ? 1.2 : isActive ? 1.3 : 1,
    emissiveIntensity: hovered || isActive ? 0.7 : 0.3,
    config: { mass: 1, tension: 280, friction: 60 }
  });
  
  // Gentle floating motion
  useFrame((state) => {
    const t = state.clock.getElapsedTime() * 0.5;
    orbRef.current.position.y = Math.sin(t + index * 1000) * 0.2;
  });

  return (
    <Float 
      speed={2} 
      rotationIntensity={0.4} 
      floatIntensity={0.5}
    >
      <animated.mesh
        ref={orbRef}
        position={[x, 0, z]}
        scale={scale}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.4, 32, 32]} />
        <animated.meshStandardMaterial
          color={skill.color}
          emissive={skill.color}
          emissiveIntensity={emissiveIntensity}
          metalness={0.8}
          roughness={0.2}
        />
      </animated.mesh>
      
      {/* Skill name label */}
      <Text
        position={[x, -0.6, z]}
        fontSize={0.15}
        color={isActive ? skill.color : "white"}
        anchorX="center"
        anchorY="middle"
      >
        {skill.name}
      </Text>
      
      {/* Skill level indicator (only visible when active) */}
      {isActive && (
        <mesh position={[x, 0.8, z]}>
          <planeGeometry args={[1, 0.15]} />
          <meshBasicMaterial color={skill.color} transparent opacity={0.8} />
          <Html position={[0, 0, 0.1]} center transform occlude>
            <div className="text-white text-xs font-bold">
              {skill.level}%
            </div>
          </Html>
        </mesh>
      )}
    </Float>
  );
};

// Main skills scene component
const SkillsScene = () => {
  const [activeSkill, setActiveSkill] = useState(null);
  
  return (
    <div className="w-full h-[600px] relative">
      <Canvas
        camera={{ position: [0, 2, 8], fov: 45 }}
        gl={{ antialias: true }}
        className="bg-transparent"
      >
        <Suspense fallback={<Html center>Loading skills visualization...</Html>}>
          <color attach="background" args={['#050505']} />
          
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={0.5} />
          
          <PresentationControls
            global
            rotation={[0, 0, 0]}
            polar={[-Math.PI / 4, Math.PI / 4]}
            azimuth={[-Math.PI / 4, Math.PI / 4]}
            config={{ mass: 2, tension: 400 }}
            snap={{ mass: 4, tension: 300 }}
          >
            <group position={[0, 0, 0]}>
              {/* Central sphere - representing the core skills */}
              <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshStandardMaterial 
                  color="#2A2A2A" 
                  metalness={0.9}
                  roughness={0.1}
                  emissive="#444444"
                  emissiveIntensity={0.2}
                />
              </mesh>
              
              {/* Connecting lines from center to skills */}
              {skillsData.map((skill, index) => {
                const angle = (index / skillsData.length) * Math.PI * 2;
                const radius = 3;
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;
                
                return (
                  <line key={`line-${skill.id}`}>
                    <bufferGeometry attach="geometry">
                      <bufferAttribute
                        attach="attributes-position"
                        array={new Float32Array([0, 0, 0, x, 0, z])}
                        count={2}
                        itemSize={3}
                      />
                    </bufferGeometry>
                    <lineBasicMaterial 
                      attach="material" 
                      color={activeSkill === index ? skill.color : "#444444"}
                      opacity={0.5}
                      transparent
                      linewidth={1}
                    />
                  </line>
                );
              })}
              
              {/* Skill orbs */}
              {skillsData.map((skill, index) => (
                <SkillOrb
                  key={skill.id}
                  skill={skill}
                  index={index}
                  totalSkills={skillsData.length}
                  onClick={() => setActiveSkill(activeSkill === index ? null : index)}
                  isActive={activeSkill === index}
                />
              ))}
            </group>
          </PresentationControls>
          
          <ContactShadows 
            position={[0, -2, 0]} 
            opacity={0.5} 
            scale={10} 
            blur={2} 
            far={4} 
          />
          
          <Environment preset="studio" />
        </Suspense>
      </Canvas>
      
      {/* Skill detail overlay */}
      {activeSkill !== null && (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-md text-white p-6 rounded-xl w-[80%] max-w-md">
          <h3 className="text-xl font-bold mb-2" style={{ color: skillsData[activeSkill].color }}>
            {skillsData[activeSkill].name}
          </h3>
          <div className="flex items-center mb-3">
            <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full" 
                style={{ 
                  width: `${skillsData[activeSkill].level}%`,
                  backgroundColor: skillsData[activeSkill].color,
                  transition: 'width 0.5s ease-out'
                }}
              ></div>
            </div>
            <span className="ml-3 font-bold">{skillsData[activeSkill].level}%</span>
          </div>
          <p className="text-gray-300">{skillsData[activeSkill].description}</p>
        </div>
      )}
      
      {/* Section title */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Skills & Expertise</h2>
        <p className="text-gray-400">Click on the spheres to explore my technical skills</p>
      </div>
    </div>
  );
};

export default SkillsScene; 