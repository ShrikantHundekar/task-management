import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { useCopilotStore } from '../store/copilotStore';
import { api } from '../services/api';
import {
  Folder,
  FileCode,
  Play,
  Terminal,
  Sparkles,
  Save,
  Check,
  Code2,
  Bug,
  ShieldCheck,
  FileText,
  Copy
} from 'lucide-react';

interface FileNode {
  name: string;
  language: string;
  content: string;
}

const INITIAL_FILES: FileNode[] = [
  {
    name: 'auth_service.py',
    language: 'python',
    content: `import bcrypt
from datetime import datetime, timedelta
from jose import jwt

SECRET_KEY = "codeflow-secret-key"
ALGORITHM = "HS256"

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode('utf-8'), hashed.encode('utf-8'))

def create_access_token(user_id: int, expires_delta: timedelta = timedelta(hours=24)) -> str:
    payload = {
        "sub": str(user_id),
        "exp": datetime.utcnow() + expires_delta
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
`,
  },
  {
    name: 'vector_search.py',
    language: 'python',
    content: `import numpy as np

def cosine_similarity(v1: np.ndarray, v2: np.ndarray) -> float:
    dot_product = np.dot(v1, v2)
    norm_v1 = np.linalg.norm(v1)
    norm_v2 = np.linalg.norm(v2)
    if norm_v1 == 0 or norm_v2 == 0:
        return 0.0
    return float(dot_product / (norm_v1 * norm_v2))

def rank_documents(query_vector: np.ndarray, doc_vectors: list[np.ndarray]) -> list[int]:
    scores = [cosine_similarity(query_vector, doc) for doc in doc_vectors]
    return sorted(range(len(scores)), key=lambda i: scores[i], reverse=True)
`,
  },
  {
    name: 'api_client.ts',
    language: 'typescript',
    content: `export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export async function fetchWithRetry<T>(url: string, retries = 3): Promise<ApiResponse<T>> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(\`HTTP error \${res.status}\`);
      const data = await res.json();
      return { data, status: res.status };
    } catch (err) {
      if (attempt === retries - 1) throw err;
      await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
    }
  }
  throw new Error("Maximum retry limit exceeded");
}
`,
  },
];

export const WorkspacePage: React.FC = () => {
  const { openCopilot, sendMessage } = useCopilotStore();
  const [files, setFiles] = useState<FileNode[]>(INITIAL_FILES);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    'CodeFlow AI Terminal initialized. Python 3.14 / Node v20 active.',
    'Ready for testing, building, and agent reasoning.',
  ]);
  const [isExecuting, setIsExecuting] = useState(false);

  const activeFile = files[activeFileIndex];

  const handleEditorChange = (value: string | undefined) => {
    if (value === undefined) return;
    setFiles((prev) =>
      prev.map((file, idx) => (idx === activeFileIndex ? { ...file, content: value } : file))
    );
  };

  const runTerminalCommand = (cmd: string) => {
    setIsExecuting(true);
    setTerminalOutput((prev) => [...prev, `$ ${cmd}`]);

    setTimeout(() => {
      if (cmd.includes('test')) {
        setTerminalOutput((prev) => [
          ...prev,
          '============================= test session starts =============================',
          'collecting ... collected 4 items',
          'tests/test_auth.py::test_hash_password PASSED                            [ 25%]',
          'tests/test_auth.py::test_verify_password PASSED                          [ 50%]',
          'tests/test_auth.py::test_jwt_expiration PASSED                           [ 75%]',
          'tests/test_auth.py::test_invalid_token PASSED                            [100%]',
          '============================== 4 passed in 0.28s ==============================',
        ]);
      } else if (cmd.includes('run')) {
        setTerminalOutput((prev) => [
          ...prev,
          '[INFO] Executing script with Groq Python JIT runtime...',
          '[SUCCESS] Script executed with exit code 0.',
        ]);
      } else {
        setTerminalOutput((prev) => [...prev, `Executed ${cmd}`]);
      }
      setIsExecuting(false);
    }, 600);
  };

  const handleAskAgentToRefactor = async () => {
    openCopilot();
    sendMessage(
      `Please review and optimize the code in ${activeFile.name}:\n\`\`\`${activeFile.language}\n${activeFile.content}\n\`\`\``
    );
  };

  const handleGenerateTests = async () => {
    openCopilot();
    sendMessage(
      `Generate comprehensive unit tests with edge cases for ${activeFile.name}:\n\`\`\`${activeFile.language}\n${activeFile.content}\n\`\`\``
    );
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col select-none overflow-hidden animate-in fade-in duration-150">
      {/* Workspace Top Toolbar */}
      <div className="h-11 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-xs font-bold text-gray-900 dark:text-white">Developer Code Workspace</h1>
          <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 px-2 py-0.5 rounded font-mono">
            Monaco Engine
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAskAgentToRefactor}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold hover:bg-indigo-100"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Refactor</span>
          </button>

          <button
            onClick={handleGenerateTests}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold hover:bg-emerald-100"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Generate Tests</span>
          </button>

          <button
            onClick={() => runTerminalCommand(`python ${activeFile.name}`)}
            disabled={isExecuting}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50"
          >
            <Play className="w-3 h-3 fill-white" />
            <span>Run Code</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* File Explorer Sidebar */}
        <div className="w-52 bg-gray-50 dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 p-3 flex flex-col justify-between shrink-0">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2 px-1">
              Explorer
            </div>
            <div className="space-y-1">
              {files.map((file, idx) => (
                <button
                  key={file.name}
                  onClick={() => setActiveFileIndex(idx)}
                  className={`w-full text-left px-2 py-1.5 rounded-md text-xs flex items-center gap-2 font-mono transition-colors ${
                    activeFileIndex === idx
                      ? 'bg-indigo-100/80 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 text-indigo-500" />
                  <span className="truncate">{file.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-900/60 text-[10px] text-gray-500">
            <span>Workspace: CodeFlow Dev Sandbox</span>
          </div>
        </div>

        {/* Editor & Terminal Column */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#1e1e1e]">
          {/* Editor Header Tab */}
          <div className="h-9 bg-[#252526] px-3 flex items-center justify-between border-b border-[#333333] shrink-0 text-xs">
            <div className="flex items-center gap-2 text-gray-200 font-mono text-xs">
              <FileCode className="w-3.5 h-3.5 text-indigo-400" />
              <span>{activeFile.name}</span>
            </div>
            <span className="text-[10px] font-mono text-gray-400">{activeFile.language}</span>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 relative">
            <Editor
              height="100%"
              language={activeFile.language}
              theme="vs-dark"
              value={activeFile.content}
              onChange={handleEditorChange}
              options={{
                fontSize: 13,
                fontFamily: "'JetBrains Mono', monospace",
                minimap: { enabled: false },
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 4,
              }}
            />
          </div>

          {/* Terminal Console Panel */}
          <div className="h-44 bg-[#181818] border-t border-[#333333] flex flex-col">
            <div className="h-8 bg-[#222222] px-3 flex items-center justify-between border-b border-[#333333] text-[11px] font-mono text-gray-300 shrink-0">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                <span>Developer Console</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => runTerminalCommand('pytest -v')}
                  className="px-2 py-0.5 rounded bg-[#333333] hover:bg-[#3e3e42] text-xs font-mono text-gray-200"
                >
                  pytest
                </button>
                <button
                  onClick={() => setTerminalOutput(['Console cleared.'])}
                  className="text-gray-400 hover:text-gray-200 text-[10px]"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="flex-1 p-3 overflow-y-auto font-mono text-[11px] text-gray-300 space-y-1">
              {terminalOutput.map((line, idx) => (
                <div key={idx} className={line.startsWith('$') ? 'text-indigo-400 font-bold' : ''}>
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
