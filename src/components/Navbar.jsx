import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './Navbar.css';


const Navbar = ({ navOpen }) => {
    const lastActiveLink = useRef(null);
    const activeBoxRef = useRef(null);

    const initActiveBox = () => {
        // Ensure the refs are not null or undefined before accessing their styles
        if (lastActiveLink.current && activeBoxRef.current) {
            activeBoxRef.current.style.top = lastActiveLink.current.offsetTop + 'px';
            activeBoxRef.current.style.left = lastActiveLink.current.offsetLeft + 'px';
            activeBoxRef.current.style.width = lastActiveLink.current.offsetWidth + 'px';
            activeBoxRef.current.style.height = lastActiveLink.current.offsetHeight + 'px';
        }
    };

    useEffect(() => {
        initActiveBox();
        // Ensure the event listener is removed when component unmounts
        const handleResize = () => initActiveBox();
        window.addEventListener('resize', handleResize);
        
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const activeCurrentLink = (event) => {
        if (lastActiveLink.current) {
            lastActiveLink.current.classList.remove('active');
        }

        event.target.classList.add('active');
        lastActiveLink.current = event.target;

        if (activeBoxRef.current) {
            activeBoxRef.current.style.top = event.target.offsetTop + 'px';
            activeBoxRef.current.style.left = event.target.offsetLeft + 'px';
            activeBoxRef.current.style.width = event.target.offsetWidth + 'px';
            activeBoxRef.current.style.height = event.target.offsetHeight + 'px';
        }
    };

    const navItems = [
        {
            label: 'Home',
            link: '#home',
            className: 'nav-link active',
            ref: lastActiveLink
        },
        {
            label: 'About',
            link: '#about',
            className: 'nav-link'
        },
        {
            label: 'Work',
            link: '#work',
            className: 'nav-link'
        },
        {
            label: 'Contact',
            link: '#contact',
            className: 'nav-link md:hidden'
        }
    ];

    return (
        <nav className={'navbar' + (navOpen ? ' active' : '')}>
            {navItems.map(({ label, link, className, ref }, key) => (
                <a
                    href={link}
                    className={className}
                    key={key}
                    ref={ref}
                    onClick={activeCurrentLink}
                >
                    {label}
                </a>
            ))}
            <div className='active-box' ref={activeBoxRef}></div>
        </nav>
    );
};

Navbar.propTypes = {
    navOpen: PropTypes.bool.isRequired
};

export default Navbar;
