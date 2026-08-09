import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({ children, isLoading, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "w-full py-2.5 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-70 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-brand-orange hover:bg-orange-600 text-white shadow-md shadow-brand-orange/20 focus:ring-brand-orange",
    secondary: "bg-white hover:bg-gray-50 text-brand-navy border border-gray-200 focus:ring-gray-200",
    text: "bg-transparent hover:bg-gray-100 text-brand-navy focus:ring-gray-200"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <Loader2 size={18} className="animate-spin" />}
      {children}
    </button>
  );
};

export default Button;
