import React from 'react';
import { CodeEditorWorkspace } from '../components/editor/CodeEditorWorkspace';
import { Code2, Sparkles } from 'lucide-react';

export const EditorPage: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 max-w-[1700px] mx-auto space-y-4 select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Monaco Code Workspace
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
              In-browser IDE with instant Groq AI code assistance
            </p>
          </div>
        </div>
      </div>

      <CodeEditorWorkspace />
    </div>
  );
};
