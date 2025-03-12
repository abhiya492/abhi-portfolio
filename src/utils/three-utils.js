import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

// Cache for loaded resources to avoid redundant loading
const fontCache = new Map();
const textureCache = new Map();

// Create fallback textures
const createFallbackTexture = (type = 'noise') => {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  
  if (type === 'noise') {
    // Create noise texture
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const value = Math.floor(Math.random() * 255);
        ctx.fillStyle = `rgb(${value},${value},${value})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  } else if (type === 'particle') {
    // Create particle texture (a simple circle)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Add glow effect
    const gradient = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 0,
      canvas.width / 2, canvas.height / 2, canvas.width / 2
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Default plain texture
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
};

// Create fallback textures for common types
const fallbackTextures = {
  noise: createFallbackTexture('noise'),
  particle: createFallbackTexture('particle'),
  default: createFallbackTexture('default')
};

/**
 * Load a JSON font for use with Text3D
 * @param {string} url - URL of the font JSON file
 * @returns {Promise<Font>} - Loaded font
 */
export const loadFont = (url) => {
  // Use cache if available
  if (fontCache.has(url)) {
    return Promise.resolve(fontCache.get(url));
  }
  
  return new Promise((resolve, reject) => {
    const loader = new FontLoader();
    loader.load(
      url, 
      (font) => {
        fontCache.set(url, font);
        resolve(font);
      },
      undefined, // onProgress not used
      (error) => {
        console.warn(`Error loading font ${url}: ${error.message}. Using system font as fallback.`);
        // Resolve with null to handle fallback in the component
        resolve(null);
      }
    );
  });
};

/**
 * Load a texture
 * @param {string} url - URL of the texture image
 * @param {string} fallbackType - Type of fallback texture to use if loading fails ('noise', 'particle', or 'default')
 * @returns {Promise<Texture>} - Loaded texture
 */
export const loadTexture = (url, fallbackType = 'default') => {
  // Use cache if available
  if (textureCache.has(url)) {
    return Promise.resolve(textureCache.get(url));
  }
  
  return new Promise((resolve) => {
    // Determine fallback texture type from URL if not specified
    if (!fallbackType || fallbackType === 'default') {
      if (url.includes('noise')) fallbackType = 'noise';
      else if (url.includes('particle')) fallbackType = 'particle';
    }
    
    // Get appropriate fallback texture ready
    const fallback = fallbackTextures[fallbackType] || fallbackTextures.default;
    
    // Skip attempt to load if URL is empty or obviously invalid
    if (!url || url === 'undefined' || url === 'null') {
      console.warn('Invalid texture URL. Using fallback texture.');
      textureCache.set(url, fallback);
      return resolve(fallback);
    }
    
    // Try to load the actual texture
    try {
      const loader = new THREE.TextureLoader();
      
      // Set a timeout to prevent hanging forever on texture load
      const timeoutId = setTimeout(() => {
        console.warn(`Texture load timeout for ${url}. Using fallback texture.`);
        textureCache.set(url, fallback);
        resolve(fallback);
      }, 5000); // 5 second timeout
      
      loader.load(
        url,
        (texture) => {
          // Cancel timeout
          clearTimeout(timeoutId);
          
          // Set texture properties for better quality
          texture.needsUpdate = true;
          
          // Store in cache
          textureCache.set(url, texture);
          resolve(texture);
        },
        undefined, // onProgress not used
        (error) => {
          // Cancel timeout
          clearTimeout(timeoutId);
          
          console.warn(`Error loading texture ${url}: ${error.message}. Using fallback texture.`);
          // Use appropriate fallback texture
          textureCache.set(url, fallback); // Cache the fallback to avoid repeated warnings
          resolve(fallback);
        }
      );
    } catch (error) {
      console.error(`Exception while loading texture ${url}: ${error}. Using fallback texture.`);
      textureCache.set(url, fallback);
      resolve(fallback);
    }
  });
};

/**
 * Create color palette for 3D scenes
 * @param {string} baseColor - Base color in hex format (e.g. '#ff0000')
 * @returns {Object} - Object with color variants
 */
export const createColorPalette = (baseColor = '#4285F4') => {
  return {
    main: baseColor,
    light: adjustColorBrightness(baseColor, 20),
    dark: adjustColorBrightness(baseColor, -20),
    darker: adjustColorBrightness(baseColor, -40),
    alpha: (opacity) => `${baseColor}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`
  };
};

/**
 * Adjust color brightness
 * @param {string} hex - Hex color
 * @param {number} percent - Percentage to adjust brightness (-100 to 100)
 * @returns {string} - Adjusted hex color
 */
function adjustColorBrightness(hex, percent) {
  // Remove hash if it exists
  hex = hex.replace(/^#/, '');
  
  // Parse hex to RGB
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);
  
  // Adjust brightness
  r = Math.max(0, Math.min(255, r + (percent / 100) * 255));
  g = Math.max(0, Math.min(255, g + (percent / 100) * 255));
  b = Math.max(0, Math.min(255, b + (percent / 100) * 255));
  
  // Convert back to hex
  return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
}

/**
 * Generate random value within range
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Random value between min and max
 */
export const randomRange = (min, max) => {
  return Math.random() * (max - min) + min;
};

/**
 * Generate a random color 
 * @param {number} minBrightness - Minimum brightness value (0-1)
 * @returns {string} - Random hex color
 */
export const randomColor = (minBrightness = 0.4) => {
  // Generate random RGB with minimum brightness
  const r = Math.floor(Math.random() * 255 * (1 - minBrightness) + 255 * minBrightness);
  const g = Math.floor(Math.random() * 255 * (1 - minBrightness) + 255 * minBrightness);
  const b = Math.floor(Math.random() * 255 * (1 - minBrightness) + 255 * minBrightness);
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

/**
 * Create 3D text geometry
 * @param {string} text - The text to display
 * @param {THREE.Font} font - The loaded font
 * @param {Object} options - Configuration options
 * @returns {THREE.BufferGeometry} - The text geometry
 */
export const createTextGeometry = (text, font, options = {}) => {
  if (!font) {
    console.warn('Font not available for creating text geometry');
    // Return a simple plane geometry as fallback
    return new THREE.PlaneGeometry(text.length * 0.5, 1);
  }
  
  const defaultOptions = {
    size: 0.5,
    height: 0.1,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  try {
    return new TextGeometry(text, {
      font,
      ...mergedOptions
    });
  } catch (error) {
    console.warn(`Error creating text geometry: ${error.message}`);
    // Return a simple plane geometry as fallback
    return new THREE.PlaneGeometry(text.length * 0.5, 1);
  }
};

/**
 * Create a standard material with sensible defaults for 3D text
 * @param {Object} options - Material options
 * @returns {THREE.MeshStandardMaterial} - The created material
 */
export const createTextMaterial = (options = {}) => {
  const defaultOptions = {
    color: 0xffffff,
    metalness: 0.3,
    roughness: 0.4,
    emissive: 0x000000,
    emissiveIntensity: 0.2
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  return new THREE.MeshStandardMaterial(mergedOptions);
};

/**
 * Setup basic Three.js scene with standard settings
 * @returns {Object} - Object containing scene, camera, renderer and other utilities
 */
export const setupBasicScene = (container, options = {}) => {
  if (!container) {
    console.error('Container element is undefined');
    return null;
  }
  
  // Create scene
  const scene = new THREE.Scene();
  
  // Configure camera
  const defaultCameraOptions = {
    fov: 45,
    near: 0.1,
    far: 1000,
    position: [0, 0, 5]
  };
  
  const cameraOptions = { ...defaultCameraOptions, ...options.camera };
  const aspect = container.clientWidth / container.clientHeight;
  const camera = new THREE.PerspectiveCamera(
    cameraOptions.fov,
    aspect,
    cameraOptions.near,
    cameraOptions.far
  );
  
  camera.position.set(...cameraOptions.position);
  
  // Configure renderer
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    ...(options.renderer || {})
  });
  
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);
  
  // Add resize handler
  const handleResize = () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };
  
  window.addEventListener('resize', handleResize);
  
  // Add basic lighting if requested
  if (options.addBasicLighting) {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
  }
  
  // Animation loop function
  const clock = new THREE.Clock();
  
  const animate = (callback) => {
    const elapsedTime = clock.getElapsedTime();
    
    if (callback) {
      callback(elapsedTime);
    }
    
    renderer.render(scene, camera);
    requestAnimationFrame(() => animate(callback));
  };
  
  return {
    scene,
    camera,
    renderer,
    clock,
    animate,
    handleResize,
    cleanup: () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      container.removeChild(renderer.domElement);
    }
  };
};

/**
 * Helper function to create a glowing material
 * @param {Object} options - Material options
 * @returns {THREE.MeshStandardMaterial} - Material with glow effect
 */
export const createGlowMaterial = (options = {}) => {
  const defaultOptions = {
    color: 0x4285F4,
    emissive: 0x4285F4,
    emissiveIntensity: 0.5,
    metalness: 0.2,
    roughness: 0.2
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  // Ensure all color values are valid
  if (typeof mergedOptions.color === 'undefined') mergedOptions.color = 0x4285F4;
  if (typeof mergedOptions.emissive === 'undefined') mergedOptions.emissive = mergedOptions.color;
  
  return new THREE.MeshStandardMaterial(mergedOptions);
};

/**
 * Create an ambient light and a directional light with shadows
 * @param {THREE.Scene} scene - The scene to add lights to
 */
export const addStandardLighting = (scene) => {
  if (!scene) {
    console.error('Scene is undefined');
    return {};
  }
  
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 5, 5);
  directionalLight.castShadow = true;
  
  // Configure shadow properties
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 50;
  directionalLight.shadow.camera.left = -10;
  directionalLight.shadow.camera.right = 10;
  directionalLight.shadow.camera.top = 10;
  directionalLight.shadow.camera.bottom = -10;
  
  scene.add(directionalLight);
  
  return { ambientLight, directionalLight };
};