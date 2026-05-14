'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login, getCurrentSession } from '@/lib/adminAuth';
import { Eye, EyeOff, ArrowRight, ShieldCheck, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@mkfashion.in');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shakeError, setShakeError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getCurrentSession().then(() => router.push('/admin')).catch(() => undefined);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back');
      router.push('/admin');
    } catch {
      toast.error('Invalid email or password');
      setShakeError(true);
      setTimeout(() => setShakeError(false), 600);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050108] flex overflow-hidden">
      <div className="hidden lg:flex flex-col justify-between w-2/5 bg-gradient-to-br from-[#1a0a2e] via-[#2d1154] to-[#0a0118] p-12 relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-20%] w-[70%] h-[70%] bg-purple-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-fuchsia-600/10 rounded-full blur-[80px]" />

        <div className="relative z-10">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center text-white font-black text-lg shadow-2xl shadow-purple-500/30 mb-8">
            MK
          </div>
          <div className="text-white/80 text-xs font-semibold uppercase tracking-[0.2em] mb-3">MK Fashion</div>
          <h1 className="text-4xl font-extrabold text-white leading-tight mb-4">
            Admin<br />Command<br />Center
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
            Secure administration for products, orders, customers, promotions, and store settings.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 relative">
        <div className="absolute top-[-15%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-sm relative z-10">
          <div className="lg:hidden mb-8 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center text-white font-black">MK</div>
            <span className="text-white font-bold text-lg">MK Fashion Admin</span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">Sign in</h2>
          <p className="text-slate-500 text-sm mb-8">Use your admin email and password to continue</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@mkfashion.in"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-white placeholder-slate-700 focus:outline-none focus:border-purple-500/60 focus:bg-white/[0.07] transition-all"
                  required
                />
              </div>
            </div>

            <div className={`space-y-1.5 ${shakeError ? 'animate-[shake_0.3s_ease-in-out]' : ''}`}>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Password</label>
              <div className="relative">
                <ShieldCheck size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-12 py-3.5 text-white placeholder-slate-700 focus:outline-none focus:border-purple-500/60 focus:bg-white/[0.07] transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-purple-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-bold py-3.5 rounded-2xl shadow-xl shadow-purple-900/30 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
