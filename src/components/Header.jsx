import React, { useState } from 'react';
import Navbar from './Navbar';
import HeroScene from './3d/HeroScene';

const Header = ({ toggle3D, setToggle3D }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [profileImageError, setProfileImageError] = useState(false);

  return (
    <header id="home" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black">
      {/* Background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-gray-900 z-0"></div>
      
      {/* Noise texture overlay for added depth */}
      <div className="absolute inset-0 opacity-20 bg-noise z-0 pointer-events-none"></div>
      
      {/* Navbar */}
      <Navbar toggle3D={toggle3D} setToggle3D={setToggle3D} />
      
      {/* Content */}
      <div className="container mx-auto px-4 z-10 mt-16 md:mt-20 flex items-center justify-center flex-1">
        <div className="flex flex-col lg:flex-row items-center justify-between max-w-6xl w-full">
          {/* Text Content */}
          <div className="lg:w-1/2 text-center lg:text-left mb-10 lg:mb-0 lg:pr-12">
            <div className="text-sm text-blue-500 font-semibold mb-3 tracking-wider uppercase">Hello, World! I'm</div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Abhishek <span className="text-blue-500">Singh</span>
            </h1>
            <h2 className="text-xl md:text-2xl text-gray-300 mb-6">
              Full-Stack Developer & DevOps Enthusiast
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed">
              Final-year Electrical Engineering student at MNIT Jaipur. Building 
              modern web applications with a focus on performance, scalability, and user experience.
            </p>
            
            {/* Call to action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-5">
              <a 
                href="#contact" 
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-300 text-center w-full sm:w-auto shadow-lg shadow-blue-500/20"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                Contact Me
              </a>
              <a 
                href="#work" 
                className="px-8 py-3 bg-transparent border border-white/20 hover:border-white/50 text-white rounded-md transition-colors duration-300 text-center w-full sm:w-auto backdrop-blur-sm"
              >
                View Projects
              </a>
            </div>
            
            {/* Social Links */}
            <div className="flex items-center justify-center lg:justify-start space-x-5 mt-10">
              <a 
                href="https://github.com/abhiya492" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors group"
                aria-label="GitHub"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16" className="group-hover:scale-110 transition-transform">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                </svg>
              </a>
              <a 
                href="https://www.linkedin.com/in/abhishek-singh-1604b9221" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors group"
                aria-label="LinkedIn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16" className="group-hover:scale-110 transition-transform">
                  <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                </svg>
              </a>
              <a 
                href="https://leetcode.com/u/2021uee1669/"
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors group"
                aria-label="LeetCode"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24" className="group-hover:scale-110 transition-transform">
                  <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
                </svg>
              </a>
            </div>
          </div>
          
          {/* 3D Model Container */}
          <div className="lg:w-1/2 relative h-[300px] md:h-[400px] w-full max-w-lg mx-auto lg:mx-0">
            <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl">
              {toggle3D && <HeroScene isHovered={isHovered} />}
              {!toggle3D && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-gray-900 to-black p-4">
                  {profileImageError ? (
                    <img 
                      src="/images/avatar-1.jpg" 
                      alt="Abhishek Singh" 
                      className="max-h-full max-w-full object-cover rounded-lg shadow-2xl border border-blue-500/30"
                    />
                  ) : (
                    <img 
                      src="/images/profile.png" 
                      alt="Abhishek Singh" 
                      className="max-h-full max-w-full object-cover rounded-lg shadow-2xl border border-blue-500/30"
                      onError={() => setProfileImageError(true)}
                    />
                  )}
                </div>
              )}
              
              {/* Decorative elements for the 3D/image container */}
              <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-blue-500/20 rounded-full blur-xl"></div>
              <div className="absolute -top-2 -left-2 w-20 h-20 bg-blue-600/20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-pulse">
        <span className="text-gray-400 text-sm mb-2">Scroll Down</span>
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center p-1">
          <div className="animate-bounce-slow w-1 h-1 bg-gray-400 rounded-full mt-1"></div>
        </div>
            </div>
        </header>
  );
};

export default Header;