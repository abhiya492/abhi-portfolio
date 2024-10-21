import { ReactLenis, useLenis } from 'lenis/react';
import { useEffect } from 'react';
import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Skill from "./components/skill";
import Work from "./components/Work";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { gsap } from "gsap";
    
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger);



const App = () => {

  useGSAP(() => {
    const elements=gsap.utils.toArray('.reveal-up');
    console.log(elements);
});


  useLenis(({ scroll }) => {
    console.log(scroll);
  });

  useEffect(() => {
    document.body.style.overflow = "auto"; // Ensuring no conflicts with the scroll
  }, []);

  return (
    <ReactLenis root>
      <Header />
      <main>
        <Hero />
        <About />
        <Skill />
        <Work />
        <Contact />
        <Footer />
      </main>
    </ReactLenis>
  );
};

export default App;
