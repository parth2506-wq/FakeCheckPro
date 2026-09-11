import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ children, className = '', padding = 'p-6', motionProps = {}, hoverEffect = true }) => {
  return (
    <motion.div
      className={`glass-card ${padding} ${className} ${hoverEffect ? 'transition-colors duration-300 hover:bg-[var(--surface-elevated)] hover:border-[var(--accent)]/30' : ''}`}
      whileHover={hoverEffect ? { y: -5, boxShadow: '0 20px 40px -10px var(--accent-soft)' } : {}}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
