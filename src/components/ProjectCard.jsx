import React, { useState } from 'react';
import PropTypes from 'prop-types';

const ProjectCard = ({ 
  title, 
  description, 
  image, 
  tags, 
  demoLink, 
  githubLink,
  featured = false,
  category
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  return (
    <div 
      className={`project-card group relative overflow-hidden rounded-xl transition-all duration-500 h-full border ${featured ? 'shadow-2xl' : 'shadow-lg'}`}
      style={{
        backgroundColor: 'rgba(17, 24, 39, 0.8)',
        backdropFilter: 'blur(12px)',
        transform: isHovered ? 'translateY(-10px) scale(1.02)' : 'none',
        borderColor: isHovered ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.05)',
        boxShadow: isHovered ? '0 20px 60px -15px rgba(59, 130, 246, 0.4)' : '0 10px 30px -10px rgba(0, 0, 0, 0.5)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Category badge */}
      <div className="absolute top-4 left-4 z-20">
        <div className="px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white backdrop-blur-sm shadow-lg transition-transform duration-300" style={{ transform: isHovered ? 'scale(1.1)' : 'scale(1)' }}>
          {category}
        </div>
      </div>
      
      {/* Featured badge */}
      {featured && (
        <div className="absolute top-4 right-4 z-20">
          <div className="px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white backdrop-blur-sm shadow-lg flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Featured
          </div>
        </div>
      )}
      
      {/* Project image */}
      <div 
        className={`relative overflow-hidden ${featured ? 'h-60' : 'h-48'}`}
      >
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-600 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
        <img
          src={image}
          alt={title}
          onLoad={() => setImageLoaded(true)}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
          style={{ 
            transform: isHovered ? 'scale(1.1) rotate(1deg)' : 'scale(1)',
            opacity: imageLoaded ? 1 : 0
          }}
        />
        <div 
          className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent transition-opacity duration-500"
          style={{ opacity: isHovered ? 0.95 : 0.8 }}
        />
        
        {/* Hover overlay with info */}
        <div 
          className="absolute inset-0 flex items-center justify-center transition-all duration-500"
          style={{ 
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'scale(1)' : 'scale(0.9)'
          }}
        >
          <div className="text-center px-4">
            <div className="text-white text-sm font-medium mb-2">View Project</div>
            <div className="flex gap-2 justify-center">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6 relative">
        <h3 
          className="text-xl font-bold mb-2 transition-all duration-300"
          style={{
            background: isHovered ? 'linear-gradient(90deg, #3b82f6, #8b5cf6)' : 'none',
            WebkitBackgroundClip: isHovered ? 'text' : 'none',
            WebkitTextFillColor: isHovered ? 'transparent' : '#fff',
            backgroundClip: isHovered ? 'text' : 'none'
          }}
        >
          {title}
        </h3>
        
        <p className={`text-gray-300 mb-4 ${featured ? 'line-clamp-3' : 'line-clamp-2'}`}>
          {description}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.slice(0, featured ? 5 : 3).map((tag, index) => (
            <span 
              key={index}
              className="px-2.5 py-1 text-xs font-medium rounded-md text-blue-300 border border-blue-500/30 bg-blue-900/30 hover:bg-blue-900/50 hover:border-blue-500/50 transition-all duration-300 cursor-default"
            >
              {tag}
            </span>
          ))}
          {tags.length > (featured ? 5 : 3) && (
            <span className="px-2.5 py-1 text-xs font-medium rounded-md text-purple-300 border border-purple-500/30 bg-purple-900/30">
              +{tags.length - (featured ? 5 : 3)}
            </span>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-3">
          <a 
            href={demoLink} 
            target="_blank"
            rel="noopener noreferrer"
            className="group/btn flex-1 px-4 py-2.5 text-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <span>Live Demo</span>
            <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
          <a 
            href={githubLink}
            target="_blank"
            rel="noopener noreferrer" 
            className="group/btn flex-1 px-4 py-2.5 text-center rounded-lg bg-gray-800 border border-gray-700 text-white font-semibold hover:bg-gray-700 hover:border-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="transition-transform group-hover/btn:rotate-12">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
              </svg>
              <span>Code</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

ProjectCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  demoLink: PropTypes.string.isRequired,
  githubLink: PropTypes.string.isRequired,
  featured: PropTypes.bool,
  category: PropTypes.string.isRequired
};

export default ProjectCard;
