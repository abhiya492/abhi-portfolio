import { Canvas, useFrame } from '@react-three/fiber';
import {
  ContactShadows,
  Float,
  Html,
  useTexture,
  Environment,
  Text,
  PresentationControls
} from '@react-three/drei';
import { Suspense, useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { contactInfo, socialLinks } from '../../data/portfolioData';

// Floating social media icon
const SocialIcon = ({ icon, url, position, color = '#ffffff' }) => {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useEffect(() => {
    if (groupRef.current) {
      gsap.to(groupRef.current.scale, {
        x: hovered ? 1.2 : 1,
        y: hovered ? 1.2 : 1,
        z: hovered ? 1.2 : 1,
        duration: 0.3,
        ease: 'back.out(1.7)'
      });
      
      gsap.to(groupRef.current.rotation, {
        z: hovered ? Math.PI * 0.1 : 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)'
      });
    }
  }, [hovered]);
  
  // Open URL when clicked
  const handleClick = () => {
    window.open(url, '_blank');
  };
  
  return (
    <group 
      ref={groupRef}
      position={position}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Icon background */}
      <mesh castShadow>
        <boxGeometry args={[0.8, 0.8, 0.05]} />
        <meshStandardMaterial 
          color={hovered ? color : '#222222'} 
          metalness={0.8}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={hovered ? 0.5 : 0.1}
        />
      </mesh>
      
      {/* Icon image */}
      <Html position={[0, 0, 0.05]} transform scale={0.4} center>
        <div 
          className={`w-16 h-16 flex items-center justify-center bg-opacity-0 transition-all duration-300 ${hovered ? 'scale-110' : 'scale-100'}`}
        >
          <i className={`text-3xl fab fa-${icon}`} style={{ color: hovered ? '#ffffff' : color }}></i>
        </div>
      </Html>
    </group>
  );
};

// Animated envelope model
const Envelope = ({ position = [0, 0, 0], onClick }) => {
  const envelopeRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [opened, setOpened] = useState(false);
  
  // Handle hover effects
  useEffect(() => {
    if (envelopeRef.current) {
      gsap.to(envelopeRef.current.rotation, {
        y: hovered ? Math.PI * 0.05 : 0,
        duration: 0.5,
        ease: 'power2.out'
      });
    }
  }, [hovered]);
  
  // Handle envelope opening animation
  useEffect(() => {
    if (envelopeRef.current && opened) {
      // Animation sequence for opening the envelope
      const timeline = gsap.timeline();
      
      timeline.to(envelopeRef.current.rotation, {
        x: Math.PI * 0.1,
        duration: 0.5,
        ease: 'power2.out'
      });
      
      timeline.to(envelopeRef.current.position, {
        y: position[1] + 0.5,
        duration: 0.5,
        ease: 'power2.out'
      });
    }
  }, [opened, position]);
  
  return (
    <group 
      ref={envelopeRef} 
      position={position}
      onClick={() => {
        setOpened(true);
        if (onClick) onClick();
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Envelope body */}
      <mesh castShadow>
        <boxGeometry args={[2, 1.2, 0.1]} />
        <meshStandardMaterial 
          color="#f5f5f5" 
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>
      
      {/* Envelope flap */}
      <mesh position={[0, 0.6, 0]} rotation={[opened ? -Math.PI * 0.4 : 0, 0, 0]}>
        <coneGeometry args={[1, 1, 4, 1, true, Math.PI * 0.75]} />
        <meshStandardMaterial 
          color="#e8e8e8" 
          metalness={0.1}
          roughness={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Envelope content (only visible when opened) */}
      {opened && (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
          <mesh position={[0, 0.4, 0.2]}>
            <planeGeometry args={[1.8, 0.8]} />
            <meshBasicMaterial color="#ffffff" />
            <Html position={[0, 0, 0.01]} transform scale={0.17} center>
              <div className="bg-white p-4 rounded shadow-lg w-[300px]">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Get In Touch</h3>
                <p className="text-gray-600 mb-4">Fill out the form below and I'll get back to you as soon as possible.</p>
                <form className="space-y-3">
                  <div>
                    <input type="text" placeholder="Your Name" className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <input type="email" placeholder="Your Email" className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <textarea placeholder="Your Message" rows="3" className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                  </div>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors w-full">Send Message</button>
                </form>
              </div>
            </Html>
          </mesh>
        </Float>
      )}
    </group>
  );
};

// Main contact scene component
const ContactScene = () => {
  const [showContactForm, setShowContactForm] = useState(false);
  
  // Social media icons positioning
  const socialIcons = [
    { icon: 'github', url: socialLinks.github, position: [-2, 0, 0], color: '#333333' },
    { icon: 'linkedin', url: socialLinks.linkedin, position: [-1, 0, 0], color: '#0077B5' },
    { icon: 'twitter', url: socialLinks.twitter, position: [1, 0, 0], color: '#1DA1F2' },
    { icon: 'instagram', url: socialLinks.instagram, position: [2, 0, 0], color: '#E4405F' }
  ];
  
  return (
    <div className="w-full h-[700px] relative">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 40 }}
        gl={{ antialias: true }}
        className="bg-transparent"
      >
        <Suspense fallback={<Html center>Loading contact section...</Html>}>
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
            <group position={[0, -0.5, 0]}>
              {/* Main contact title */}
              <Text
                position={[0, 2, 0]}
                fontSize={0.5}
                font="/fonts/inter-bold.woff"
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
              >
                Contact Me
              </Text>
              
              {/* Social icons row */}
              <group position={[0, 0.5, 0]}>
                {socialIcons.map((social, index) => (
                  <Float 
                    key={index}
                    speed={2} 
                    rotationIntensity={0.3} 
                    floatIntensity={0.5}
                  >
                    <SocialIcon
                      icon={social.icon}
                      url={social.url}
                      position={social.position}
                      color={social.color}
                    />
                  </Float>
                ))}
              </group>
              
              {/* Email envelope */}
              <Envelope 
                position={[0, -1, 0]} 
                onClick={() => setShowContactForm(true)}
              />
              
              {/* Hint text */}
              <Text
                position={[0, -2, 0]}
                fontSize={0.15}
                font="/fonts/inter-medium.woff"
                color="#aaaaaa"
                anchorX="center"
                anchorY="middle"
              >
                Click the envelope to contact me
              </Text>
            </group>
          </PresentationControls>
          
          <ContactShadows 
            position={[0, -2.5, 0]} 
            opacity={0.5} 
            scale={10} 
            blur={2} 
            far={4} 
          />
          
          <Environment preset="studio" />
        </Suspense>
      </Canvas>
      
      {/* Contact info sidebar */}
      <div className="absolute top-1/2 right-8 transform -translate-y-1/2 bg-black/80 backdrop-blur-md p-6 rounded-xl border border-white/10 max-w-[350px] hidden lg:block">
        <h3 className="text-xl font-bold text-white mb-4">Contact Information</h3>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="bg-blue-500/20 p-2 rounded-lg">
              <i className="fas fa-envelope text-blue-500"></i>
            </div>
            <div>
              <h4 className="text-white font-semibold">Email</h4>
              <a href={`mailto:${contactInfo.email}`} className="text-gray-400 hover:text-blue-400 transition-colors">
                {contactInfo.email}
              </a>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-green-500/20 p-2 rounded-lg">
              <i className="fas fa-phone text-green-500"></i>
            </div>
            <div>
              <h4 className="text-white font-semibold">Phone</h4>
              <a href={`tel:${contactInfo.phone}`} className="text-gray-400 hover:text-green-400 transition-colors">
                {contactInfo.phone}
              </a>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-red-500/20 p-2 rounded-lg">
              <i className="fas fa-map-marker-alt text-red-500"></i>
            </div>
            <div>
              <h4 className="text-white font-semibold">Location</h4>
              <p className="text-gray-400">{contactInfo.location}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-white/10">
          <h4 className="text-white font-semibold mb-3">Connect with me</h4>
          <div className="flex gap-3">
            <a href={socialLinks.github} target="_blank" rel="noreferrer" className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
              <i className="fab fa-github text-white"></i>
            </a>
            <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
              <i className="fab fa-linkedin-in text-white"></i>
            </a>
            <a href={socialLinks.twitter} target="_blank" rel="noreferrer" className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
              <i className="fab fa-twitter text-white"></i>
            </a>
            <a href={socialLinks.instagram} target="_blank" rel="noreferrer" className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
              <i className="fab fa-instagram text-white"></i>
            </a>
          </div>
        </div>
      </div>
      
      {/* Mobile contact form (shown when screen is too small for 3D or when requested) */}
      {showContactForm && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-10">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Get In Touch</h3>
              <button 
                onClick={() => setShowContactForm(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <form className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Name</label>
                <input type="text" placeholder="Your Name" className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1">Email</label>
                <input type="email" placeholder="Your Email" className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1">Message</label>
                <textarea placeholder="Your Message" rows="4" className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
              </div>
              
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors w-full">
                Send Message
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactScene; 