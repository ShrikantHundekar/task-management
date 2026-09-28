import { api } from './api';
import { AIMessage, AIConversation } from '../types';
import { INITIAL_CONVERSATIONS } from './mockData';

export const aiService = {
  async runAction(data: {
    action: string;
    task_id?: number;
    prompt?: string;
    code_snippet?: string;
    programming_language?: string;
  }): Promise<{ action: string; content: string; structured_data?: any; code_block?: string }> {
    return api.runAiAction(data);
  },

  async getConversations(): Promise<AIConversation[]> {
    const raw = localStorage.getItem('cf_conversations');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {}
    }
    localStorage.setItem('cf_conversations', JSON.stringify(INITIAL_CONVERSATIONS));
    return INITIAL_CONVERSATIONS;
  },

  async saveConversation(conv: AIConversation): Promise<void> {
    const convs = await this.getConversations();
    const existingIndex = convs.findIndex((c) => c.id === conv.id);
    let updated: AIConversation[];
    if (existingIndex >= 0) {
      updated = convs.map((c) => (c.id === conv.id ? conv : c));
    } else {
      updated = [conv, ...convs];
    }
    localStorage.setItem('cf_conversations', JSON.stringify(updated));
  },

  async chatStream(
    prompt: string,
    onChunk: (chunk: string) => void,
    onDone: (fullText: string, codeBlock?: string, codeLang?: string) => void,
    options?: { codeSnippet?: string; language?: string; model?: string }
  ): Promise<void> {
    const isDebug = prompt.startsWith('/debug') || prompt.toLowerCase().includes('debug') || prompt.toLowerCase().includes('error');
    const isTest = prompt.startsWith('/test') || prompt.toLowerCase().includes('test');
    const isExplain = prompt.startsWith('/explain') || prompt.toLowerCase().includes('explain');
    const isOptimize = prompt.startsWith('/optimize') || prompt.toLowerCase().includes('optimize');

    let reply = '';
    let codeBlock = '';
    let codeLang = options?.language || 'python';

    if (isDebug) {
      reply = `### CodeFlow AI Debug Analysis\nIdentified potential vulnerability in concurrent token lifecycle:\n\n1. **Race Condition Guard**: Token refresh triggers simultaneously when concurrent workers receive 401.\n2. **Graceful Blacklist Fallback**: Add Redis blacklist check before accepting signature.`;
      codeBlock = `try:\n    payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])\n    user_id = payload.get("sub")\n    if not user_id or is_token_blacklisted(token):\n        raise HTTPException(status_code=401, detail="Token invalid or revoked")\nexcept jwt.ExpiredSignatureError:\n    raise HTTPException(status_code=401, detail="Token expired")`;
    } else if (isTest) {
      reply = `### Generated Pytest Suite\nComprehensive test coverage for unit validation:`;
      codeBlock = `@pytest.mark.asyncio\nasync def test_auth_token_issuance_and_refresh(async_client: AsyncClient):\n    res = await async_client.post("/api/v1/auth/login", json={"email": "dev@codeflow.ai", "password": "secure"})\n    assert res.status_code == 200\n    tokens = res.json()\n    assert "access_token" in tokens\n    assert tokens["token_type"] == "bearer"`;
    } else if (isOptimize) {
      reply = `### Performance Optimization Report\n- Replaced quadratic nested loop with O(N) hash map index lookup.\n- Reduced allocation overhead by reusing pre-allocated slice buffers.\n- p99 latency dropped from 142ms to 18ms.`;
      codeBlock = `// Optimized linear-time set intersection in Go\nfunc FindMatchingSkills(required, candidate []string) []string {\n    set := make(map[string]struct{}, len(required))\n    for _, r := range required {\n        set[r] = struct{}{}\n    }\n    var matches []string\n    for _, c := range candidate {\n        if _, exists := set[c]; exists {\n            matches = append(matches, c)\n        }\n    }\n    return matches\n}`;
      codeLang = 'go';
    } else {
      reply = `I analyzed your query: **"${prompt}"**.\n\nCodeFlow AI recommends structuring your logic using single-responsibility modules. This guarantees clean test isolation and minimizes coupling across project boundaries.`;
      if (options?.codeSnippet) {
        codeBlock = options.codeSnippet;
      }
    }

    // Simulate ultra-fast token streaming
    const words = reply.split(' ');
    let current = '';
    for (let i = 0; i < words.length; i++) {
      current += (i === 0 ? '' : ' ') + words[i];
      onChunk(current);
      await new Promise((r) => setTimeout(r, 25));
    }

    onDone(reply, codeBlock || undefined, codeLang);
  },
};
