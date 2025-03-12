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
  
  return (
    <div 
      className={`project-card group relative overflow-hidden rounded-xl transition-all duration-300 h-full ${featured ? 'shadow-xl' : 'shadow-lg'}`}
      style={{
        backgroundColor: 'rgba(17, 24, 39, 0.7)',
        backdropFilter: 'blur(8px)',
        transform: isHovered ? 'translateY(-5px)' : 'none'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Category badge */}
      <div className="absolute top-4 left-4 z-10">
        <div className="px-3 py-1 text-xs rounded-full bg-blue-600/80 text-white backdrop-blur-sm">
          {category}
        </div>
      </div>
      
      {/* Project image */}
      <div 
        className={`relative overflow-hidden ${featured ? 'h-60' : 'h-48'}`}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500"
          style={{ 
            backgroundImage: `url(${image})`,
            transform: isHovered ? 'scale(1.05)' : 'scale(1)'
          }}
        />
        <div 
          className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-80"
        />
      </div>
      
      {/* Content */}
      <div className="p-6 relative">
        <h3 
          className="text-xl font-bold mb-2 text-white group-hover:text-blue-400 transition-colors"
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
              className="px-2 py-1 text-xs rounded-md text-blue-300 border border-blue-500/20 bg-blue-900/20"
            >
              {tag}
            </span>
          ))}
          {tags.length > (featured ? 5 : 3) && (
            <span className="px-2 py-1 text-xs rounded-md text-blue-200 border border-blue-500/20 bg-blue-900/20">
              +{tags.length - (featured ? 5 : 3)} more
            </span>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-3">
          <a 
            href={demoLink} 
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-4 py-2 text-center rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-sm hover:shadow-blue-600/20 hover:shadow-md"
          >
            Live Demo
          </a>
          <a 
            href={githubLink}
            target="_blank"
            rel="noopener noreferrer" 
            className="flex-1 px-4 py-2 text-center rounded-md bg-gray-700 text-white font-medium hover:bg-gray-600 transition-colors shadow-sm"
          >
            <div className="flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="mr-2">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
              </svg>
              Code
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
