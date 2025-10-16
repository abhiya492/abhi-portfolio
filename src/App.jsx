import React, { useState, useEffect } from 'react';
import './App.css'; // Import our enhanced styles
import { ThemeProvider, useTheme } from './context/ThemeContext';
import LoadingScreen from './components/LoadingScreen';
import ScrollProgress from './components/ScrollProgress';
import Header from './components/Header';
import About from './components/About';
import Skill from './components/Skill';
import Work from './components/Work';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { ThreeProvider } from './components/3d/ThreeProvider';

const AppContent = () => {
  const { isDark } = useTheme();
  const [toggle3D, setToggle3D] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <ThreeProvider>
      {isLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}
      {!isLoading && <ScrollProgress />}
      <div 
        className={`App ${isDark ? 'dark bg-black text-white' : 'light bg-gray-50 text-gray-900'} transition-colors duration-500`} 
        style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.5s ease-in' }}
      >
        <Header toggle3D={toggle3D} setToggle3D={setToggle3D} />
        <main>
          <About toggle3D={toggle3D} />
          <Skill toggle3D={toggle3D} />
          <Work toggle3D={toggle3D} />
          <Contact toggle3D={toggle3D} />
        </main>
        <Footer />
      </div>
    </ThreeProvider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
