import React, { useState } from 'react';
import PropTypes from 'prop-types';

const SkillCard = ({ title, items, icon, accentColor, description }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(85 + Math.random() * 10);
    }, 300);
    return () => clearTimeout(timer);
  }, []);
  
  // Create a lighter version of the accent color for the gradient
  const lightenColor = (color, percent) => {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return `#${(
      0x1000000 +
      (R < 255 ? (R < 0 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 0 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 0 ? 0 : B) : 255)
    ).toString(16).slice(1)}`;
  };
  
  const lightColor = lightenColor(accentColor, 60);
  const darkColor = lightenColor(accentColor, -20);

  return (
    <div 
      className="skill-card relative overflow-hidden rounded-xl transition-all duration-300 h-full group cursor-pointer"
      style={{
        background: `linear-gradient(145deg, rgba(17, 17, 17, 0.9), rgba(24, 24, 27, 0.8))`,
        border: `1px solid ${isHovered ? accentColor + '40' : 'rgba(63, 63, 70, 0.4)'}`,
        boxShadow: isHovered ? `0 12px 40px -12px ${accentColor}40, 0 0 0 1px ${accentColor}20` : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'none'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Color accent with animation */}
      <div 
        className="absolute top-0 left-0 w-full h-1 transition-all duration-500"
        style={{
          background: isHovered 
            ? `linear-gradient(90deg, ${darkColor}, ${accentColor}, ${lightColor}, ${accentColor}, ${darkColor})` 
            : accentColor,
          opacity: isHovered ? 1 : 0.7,
          backgroundSize: isHovered ? '200% 100%' : '100% 100%',
          animation: isHovered ? 'shimmer 2s linear infinite' : 'none'
        }}
      ></div>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
      
      {/* Background decorative elements */}
      <div 
        className="absolute bottom-0 right-0 w-24 h-24 rounded-full transition-all duration-300"
        style={{
          background: `radial-gradient(circle, ${accentColor}10 0%, transparent 70%)`,
          transform: isHovered ? 'scale(1.5)' : 'scale(1)',
          opacity: isHovered ? 0.8 : 0.3
        }}
      ></div>
      <div 
        className="absolute top-1/2 left-0 w-16 h-16 rounded-full blur-xl transition-all duration-500"
        style={{
          background: `radial-gradient(circle, ${accentColor}15 0%, transparent 70%)`,
          transform: isHovered ? 'translate(-25%, -50%) scale(1.2)' : 'translate(-50%, -50%) scale(0.8)',
          opacity: isHovered ? 0.6 : 0
        }}
      ></div>
      
      {/* Card content */}
      <div className="p-6 relative z-10">
        {/* Header with icon */}
        <div className="flex items-center mb-4">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center mr-3 transition-all duration-300"
            style={{
              background: isHovered ? `${accentColor}20` : 'rgba(39, 39, 42, 0.8)',
              border: `1px solid ${isHovered ? accentColor + '40' : 'rgba(63, 63, 70, 0.4)'}`
            }}
          >
            <img src={icon} alt={title} className="w-5 h-5" />
          </div>
          <h3 
            className="text-lg font-semibold transition-colors duration-300 flex-1 leading-tight"
            style={{ color: isHovered ? accentColor : '#fff' }}
          >
            {title}
          </h3>
	  </div>
        
        {/* Description */}
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{description}</p>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-500">Proficiency</span>
            <span className="text-xs font-semibold" style={{ color: accentColor }}>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${accentColor}, ${lightenColor(accentColor, 40)})`,
                boxShadow: isHovered ? `0 0 10px ${accentColor}60` : 'none'
              }}
            ></div>
          </div>
        </div>
        
        {/* Skills list */}
        <div className="flex flex-wrap gap-2 mt-3">
          {items.map((item, index) => (
            <span 
              key={index}
              className="inline-flex items-center text-xs px-2.5 py-1 rounded-md transition-all duration-300"
              style={{
                background: isHovered ? `${accentColor}15` : 'rgba(39, 39, 42, 0.8)',
                border: `1px solid ${isHovered ? accentColor + '25' : 'rgba(63, 63, 70, 0.4)'}`,
                color: isHovered ? lightColor : '#e4e4e7'
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

SkillCard.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  icon: PropTypes.string.isRequired,
  accentColor: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};

export default SkillCard;