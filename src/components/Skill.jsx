
import SkillCard from './SkillCard';

const skillItem = [
  {
      imgSrc: '/images/css3.svg',
      label: 'CSS',
      desc: 'User  Interface'
  },
  {
      imgSrc: '/images/javascript.svg',
      label: 'JavaScript',
      desc: 'Interaction'
  },
  {
      imgSrc: '/images/nodejs.svg',
      label: 'NodeJS',
      desc: 'Web Server'
  },
  {
      imgSrc: '/images/expressjs.svg',
      label: 'ExpressJS',
      desc: 'Node Framework'
  },
  {
      imgSrc: '/images/mongodb.svg',
      label: 'MongoDB',
      desc: 'Database'
  },
  {
      imgSrc: '/images/react.svg',
      label: 'React',
      desc: 'Framework'
  },
  {
      imgSrc: '/images/tailwindcss.svg',
      label: 'TailwindCSS',
      desc: 'User  Interface'
  },
  // Additional skill items
  {
      imgSrc: '/images/aws-logo.svg', // Suggestion for AWS icon
      label: 'AWS',
      desc: 'Cloud Services'
  },
  {
      imgSrc: '/images/azure.svg', // Suggestion for Azure icon
      label: 'Azure',
      desc: 'Cloud Services'
  },
  {
      imgSrc: '/images/docker.svg', // Suggestion for Docker icon
      label: 'Docker',
      desc: 'Containerization'
  },
  {
      imgSrc: '/images/kubernetes.svg', // Suggestion for Kubernetes icon
      label: 'Kubernetes',
      desc: 'Container Orchestration'
  },
  {
      imgSrc: '/images/terraform.svg', // Suggestion for Terraform icon
      label: 'Terraform',
      desc: 'Infrastructure as Code'
  },
  {
      imgSrc: '/images/ansible.svg', // Suggestion for Ansible icon
      label: 'Ansible',
      desc: 'Configuration Management'
  },
  {
      imgSrc: '/images/jenkins.svg', // Suggestion for Jenkins icon
      label: 'Jenkins',
      desc: 'CI/CD Tool'
  },
  {
      imgSrc: '/images/bash.svg', // Suggestion for Bash icon
      label: 'Bash',
      desc: 'Scripting Language'
  },
  {
      imgSrc: '/images/python.svg', // Suggestion for Python icon
      label: 'Python',
      desc: 'Programming Language'
  },
  {
      imgSrc: '/images/git.svg', // Suggestion for Git icon
      label: 'Git',
      desc: 'Version Control'
  },
  {
      imgSrc: '/images/postman.svg', // Suggestion for Postman icon
      label: 'Postman',
      desc: 'API Development'
  },
  {
      imgSrc: '/images/prometheus.svg', // Suggestion for Prometheus icon
      label: 'Prometheus',
      desc: 'Monitoring'
  },
  {
      imgSrc: '/images/grafana.svg', // Suggestion for Grafana icon
      label: 'Grafana',
      desc: 'Monitoring'
  },
  {
      imgSrc: '/images/sql.svg', // Suggestion for SQL icon
      label: 'SQL',
      desc: 'Database Language'
  },
  {
      imgSrc: '/images/django.svg', // Suggestion for Django icon
      label: 'Django',
      desc: 'Web Framework'
  },
  {
      imgSrc: '/images/typescript.svg', // Suggestion for TypeScript icon
      label: 'TypeScript',
      desc: 'Programming Language'
  }
];

const Skill = () => {
  return (
    <section className="section">
        <div className="container">
            <h2 className="headline-2">
                Tools I use
            </h2>
            <p className="">
            Discover the powerful tools and technologies I use to create exceptional, high-performing websites & applications.

            </p>

            <div className="grid grid-cols-2 gap-4 mt-8">
                {
                    skillItem.map(({ imgSrc, label, desc }, index) => 
                    (
                        <SkillCard 
                        key={index}
                        imgSrc={imgSrc}
                        label={label}
                        desc={desc}
                        />
                    
                    ))
                }

            </div>
        </div>
    </section>
  );
}

export default Skill;