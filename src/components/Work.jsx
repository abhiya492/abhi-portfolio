import ProjectCard from './ProjectCard';

const works = [  
    {  
    imgSrc: '/images/project-1.jpg',  
    title: 'PingPanda-Notification-sever',  
    tags: ['API', 'SaaS', 'Development'],  
    projectLink: 'https://github.com/abhiya492/jstack'  
    }, 
    {  
    imgSrc: '/images/project-2.jpg',  
    title: 'Transform Videos into Blog Posts with Ease',  
    tags: ['API', 'SaaS', 'Development'],  
    projectLink: 'https://github.com/abhiya492/motion-ai'  
    },  
    {  
    imgSrc: '/images/project-3.jpg',  
    title: 'Personal Portfolio',  
    tags: ['Web-design', 'Development'],  
    projectLink: 'https://github.com/abhiya492/portfolio'  
    },  
   ];  
   
   
   const Work = () => {  
    return (  
    <section id="work" className="section py-16">  
    <div className="container">  
    <h2 className="headline-2 mb-10 text-center">  
    My Portfolio Highlights </h2>  
   
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">  
    {works.map(({ imgSrc, title, tags, projectLink }, key) => (  
    <ProjectCard key={key}  
    imgSrc={imgSrc}  
    title={title}  
    tags={tags}  
    projectLink={projectLink}  
    />  
    ))}  
    </div>  
    </div>  
    </section>  
    );  
   }  
   
   export default Work;