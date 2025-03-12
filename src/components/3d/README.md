# Advanced 3D Components for React Portfolio

This collection of 3D components is designed to enhance your portfolio website with interactive and visually impressive WebGL-powered features. The components use Three.js, React Three Fiber, and various related libraries to create immersive experiences.

## Table of Contents

1. [Installation](#installation)
2. [Components Overview](#components-overview)
3. [Basic Setup](#basic-setup)
4. [Component Usage](#component-usage)
5. [Performance Considerations](#performance-considerations)
6. [Troubleshooting](#troubleshooting)

## Installation

Ensure you have the required dependencies installed:

```bash
npm install three @react-three/fiber @react-three/drei @react-three/cannon react-intersection-observer
```

Or if you're using yarn:

```bash
yarn add three @react-three/fiber @react-three/drei @react-three/cannon react-intersection-observer
```

## Components Overview

This package includes the following components:

1. **ShaderBackground**: Create stunning WebGL shader backgrounds with interactive effects.
2. **InteractiveText3D**: 3D text components for headings with hover and interaction effects.
3. **PhysicsProjectShowcase**: A physics-based project showcase with interactive 3D objects.
4. **ThreeDemoSection**: A comprehensive demo section that showcases all available 3D features.
5. **ThreeProvider**: Context provider that manages loading of 3D assets and fonts.

## Basic Setup

1. Wrap your app with the `ThreeProvider` to provide 3D context:

```jsx
// In your App.jsx or similar file
import { ThreeProvider } from './components/3d';

function App() {
  return (
    <ThreeProvider>
      <YourComponents />
    </ThreeProvider>
  );
}
```

2. Import and use any of the components in your sections:

```jsx
import { ShaderBackground, InteractiveText3D } from './components/3d';

function YourSection() {
  return (
    <div className="relative h-screen">
      <ShaderBackground shader="particles" />
      <div className="relative z-10">
        <InteractiveText3D text="Your Heading" />
        <p>Your content here</p>
      </div>
    </div>
  );
}
```

## Component Usage

### ShaderBackground

A component that creates WebGL shader-based backgrounds:

```jsx
<ShaderBackground 
  shader="particles" // 'particles', 'gradient', or 'wave'
  intensity={1.0} // 0.1 to 2.0 
  speed={0.5} // 0.1 to 1.5
  themeColors={{
    primary: '#4285F4',
    secondary: '#34A853',
    accent1: '#FBBC05',
    accent2: '#EA4335',
    background: '#050a12',
    foreground: '#ffffff'
  }}
  className="custom-class" // Optional additional classes
/>
```

### InteractiveText3D

A component for creating interactive 3D text:

```jsx
<InteractiveText3D
  text="Your 3D Text"
  type="words" // 'single' or 'words'
  height={250} // Height in pixels or other valid CSS unit
  size={0.5} // Size of the 3D text
  color="#4285F4" // Primary color
  secondary="#34A853" // Secondary color (for hover)
  matcapIndex={21} // Material capture texture index
  hoverMatcapIndex={24} // Hover material texture index
  showCursor={true} // Show interactive cursor
  letterSpacing={0} // Letter spacing
  lineHeight={1} // Line height
  wordsPerLine={3} // Words per line (for 'words' type)
  enableControls={true} // Enable interaction controls
  backgroundColor="transparent" // Background color
  className="custom-class" // Additional CSS classes
/>
```

### PhysicsProjectShowcase

A physics-based 3D showcase for your projects:

```jsx
// Define your projects data
const projects = [
  {
    title: "Project Name",
    description: "Project description...",
    image: "/path/to/image.jpg",
    tags: ["React", "Three.js"],
    demoLink: "https://example.com",
    githubLink: "https://github.com/username/project",
    color: "#4285F4" // Color for the 3D object
  },
  // More projects...
];

// Use the component
<PhysicsProjectShowcase projects={projects} />
```

### ThreeDemoSection

A full demo section that showcases all available 3D features:

```jsx
<ThreeDemoSection 
  title="Advanced 3D Features"
  subtitle="Explore interactive 3D elements that showcase modern web technologies"
  backgroundColor="#050a12"
  primaryColor="#4285F4"
  secondaryColor="#34A853"
  accentColor1="#FBBC05"
  accentColor2="#EA4335"
  enableShaderBackground={true}
  selectedShader="particles" // Initial shader to display
  enableText3D={true}
  text3DType="words"
  enableProjectShowcase={true}
  projects={projects} // Your projects data array
/>
```

## Performance Considerations

3D components can be resource-intensive. Here are some tips to maintain good performance:

1. **Lazy Loading**: Use dynamic imports to load 3D components only when needed.
2. **Mobile Detection**: Consider showing simplified versions on mobile devices.
3. **Unmount When Not Visible**: Remove 3D components from the DOM when they're not in the viewport.
4. **Optimize Textures**: Keep texture sizes reasonable (1024x1024 or smaller).
5. **Reduce Polygon Count**: Use simplified 3D models.

Example of lazy loading:

```jsx
import { lazy, Suspense } from 'react';

const PhysicsProjectShowcase = lazy(() => import('./components/3d/PhysicsProjectShowcase'));

function Projects() {
  return (
    <Suspense fallback={<div>Loading 3D Projects...</div>}>
      <PhysicsProjectShowcase projects={projects} />
    </Suspense>
  );
}
```

## Troubleshooting

Common issues and solutions:

### WebGL Not Supported

If you see errors related to WebGL not being supported:

```jsx
// Add a WebGL detection before rendering 3D components
import { useDetectWebGL } from './components/3d';

function YourComponent() {
  const hasWebGL = useDetectWebGL();
  
  return (
    <div>
      {hasWebGL ? (
        <PhysicsProjectShowcase projects={projects} />
      ) : (
        <div>Your browser doesn't support WebGL. Please try a different browser.</div>
      )}
    </div>
  );
}
```

### Performance Issues

If you experience low frame rates:

1. Reduce the intensity and complexity of shaders
2. Lower the size of the Canvas
3. Reduce the number of 3D objects 