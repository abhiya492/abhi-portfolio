import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadFont, loadTexture } from '../../utils/three-utils';
import PropTypes from 'prop-types';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

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
  // State for fonts
  const [fonts, setFonts] = useState({
    defaultFont: null,
    loaded: false,
    error: false
  });
  
  // State for common textures
  const [textures, setTextures] = useState({
    noiseTexture: null,
    particleTexture: null,
    loaded: false
  });
  
  // Device capability detection
  const [deviceCapability, setDeviceCapability] = useState({
    isMobile: false,
    hasWebGL2: false,
    pixelRatio: 1,
    performanceLevel: 'medium' // 'low', 'medium', 'high'
  });
  
  // Quality settings based on device capability
  const [qualitySettings, setQualitySettings] = useState({
    particleCount: 1000,
    shadowResolution: 1024,
    antialiasing: true,
    maxLights: 4
  });
  
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
  
  // Detect device capabilities
  useEffect(() => {
    // Check if mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
      || window.innerWidth < 768;
    
    // Check WebGL2 support
    const hasWebGL2 = !!window.WebGL2RenderingContext;
    
    // Get pixel ratio (limited to 2 for performance)
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    
    // Determine performance level based on device info
    let performanceLevel = 'medium';
    
    if (isMobile || pixelRatio < 1.5) {
      performanceLevel = 'low';
    } else if (hasWebGL2 && pixelRatio >= 2) {
      performanceLevel = 'high';
    }
    
    // Update device capability state
    setDeviceCapability({
      isMobile,
      hasWebGL2,
      pixelRatio,
      performanceLevel
    });
    
    // Set quality settings based on performance level
    const qualityMap = {
      low: {
        particleCount: 500,
        shadowResolution: 512,
        antialiasing: false,
        maxLights: 2
      },
      medium: {
        particleCount: 1000,
        shadowResolution: 1024,
        antialiasing: true,
        maxLights: 4
      },
      high: {
        particleCount: 2000,
        shadowResolution: 2048,
        antialiasing: true,
        maxLights: 8
      }
    };
    
    setQualitySettings(qualityMap[performanceLevel]);
  }, []);
  
  // Load common fonts
  useEffect(() => {
    // List of fonts to try (in order of preference)
    const fontUrls = [
      'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
      'https://threejs.org/examples/fonts/helvetiker_bold.typeface.json',
      '/fonts/inter-bold.json' // Local fallback
    ];
    
    let isMounted = true;
    let loadedFont = null;
    
    const loadFonts = async () => {
      // Try each font in order until one loads successfully
      for (const url of fontUrls) {
        try {
          const font = await loadFont(url);
          if (font && isMounted) {
            console.log(`Successfully loaded font from ${url}`);
            loadedFont = font;
            break;
          }
        } catch (error) {
          console.warn(`Failed to load font from ${url}:`, error);
        }
      }
      
      // Update state with results
      if (isMounted) {
        if (loadedFont) {
          setFonts({
            defaultFont: loadedFont,
            loaded: true,
            error: false
          });
        } else {
          console.error('Failed to load any fonts. Using fallbacks.');
          setFonts({
            defaultFont: null,
            loaded: true,
            error: true
          });
          
          // Try to preload Inter web font as fallback
          const link = document.createElement('link');
          link.rel = 'preload';
          link.href = 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZFhjA.woff2';
          link.as = 'font';
          link.type = 'font/woff2';
          link.crossOrigin = 'anonymous';
          document.head.appendChild(link);
          
          setTimeout(() => {
            // Log after timeout to check if font loaded
            console.log('Attempted to preload web font as fallback');
          }, 3000);
        }
      }
    };
    
    loadFonts();
    
    return () => {
      isMounted = false;
    };
  }, []);
  
  // Load common textures
  useEffect(() => {
    let isMounted = true;
    
    const loadTextures = async () => {
      try {
        // Load noise texture
        const noiseTexture = await loadTexture('/textures/noise.jpg', 'noise');
        
        // Load particle texture
        const particleTexture = await loadTexture('/textures/particle.png', 'particle');
        
        if (isMounted) {
          setTextures({
            noiseTexture,
            particleTexture,
            loaded: true
          });
        }
      } catch (error) {
        console.error('Error loading textures:', error);
        // Fallbacks will be used automatically via loadTexture
        if (isMounted) {
          setTextures(prev => ({
            ...prev,
            loaded: true
          }));
        }
      }
    };
    
    loadTextures();
    
    return () => {
      isMounted = false;
    };
  }, []);
  
  // Toggle between dark and light themes
  const toggleTheme = () => {
    setActiveTheme(activeTheme === 'dark' ? 'light' : 'dark');
  };
  
  // Context value
  const contextValue = {
    fonts,
    textures,
    deviceCapability,
    qualitySettings,
    theme: themes[activeTheme],
    toggleTheme
  };
  
  // Show loading screen while resources are loading
  if (!fonts.loaded || !textures.loaded) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-black text-white z-50">
        <h2 className="text-xl mb-4">Loading 3D Resources</h2>
        <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-300" 
            style={{ width: `${fonts.loaded && textures.loaded ? 100 : 0}%` }}
          ></div>
        </div>
        <p className="mt-2">{fonts.loaded && textures.loaded ? '100%' : 'Loading...'}</p>
      </div>
    );
  }
  
  // Show error screen if any required resources failed to load
  if (fonts.error || textures.error) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-black text-white z-50">
        <h2 className="text-xl text-red-500 mb-4">Error Loading Resources</h2>
        <p>{fonts.error || textures.error}</p>
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