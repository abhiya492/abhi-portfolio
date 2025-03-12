import './Contact.css';
import { useState, useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const socialLinks = [
    {
      href: 'https://github.com/abhiya492',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
      </svg>,
      alt: 'GitHub'
    },
    {
      href: 'https://www.linkedin.com/in/abhishek-singh-1604b9221',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
        <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
      </svg>,
      alt: 'LinkedIn'
    },
    {
      href: 'https://leetcode.com/u/2021uee1669/',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
        <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
      </svg>,
      alt: 'LeetCode'
    },
  ];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [activeField, setActiveField] = useState(null);
  
  const sectionRef = useRef(null);
  const formRef = useRef(null);
  const infoRef = useRef(null);
  
  // Floating particle effect
  useEffect(() => {
    const particles = document.querySelectorAll('.particle');
    
    particles.forEach(particle => {
      const speed = 1 + Math.random() * 2;
      const direction = Math.random() > 0.5 ? 1 : -1;
      const rotation = Math.random() * 360;
      
      gsap.to(particle, {
        y: `${direction * (20 + Math.random() * 30)}px`,
        x: `${direction * (Math.random() * 20)}px`,
        rotation: rotation,
        duration: speed,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });
  }, []);
  
  useGSAP(() => {
    // Staggered animation for contact info items
    const infoItems = gsap.utils.toArray('.info-item', infoRef.current);
    gsap.fromTo(
      infoItems,
      { x: -30, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: infoRef.current,
          start: 'top 80%',
          once: true,
        }
      }
    );
    
    // Animation for social links
    const socialItems = gsap.utils.toArray('.social-item');
    gsap.fromTo(
      socialItems,
      { scale: 0, opacity: 0 },
      { 
        scale: 1, 
        opacity: 1, 
        duration: 0.4,
        stagger: 0.1,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: '.social-container',
          start: 'top 85%',
          once: true,
        }
      }
    );
    
    // Form animation
    gsap.fromTo(
      formRef.current,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        scrollTrigger: {
          trigger: formRef.current,
          start: 'top 80%',
          once: true,
        }
      }
    );
    
    // Title animations
    gsap.fromTo(
      '.contact-title',
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        scrollTrigger: {
          trigger: '.contact-title',
          start: 'top 85%',
          once: true,
        }
      }
    );
    
    gsap.fromTo(
      '.contact-subtitle',
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: 0.2,
        scrollTrigger: {
          trigger: '.contact-subtitle',
          start: 'top 85%',
          once: true,
        }
      }
    );
  }, { scope: sectionRef });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFocus = (field) => {
    setActiveField(field);
  };
  
  const handleBlur = () => {
    setActiveField(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitStatus({ success: true, message: 'Your message has been sent successfully! I\'ll get back to you soon.' });
      
      // Animate success
      const formElements = formRef.current.querySelectorAll('input, textarea, button');
      gsap.fromTo(
        formElements, 
        { scale: 1 }, 
        { 
          scale: 1.02, 
          duration: 0.3,
          stagger: 0.05,
          yoyo: true,
          repeat: 1
        }
      );
      
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        message: ''
      });
      
      // Reset status after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    } catch (error) {
      setSubmitStatus({ success: false, message: 'Something went wrong. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

    return (
    <section id="contact" ref={sectionRef} className="py-20 md:py-28 relative grid-pattern overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="particle absolute top-[10%] left-[15%] w-16 h-16 rounded-full"></div>
        <div className="particle absolute top-[60%] left-[20%] w-24 h-24 rounded-full"></div>
        <div className="particle absolute top-[25%] right-[10%] w-20 h-20 rounded-full"></div>
        <div className="particle absolute bottom-[15%] right-[20%] w-32 h-32 rounded-full"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 contact-title">
            Get In <span className="text-gradient">Touch</span>
                        </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mb-6"></div>
          <p className="text-gray-400 max-w-2xl mx-auto contact-subtitle">
            Feel free to reach out if you have any questions or want to work together.
            I'm always open to discussing new projects and opportunities.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <div ref={infoRef} className="glass rounded-2xl p-8 border border-white/5 card-shadow">
            <h3 className="text-xl font-semibold mb-8 flex items-center relative info-item">
              <span className="inline-block w-10 h-1 bg-blue-500 rounded-full absolute -left-4 -translate-x-full"></span>
              Contact Information
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-start info-item">
                <div className="mr-4 p-3 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Email</p>
                  <a 
                    href="mailto:singh.421.aspabhiya@gmail.com" 
                    className="text-white hover:text-blue-400 transition-colors duration-300"
                  >
                    singh.421.aspabhiya@gmail.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start info-item">
                <div className="mr-4 p-3 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Education</p>
                  <p className="text-white">MNIT Jaipur - B.Tech in Electrical Engineering</p>
                </div>
              </div>
              
              <div className="flex items-start info-item">
                <div className="mr-4 p-3 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Location</p>
                  <p className="text-white">Jaipur, Rajasthan, India</p>
                </div>
              </div>
            </div>
            
            <div className="mt-10 info-item">
              <h3 className="text-xl font-semibold mb-5 relative">
                <span className="inline-block w-10 h-1 bg-blue-500 rounded-full absolute -left-4 -translate-x-full"></span>
                Connect With Me
              </h3>
              <div className="flex gap-4 social-container">
                            {socialLinks.map(({ href, icon, alt }, key) => (
                                <a 
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                    className="social-item group bg-gray-800/60 p-3 rounded-full hover:bg-blue-600 transition-all duration-300 transform hover:scale-110 border border-white/5"
                                    key={key}
                                    aria-label={alt}
                                >
                    <div className="w-6 h-6 text-blue-400 group-hover:text-white transition-colors duration-300">{icon}</div>
                                </a>
                            ))}
                        </div>
                    </div>
            
            <div className="mt-10 info-item">
              <h3 className="text-xl font-semibold mb-5 relative">
                <span className="inline-block w-10 h-1 bg-blue-500 rounded-full absolute -left-4 -translate-x-full"></span>
                Certifications
              </h3>
              <ul className="space-y-3">
                {[
                  'AWS Technical Essential',
                  'Master the Linux Command Line',
                  'JavaScript Algorithms and Data Structures'
                ].map((cert, index) => (
                  <li key={index} className="certification-item flex items-center text-gray-300 group transition-all duration-300 hover:translate-x-2">
                    <span className="text-blue-400 mr-2 text-xl leading-none">•</span>
                    <span className="group-hover:text-white transition-colors duration-300">{cert}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Contact Form */}
          <div ref={formRef} className="relative">
            <form 
              onSubmit={handleSubmit} 
              className="glass p-8 rounded-2xl border border-white/5 card-shadow h-full"
            >
              {submitStatus && (
                <div 
                  className={`p-4 mb-6 rounded-lg ${submitStatus.success ? 'bg-green-900/30 text-green-300 border border-green-500/30' : 'bg-red-900/30 text-red-300 border border-red-500/30'} flex items-start`}
                >
                  <span className="mr-2 mt-0.5">
                    {submitStatus.success ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    )}
                  </span>
                  <p>{submitStatus.message}</p>
                </div>
              )}
              
              <h3 className="text-xl font-semibold mb-6 relative">
                <span className="inline-block w-10 h-1 bg-blue-500 rounded-full absolute -left-4 -translate-x-full"></span>
                Send A Message
              </h3>
              
              <div className="mb-6">
                <label 
                  htmlFor="name" 
                  className={`block text-sm font-medium mb-2 transition-colors duration-300 ${activeField === 'name' ? 'text-blue-400' : 'text-gray-300'}`}
                >
                  Your Name
                            </label>
                <div className={`relative transition-all duration-300 ${activeField === 'name' ? 'scale-[1.02]' : ''}`}>
                            <input
                                type="text"
                                id="name"
                                name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => handleFocus('name')}
                    onBlur={handleBlur}
                                required
                    className="w-full bg-gray-800/70 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 transition-all duration-300"
                    placeholder="John Doe"
                            />
                  {activeField === 'name' && <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse w-full rounded-full"></div>}
                </div>
                        </div>
              
              <div className="mb-6">
                <label 
                  htmlFor="email" 
                  className={`block text-sm font-medium mb-2 transition-colors duration-300 ${activeField === 'email' ? 'text-blue-400' : 'text-gray-300'}`}
                >
                  Your Email
                            </label>
                <div className={`relative transition-all duration-300 ${activeField === 'email' ? 'scale-[1.02]' : ''}`}>
                            <input
                                type="email"
                                id="email"
                                name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => handleFocus('email')}
                    onBlur={handleBlur}
                                required
                    className="w-full bg-gray-800/70 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 transition-all duration-300"
                    placeholder="john.doe@example.com"
                            />
                  {activeField === 'email' && <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse w-full rounded-full"></div>}
                </div>
                        </div>
              
              <div className="mb-6">
                <label 
                  htmlFor="message" 
                  className={`block text-sm font-medium mb-2 transition-colors duration-300 ${activeField === 'message' ? 'text-blue-400' : 'text-gray-300'}`}
                >
                  Your Message
                            </label>
                <div className={`relative transition-all duration-300 ${activeField === 'message' ? 'scale-[1.02]' : ''}`}>
                            <textarea
                                id="message"
                                name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => handleFocus('message')}
                    onBlur={handleBlur}
                                required
                    rows="5"
                    className="w-full bg-gray-800/70 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 transition-all duration-300 resize-none"
                    placeholder="Hello Abhishek, I'd like to talk about..."
                  ></textarea>
                  {activeField === 'message' && <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse w-full rounded-full"></div>}
                </div>
                        </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-6 rounded-lg font-medium text-white relative overflow-hidden group ${
                  isSubmitting 
                    ? 'bg-gray-700 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 background-size-200'
                } transition-all duration-300`}
              >
                <span className="relative z-10 flex items-center justify-center">
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                            Send Message
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </span>
                {!isSubmitting && (
                  <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></span>
                )}
                        </button>
                    </form>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl"></div>
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-purple-500/10 rounded-full blur-xl"></div>
          </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;

