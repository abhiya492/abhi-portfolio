import './About.css';

import { useEffect, useState } from 'react';

const aboutItems = [
    {
      label: 'Projects Done',
      number: 45
    },
    {
      label: 'Years of Experience',
      number: 1
    }
];

const About = () => {
  const [counts, setCounts] = useState([0, 0]);

  // Animating numbers on component load
  useEffect(() => {
    const newCounts = aboutItems.map(item => item.number);
    let currentCounts = [0, 0];
    
    const interval = setInterval(() => {
      currentCounts = currentCounts.map((val, idx) => Math.min(val + 1, newCounts[idx]));
      setCounts([...currentCounts]);

      if (currentCounts.every((val, idx) => val === newCounts[idx])) {
        clearInterval(interval);
      }
    }, 50);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="about" className="section py-16 bg-gradient-to-r from-gray-800 via-gray-900 to-black">
      <div className="container mx-auto px-4">
        <div className="bg-zinc-800/60 p-8 rounded-xl shadow-lg md:p-12 custom-shadow">
          <p className="text-zinc-300 mb-6 text-lg leading-relaxed md:mb-10 md:text-xl md:max-w-[60ch]">
            I am a passionate full-stack developer with expertise in JavaScript, React, Node.js, and MongoDB. I thrive on tackling new challenges and enjoy collaborating with others on exciting projects...
          </p>
          <div className="flex flex-wrap items-center gap-6 md:gap-8">
            {aboutItems.map(({ label }, key) => (
              <div key={key} className="text-center about-number">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-4xl font-bold text-white md:text-5xl animate-number">{counts[key]}</span>
                  <span className="text-sky-400 font-bold text-3xl md:text-4xl">+</span>
                </div>
                <p className="text-zinc-400 text-sm md:text-base">{label}</p>
              </div>
            ))}
            <img
              src="/images/logo.svg"
              alt="Logo"
              width={40}
              height={40}
              className="ml-auto md:w-[50px] md:h-[50px] logo-hover-effect"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
