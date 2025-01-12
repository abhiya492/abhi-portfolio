import { useState } from "react";
import PropTypes from 'prop-types';
import { motion } from 'framer-motion'; // Import motion from framer-motion
import './SkillCard.css'; // Import a CSS file for additional styling, if needed

const SkillCard = ({
  imgSrc,
  label,
  desc,
  classes,
  tooltipText,
  onClick,
  //animationDuration = 1500,
}) => {
  const [bgColor, setBgColor] = useState('bg-gradient-to-r from-sky-300 to-pink-600');
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleMouseMove = (e) => {
	const { offsetWidth, offsetHeight } = e.currentTarget;
	const x = Math.round((e.nativeEvent.offsetX / offsetWidth) * 255);
	const y = Math.round((e.nativeEvent.offsetY / offsetHeight) * 255);
	setBgColor(`rgb(${x}, ${y}, 150)`); // Example RGB color
  };

  const handleMouseEnter = () => {
	setIsHovered(true);
	setBgColor('bg-sky-700'); // Change to sky-700 on hover
  };

  const handleMouseLeave = () => {
	setIsHovered(false);
	setBgColor('bg-gradient-to-r from-sky-300 to-pink-600'); // Reset to original gradient
  };

  return (
	<motion.div
	  className={`skill-card ${classes}`}
	  style={{ background: bgColor }}
	  onMouseMove={handleMouseMove}
	  onMouseEnter={handleMouseEnter}
	  onMouseLeave={handleMouseLeave}
	  onClick={onClick}
	  initial={{ scale: 1 }}
	  whileHover={{ scale: 1.05 }} // Scale effect on hover
	  transition={{ duration: 0.3 }} // Transition duration for scale
	>
	  {isLoading && (
		<div className="loader">Loading...</div> // Add your loader JSX here
	  )}
	  <img
		src={imgSrc}
		alt={label}
		onLoad={() => setIsLoading(false)} // Hide loader when image loads
	  />
	  <div className="content">
		<h3>{label}</h3>
		<p>{desc}</p>
	  </div>
	  {isHovered && tooltipText && (
		<motion.div
		  className="tooltip"
		  initial={{ opacity: 0, y: -10 }}
		  animate={{ opacity: 1, y: 0 }}
		  exit={{ opacity: 0, y: -10 }}
		  transition={{ duration: 0.2 }} // Tooltip transition
		>
		  {tooltipText}
		</motion.div>
	  )}
	</motion.div>
  );
};

SkillCard.propTypes = {
  imgSrc: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  classes: PropTypes.string,
  tooltipText: PropTypes.string,
  onClick: PropTypes.func,
  animationDuration: PropTypes.number,
};

export default SkillCard;