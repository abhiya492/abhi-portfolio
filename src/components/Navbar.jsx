import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';

const Navbar = ({ toggle3D, setToggle3D }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('home');
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }

      // Update active section based on scroll position
      const sections = ['home', 'about', 'skills', 'work', 'contact'];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (!element) return false;
        
        const rect = element.getBoundingClientRect();
        return rect.top <= 150 && rect.bottom >= 150;
      });

      if (currentSection) {
        setActiveLink(currentSection);
      }
    };

    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    // Prevent body scrolling when menu is open
    document.body.style.overflow = mobileMenuOpen ? 'auto' : 'hidden';
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    document.body.style.overflow = 'auto';
  };

  const handleNavClick = (sectionId) => {
    setActiveLink(sectionId);
    closeMobileMenu();
    
    // Smooth scroll to section
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

    return (
    <nav 
      ref={navRef}
      className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled 
          ? 'py-2 navbar-glass' 
          : 'py-4 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <a 
            href="#home" 
            className="text-white text-xl font-bold flex items-center transition-transform hover:scale-105"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('home');
            }}
          >
            <span className="text-gradient">Abhi</span>
            <span className="logo-box bg-blue-600 text-white px-2 py-0.5 rounded ml-1">Dev</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {[
              { id: 'home', label: 'Home' },
              { id: 'about', label: 'About' },
              { id: 'skills', label: 'Skills' },
              { id: 'work', label: 'Projects' },
              { id: 'contact', label: 'Contact' }
            ].map(item => (
              <a 
                key={item.id}
                href={`#${item.id}`}
                className={`nav-item relative px-2 py-1 text-sm font-medium transition-colors ${
                  activeLink === item.id 
                    ? 'active text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.id);
                }}
              >
                {item.label}
                {activeLink === item.id && (
                  <span className="active-indicator" />
                )}
                </a>
            ))}
            
            {/* 3D Toggle Button */}
            <button 
              onClick={() => setToggle3D(!toggle3D)}
              className={`toggle-3d flex items-center px-3 py-1.5 rounded-full text-sm transition-all duration-300 ${
                toggle3D 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
                <path d="M12.5 8.9l1.5 1.5 3.5-3.5V2.1H13v5.2zm6.9 9.5l-3.5 3.5 1.5 1.5 3.5-3.5v-5.8h-4.7l3.2 4.3zM4.6 4.6L1 8.2v5.8h4.7L2.5 9.7 1 8.2l3.6-3.6zm8.9 10.4l-1.5-1.5-3.5 3.5v4.8h4.5v-5.2z" />
              </svg>
              <span>{toggle3D ? '3D On' : '3D Off'}</span>
            </button>
            
            {/* Resume Button */}
            <a 
              href="https://drive.google.com/file/d/1m1TjIE0A5E7cz6LfCk6AYR_Bz5GRmDvx/view?usp=sharing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white text-sm px-4 py-2 rounded-md transition-all duration-300 transform hover:scale-105 flex items-center"
            >
              <span>Resume</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-2">
                <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clipRule="evenodd" />
              </svg>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white focus:outline-none z-50" 
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <div className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}>
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`mobile-menu-overlay ${mobileMenuOpen ? 'active' : ''}`}
        onClick={closeMobileMenu}
      ></div>

      {/* Mobile Menu */}
      <div 
        className={`fixed md:hidden inset-0 bg-black/95 backdrop-blur-lg z-40 transition-all duration-500 ease-in-out transform ${
          mobileMenuOpen 
            ? 'translate-x-0 opacity-100' 
            : 'translate-x-full opacity-0'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8 p-4">
          {[
            { id: 'home', label: 'Home' },
            { id: 'about', label: 'About' },
            { id: 'skills', label: 'Skills' },
            { id: 'work', label: 'Projects' },
            { id: 'contact', label: 'Contact' }
          ].map((item, index) => (
            <a 
              key={item.id}
              href={`#${item.id}`}
              className={`mobile-nav-item ${mobileMenuOpen ? 'visible' : ''} text-2xl font-bold ${
                activeLink === item.id 
                  ? 'text-white' 
                  : 'text-gray-400'
              } transition-all duration-300 hover:text-white`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.id);
              }}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              {item.label}
            </a>
          ))}
          
          <div className="flex flex-col items-center space-y-4 mt-4">
            {/* 3D Toggle Button */}
            <button 
              onClick={() => {
                setToggle3D(!toggle3D);
              }}
              className={`mobile-nav-item ${mobileMenuOpen ? 'visible' : ''} toggle-3d flex items-center px-4 py-2 rounded-full transition-colors ${
                toggle3D 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white' 
                  : 'bg-gray-800 text-gray-300'
              }`}
              style={{ transitionDelay: '250ms' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                <path d="M12.5 8.9l1.5 1.5 3.5-3.5V2.1H13v5.2zm6.9 9.5l-3.5 3.5 1.5 1.5 3.5-3.5v-5.8h-4.7l3.2 4.3zM4.6 4.6L1 8.2v5.8h4.7L2.5 9.7 1 8.2l3.6-3.6zm8.9 10.4l-1.5-1.5-3.5 3.5v4.8h4.5v-5.2z" />
              </svg>
              <span>{toggle3D ? '3D Enabled' : '3D Disabled'}</span>
            </button>
            
            {/* Resume Button */}
            <a 
              href="https://drive.google.com/file/d/1m1TjIE0A5E7cz6LfCk6AYR_Bz5GRmDvx/view?usp=sharing" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`mobile-nav-item ${mobileMenuOpen ? 'visible' : ''} bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 py-3 rounded-md w-full text-center transition-all duration-300`}
              style={{ transitionDelay: '300ms' }}
            >
              View Resume
            </a>
          </div>
        </div>
      </div>
        </nav>
    );
};

export default Navbar;
