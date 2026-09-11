import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

const Input = ({ label, type = 'text', error, motionProps = {}, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <motion.div className="mb-4 w-full" {...motionProps}>
      {label && <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5 transition-colors">{label}</label>}
      <div className="relative group">
        {/* Focus Glow */}
        <div className="absolute inset-0 rounded-xl bg-[var(--accent)] opacity-0 group-focus-within:opacity-20 blur-md transition-opacity duration-500 pointer-events-none" />
        <input
          type={inputType}
          className={`w-full px-4 py-2.5 rounded-xl border ${error ? 'border-[var(--danger)] focus:ring-[var(--danger)]/20' : 'border-[var(--border-color)] focus:border-[var(--accent)] focus:ring-[var(--accent)]/20'} bg-[var(--surface)] text-[var(--text-primary)] focus:bg-[var(--surface-elevated)] transition-all duration-300 outline-none focus:ring-4 shadow-sm focus:shadow-lg placeholder:text-[var(--text-secondary)] placeholder:opacity-50 relative z-10`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors z-20 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-1.5 text-sm text-[var(--danger)]">{error}</motion.p>}
    </motion.div>
  );
};

export default Input;
