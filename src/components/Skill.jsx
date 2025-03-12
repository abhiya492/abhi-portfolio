import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SkillCard from './SkillCard';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const skills = [
  {
    category: 'Infrastructure & DevOps',
    items: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'Linux', 'CI/CD', 'Git'],
    icon: '/images/docker.svg',
    color: '#61DAFB',
    description: 'Building and managing scalable cloud infrastructure and automated deployment pipelines.'
  },
  {
    category: 'Programming & Development',
    items: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Express.js', 'REST APIs', 'GraphQL'],
    icon: '/images/javascript.svg',
    color: '#F7DF1E',
    description: 'Creating responsive web applications with modern frameworks and libraries.'
  },
  {
    category: 'Databases & Data Management',
    items: ['MongoDB', 'PostgreSQL', 'Redis', 'DynamoDB', 'Mongoose', 'SQL', 'NoSQL', 'Data Modeling'],
    icon: '/images/mongodb.svg',
    color: '#4DB33D',
    description: 'Designing and implementing efficient database solutions for various application needs.'
  },
  {
    category: 'System Design & Tools',
    items: ['Microservices', 'API Design', 'System Architecture', 'Postman', 'Performance Optimization', 'Security'],
    icon: '/images/postman.svg',
    color: '#FF6C37',
    description: 'Architecting robust systems with scalability, reliability, and performance in mind.'
  }
];

const Skill = ({ toggle3D }) => {
  const skillsRef = useRef(null);
  const cardsRef = useRef([]);
  
  useEffect(() => {
    // Reset refs array
    cardsRef.current = [];
    
    // Animation for section title
    gsap.fromTo(
      '.skills-title',
      { y: 50, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.8, 
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.skills-title',
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );
    
    // Animation for section text
    gsap.fromTo(
      '.skills-text',
      { y: 30, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.8,
        delay: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.skills-text',
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );
    
    // Staggered animation for skill cards
    if (cardsRef.current.length > 0) {
      gsap.fromTo(
        cardsRef.current,
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.7,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: skillsRef.current,
            start: 'top 70%',
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
    <section id="skills" className="py-20 md:py-28 bg-gradient-to-b from-black to-gray-900" ref={skillsRef}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4 skills-title">
          Technical <span className="text-blue-500">Skills</span>
            </h2>
        
        <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12 skills-text">
          Throughout my academic and professional journey, I've developed expertise in various technologies. 
          I've also solved over 350 problems on LeetCode, enhancing my problem-solving abilities.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {skills.map((skill, index) => (
            <div 
              ref={addToRefs} 
              key={index} 
              className="skill-card-container"
            >
                        <SkillCard 
                title={skill.category}
                items={skill.items}
                icon={skill.icon}
                accentColor={skill.color}
                description={skill.description}
              />
            </div>
          ))}
        </div>
        
        {toggle3D && (
          <div className="mt-16 text-center">
            <div className="inline-block py-3 px-6 bg-blue-600/10 rounded-lg border border-blue-500/20 text-blue-400 text-sm backdrop-blur-sm">
              <span role="img" aria-label="Lightbulb" className="mr-2">💡</span>
              Explore each skill category by hovering over the cards for more details
            </div>
          </div>
        )}
        </div>
    </section>
  );
};

export default Skill;