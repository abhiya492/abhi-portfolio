//import React from 'react';
import PropTypes from 'prop-types';

const ButtonPrimary = ({
    href,
    target = "_self",
    label,
    icon,
    classes = "", // Ensure classes is a string by default
}) => {  
    if (href) {
        return (
            <a 
                href={href}
                target={target}
                className={`btn btn-primary ${classes}`} // Use template literals for class names
            >
                {label}
                {icon && (
                    <span className="material-symbols-rounded" aria-hidden="true">
                        {icon}
                    </span>
                )}
            </a>
        );
    } else {
        return (
            <button className={`btn btn-primary ${classes}`}>
                {label}
                {icon && (
                    <span className="material-symbols-rounded" aria-hidden="true">
                        {icon}
                    </span>
                )}
            </button>
        );
    }
};

ButtonPrimary.propTypes = {
    label: PropTypes.string.isRequired,
    href: PropTypes.string,
    target: PropTypes.string,
    icon: PropTypes.string,
    classes: PropTypes.string,
};

const ButtonOutLine = ({
    href,
    target = "_self",
    label,
    icon,
    classes = "", // Ensure classes is a string by default
}) => {  
    if (href) {
        return (
            <a 
                href={href}
                target={target}
                className={`btn btn-primary ${classes}`} // Use template literals for class names
            >
                {label}
                {icon && (
                    <span className="material-symbols-rounded" aria-hidden="true">
                        {icon}
                    </span>
                )}
            </a>
        );
    } else {
        return (
            <button className={`btn btn-primary ${classes}`}>
                {label}
                {icon && (
                    <span className="material-symbols-rounded" aria-hidden="true">
                        {icon}
                    </span>
                )}
            </button>
        );
    }
};

ButtonOutLine.propTypes = {
    label: PropTypes.string.isRequired,
    href: PropTypes.string,
    target: PropTypes.string,
    icon: PropTypes.string,
    classes: PropTypes.string,
};

export { ButtonPrimary };
export { ButtonOutLine };