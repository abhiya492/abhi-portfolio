import './About.css';

import { useEffect, useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const aboutItems = [
    {
      label: 'Projects Done',
      number: 10,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    {
      label: 'LeetCode Problems',
      number: 350,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      )
    }
];

const About = () => {
  const [counts, setCounts] = useState([0, 0]);
  const sectionRef = useRef(null);
  const imageRef = useRef(null);

  // Animating numbers on component load
  useEffect(() => {
    const newCounts = aboutItems.map(item => item.number);
    let currentCounts = [0, 0];
    
    const interval = setInterval(() => {
      currentCounts = currentCounts.map((val, idx) => Math.min(val + (newCounts[idx] > 100 ? 5 : 1), newCounts[idx]));
      setCounts([...currentCounts]);

      if (currentCounts.every((val, idx) => val === newCounts[idx])) {
        clearInterval(interval);
      }
    }, 20);
    
    return () => clearInterval(interval);
  }, []);

  useGSAP(() => {
    // Text elements animation
    const elements = gsap.utils.toArray('.reveal-up', sectionRef.current);
    elements.forEach((el, index) => {
      gsap.fromTo(
        el,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: index * 0.1,
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            once: true,
          },
        }
      );
    });

    // Image animation
    if (imageRef.current) {
      gsap.fromTo(
        imageRef.current,
        { scale: 0.8, opacity: 0, rotate: -5 },
        {
          scale: 1,
          opacity: 1,
          rotate: 0,
          duration: 1.2,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: imageRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      );
    }

    // Stats animation
    const statsItems = gsap.utils.toArray('.stat-item');
    gsap.fromTo(
      statsItems,
      { scale: 0.8, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        stagger: 0.2,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: statsItems[0],
          start: 'top 80%',
          once: true,
        },
      }
    );
  }, { scope: sectionRef });

  return (
    <section id="about" ref={sectionRef} className="py-20 grid-pattern">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 reveal-up">
            About <span className="text-gradient">Me</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6 reveal-up"></div>
          <p className="text-center text-gray-400 max-w-2xl reveal-up">
            Final-year Electrical Engineering student with a passion for software development and cloud technologies.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 reveal-up">
            <p className="text-lg mb-6 text-gray-300">
              Results-driven final-year Electrical Engineering student at MNIT Jaipur with hands-on experience in full-stack development and DevOps practices.
            </p>
            <p className="text-lg mb-6 text-gray-300">
              Demonstrated expertise through development of production-ready applications using MERN stack and modern cloud technologies. Proficient in AWS services, containerization, and infrastructure automation.
            </p>
            
            <div className="mb-8 reveal-up">
              <h3 className="text-xl font-semibold mb-4 relative inline-block">
                Quick Facts
                <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-transparent"></span>
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">
                {[
                  'Full-Stack Developer',
                  'DevOps Enthusiast',
                  'Technical Writer at Hashnode',
                  'MNIT Jaipur Student'
                ].map((fact, index) => (
                  <li key={index} className="flex items-center group">
                    <span className="text-blue-500 mr-2 transition-transform duration-300 group-hover:translate-x-1">▹</span> 
                    <span className="transition-colors duration-300 group-hover:text-white">{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex flex-wrap gap-4 mt-8 reveal-up">
              {aboutItems.map(({ label, number, icon }, key) => (
                <div key={key} className="stat-item glass py-4 px-6 rounded-xl flex items-center space-x-4 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
                  <div className="p-3 rounded-lg bg-blue-500/10 text-blue-500">
                    {icon}
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white">{counts[key]}+</div>
                    <p className="text-gray-400 text-sm">{label}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 reveal-up">
              <a 
                href="#contact" 
                className="group inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium shadow-lg transition-all duration-300 hover:shadow-blue-500/30 hover:scale-105"
              >
                Get In Touch
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
          
          <div className="order-1 md:order-2 flex justify-center">
            <div ref={imageRef} className="relative">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-blue-500/30 p-2">
                <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-2xl font-bold text-white">
                  <span>Abhishek Singh</span>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-blue-500 animate-pulse-slow"></div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full bg-purple-500 animate-float"></div>
              <div className="absolute top-1/4 -left-6 w-4 h-4 rounded-full bg-green-500 animate-bounce-slow"></div>
              <div className="absolute bottom-1/4 -right-8 w-5 h-5 rounded-full bg-yellow-500 animate-pulse-slow"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
