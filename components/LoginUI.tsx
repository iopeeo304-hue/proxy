
import React, { useState } from 'react';
import { Sprout, Mail, Lock, Loader2, AlertCircle, Eye, EyeOff, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoginUIProps {
  onLoginSuccess: () => void;
}

const LoginUI: React.FC<LoginUIProps> = ({ onLoginSuccess }) => {
  // 預設帳號密碼
  const [email, setEmail] = useState('s1120325@o365st.pu.edu.tw');
  const [password, setPassword] = useState('Gary.0924');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    setTimeout(() => {
      if (email === 's1120325@o365st.pu.edu.tw' && password === 'Gary.0924') {
        setStatus('success');
        setTimeout(() => onLoginSuccess(), 800);
      } else {
        setStatus('error');
        setErrorMessage('請檢查帳號密碼（預設：Gary.0924）');
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#f3fdf5] flex items-center justify-center p-6 overflow-hidden">
      <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-100/40 rounded-full blur-2xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-emerald-100/40 rounded-full blur-2xl animate-pulse" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm bg-white/95 backdrop-blur-xl p-8 rounded-[3.5rem] shadow-[0_40px_80px_-20px_rgba(52,211,153,0.15)] border-[8px] border-white relative"
      >
        <div className="flex flex-col items-center mb-8">
          <motion.div 
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="w-20 h-20 bg-emerald-400 rounded-[2rem] flex items-center justify-center shadow-xl mb-4"
          >
            <Sprout size={44} className="text-white" />
          </motion.div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tighter italic">PlantGo!</h1>
          <p className="text-emerald-500 text-[11px] font-black uppercase tracking-[0.3em] mt-1">靜宜校園探險隊</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-3xl focus:border-emerald-400 focus:bg-white outline-none transition-all font-bold text-slate-700"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-slate-50 border-2 border-slate-100 rounded-3xl focus:border-emerald-400 focus:bg-white outline-none transition-all font-bold text-slate-700"
              required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <AnimatePresence>
            {status === 'error' && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-rose-50 border border-rose-100 rounded-2xl text-rose-500 text-[11px] font-bold text-center">
                <AlertCircle size={14} className="inline mr-2" />
                {errorMessage}
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-3xl font-black text-lg transition-all shadow-xl shadow-emerald-100 flex items-center justify-center gap-3 active:scale-95"
          >
            {status === 'loading' ? <Loader2 className="animate-spin" /> : <span>出發探險！</span>}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-50 text-center">
          <p className="text-[10px] text-slate-300 font-bold uppercase flex items-center justify-center gap-1">
            Made with <Heart size={10} className="text-rose-300 fill-rose-300" /> by PU Explorer Team
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginUI;
