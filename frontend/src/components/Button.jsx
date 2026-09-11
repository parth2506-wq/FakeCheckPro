import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Button = ({ children, isLoading, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "w-full py-2.5 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-[var(--bg-base)] disabled:opacity-70 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-br from-[var(--text-primary)] to-[var(--text-primary)] opacity-90 hover:opacity-100 text-[var(--bg-base)] shadow-lg shadow-[var(--border-color)] focus:ring-[var(--text-primary)] border border-transparent",
    secondary: "bg-[var(--surface)] hover:bg-[var(--surface-elevated)] text-[var(--text-primary)] border border-[var(--border-color)] focus:ring-[var(--border-color)] shadow-sm hover:shadow-md",
    text: "bg-transparent hover:bg-[var(--surface)] text-[var(--text-primary)] focus:ring-[var(--border-color)]"
  };

  return (
    <motion.button 
      className={`${baseStyle} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      whileHover={{ scale: (isLoading || props.disabled) ? 1 : 1.02 }}
      whileTap={{ scale: (isLoading || props.disabled) ? 1 : 0.98 }}
      {...props}
    >
      {isLoading && <Loader2 size={18} className="animate-spin" />}
      {children}
    </motion.button>
  );
};

export default Button;
