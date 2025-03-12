import { useState, useRef, useEffect } from 'react';
import ShaderBackground from './ShaderBackground';
import InteractiveText3D from './InteractiveText3D';
import PhysicsProjectShowcase from './PhysicsProjectShowcase';
import { useInView } from 'react-intersection-observer';

// Demo section with all 3D features
const ThreeDemoSection = ({ 
  projects, 
  title = "Advanced 3D Features",
  subtitle = "Explore interactive 3D elements that showcase modern web technologies",
  backgroundColor = '#050a12',
  primaryColor = '#4285F4',
  secondaryColor = '#34A853',
  accentColor1 = '#FBBC05',
  accentColor2 = '#EA4335',
  enableShaderBackground = true,
  selectedShader = 'particles',
  enableText3D = true,
  text3DType = 'words',
  enableProjectShowcase = true,
  children 
}) => {
  const [activeTab, setActiveTab] = useState('shader');
  const [activeShader, setActiveShader] = useState(selectedShader);
  const [shaderIntensity, setShaderIntensity] = useState(1.0);
  const [shaderSpeed, setShaderSpeed] = useState(0.5);
  
  // Ref for the demo container
  const containerRef = useRef(null);
  
  // Intersection observer to trigger animations when in view
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });
  
  // Color theme for shaders
  const themeColors = {
    primary: primaryColor,
    secondary: secondaryColor,
    accent1: accentColor1,
    accent2: accentColor2,
    background: backgroundColor,
    foreground: '#ffffff'
  };
  
  // Tab options for the demo
  const tabs = [
    { id: 'shader', label: 'Shader Backgrounds' },
    { id: 'text', label: '3D Text' },
    { id: 'projects', label: 'Physics Projects' }
  ];
  
  // Shader options for the demo
  const shaders = [
    { id: 'gradient', label: 'Gradient' },
    { id: 'wave', label: 'Wave' },
    { id: 'particles', label: 'Particles' }
  ];
  
  // Example projects data if none provided
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
  
  // Use provided projects or defaults
  const projectsData = projects || defaultProjects;
  
  // Sample code snippet for integrating 3D features
  const codeSnippets = {
    shader: `
// Import the component
import ShaderBackground from './components/3d/ShaderBackground';

// Use in your component
<div className="relative h-screen">
  <ShaderBackground 
    shader="${activeShader}"
    intensity={${shaderIntensity}}
    speed={${shaderSpeed}}
  />
  
  <div className="absolute inset-0 z-10 flex items-center justify-center">
    <h1 className="text-5xl text-white font-bold">Your Content Here</h1>
  </div>
</div>
    `,
    text: `
// Import the component
import InteractiveText3D from './components/3d/InteractiveText3D';

// Use in your component
<InteractiveText3D
  text="Your 3D Text"
  type="${text3DType}"
  height={250}
  size={0.5}
  color="${primaryColor}"
  secondary="${secondaryColor}"
  enableControls={true}
  showCursor={true}
/>
    `,
    projects: `
// Import the component
import PhysicsProjectShowcase from './components/3d/PhysicsProjectShowcase';

// Your projects data (or pass from props)
const projects = [
  {
    title: "Project Name",
    description: "Project description goes here...",
    image: "/path/to/image.jpg",
    tags: ["React", "Three.js"],
    demoLink: "https://example.com",
    githubLink: "https://github.com/yourusername/project",
    color: "#4285F4"
  },
  // More projects...
];

// Use in your component
<PhysicsProjectShowcase projects={projects} />
    `
  };
  
  // Tab content components
  const TabContent = () => {
    switch (activeTab) {
      case 'shader':
        return (
          <div className="bg-black/30 rounded-lg p-6 backdrop-blur-lg">
            <h3 className="text-xl font-bold text-white mb-4">Shader Backgrounds</h3>
            <p className="text-gray-300 mb-6">
              Add stunning WebGL shader backgrounds to any section of your portfolio. 
              These backgrounds are interactive, respond to mouse movements, and create 
              a modern, immersive experience.
            </p>
            
            <div className="flex flex-wrap gap-3 mb-6">
              {shaders.map((shader) => (
                <button
                  key={shader.id}
                  onClick={() => setActiveShader(shader.id)}
                  className={`px-4 py-2 rounded-full text-sm ${
                    activeShader === shader.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {shader.label}
                </button>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Intensity: {shaderIntensity.toFixed(1)}
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="2"
                  step="0.1"
                  value={shaderIntensity}
                  onChange={(e) => setShaderIntensity(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Speed: {shaderSpeed.toFixed(1)}
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1.5"
                  step="0.1"
                  value={shaderSpeed}
                  onChange={(e) => setShaderSpeed(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
            
            <div className="bg-gray-900 p-4 rounded-lg">
              <h4 className="text-gray-300 text-sm mb-2">Example Usage:</h4>
              <pre className="text-xs text-gray-400 overflow-auto max-h-60 p-3 bg-black/50 rounded">
                {codeSnippets.shader}
              </pre>
            </div>
          </div>
        );
        
      case 'text':
        return (
          <div className="bg-black/30 rounded-lg p-6 backdrop-blur-lg">
            <h3 className="text-xl font-bold text-white mb-4">3D Interactive Text</h3>
            <p className="text-gray-300 mb-6">
              Enhance your section headings with interactive 3D text. This component 
              creates beautiful, interactive 3D text that responds to mouse movements
              and adds visual interest to your portfolio.
            </p>
            
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={() => setActiveTab('text-demo')}
                className="px-4 py-2 rounded-full text-sm bg-blue-600 text-white"
              >
                View Demo
              </button>
            </div>
            
            <div className="bg-gray-900 p-4 rounded-lg">
              <h4 className="text-gray-300 text-sm mb-2">Example Usage:</h4>
              <pre className="text-xs text-gray-400 overflow-auto max-h-60 p-3 bg-black/50 rounded">
                {codeSnippets.text}
              </pre>
            </div>
          </div>
        );
        
      case 'text-demo':
        return (
          <div className="bg-black/30 rounded-lg p-6 backdrop-blur-lg">
            <button
              onClick={() => setActiveTab('text')}
              className="text-gray-400 hover:text-white mb-4 flex items-center"
            >
              <span>← Back</span>
            </button>
            
            <div className="bg-black/50 rounded-lg overflow-hidden" style={{ height: '300px' }}>
              <InteractiveText3D
                text="3D Interactive Text"
                type={text3DType}
                height="100%"
                size={0.35}
                color={primaryColor}
                secondary={secondaryColor}
                enableControls={true}
                showCursor={true}
              />
            </div>
            
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => text3DType === 'single' ? null : null}
                className={`px-4 py-2 rounded-full text-sm ${
                  text3DType === 'single'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Single Line
              </button>
              
              <button
                onClick={() => text3DType === 'words' ? null : null}
                className={`px-4 py-2 rounded-full text-sm ${
                  text3DType === 'words'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Words Animation
              </button>
            </div>
          </div>
        );
        
      case 'projects':
        return (
          <div className="bg-black/30 rounded-lg p-6 backdrop-blur-lg">
            <h3 className="text-xl font-bold text-white mb-4">Physics-Based Project Showcase</h3>
            <p className="text-gray-300 mb-6">
              Create an interactive showcase of your projects with realistic physics. 
              Users can interact with 3D objects representing your projects, click for 
              more details, and play with physics simulations.
            </p>
            
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={() => setActiveTab('projects-demo')}
                className="px-4 py-2 rounded-full text-sm bg-blue-600 text-white"
              >
                View Demo
              </button>
            </div>
            
            <div className="bg-gray-900 p-4 rounded-lg">
              <h4 className="text-gray-300 text-sm mb-2">Example Usage:</h4>
              <pre className="text-xs text-gray-400 overflow-auto max-h-60 p-3 bg-black/50 rounded">
                {codeSnippets.projects}
              </pre>
            </div>
          </div>
        );
        
      case 'projects-demo':
        return (
          <div className="bg-black/30 rounded-lg p-6 backdrop-blur-lg">
            <button
              onClick={() => setActiveTab('projects')}
              className="text-gray-400 hover:text-white mb-4 flex items-center"
            >
              <span>← Back</span>
            </button>
            
            <div className="bg-black/50 rounded-lg overflow-hidden h-[500px]">
              <PhysicsProjectShowcase projects={projectsData.slice(0, 4)} />
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <section 
      ref={ref}
      className="relative overflow-hidden py-20 min-h-screen"
      style={{ backgroundColor }}
    >
      {/* Background shader */}
      {enableShaderBackground && (
        <ShaderBackground 
          shader={activeShader}
          intensity={shaderIntensity}
          speed={shaderSpeed}
          themeColors={themeColors}
        />
      )}
      
      <div className="relative z-10 container mx-auto px-4">
        <div ref={containerRef} className="text-center mb-16">
          {/* 3D text heading or regular heading */}
          {enableText3D ? (
            <div className="h-[200px] mb-8">
              <InteractiveText3D
                text={title}
                type="words"
                height="100%"
                size={0.65}
                color={primaryColor}
                secondary={secondaryColor}
                enableControls={true}
                showCursor={false}
                wordsPerLine={3}
              />
            </div>
          ) : (
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{title}</h2>
          )}
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">{subtitle}</p>
        </div>
        
        {/* Tab navigation */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-full text-sm md:text-base transition-colors ${
                activeTab === tab.id || 
                (tab.id === 'text' && activeTab === 'text-demo') ||
                (tab.id === 'projects' && activeTab === 'projects-demo')
                  ? 'bg-white text-[#050a12] font-medium'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Demo content */}
        <div className="max-w-4xl mx-auto">
          <TabContent />
        </div>
        
        {/* Custom content */}
        {children && (
          <div className="mt-20">
            {children}
          </div>
        )}
      </div>
    </section>
  );
};

export default ThreeDemoSection; 