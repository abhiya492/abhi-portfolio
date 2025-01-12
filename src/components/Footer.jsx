import './Footer.css';


const sitemap = [
    {
      label: 'Home',
      href: '#home'
    },
    {
      label: 'About',
      href: '#about'
    },
    {
      label: 'Work',
      href: '#work'
    },
    {
      label: 'Contact me',
      href: '#contact'
    }
  ];
  
  const socials = [
    {
      label: 'GitHub',
      href: 'https://www.github.com/abhiya492'
    },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/abhishek-singh-1604b9221'
    },
    {
      label: 'Twitter X',
      href: 'https://x.com/ABHISHE96010387'
    },
  ];


const Footer = () => {
    return (
        <footer className="footer-section py-16">
            <div className="container mx-auto px-4">
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                    <div>
                        <h2 className="text-3xl font-extrabold mb-4 text-gray-800">
                            Get in touch
                        </h2>
                        <p className="mb-6 text-gray-600">
                            Reach out today to discuss your project needs and start collaborating on something amazing!
                        </p>
                        <div className="flex space-x-6">
                            {socials.map(({ href, label }, key) => (
                                <a 
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-600 hover:text-blue-600 transition duration-200"
                                    key={key}
                                    aria-label={label}
                                >
                                    <div className="w-8 h-8">{label}</div>
                                </a>
                            ))}
                        </div>
                    </div>
                    <nav className="footer-nav">
                        <ul className="flex space-x-6">
                            {sitemap.map(({ href, label }, key) => (
                                <li key={key}>
                                    <a 
                                        href={href}
                                        className="text-gray-600 hover:text-blue-600 transition duration-200"
                                    >
                                        {label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
        </footer>
    );
};


export default Footer;