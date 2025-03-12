import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

// Cache for loaded resources to avoid redundant loading
const fontCache = new Map();
const textureCache = new Map();

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
      (error) => reject(new Error(`Error loading font ${url}: ${error.message}`))
    );
  });
};

/**
 * Load a texture
 * @param {string} url - URL of the texture image
 * @returns {Promise<Texture>} - Loaded texture
 */
export const loadTexture = (url) => {
  // Use cache if available
  if (textureCache.has(url)) {
    return Promise.resolve(textureCache.get(url));
  }
  
  return new Promise((resolve, reject) => {
    const loader = new THREE.TextureLoader();
    loader.load(
      url,
      (texture) => {
        // Set texture properties for better quality
        texture.needsUpdate = true;
        
        // Store in cache
        textureCache.set(url, texture);
        resolve(texture);
      },
      undefined, // onProgress not used
      (error) => reject(new Error(`Error loading texture ${url}: ${error.message}`))
    );
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
  return new TextGeometry(text, {
    font,
    ...mergedOptions
  });
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
    ...options.renderer
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
  return new THREE.MeshStandardMaterial(mergedOptions);
};

/**
 * Create an ambient light and a directional light with shadows
 * @param {THREE.Scene} scene - The scene to add lights to
 */
export const addStandardLighting = (scene) => {
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