import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Environment, 
  Html, 
  PresentationControls, 
  ContactShadows,
  useTexture,
  Float
} from '@react-three/drei';
import { Suspense, useRef, useState, useEffect } from 'react';
import { projectsData } from '../../data/portfolioData';
import * as THREE from 'three';
import { gsap } from 'gsap';

// A single 3D project card
const ProjectCard = ({ project, position, rotation = [0, 0, 0], active, onClick }) => {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  // Load project image texture
  const texture = useTexture(project.image || "/images/placeholder.jpg");
  
  // Handle hover effects
  useEffect(() => {
    if (groupRef.current) {
      gsap.to(groupRef.current.position, {
        y: hovered ? position[1] + 0.2 : position[1],
        duration: 0.5,
        ease: 'power2.out'
      });
    }
  }, [hovered, position]);
  
  // Handle active state transition
  useEffect(() => {
    if (groupRef.current) {
      gsap.to(groupRef.current.scale, {
        x: active ? 1.1 : 1,
        y: active ? 1.1 : 1,
        z: active ? 1.1 : 1,
        duration: 0.5,
        ease: 'back.out(1.5)'
      });
      
      gsap.to(groupRef.current.rotation, {
        z: active ? rotation[2] + 0.05 : rotation[2],
        duration: 0.5,
        ease: 'power2.out'
      });
    }
  }, [active, rotation]);
  
  return (
    <group 
      ref={groupRef} 
      position={position}
      rotation={rotation}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Card body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.5, 1.4, 0.1]} />
        <meshStandardMaterial 
          color={active ? "#ffffff" : "#f0f0f0"} 
          metalness={0.5} 
          roughness={0.2}
          envMapIntensity={1.5}
        />
      </mesh>
      
      {/* Project image */}
      <mesh position={[0, 0.15, 0.06]}>
        <planeGeometry args={[2.3, 1]} />
        <meshBasicMaterial map={texture} transparent />
      </mesh>
      
      {/* Project title */}
      <mesh position={[0, -0.55, 0.06]}>
        <planeGeometry args={[2.3, 0.2]} />
        <meshBasicMaterial color={active ? project.technologies[0] === "React" ? "#61DAFB" : "#4285F4" : "#333333"} />
        <Html position={[0, 0, 0.01]} center transform>
          <div className="text-center">
            <h3 className="text-white font-bold text-sm">{project.title}</h3>
          </div>
        </Html>
      </mesh>
      
      {/* Interactive info panel (only shown when active) */}
      {active && (
        <Html position={[0, 0, 0.5]} center transform>
          <div className="bg-black/85 backdrop-blur-md text-white p-4 rounded-xl w-[250px] shadow-xl border border-white/10">
            <h3 className="text-xl font-bold mb-2">{project.title}</h3>
            <p className="text-gray-300 text-sm mb-3">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {project.technologies.map((tech, index) => (
                <span 
                  key={index} 
                  className="px-2 py-1 text-xs bg-white/10 rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <a 
                href={project.demoUrl} 
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs transition-colors"
                target="_blank" 
                rel="noopener noreferrer"
              >
                Live Demo
              </a>
              <a 
                href={project.githubUrl} 
                className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs transition-colors"
                target="_blank" 
                rel="noopener noreferrer"
              >
                Source Code
              </a>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

// Main Projects Scene component
const ProjectsScene = () => {
  const [activeProject, setActiveProject] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const projectsPerPage = 3;
  const totalPages = Math.ceil(projectsData.length / projectsPerPage);
  
  // Camera controls
  const { camera } = useThree();
  const cameraTargetRef = useRef([0, 0, 0]);
  
  // Animate camera based on active project
  useFrame(() => {
    // Smooth camera transition to focus on active project
    if (activeProject !== null) {
      const index = activeProject % projectsPerPage;
      cameraTargetRef.current = [index * 3 - 3, 0, 5];
    } else {
      cameraTargetRef.current = [0, 0, 8];
    }
    
    // Smooth camera movement
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, cameraTargetRef.current[0], 0.05);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, cameraTargetRef.current[2], 0.05);
  });
  
  // Get current page projects
  const currentProjects = projectsData.slice(
    currentPage * projectsPerPage, 
    (currentPage + 1) * projectsPerPage
  );
  
  // Page navigation
  const nextPage = () => {
    setActiveProject(null);
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };
  
  const prevPage = () => {
    setActiveProject(null);
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };
  
  return (
    <div className="w-full h-[700px] relative">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 40 }}
        gl={{ antialias: true }}
        className="bg-transparent"
      >
        <Suspense fallback={<Html center>Loading projects...</Html>}>
          <color attach="background" args={['#050505']} />
          
          <ambientLight intensity={0.5} />
          <spotLight 
            position={[10, 10, 10]} 
            angle={0.15} 
            penumbra={1} 
            intensity={1}
            castShadow
          />
          
          <PresentationControls
            global
            rotation={[0, 0, 0]}
            polar={[-Math.PI / 4, Math.PI / 4]}
            azimuth={[-Math.PI / 4, Math.PI / 4]}
            config={{ mass: 2, tension: 400 }}
            snap={{ mass: 4, tension: 300 }}
          >
            <group>
              {/* Project cards */}
              {currentProjects.map((project, index) => (
                <Float
                  key={project.id}
                  speed={1} 
                  rotationIntensity={0.2} 
                  floatIntensity={0.5}
                >
                  <ProjectCard
                    project={project}
                    position={[index * 3 - 3, 0, 0]}
                    rotation={[0, 0, 0]}
                    active={activeProject === index + currentPage * projectsPerPage}
                    onClick={() => {
                      setActiveProject(
                        activeProject === index + currentPage * projectsPerPage 
                          ? null 
                          : index + currentPage * projectsPerPage
                      );
                    }}
                  />
                </Float>
              ))}
            </group>
          </PresentationControls>
          
          <ContactShadows 
            position={[0, -1.5, 0]} 
            opacity={0.5} 
            scale={10} 
            blur={2} 
            far={4} 
          />
          
          <Environment preset="city" />
        </Suspense>
      </Canvas>
      
      {/* Section title */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Featured Projects</h2>
        <p className="text-gray-400">Click on a project to see details</p>
      </div>
      
      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-4">
          <button 
            onClick={prevPage}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full transition-colors"
          >
            ← Previous
          </button>
          <div className="bg-white/5 px-4 py-2 rounded-full text-white/80">
            {currentPage + 1} / {totalPages}
          </div>
          <button 
            onClick={nextPage}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectsScene; 