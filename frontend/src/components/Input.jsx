import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = ({ label, type = 'text', error, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="mb-4 w-full">
      {label && <label className="block text-sm font-medium text-brand-navy mb-1.5">{label}</label>}
      <div className="relative">
        <input
          type={inputType}
          className={`w-full px-4 py-2.5 rounded-xl border ${error ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:border-brand-orange focus:ring-brand-orange/20'} bg-white/50 focus:bg-white transition-all outline-none focus:ring-2`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
