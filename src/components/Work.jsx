import React, { useEffect, useRef } from 'react';
import ProjectCard from './ProjectCard';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: 1,
    title: 'Real-time Chat Application',
    description: 'A scalable chat application with real-time messaging, user authentication, and room management features.',
    image: '/images/project-4.jpg',
    tags: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'Redux'],
    demoLink: 'https://chat-app-complete.onrender.com/',
    githubLink: 'https://github.com/abhiya492/Chat-app-complete',
    category: 'Web Application',
    featured: true
  },
  {
    id: 2,
    title: 'Ticketing Marketplace SaaS',
    description: 'Full-stack marketplace for buying and selling event tickets with secure payment processing via Stripe.',
    image: '/images/project-5.jpg.png',
    tags: ['Next.js', 'Express', 'PostgreSQL', 'Stripe', 'TypeScript'],
    demoLink: 'https://ticket-marketplace.vercel.app/',
    githubLink: 'https://github.com/abhiya492/ticket-saas-app',
    category: 'Full-Stack',
    featured: true
  },
  {
    id: 3,
    title: 'Portfolio Website',
    description: 'Modern portfolio website featuring React, Three.js for 3D elements, and GSAP for smooth animations.',
    image: '/images/project-3.jpg',
    tags: ['React', 'Three.js', 'GSAP', 'Tailwind CSS'],
    demoLink: 'https://abhishek-singh.dev/',
    githubLink: 'https://github.com/abhiya492/portfolio',
    category: 'Front-End',
    featured: false
  },
  {
    id: 4,
    title: 'AWS Implementation Guides',
    description: 'Comprehensive implementation guides for AWS services, including step-by-step tutorials and best practices.',
    image: '/images/project-6.jpg',
    tags: ['AWS', 'DevOps', 'Infrastructure', 'Documentation'],
    demoLink: 'https://hashnode.com/@abhishek9123',
    githubLink: 'https://hashnode.com/@abhishek9123',
    category: 'DevOps',
    featured: false
  },
  {
    id: 5,
    title: 'Transform Videos into Blog Posts with Ease',
    description: ' Transform your videos into engaging blog posts instantly using the power of AI! This full-stack SaaS application leverages cutting-edge technologies to provide a seamless video-to-blog conversion experience..',
    image: '/images/project-2.jpg',
    tags: ['Next.js 14 ', 'Clerk', 'NeonDb','TailwindCSS + ShadCN UI' ,'UploadThing' , 'Stripe' ,'OpenAI API' ,'TypeScript' , 'Documentation'],
    demoLink: 'https://github.com/abhiya492/motion-ai',
    githubLink: 'https://github.com/abhiya492/motion-ai',
    category: 'SaaS',
    featured: false
  }
];

const Work = ({ toggle3D }) => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  
  useEffect(() => {
    // Reset refs array
    cardsRef.current = [];
    
    // Animation for section title
    gsap.fromTo(
      '.work-title',
      { y: 50, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.8, 
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.work-title',
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );
    
    // Animation for section text
    gsap.fromTo(
      '.work-text',
      { y: 30, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.8,
        delay: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.work-text',
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );
    
    // Staggered animation for project cards
    if (cardsRef.current.length > 0) {
      gsap.fromTo(
        cardsRef.current,
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.7,
          stagger: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            toggleActions: 'play none none none'
          }
        }
      );
    }
  }, [toggle3D]);
  
  // Function to add elements to the refs array
  const addToRefs = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };
  
    return (  
    <section id="work" className="py-20 md:py-28 bg-gradient-to-b from-gray-900 to-black" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4 work-title">
          Featured <span className="text-blue-500">Projects</span>
        </h2>
        
        <p className="text-gray-400 text-center max-w-2xl mx-auto mb-16 work-text">
          Showcasing my work across full-stack development, DevOps, and cloud infrastructure.
          Each project demonstrates my technical skills and problem-solving abilities.
        </p>
        
        {/* Featured projects (larger cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {projects.filter(project => project.featured).map((project, index) => (
            <div key={project.id} ref={addToRefs} className="project-card-container">
              <ProjectCard 
                title={project.title}
                description={project.description}
                image={project.image}
                tags={project.tags}
                demoLink={project.demoLink}
                githubLink={project.githubLink}
                featured={true}
                category={project.category}
              />
            </div>
          ))}
        </div>
        
        {/* Other projects (smaller cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {projects.filter(project => !project.featured).map((project, index) => (
            <div key={project.id} ref={addToRefs} className="project-card-container">
              <ProjectCard 
                title={project.title}
                description={project.description}
                image={project.image}
                tags={project.tags}
                demoLink={project.demoLink}
                githubLink={project.githubLink}
                featured={false}
                category={project.category}
              />
            </div>
    ))}  
    </div>  
        
        {/* Call-to-action */}
        <div className="text-center mt-20">
          <p className="text-gray-400 mb-6">Want to see more of my projects?</p>
          <a 
            href="https://github.com/abhiya492" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-300 shadow-lg shadow-blue-500/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" className="mr-2">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            Visit My GitHub
          </a>
    </div>  
    </div>  
    </section>  
    );  
};
   
   export default Work;
