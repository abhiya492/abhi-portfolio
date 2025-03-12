import React, { useState } from 'react';
import './App.css'; // Import our enhanced styles
import Header from './components/Header';
import About from './components/About';
import Skill from './components/Skill';
import Work from './components/Work';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { ThreeProvider } from './components/3d/ThreeProvider';

function App() {
  const [toggle3D, setToggle3D] = useState(true);

  return (
    <ThreeProvider>
      <div className="App bg-black text-white">
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
}

export default App;
