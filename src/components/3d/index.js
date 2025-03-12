// Export all 3D components from a single file for easier imports

// 3D Provider and Context
export { default as ThreeProvider, useThreeContext } from './ThreeProvider';

// Hero Scene 3D Component
export { default as HeroScene } from './HeroScene';

// Interactive Skills Globe
export { default as SkillsGlobe } from './SkillsGlobe';

// WebGL Shader Backgrounds
export { default as ShaderBackground } from './ShaderBackground';

// Interactive 3D Text for Headers
export { default as InteractiveText3D } from './InteractiveText3D';

// Physics-based Project Showcase
export { default as PhysicsProjectShowcase } from './PhysicsProjectShowcase';

// Demo Section that showcases all 3D features
export { default as ThreeDemoSection } from './ThreeDemoSection';

// Helper utilities
export * from '../utils/three-utils';

// WebGL detection and device capability utilities
export { 
  useDetectWebGL, 
  useDetectDeviceCapability, 
  detectAdvancedWebGLSupport,
  getRecommendedQualitySettings
} from '../utils/webglUtils';

/**
 * Easy integration guide:
 * 
 * 1. Wrap your app with ThreeProvider to provide 3D context:
 *    
 *    import { ThreeProvider } from './components/3d';
 *    
 *    function App() {
 *      return (
 *        <ThreeProvider>
 *          <YourComponents />
 *        </ThreeProvider>
 *      );
 *    }
 * 
 * 2. Use individual components in your sections:
 * 
 *    import { ShaderBackground, InteractiveText3D } from './components/3d';
 *    
 *    function YourSection() {
 *      return (
 *        <div className="relative h-screen">
 *          <ShaderBackground shader="particles" />
 *          <div className="relative z-10">
 *            <InteractiveText3D text="Your Heading" />
 *            <p>Your content here</p>
 *          </div>
 *        </div>
 *      );
 *    }
 * 
 * 3. Or use the demo section to showcase all features:
 * 
 *    import { ThreeDemoSection } from './components/3d';
 *    
 *    function YourPage() {
 *      return (
 *        <div>
 *          <OtherSections />
 *          <ThreeDemoSection 
 *            title="My 3D Skills"
 *            subtitle="Explore my interactive portfolio features"
 *          />
 *        </div>
 *      );
 *    }
 */ 