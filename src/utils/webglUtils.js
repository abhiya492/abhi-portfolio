import { useState, useEffect } from 'react';

/**
 * Hook to detect WebGL support
 * @returns {boolean} - Whether WebGL is supported
 */
export const useDetectWebGL = () => {
  const [isSupported, setIsSupported] = useState(null);
  
  useEffect(() => {
    // Check for WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || 
                canvas.getContext('experimental-webgl');
      
      setIsSupported(!!gl);
    } catch (e) {
      console.error('Error detecting WebGL support:', e);
      setIsSupported(false);
    }
  }, []);
  
  return isSupported;
};

/**
 * Detect the user's device capability for 3D rendering
 * @returns {string} - 'high', 'medium', or 'low'
 */
export const useDetectDeviceCapability = () => {
  const [capability, setCapability] = useState('medium');
  
  useEffect(() => {
    // Simple heuristic for device capability
    const detectCapability = () => {
      // Check for mobile
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      
      // Get pixel ratio as a factor
      const pixelRatio = window.devicePixelRatio || 1;
      
      // Get rough estimate of GPU power based on canvas performance
      let gpuPower = 'medium';
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 1000;
        canvas.height = 1000;
        const ctx = canvas.getContext('2d');
        
        // Measure time to draw complex shapes
        const startTime = performance.now();
        const iterations = 1000;
        
        for (let i = 0; i < iterations; i++) {
          ctx.clearRect(0, 0, 1000, 1000);
          ctx.beginPath();
          ctx.arc(500, 500, 400, 0, 2 * Math.PI);
          ctx.fill();
          ctx.beginPath();
          ctx.rect(100, 100, 800, 800);
          ctx.stroke();
        }
        
        const endTime = performance.now();
        const timePerOperation = (endTime - startTime) / iterations;
        
        // Classify performance
        if (timePerOperation < 0.05) {
          gpuPower = 'high';
        } else if (timePerOperation > 0.2) {
          gpuPower = 'low';
        }
      } catch (e) {
        console.warn('Error detecting GPU power:', e);
      }
      
      // Determine overall capability
      if (isMobile) {
        if (gpuPower === 'low' || pixelRatio < 2) {
          return 'low';
        }
        return 'medium';
      } else {
        if (gpuPower === 'high' && pixelRatio >= 2) {
          return 'high';
        } else if (gpuPower === 'low') {
          return 'medium';
        }
        return gpuPower;
      }
    };
    
    setCapability(detectCapability());
  }, []);
  
  return capability;
};

/**
 * Check if the browser supports the WebGL features required for advanced effects
 * @returns {Object} - Object containing support info for various WebGL features
 */
export const detectAdvancedWebGLSupport = () => {
  const result = {
    webgl2: false,
    floatTextures: false,
    shaderTextureLOD: false,
    anisotropicFiltering: false,
    instancedArrays: false,
  };
  
  try {
    // Check WebGL2 support
    const canvas = document.createElement('canvas');
    const gl2 = canvas.getContext('webgl2');
    result.webgl2 = !!gl2;
    
    // If WebGL2 is supported, we can use most advanced features
    if (gl2) {
      result.floatTextures = true;
      result.shaderTextureLOD = true;
      result.instancedArrays = true;
      
      // Check anisotropic filtering
      const ext = gl2.getExtension('EXT_texture_filter_anisotropic');
      result.anisotropicFiltering = !!ext;
    } else {
      // Try WebGL1 with extensions
      const gl1 = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (gl1) {
        // Check float textures
        result.floatTextures = !!(
          gl1.getExtension('OES_texture_float') || 
          gl1.getExtension('OES_texture_half_float')
        );
        
        // Check shader texture LOD
        result.shaderTextureLOD = !!gl1.getExtension('EXT_shader_texture_lod');
        
        // Check instanced arrays
        result.instancedArrays = !!gl1.getExtension('ANGLE_instanced_arrays');
        
        // Check anisotropic filtering
        const ext = gl1.getExtension('EXT_texture_filter_anisotropic');
        result.anisotropicFiltering = !!ext;
      }
    }
  } catch (e) {
    console.error('Error detecting advanced WebGL support:', e);
  }
  
  return result;
};

/**
 * Get a recommended quality preset based on device capabilities
 * @returns {Object} - Quality settings for 3D rendering
 */
export const getRecommendedQualitySettings = () => {
  const webglSupport = useDetectWebGL();
  const deviceCapability = useDetectDeviceCapability();
  const advancedSupport = detectAdvancedWebGLSupport();
  
  // Default low quality settings
  const settings = {
    particleCount: 100,
    shadowQuality: 'off',
    textureSize: 512,
    antialiasing: false,
    physicsQuality: 'low',
    maxLights: 2,
    postProcessing: false,
    resolution: 1,
  };
  
  // No WebGL, return minimal settings
  if (!webglSupport) {
    return settings;
  }
  
  // Adjust based on device capability
  switch (deviceCapability) {
    case 'high':
      settings.particleCount = 1000;
      settings.shadowQuality = 'high';
      settings.textureSize = 2048;
      settings.antialiasing = true;
      settings.physicsQuality = 'high';
      settings.maxLights = 8;
      settings.postProcessing = true;
      settings.resolution = window.devicePixelRatio || 1;
      break;
      
    case 'medium':
      settings.particleCount = 500;
      settings.shadowQuality = 'medium';
      settings.textureSize = 1024;
      settings.antialiasing = true;
      settings.physicsQuality = 'medium';
      settings.maxLights = 4;
      settings.postProcessing = advancedSupport.webgl2;
      settings.resolution = Math.min(window.devicePixelRatio || 1, 1.5);
      break;
      
    case 'low':
    default:
      // Already set to low
      break;
  }
  
  // Further adjust based on specific WebGL features
  if (!advancedSupport.floatTextures) {
    settings.postProcessing = false;
  }
  
  if (!advancedSupport.instancedArrays) {
    settings.particleCount = Math.min(settings.particleCount, 200);
  }
  
  return settings;
}; 