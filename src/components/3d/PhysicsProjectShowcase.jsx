import { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas, useLoader, useFrame, useThree } from '@react-three/fiber';
import { 
  Text, 
  useTexture, 
  Html, 
  ContactShadows, 
  Environment, 
  useGLTF, 
  OrbitControls,
  PerspectiveCamera
} from '@react-three/drei';
import { 
  Physics, 
  useBox, 
  usePlane, 
  useSphere, 
  useSpring
} from '@react-three/cannon';
import * as THREE from 'three';
import { useThreeContext } from './ThreeProvider';

// Floor for physics objects to rest on
const Floor = (props) => {
  const [ref] = usePlane(() => ({ 
    rotation: [-Math.PI / 2, 0, 0], 
    position: [0, -2, 0],
    ...props 
  }));
  
  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial 
        color="#111" 
        envMapIntensity={0.5} 
        roughness={0.9}
        metalness={0.1}
      />
      <gridHelper args={[30, 30, '#555', '#333']} position={[0, 0.01, 0]} />
    </mesh>
  );
};

// Interactive project cube with physics
const ProjectCube = ({ project, position = [0, 0, 0], size = [1, 1, 1], mass = 1 }) => {
  const [ref, api] = useBox(() => ({ 
    mass,
    position,
    args: size,
  }));
  
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const texture = useTexture(project.image || '/images/placeholder.jpg');
  
  // Apply force when clicked
  const handleClick = (e) => {
    e.stopPropagation();
    
    // Push the cube upward and with a random rotation
    api.velocity.set(
      (Math.random() - 0.5) * 5, 
      5 + Math.random() * 2, 
      (Math.random() - 0.5) * 5
    );
    
    api.angularVelocity.set(
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1
    );
    
    setClicked(!clicked);
  };
  
  // Reset cube position if it falls too far
  useFrame(() => {
    // Grab current position
    const position = [];
    ref.current.getWorldPosition(new THREE.Vector3()).toArray(position);
    
    // Reset if fallen too far
    if (position[1] < -10) {
      api.position.set(Math.random() * 2 - 1, 5, Math.random() * 2 - 1);
      api.velocity.set(0, 0, 0);
      api.angularVelocity.set(0, 0, 0);
    }
  });
  
  return (
    <group>
      <mesh
        ref={ref}
        castShadow
        receiveShadow
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={size} />
        <meshStandardMaterial 
          map={texture} 
          metalness={0.2} 
          roughness={0.7}
          emissive={hovered ? new THREE.Color(0x555555) : new THREE.Color(0x000000)}
        />
      </mesh>
      
      {/* Project details panel */}
      {clicked && (
        <Html position={[0, 2, 0]} transform distanceFactor={10} center>
          <div className="bg-black/90 backdrop-blur-lg p-4 rounded-lg shadow-xl max-w-xs border border-blue-500/20">
            <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
            <p className="text-sm text-gray-300 mb-3">{project.description}</p>
            
            <div className="flex flex-wrap gap-1 mb-3">
              {project.tags?.map((tag, i) => (
                <span key={i} className="text-xs bg-blue-900/40 text-blue-300 px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex gap-2 justify-center">
              {project.demoLink && (
                <a 
                  href={project.demoLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded transition-colors"
                >
                  Live Demo
                </a>
              )}
              {project.githubLink && (
                <a 
                  href={project.githubLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs bg-gray-700 hover:bg-gray-800 text-white px-3 py-1.5 rounded transition-colors"
                >
                  GitHub
                </a>
              )}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

// Interactive project sphere
const ProjectSphere = ({ project, position = [0, 0, 0], radius = 0.7, mass = 1 }) => {
  const [ref, api] = useSphere(() => ({ 
    mass,
    position,
    args: [radius],
  }));
  
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  
  // Apply force when clicked
  const handleClick = (e) => {
    e.stopPropagation();
    
    // Push the sphere upward and with a random direction
    api.velocity.set(
      (Math.random() - 0.5) * 5, 
      5 + Math.random() * 2, 
      (Math.random() - 0.5) * 5
    );
    
    setClicked(!clicked);
  };
  
  // Glow effect when hovered
  useFrame(({ clock }) => {
    if (ref.current) {
      if (hovered) {
        const t = clock.getElapsedTime();
        const scale = 1 + Math.sin(t * 5) * 0.05;
        ref.current.scale.set(scale, scale, scale);
      } else {
        ref.current.scale.set(1, 1, 1);
      }
    }
  });
  
  return (
    <group>
      <mesh
        ref={ref}
        castShadow
        receiveShadow
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[radius, 32, 32]} />
        <meshPhysicalMaterial 
          color={project.color || '#4285F4'} 
          clearcoat={1}
          clearcoatRoughness={0.1}
          metalness={0.8}
          roughness={0.2}
          emissive={hovered ? new THREE.Color(project.color || '#4285F4') : new THREE.Color(0x000000)}
          emissiveIntensity={hovered ? 0.5 : 0}
        />
      </mesh>
      
      {/* Project details panel */}
      {clicked && (
        <Html position={[0, 2, 0]} transform distanceFactor={10} center>
          <div className="bg-black/90 backdrop-blur-lg p-4 rounded-lg shadow-xl max-w-xs border border-blue-500/20">
            <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
            <p className="text-sm text-gray-300 mb-3">{project.description}</p>
            
            <div className="flex flex-wrap gap-1 mb-3">
              {project.tags?.map((tag, i) => (
                <span key={i} className="text-xs bg-blue-900/40 text-blue-300 px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex gap-2 justify-center">
              {project.demoLink && (
                <a 
                  href={project.demoLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded transition-colors"
                >
                  Live Demo
                </a>
              )}
              {project.githubLink && (
                <a 
                  href={project.githubLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs bg-gray-700 hover:bg-gray-800 text-white px-3 py-1.5 rounded transition-colors"
                >
                  GitHub
                </a>
              )}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

// Spring connection between two physics objects
const Spring = ({ bodyA, bodyB, color = '#ffffff', thickness = 0.05 }) => {
  const { scene } = useThree();
  const spring = useRef();
  
  // Create spring constraint
  useSpring(bodyA, bodyB, {
    restLength: 2,
    stiffness: 50,
    damping: 5,
    worldAnchorA: [0, 0, 0],
    worldAnchorB: [0, 0, 0],
    localAnchorA: [0, 0, 0],
    localAnchorB: [0, 0, 0],
  });
  
  useEffect(() => {
    // Create line for visualization
    const lineMaterial = new THREE.LineBasicMaterial({ color });
    const points = [];
    points.push(new THREE.Vector3(0, 0, 0));
    points.push(new THREE.Vector3(0, 0, 0));
    
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(lineGeometry, lineMaterial);
    
    spring.current = line;
    scene.add(line);
    
    return () => {
      scene.remove(line);
    };
  }, [scene, color]);
  
  // Update line positions
  useFrame(() => {
    if (spring.current && bodyA.current && bodyB.current) {
      const posA = new THREE.Vector3();
      const posB = new THREE.Vector3();
      
      bodyA.current.getWorldPosition(posA);
      bodyB.current.getWorldPosition(posB);
      
      const points = [];
      points.push(posA);
      points.push(posB);
      
      spring.current.geometry.setFromPoints(points);
      spring.current.geometry.attributes.position.needsUpdate = true;
    }
  });
  
  return null;
};

// Scene that contains all the physics objects
const PhysicsProjectScene = ({ projects }) => {
  // Create refs for spring connections
  const cubeRefs = useRef([]);
  const sphereRefs = useRef([]);
  
  // Setup camera controls
  const controlsRef = useRef();
  
  useFrame(({ clock }) => {
    if (controlsRef.current) {
      // Slowly rotate the camera around the scene
      const t = clock.getElapsedTime() * 0.1;
      controlsRef.current.target.set(0, 0, 0);
    }
  });
  
  return (
    <>
      <OrbitControls 
        ref={controlsRef} 
        enablePan={false}
        enableZoom={true}
        minDistance={5}
        maxDistance={20}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2}
      />
      
      <PerspectiveCamera 
        makeDefault 
        position={[8, 5, 8]} 
        fov={45}
      />
      
      <Physics gravity={[0, -9.8, 0]}>
        {/* Ground plane */}
        <Floor />
        
        {/* Project cubes */}
        {projects.slice(0, Math.ceil(projects.length / 2)).map((project, i) => (
          <ProjectCube
            key={`cube-${i}`}
            ref={(el) => (cubeRefs.current[i] = el)}
            project={project}
            position={[
              (i * 2 - projects.length / 2) * 0.5,
              1 + Math.random() * 2,
              -2 + Math.random()
            ]}
            size={[1.5, 1.5, 1.5]}
            mass={1}
          />
        ))}
        
        {/* Project spheres */}
        {projects.slice(Math.ceil(projects.length / 2)).map((project, i) => (
          <ProjectSphere
            key={`sphere-${i}`}
            ref={(el) => (sphereRefs.current[i] = el)}
            project={project}
            position={[
              (i * 2 - (projects.length - Math.ceil(projects.length / 2)) / 2) * 0.5,
              1 + Math.random() * 2,
              2 + Math.random()
            ]}
            radius={0.75}
            mass={1}
          />
        ))}
        
        {/* Add springs between some objects for interesting physics */}
        {cubeRefs.current.length > 1 && sphereRefs.current.length > 0 && (
          <>
            <Spring bodyA={cubeRefs.current[0]} bodyB={cubeRefs.current[1]} color="#4285F4" />
            <Spring bodyA={cubeRefs.current[0]} bodyB={sphereRefs.current[0]} color="#DB4437" />
          </>
        )}
      </Physics>
      
      {/* Environment and lighting */}
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={1} castShadow />
      <ContactShadows 
        rotation={[Math.PI / 2, 0, 0]} 
        position={[0, -1.99, 0]} 
        opacity={0.8} 
        width={30} 
        height={30} 
        blur={1} 
        far={10} 
      />
      <Environment preset="city" />
    </>
  );
};

// Main component
const PhysicsProjectShowcase = ({ projects: userProjects }) => {
  // Default projects if none provided
  const defaultProjects = [
    {
      title: "Real-time Chat Application",
      description: "A scalable real-time chat application built using the MERN stack with Socket.io for real-time communication.",
      image: "/images/projects/project1.jpg",
      tags: ["React", "Node.js", "Socket.io", "MongoDB"],
      demoLink: "https://chat-app-demo.example.com",
      githubLink: "https://github.com/username/chat-app",
      color: "#4285F4"
    },
    {
      title: "Ticketing Marketplace SaaS",
      description: "A full-stack ticketing marketplace with Stripe payment processing and email notifications.",
      image: "/images/projects/project2.jpg",
      tags: ["Next.js", "Express", "PostgreSQL", "Stripe"],
      demoLink: "https://ticketing-marketplace.example.com",
      githubLink: "https://github.com/username/ticketing-app",
      color: "#0F9D58"
    },
    {
      title: "Portfolio Website",
      description: "A modern, responsive portfolio website with interactive 3D elements and animations.",
      image: "/images/projects/project3.jpg",
      tags: ["React", "Three.js", "GSAP", "Tailwind CSS"],
      demoLink: "https://portfolio.example.com",
      githubLink: "https://github.com/username/portfolio",
      color: "#DB4437"
    },
    {
      title: "AWS Implementation Guides",
      description: "Practical guides and templates for implementing various AWS services with infrastructure as code.",
      image: "/images/projects/project4.jpg",
      tags: ["AWS", "Terraform", "CloudFormation", "DevOps"],
      demoLink: "https://aws-guides.example.com",
      githubLink: "https://github.com/username/aws-guides",
      color: "#F4B400"
    }
  ];
  
  const projects = userProjects || defaultProjects;
  
  // Instructions text component
  const Instructions = () => (
    <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm p-3 rounded-lg max-w-xs text-white text-sm z-10">
      <h3 className="font-bold mb-1">Interactive Projects</h3>
      <p className="text-gray-300 text-xs">Click on any project to view details. Click again to apply physics forces!</p>
      <p className="text-gray-400 text-xs mt-1">Drag to rotate view. Scroll to zoom.</p>
    </div>
  );
  
  return (
    <div className="relative w-full h-[700px]">
      <Instructions />
      
      <Canvas shadows dpr={[1, 2]}>
        <Suspense fallback={<Html center>Loading 3D Projects...</Html>}>
          <PhysicsProjectScene projects={projects} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default PhysicsProjectShowcase; 