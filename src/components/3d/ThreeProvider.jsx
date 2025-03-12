import { createContext, useContext, useEffect, useState } from 'react';
import { loadFont, loadTexture } from '../../utils/three-utils';
import PropTypes from 'prop-types';
import * as THREE from 'three';

// Create context for Three.js resources
const ThreeContext = createContext(null);

// Resources to preload with optional flag
const RESOURCES_TO_PRELOAD = {
  fonts: [
    // These will be loaded if available, but won't cause errors if missing
    { key: 'interBold', url: '/fonts/inter-bold.json', optional: true },
    { key: 'interMedium', url: '/fonts/inter-medium.json', optional: true }
  ],
  textures: [
    { key: 'noise', url: '/textures/noise.jpg', optional: true },
    { key: 'particles', url: '/textures/particle.png', optional: true }
  ]
};

/**
 * Provider component that preloads and manages Three.js resources
 */
export const ThreeProvider = ({ children }) => {
  const [resources, setResources] = useState({ fonts: {}, textures: {} });
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  
  // Color themes for 3D scenes
  const themes = {
    dark: {
      background: '#050505',
      primary: '#4285F4',
      secondary: '#DB4437',
      tertiary: '#0F9D58',
      accent: '#F4B400',
      text: '#ffffff'
    },
    light: {
      background: '#f5f5f5',
      primary: '#1a73e8',
      secondary: '#d93025',
      tertiary: '#188038',
      accent: '#fbbc04',
      text: '#202124'
    }
  };
  
  const [activeTheme, setActiveTheme] = useState('dark');
  
  // Load all resources on mount
  useEffect(() => {
    let isMounted = true;
    const loadResources = async () => {
      try {
        const totalResources = RESOURCES_TO_PRELOAD.fonts.length + RESOURCES_TO_PRELOAD.textures.length;
        let loadedCount = 0;
        
        const loadedFonts = {};
        const loadedTextures = {};
        
        // Load fonts
        for (const font of RESOURCES_TO_PRELOAD.fonts) {
          try {
            loadedFonts[font.key] = await loadFont(font.url);
            loadedCount++;
            if (isMounted) {
              setProgress(Math.floor((loadedCount / totalResources) * 100));
            }
          } catch (err) {
            console.error(`Failed to load font ${font.url}:`, err);
            // Only set error if the resource is not optional
            if (!font.optional && isMounted) {
              setError(`Failed to load required font: ${font.url}`);
            }
          }
        }
        
        // Load textures
        for (const texture of RESOURCES_TO_PRELOAD.textures) {
          try {
            loadedTextures[texture.key] = await loadTexture(texture.url);
            
            // Set texture properties
            if (loadedTextures[texture.key]) {
              loadedTextures[texture.key].colorSpace = THREE.SRGBColorSpace;
              loadedTextures[texture.key].anisotropy = 16;
            }
            
            loadedCount++;
            if (isMounted) {
              setProgress(Math.floor((loadedCount / totalResources) * 100));
            }
          } catch (err) {
            console.error(`Failed to load texture ${texture.url}:`, err);
            // Only set error if the resource is not optional
            if (!texture.optional && isMounted) {
              setError(`Failed to load required texture: ${texture.url}`);
            }
          }
        }
        
        // Set all loaded resources to state
        if (isMounted) {
          setResources({
            fonts: loadedFonts,
            textures: loadedTextures
          });
        }
      } catch (err) {
        console.error('Failed to load resources:', err);
        if (isMounted) {
          setError('Failed to load required resources');
        }
      } finally {
        // Use timeout to prevent flash on fast loads
        setTimeout(() => {
          if (isMounted) {
            setIsLoading(false);
          }
        }, 500);
      }
    };
    
    // Set a timeout to avoid blocking the UI indefinitely if loading takes too long
    const timeoutId = setTimeout(() => {
      if (isMounted && isLoading) {
        setIsLoading(false);
        console.warn('Resource loading timeout exceeded, continuing anyway');
      }
    }, 10000); // 10 seconds timeout
    
    loadResources();
    
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, []);
  
  // Toggle between dark and light themes
  const toggleTheme = () => {
    setActiveTheme(activeTheme === 'dark' ? 'light' : 'dark');
  };
  
  // Context value
  const contextValue = {
    resources,
    isLoading,
    progress,
    error,
    theme: themes[activeTheme],
    toggleTheme
  };
  
  // Show loading screen while resources are loading
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-black text-white z-50">
        <h2 className="text-xl mb-4">Loading 3D Resources</h2>
        <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-300" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="mt-2">{progress}%</p>
      </div>
    );
  }
  
  // Show error screen if any required resources failed to load
  if (error) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-black text-white z-50">
        <h2 className="text-xl text-red-500 mb-4">Error Loading Resources</h2>
        <p>{error}</p>
        <button 
          className="mt-6 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }
  
  return (
    <ThreeContext.Provider value={contextValue}>
      {children}
    </ThreeContext.Provider>
  );
};

ThreeProvider.propTypes = {
  children: PropTypes.node.isRequired
};

/**
 * Custom hook to access the Three.js context
 */
export const useThreeContext = () => {
  const context = useContext(ThreeContext);
  if (!context) {
    throw new Error('useThreeContext must be used within a ThreeProvider');
  }
  return context;
}; 