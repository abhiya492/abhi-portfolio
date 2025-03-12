/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Text, useFont } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useThreeContext } from './ThreeProvider';

const InteractiveText3D = ({
  text = "Hello World",
  type = "single", // 'single', 'words', 'characters'
  height = "100%",
  size = 1,
  color = "#4285F4",
  secondary = "#FBBC05",
  enableControls = false,
  showCursor = false,
  wordsPerLine = 3
}) => {
  const groupRef = useRef();
  const [words, setWords] = useState([]);
  const [hovered, setHovered] = useState(null);
  const [cursorIndex, setCursorIndex] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [useHtmlFallback, setUseHtmlFallback] = useState(false);
  const { fonts } = useThreeContext() || { fonts: {} };
  
  // Check if we need to use fallback
  useEffect(() => {
    if (!fonts || !fonts.defaultFont) {
      console.warn("No font available in ThreeContext. Using fallback text rendering.");
      setUseFallback(true);
    }
  }, [fonts]);
  
  // Initialize text based on type
  useEffect(() => {
    switch(type) {
      case 'words':
        setWords(text.split(' ').map((word, index) => ({
          text: word,
          position: calculateWordPosition(index),
          originalY: 0
        })));
        break;
      case 'characters':
        setWords(text.split('').map((char, index) => ({
          text: char,
          position: [index * 0.5 - (text.length * 0.25), 0, 0],
          originalY: 0
        })));
        break;
      case 'single':
      default:
        setWords([{
          text: text,
          position: [0, 0, 0],
          originalY: 0
        }]);
    }
  }, [text, type, wordsPerLine]);
  
  // Calculate position for words layout
  function calculateWordPosition(index) {
    const row = Math.floor(index / wordsPerLine);
    const col = index % wordsPerLine;
    return [
      (col - wordsPerLine / 2 + 0.5) * 1.2, 
      -row * 1.2, 
      0
    ];
  }
  
  // Handle font errors
  const handleFontError = () => {
    console.warn("Failed to load web font for 3D text. Using HTML fallback.");
    setUseHtmlFallback(true);
  };
  
  // Handle cursor blinking effect
  useEffect(() => {
    if (!showCursor) return;
    
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 530);
    
    return () => clearInterval(interval);
  }, [showCursor]);
  
  // Animation loop
  useFrame((state, delta) => {
    // Don't animate if using HTML fallback
    if (useHtmlFallback) return;
    
    // Animate each word/character
    if (groupRef.current) {
      try {
        groupRef.current.children.forEach((child, index) => {
          // Skip cursor element
          if (child.name === 'cursor') return;
          
          if (index === hovered) {
            // Hovered element animation
            child.position.y = words[index]?.originalY + Math.sin(state.clock.elapsedTime * 2) * 0.1;
            child.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
            
            // This is safe because we're checking material type first
            if (child.material && 
                (child.material instanceof THREE.MeshBasicMaterial || 
                 child.material.color)) {
              try {
                child.material.color.set(secondary);
              } catch (e) {
                // Ignore color setting errors
              }
            }
          } else {
            // Reset non-hovered elements
            if (words[index]) {
              child.position.y = words[index].originalY;
              child.rotation.y = Math.sin(state.clock.elapsedTime) * 0.05;
            }
            
            // This is safe because we're checking material type first
            if (child.material && 
                (child.material instanceof THREE.MeshBasicMaterial || 
                 child.material.color)) {
              try {
                child.material.color.set(color);
              } catch (e) {
                // Ignore color setting errors
              }
            }
          }
        });
        
        // Cursor animation
        const cursor = groupRef.current.children.find(child => child.name === 'cursor');
        if (cursor && words[cursorIndex]) {
          // Calculate cursor position
          if (type === 'single') {
            // Place cursor at the end of text
            const lastWordLength = words[0].text.length * 0.4 * size;
            cursor.position.set(lastWordLength / 2, 0, 0);
          } else {
            // Position cursor next to current word
            const currentWord = groupRef.current.children[cursorIndex];
            if (currentWord && currentWord.geometry && currentWord.geometry.boundingBox) {
              const wordWidth = currentWord.geometry.boundingBox.max.x - currentWord.geometry.boundingBox.min.x;
              cursor.position.set(
                words[cursorIndex].position[0] + wordWidth / 2 + 0.1,
                words[cursorIndex].position[1],
                0
              );
            } else if (words[cursorIndex]) {
              // Fallback if geometry isn't available
              cursor.position.set(
                words[cursorIndex].position[0] + 0.5,
                words[cursorIndex].position[1],
                0
              );
            }
          }
        }
      } catch (error) {
        console.warn("Animation error in InteractiveText3D:", error);
      }
    }
  });
  
  // Complete HTML fallback
  if (useHtmlFallback) {
    const containerStyle = {
      width: '100%',
      height: typeof height === 'number' ? `${height}px` : height,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: color,
      fontFamily: 'Arial, sans-serif'
    };
    
    return (
      <div style={containerStyle}>
        {type === 'single' ? (
          <div 
            style={{ 
              fontSize: `${size * 2}rem`, 
              fontWeight: 'bold',
              color: hovered === 0 ? secondary : color,
              cursor: 'pointer'
            }}
            onMouseEnter={() => setHovered(0)}
            onMouseLeave={() => setHovered(null)}
          >
            {text}
          </div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
            {words.map((word, index) => (
              <div
                key={index}
                style={{
                  fontSize: `${size * 1.5}rem`,
                  fontWeight: 'bold',
                  color: hovered === index ? secondary : color,
                  cursor: 'pointer',
                  transform: hovered === index ? 'translateY(-5px)' : 'none',
                  transition: 'transform 0.3s, color 0.3s'
                }}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
              >
                {word.text}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  
  // Render fallback 2D text if 3D is not available
  if (useFallback) {
    return (
      <group ref={groupRef}>
        {words.map((word, index) => (
          <Text
            key={index}
            color={color}
            fontSize={size}
            position={word.position}
            onPointerOver={() => enableControls && setHovered(index)}
            onPointerOut={() => enableControls && setHovered(null)}
            onClick={() => enableControls && setCursorIndex(index)}
            font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZFhjA.woff2"
            anchorX="center"
            anchorY="middle"
            maxWidth={10}
            textAlign="center"
            onError={handleFontError}
          >
            {word.text}
          </Text>
        ))}
        
        {showCursor && cursorVisible && (
          <mesh name="cursor" position={[0, 0, 0]}>
            <planeGeometry args={[0.1, size * 1.2]} />
            <meshBasicMaterial color={secondary} />
          </mesh>
        )}
      </group>
    );
  }
  
  return (
    <group ref={groupRef}>
      {words.map((word, index) => (
        <Text
          key={index}
          color={color}
          fontSize={size}
          position={word.position}
          onPointerOver={() => enableControls && setHovered(index)}
          onPointerOut={() => enableControls && setHovered(null)}
          onClick={() => enableControls && setCursorIndex(index)}
          font="https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2"
          anchorX="center"
          anchorY="middle"
          maxWidth={10}
          textAlign="center"
          onError={handleFontError}
        >
          {word.text}
        </Text>
      ))}
      
      {showCursor && cursorVisible && (
        <mesh name="cursor" position={[0, 0, 0]}>
          <planeGeometry args={[0.1, size * 1.2]} />
          <meshBasicMaterial color={secondary} />
        </mesh>
      )}
    </group>
  );
};

export default InteractiveText3D;