import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import {
  FileCode,
  Folder,
  Play,
  Copy,
  Check,
  Sparkles,
  Bug,
  ShieldCheck,
  Cpu,
  HelpCircle,
  FilePlus,
  Save,
  RotateCcw,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { aiService } from '../../services/aiService';

interface FileItem {
  name: string;
  language: string;
  path: string;
  content: string;
}

const INITIAL_FILES: FileItem[] = [
  {
    name: 'auth.py',
    language: 'python',
    path: 'src/api/auth.py',
    content: `from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["auth"])

SECRET_KEY = "cf_super_secure_jwt_secret_dev_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

class Token(BaseModel):
    access_token: str
    token_type: str
    expires_in: int

def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire, "iat": datetime.utcnow()})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # In production, verify against argon2id hashed password in DB
    if form_data.username != "developer@codeflow.ai" or form_data.password != "admin":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": form_data.username})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    }`,
  },
  {
    name: 'recommender.py',
    language: 'python',
    path: 'src/services/recommender.py',
    content: `import numpy as np

def cosine_similarity_safe(a: np.ndarray, b: np.ndarray, eps: float = 1e-8) -> float:
    """Safe cosine similarity avoiding zero-division on sparse zero-norm vectors."""
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    
    if norm_a < eps or norm_b < eps:
        return 0.0
        
    return float(np.dot(a, b) / (norm_a * norm_b))

def rank_top_k(target_vector: np.ndarray, candidate_matrix: np.ndarray, k: int = 10):
    scores = np.array([cosine_similarity_safe(target_vector, row) for row in candidate_matrix])
    top_indices = np.argsort(scores)[::-1][:k]
    return top_indices, scores[top_indices]`,
  },
  {
    name: 'useAuthStore.ts',
    language: 'typescript',
    path: 'src/store/useAuthStore.ts',
    content: `import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('cf_token'),
  isAuthenticated: !!localStorage.getItem('cf_token'),
  login: (email, token) => {
    localStorage.setItem('cf_token', token);
    set({ user: { id: '1', email, role: 'developer' }, token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('cf_token');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));`,
  },
];

export const CodeEditorWorkspace: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>(INITIAL_FILES);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [aiResult, setAiResult] = useState<{ action: string; content: string; code?: string } | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const { addToast } = useAppStore();
  const currentFile = files[activeFileIndex];

  const handleEditorChange = (value: string | undefined) => {
    if (value === undefined) return;
    setFiles((prev) =>
      prev.map((f, i) => (i === activeFileIndex ? { ...f, content: value } : f))
    );
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    addToast({ title: 'Copied', description: 'Code copied to clipboard.', type: 'info' });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunAiAction = async (action: string) => {
    setIsAiLoading(true);
    try {
      const res = await aiService.runAction({
        action,
        code_snippet: currentFile.content,
        programming_language: currentFile.language,
        prompt: `/${action} active file: ${currentFile.name}`,
      });
      setAiResult({
        action,
        content: res.content,
        code: res.code_block,
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleApplyAiCode = () => {
    if (!aiResult?.code) return;
    handleEditorChange(aiResult.code);
    addToast({
      title: 'Code Applied',
      description: `Updated ${currentFile.name} with AI recommendations.`,
      type: 'success',
    });
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)] rounded-3xl border border-gray-200/80 dark:border-white/10 bg-white dark:bg-[#11151A] overflow-hidden shadow-sm select-none">
      {/* Panel 1: File Explorer */}
      <div className="w-full lg:w-60 border-b lg:border-b-0 lg:border-r border-gray-200/80 dark:border-white/10 bg-gray-50/70 dark:bg-[#0B0D10]/50 p-3 flex flex-col shrink-0">
        <div className="flex items-center justify-between px-2 py-1 mb-2">
          <span className="text-[11px] font-mono uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider">
            Workspace Explorer
          </span>
          <button
            onClick={() =>
              addToast({ title: 'New File', description: 'File creation enabled.', type: 'info' })
            }
            className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            title="New File"
          >
            <FilePlus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5 px-2 py-1 text-xs text-gray-500 dark:text-gray-400 font-semibold font-mono">
            <Folder className="w-3.5 h-3.5 text-indigo-500" />
            <span>src/</span>
          </div>

          {files.map((file, idx) => (
            <button
              key={file.path}
              onClick={() => setActiveFileIndex(idx)}
              className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-left text-xs font-mono transition-colors ${
                activeFileIndex === idx
                  ? 'bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{file.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Panel 2: Monaco Editor Center */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#1E1E1E]">
        {/* Editor Tab Bar */}
        <div className="h-10 border-b border-gray-800 bg-[#141414] px-4 flex items-center justify-between text-xs font-mono text-gray-300">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-white">{currentFile.name}</span>
            <span className="text-[10px] text-gray-500 font-sans">({currentFile.path})</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={() =>
                addToast({ title: 'Saved', description: `Saved ${currentFile.name} locally.`, type: 'success' })
              }
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-sans font-medium transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>
          </div>
        </div>

        {/* Monaco Editor Component */}
        <div className="flex-1 min-h-[300px]">
          <Editor
            height="100%"
            theme="vs-dark"
            language={currentFile.language}
            value={currentFile.content}
            onChange={handleEditorChange}
            options={{
              minimap: { enabled: true },
              fontSize: 13,
              fontFamily: "'JetBrains Mono', monospace",
              fontLigatures: true,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 4,
              cursorBlinking: 'smooth',
              lineNumbers: 'on',
            }}
          />
        </div>
      </div>

      {/* Panel 3: Contextual AI Assistant Panel */}
      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-gray-200/80 dark:border-white/10 bg-white dark:bg-[#11151A] p-4 flex flex-col shrink-0">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span className="text-sm font-bold text-gray-900 dark:text-white">AI Code Assistant</span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-500 font-semibold">
            Groq LLaMA
          </span>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          {[
            { action: 'debug', label: 'Debug Bug', icon: Bug },
            { action: 'explain', label: 'Explain Logic', icon: HelpCircle },
            { action: 'review', label: 'Security Review', icon: ShieldCheck },
            { action: 'test', label: 'Unit Tests', icon: Play },
            { action: 'optimize', label: 'Optimize', icon: Cpu },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.action}
                onClick={() => handleRunAiAction(item.action)}
                disabled={isAiLoading}
                className="flex items-center gap-1.5 p-2 rounded-xl border border-gray-200 dark:border-white/10 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/10 text-xs font-medium text-gray-700 dark:text-gray-300 transition-all text-left group"
              >
                <Icon className="w-3.5 h-3.5 text-indigo-500 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* AI Output Result Box */}
        <div className="flex-1 mt-4 rounded-2xl border border-indigo-500/20 bg-indigo-50/10 dark:bg-indigo-500/5 p-3.5 overflow-y-auto text-xs space-y-3">
          {isAiLoading ? (
            <div className="py-8 text-center text-gray-400 font-mono space-y-2">
              <Sparkles className="w-6 h-6 text-indigo-500 animate-spin mx-auto" />
              <p>Analyzing syntax & dependencies...</p>
            </div>
          ) : aiResult ? (
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-indigo-500/10 mb-2">
                <span className="font-mono font-semibold uppercase text-indigo-600 dark:text-indigo-400">
                  /{aiResult.action} Output
                </span>
                {aiResult.code && (
                  <button
                    onClick={handleApplyAiCode}
                    className="px-2 py-0.5 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-[10px]"
                  >
                    Apply to Editor
                  </button>
                )}
              </div>
              <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                {aiResult.content}
              </div>
              {aiResult.code && (
                <pre className="mt-2 p-2 rounded bg-black/50 text-gray-200 font-mono text-[11px] overflow-x-auto">
                  {aiResult.code}
                </pre>
              )}
            </div>
          ) : (
            <div className="py-10 text-center text-gray-400">
              <Sparkles className="w-8 h-8 text-indigo-500/40 mx-auto mb-2" />
              <p className="text-xs">Click any action above to run AI code analysis on {currentFile.name}.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
