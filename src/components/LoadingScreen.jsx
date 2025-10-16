import React, { useEffect, useState } from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onLoadingComplete(), 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <div className="loading-screen">
      <div className="loading-content">
        {/* Logo */}
        <div className="loading-logo">
          <span className="logo-text">Abhi</span>
          <span className="logo-box">Dev</span>
        </div>

        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${Math.min(progress, 100)}%` }}></div>
        </div>
        
        <div className="progress-text">{Math.min(Math.round(progress), 100)}%</div>
      </div>

      {/* Animated Background */}
      <div className="loading-bg">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
