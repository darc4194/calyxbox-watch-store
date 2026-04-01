import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Lock, Mail, Loader2, ArrowLeft, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AdminLoginProps {
  onBack: () => void;
  onSuccess: () => void;
}

export default function AdminLogin({ onBack, onSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      onSuccess();
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-light-grey p-8 md:p-12 rounded-[40px] shadow-xl border border-line/5"
      >
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={32} className="text-brand" />
          </div>
          <h1 className="text-3xl font-bold uppercase tracking-tight italic serif">Admin Access</h1>
          <p className="text-xs font-bold uppercase tracking-widest text-dusty-olive/60">Secure login for Calyxbox management</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold uppercase tracking-widest text-center"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-dusty-olive/60 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-dusty-olive/40" size={20} />
              <input 
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-5 pl-14 bg-white border-none rounded-2xl focus:ring-2 focus:ring-brand transition-all text-sm font-medium" 
                placeholder="admin@calyxbox.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-dusty-olive/60 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-dusty-olive/40" size={20} />
              <input 
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-5 pl-14 bg-white border-none rounded-2xl focus:ring-2 focus:ring-brand transition-all text-sm font-medium" 
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="pt-4 space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand text-white py-6 rounded-2xl font-bold uppercase tracking-widest shadow-xl shadow-brand/20 flex items-center justify-center space-x-3 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <ShieldCheck size={20} />}
              <span>Authorize Access</span>
            </motion.button>

            <button 
              type="button"
              onClick={onBack}
              className="w-full text-[10px] font-bold uppercase tracking-widest text-dusty-olive hover:text-brand transition-colors flex items-center justify-center space-x-2"
            >
              <ArrowLeft size={14} />
              <span>Back to Store</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
