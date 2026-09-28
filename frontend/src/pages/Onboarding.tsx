import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/ui/Logo';
import { Button } from '../components/ui/Button';
import { useAppStore } from '../store/useAppStore';
import { useProjectStore } from '../store/projectStore';
import {
  Code2,
  Smartphone,
  Cpu,
  Server,
  Database,
  Terminal,
  ArrowRight,
  Check,
  Sparkles,
} from 'lucide-react';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useAppStore();
  const { createProject } = useProjectStore();

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedTrack, setSelectedTrack] = useState<string>('ai_ml');
  const [projectName, setProjectName] = useState('My First Microservice');
  const [language, setLanguage] = useState('Python');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tracks = [
    { id: 'web', label: 'Web Applications', desc: 'React, Next.js, Vue, Tailwind', icon: Code2 },
    { id: 'backend', label: 'Backend APIs', desc: 'FastAPI, Go, Node.js, PostgreSQL', icon: Server },
    { id: 'ai_ml', label: 'AI / Machine Learning', desc: 'PyTorch, Groq, LangChain, spaCy', icon: Cpu },
    { id: 'mobile', label: 'Mobile Apps', desc: 'React Native, Flutter, Swift, Kotlin', icon: Smartphone },
    { id: 'data', label: 'Data & Pipelines', desc: 'BigQuery, Kafka, Spark, dbt', icon: Database },
    { id: 'cli', label: 'Developer Tools', desc: 'CLI scripts, Rust, WebAssembly', icon: Terminal },
  ];

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      await createProject({
        name: projectName.trim() || 'My First Project',
        programming_language: language,
        framework: selectedTrack === 'ai_ml' ? 'FastAPI · Groq' : 'React · Vite',
        description: 'Initialized during developer onboarding wizard.',
      });
      addToast({
        title: 'Workspace Initialized',
        description: `Created project "${projectName}". Welcome to CodeFlow AI!`,
        type: 'success',
      });
      navigate('/');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0D10] text-gray-100 flex flex-col items-center justify-center p-6 select-none">
      <div className="w-full max-w-xl space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-block">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Welcome to CodeFlow AI
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Step {step} of 2 · Tailor your intelligent coding workspace
          </p>
        </div>

        {step === 1 ? (
          <div className="rounded-3xl border border-white/10 bg-[#151A21] p-6 sm:p-8 space-y-6 shadow-xl">
            <div>
              <h2 className="text-base font-bold text-white">What do you primary build?</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                We optimize your AI prompts and project templates based on your engineering focus.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tracks.map((t) => {
                const Icon = t.icon;
                const isSelected = selectedTrack === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTrack(t.id)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-500/10 ring-2 ring-indigo-500/30'
                        : 'border-white/10 bg-white/[0.02] hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-indigo-400' : 'text-gray-400'}`} />
                      {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
                    </div>
                    <p className="font-semibold text-sm text-white mt-2">{t.label}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5 font-mono">{t.desc}</p>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                variant="primary"
                size="md"
                onClick={() => setStep(2)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Continue to Project Setup
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-[#151A21] p-6 sm:p-8 space-y-6 shadow-xl">
            <div>
              <h2 className="text-base font-bold text-white">Initialize Your First Project</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Set up your primary repository workspace to begin organizing sprints and code tasks.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-gray-400 font-semibold mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-gray-400 font-semibold mb-1">
                  Primary Programming Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Python">Python</option>
                  <option value="TypeScript">TypeScript</option>
                  <option value="Go">Go (Golang)</option>
                  <option value="Rust">Rust</option>
                  <option value="C++">C++</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-gray-400 hover:text-white"
              >
                ← Back
              </button>
              <Button
                variant="ai"
                size="md"
                onClick={handleFinish}
                isLoading={isSubmitting}
                rightIcon={<Sparkles className="w-4 h-4" />}
              >
                Launch Workspace
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
