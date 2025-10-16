import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

const Navbar = ({ toggle3D, setToggle3D }) => {
  const { isDark, toggleTheme } = useTheme();
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
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'py-3 navbar-glass shadow-lg' 
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <a 
            href="#home" 
            className="text-white text-xl font-bold flex items-center transition-all duration-300 hover:scale-105 group"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('home');
            }}
          >
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-purple-400 transition-all duration-300">Abhi</span>
            <span className="logo-box bg-gradient-to-r from-blue-600 to-blue-500 text-white px-2 py-1 rounded-md ml-2 shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300">Dev</span>
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
                className={`nav-item relative px-3 py-2 text-sm font-medium transition-all duration-300 rounded-lg ${
                  activeLink === item.id 
                    ? 'active text-white bg-white/10 backdrop-blur-sm' 
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
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
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-800/80 backdrop-blur-sm text-gray-300 hover:bg-gray-700/80 hover:text-white border border-gray-700 transition-all duration-300"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            
            {/* 3D Toggle Button */}
            <button 
              onClick={() => setToggle3D(!toggle3D)}
              className={`toggle-3d flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl ${
                toggle3D 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-blue-500/30 hover:shadow-blue-500/50' 
                  : 'bg-gray-800/80 backdrop-blur-sm text-gray-300 hover:bg-gray-700/80 hover:text-white border border-gray-700'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
                <path d="M12.5 8.9l1.5 1.5 3.5-3.5V2.1H13v5.2zm6.9 9.5l-3.5 3.5 1.5 1.5 3.5-3.5v-5.8h-4.7l3.2 4.3zM4.6 4.6L1 8.2v5.8h4.7L2.5 9.7 1 8.2l3.6-3.6zm8.9 10.4l-1.5-1.5-3.5 3.5v4.8h4.5v-5.2z" />
              </svg>
              <span>{toggle3D ? '3D On' : '3D Off'}</span>
            </button>
            
            {/* Resume Button */}
            <a 
              href="https://drive.google.com/file/d/1VD26rCHHFMQpmr_qZ5JpzqszqPvTUaCI/view?usp=sharing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 flex items-center shadow-lg hover:shadow-xl hover:shadow-blue-500/30 group"
            >
              <span>Resume</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5">
                <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clipRule="evenodd" />
              </svg>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white focus:outline-none z-50 p-2 rounded-lg hover:bg-white/10 transition-all duration-300" 
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <div className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}>
              <span className="bar bg-white"></span>
              <span className="bar bg-white"></span>
              <span className="bar bg-white"></span>
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
        className={`fixed md:hidden inset-0 bg-gradient-to-br from-black/95 via-gray-900/95 to-black/95 backdrop-blur-xl z-40 transition-all duration-500 ease-in-out transform ${
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
                  ? 'text-white bg-gradient-to-r from-blue-600/20 to-purple-600/20 px-6 py-2 rounded-lg backdrop-blur-sm border border-blue-500/30' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5 px-6 py-2 rounded-lg'
              } transition-all duration-300`}
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
              className={`mobile-nav-item ${mobileMenuOpen ? 'visible' : ''} toggle-3d flex items-center px-6 py-3 rounded-full transition-all duration-300 shadow-lg ${
                toggle3D 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-blue-500/30' 
                  : 'bg-gray-800/80 backdrop-blur-sm text-gray-300 border border-gray-700'
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
              href="https://drive.google.com/file/d/1VD26rCHHFMQpmr_qZ5JpzqszqPvTUaCI/view?usp=sharing" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`mobile-nav-item ${mobileMenuOpen ? 'visible' : ''} bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg w-full text-center transition-all duration-300 shadow-lg hover:shadow-xl font-medium`}
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
