import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Logo } from '../components/ui/Logo';
import { Button } from '../components/ui/Button';
import { authService } from '../services/authService';
import { useAppStore } from '../store/useAppStore';
import { Lock, Mail, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('developer@codeflow.ai');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useAppStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authService.login(email, password);
      addToast({
        title: 'Welcome Back',
        description: 'Successfully authenticated with CodeFlow AI.',
        type: 'success',
      });
      navigate('/');
    } catch {
      addToast({ title: 'Authentication Failed', description: 'Invalid credentials.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSignIn = () => {
    setEmail('developer@codeflow.ai');
    setPassword('password123');
    setTimeout(() => {
      authService.login('developer@codeflow.ai', 'password123');
      addToast({ title: 'Demo Mode Activated', description: 'Logged in as Alex Rivera.', type: 'success' });
      navigate('/');
    }, 200);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0B0D10] text-gray-100 font-sans select-none">
      {/* Left Column: Brand Hero */}
      <div className="relative flex-1 flex flex-col justify-between p-8 sm:p-12 lg:p-16 border-b md:border-b-0 md:border-r border-white/10 bg-gradient-to-br from-[#0E131A] via-[#101622] to-[#151128] overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/4 left-1/4 -ml-20 -mt-20 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <Logo size="lg" />
        </div>

        <div className="relative z-10 my-12 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Plan. Code. Debug. Ship.</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Developer productivity at the speed of Groq.
          </h2>

          <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
            The intelligent task management platform tailored for engineering teams.
            Coordinate sprints, deconstruct complex tickets into subtasks, and debug race conditions with zero context switching.
          </p>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs font-mono text-gray-500 pt-6 border-t border-white/5">
          <span>CodeFlow AI v2.4</span>
          <span>FastAPI + Groq LPU</span>
        </div>
      </div>

      {/* Right Column: Sign In Form */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 lg:p-16 bg-[#0B0D10]">
        <div className="w-full max-w-md space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-white tracking-tight">Sign in to your account</h3>
            <p className="text-xs text-gray-400 mt-1">
              Enter your credentials to access your workspaces and repositories
            </p>
          </div>

          {/* Quick Demo One-Click Access */}
          <button
            type="button"
            onClick={handleDemoSignIn}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/15 text-indigo-300 text-xs font-semibold transition-all group shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Sign in with 1-Click Demo Account</span>
            </div>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="relative flex items-center justify-center">
            <span className="w-full border-t border-white/10" />
            <span className="absolute bg-[#0B0D10] px-3 text-[11px] font-mono text-gray-500 uppercase">
              Or with email
            </span>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 font-semibold mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="developer@codeflow.ai"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-[#151A21] text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 font-semibold mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-[#151A21] text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full py-3"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to CodeFlow
            </Button>
          </form>

          <p className="text-center text-xs text-gray-500">
            New to CodeFlow?{' '}
            <Link to="/onboarding" className="text-indigo-400 font-semibold hover:underline">
              Create an account & start onboarding
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
