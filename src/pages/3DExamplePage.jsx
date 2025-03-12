import React, { useState } from 'react';
import { 
  ShaderBackground, 
  InteractiveText3D,
  PhysicsProjectShowcase,
  ThreeDemoSection
} from '../components/3d';

const projects = [
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

const ThreeDExamplePage = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Theme color schemes
  const themeColors = {
    dark: {
      primary: '#4285F4',
      secondary: '#34A853',
      accent1: '#FBBC05',
      accent2: '#EA4335',
      background: '#050a12',
      text: '#ffffff',
      lightText: '#a0aec0',
      card: '#1a202c',
      cardHover: '#2d3748'
    },
    light: {
      primary: '#1a73e8',
      secondary: '#34A853',
      accent1: '#FBBC05',
      accent2: '#EA4335',
      background: '#f8fafc',
      text: '#1a202c',
      lightText: '#4a5568',
      card: '#ffffff',
      cardHover: '#f1f5f9'
    }
  };
  
  // Get current theme colors
  const theme = isDarkMode ? themeColors.dark : themeColors.light;
  
  return (
    <div style={{ background: theme.background, color: theme.text }}>
      {/* Example 1: Hero section with shader background and 3D text */}
      <section 
        id="hero"
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background shader effect */}
        <ShaderBackground 
          shader="particles" 
          intensity={0.8} 
          speed={0.3}
          themeColors={{
            primary: theme.primary,
            secondary: theme.secondary,
            accent1: theme.accent1,
            accent2: theme.accent2,
            background: theme.background,
            foreground: theme.text
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="mb-8 h-[150px]">
            <InteractiveText3D
              text="Hi, I'm Abhishek"
              type="words"
              height="100%"
              size={0.6}
              color={theme.primary}
              secondary={theme.accent1}
              enableControls={true}
              showCursor={true}
              wordsPerLine={3}
            />
          </div>
          
          <h2 className="text-2xl md:text-3xl mb-8 opacity-80">
            Full Stack Developer & AWS Cloud Expert
          </h2>
          
          <div className="flex gap-4 justify-center mt-12">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
              View My Work
            </button>
            <button className="border border-gray-400 hover:border-white text-gray-300 hover:text-white px-6 py-3 rounded-lg transition-colors">
              Contact Me
            </button>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M12 5V19M12 19L19 12M12 19L5 12" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </section>
      
      {/* Example 2: Projects section with physics showcase */}
      <section 
        id="projects"
        className="py-20"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="h-[120px] mb-6">
              <InteractiveText3D
                text="My Projects"
                type="single"
                height="100%"
                size={0.5}
                color={theme.primary}
                secondary={theme.accent1}
              />
            </div>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: theme.lightText }}>
              Explore my latest work through this interactive 3D showcase. 
              Click on any project to view details and interact with the physics simulation.
            </p>
          </div>
          
          <div className="mt-10">
            <PhysicsProjectShowcase projects={projects} />
          </div>
          
          <div className="mt-12 text-center">
            <a 
              href="https://github.com/yourusername" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 transition-colors"
            >
              <span>View more projects on GitHub</span>
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.605-3.369-1.343-3.369-1.343-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.022A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.841-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.164 22 16.42 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
            </a>
          </div>
        </div>
      </section>
      
      {/* Example 3: Full Demo Section */}
      <ThreeDemoSection 
        title="3D Portfolio Features"
        subtitle="Explore the interactive 3D features I've implemented in this portfolio"
        backgroundColor={theme.background}
        primaryColor={theme.primary}
        secondaryColor={theme.secondary}
        accentColor1={theme.accent1}
        accentColor2={theme.accent2}
        selectedShader="gradient"
        projects={projects}
      />
      
      {/* Theme toggle button */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-gray-800 text-white shadow-lg hover:bg-gray-700 transition-colors"
        aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDarkMode ? (
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default ThreeDExamplePage; 