import ProjectCard from './ProjectCard';

const works = [  
    {  
    imgSrc: '/images/project-1.jpg',  
    title: 'Full Stack Music App',  
    tags: ['API', 'MVC', 'Development'],  
    projectLink: 'https://musify-5al0.onrender.com/'  
    },  
    {  
    imgSrc: '/images/project-2.jpg',  
    title: 'Free Stock Photo App',  
    tags: ['API', 'SPA'],  
    projectLink: 'https://pixstock-official.vercel.app/'  
    },  
    {  
    imgSrc: '/images/project-3.jpg',  
    title: 'Recipe App',  
    tags: ['Development', 'API'],  
    projectLink: '#'  
    },  
    {  
    imgSrc: '/images/project-4.jpg',  
    title: 'Real Estate Website',  
    tags: ['Web-design', 'Development'],  
    projectLink: 'https://github.com/codewithsadee-org/wealthome'  
    },  
    {  
    imgSrc: '/images/project-5.jpg',  
    title: 'eCommerce Website',  
    tags: ['eCommerce', 'Development'],  
    projectLink: 'https://github.com/codewithsadee/anon-ecommerce-website'  
    },  
    {  
    imgSrc: '/images/project-6.jpg',  
    title: 'vCard Personal Portfolio',  
    tags: ['Web-design', 'Development'],  
    projectLink: 'https://github.com/codewithsadee/vcard-personal-portfolio'  
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