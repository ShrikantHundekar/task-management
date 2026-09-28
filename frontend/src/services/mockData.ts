import { Project, Task, Workspace, AppNotification, AnalyticsSummary, AIConversation } from '../types';

export const INITIAL_WORKSPACES: Workspace[] = [
  { id: 'dev', name: 'Development', icon: 'Code2', color: '#6366F1', role: 'Owner', projectsCount: 3 },
  { id: 'personal', name: 'Personal', icon: 'User', color: '#10B981', role: 'Personal', projectsCount: 1 },
  { id: 'univ', name: 'University', icon: 'GraduationCap', color: '#F59E0B', role: 'Collaborator', projectsCount: 1 },
  { id: 'freelance', name: 'Freelance', icon: 'Briefcase', color: '#EC4899', role: 'Admin', projectsCount: 1 },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 1,
    user_id: 1,
    name: 'AI Resume Analyzer',
    description: 'Automated ATS scanner and keyword extractor powered by FastAPI, spaCy, and React with Groq LLM integration.',
    programming_language: 'Python',
    framework: 'FastAPI · React',
    repository_url: 'https://github.com/codeflow/ai-resume-analyzer',
    status: 'active',
    created_at: '2026-09-01T10:00:00Z',
    updated_at: '2026-09-23T14:30:00Z',
    tasks_count: 12,
    completed_tasks_count: 8,
    is_favorite: true,
    members_count: 3,
  },
  {
    id: 2,
    user_id: 1,
    name: 'Movie Recommendation System',
    description: 'Hybrid collaborative filtering and neural embeddings model with fast vector search and Next.js frontend.',
    programming_language: 'Python',
    framework: 'PyTorch · Next.js',
    repository_url: 'https://github.com/codeflow/movie-recommender',
    status: 'active',
    created_at: '2026-09-05T09:00:00Z',
    updated_at: '2026-09-22T18:15:00Z',
    tasks_count: 9,
    completed_tasks_count: 5,
    is_favorite: true,
    members_count: 2,
  },
  {
    id: 3,
    user_id: 1,
    name: 'Developer Portfolio',
    description: 'High-performance interactive 3D portfolio showcase with WebGL shaders, Tailwind CSS, and headless CMS.',
    programming_language: 'TypeScript',
    framework: 'React · Three.js',
    repository_url: 'https://github.com/codeflow/dev-portfolio',
    status: 'active',
    created_at: '2026-09-10T11:00:00Z',
    updated_at: '2026-09-20T16:00:00Z',
    tasks_count: 6,
    completed_tasks_count: 5,
    is_favorite: false,
    members_count: 1,
  },
  {
    id: 4,
    user_id: 1,
    name: 'E-Commerce Platform',
    description: 'Microservices-based multi-vendor storefront with distributed transactions, Stripe webhooks, and Redis cache.',
    programming_language: 'Go',
    framework: 'Gin · PostgreSQL · React',
    repository_url: 'https://github.com/codeflow/ecommerce-platform',
    status: 'active',
    created_at: '2026-08-15T08:00:00Z',
    updated_at: '2026-09-21T11:45:00Z',
    tasks_count: 15,
    completed_tasks_count: 6,
    is_favorite: false,
    members_count: 4,
  },
  {
    id: 5,
    user_id: 1,
    name: 'Quantum Cryptography Simulator',
    description: 'BB84 protocol simulation and quantum key distribution testbed compiling Qiskit circuit kernels to WebAssembly.',
    programming_language: 'Python',
    framework: 'Qiskit · WebAssembly',
    repository_url: 'https://github.com/codeflow/quantum-crypto-sim',
    status: 'active',
    created_at: '2026-09-12T14:00:00Z',
    updated_at: '2026-09-19T10:20:00Z',
    tasks_count: 8,
    completed_tasks_count: 2,
    is_favorite: false,
    members_count: 2,
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 101,
    project_id: 1,
    project_name: 'AI Resume Analyzer',
    task_number: 'RES-101',
    title: 'Implement JWT Authentication & Refresh Tokens',
    description: 'Implement secure asymmetric RS256 JWT access token and rotating refresh token lifecycle with httpOnly cookie storage.',
    acceptance_criteria: [
      'Access tokens expire in 15 minutes',
      'Refresh tokens stored with argon2id hashes in database',
      'Automatic token renewal interceptor in client API client',
      'Revocation blacklist supported in Redis',
    ],
    status: 'in_progress',
    priority: 'high',
    programming_language: 'Python',
    framework: 'FastAPI',
    code_snippet: `from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi import HTTPException, status

SECRET_KEY = "cf_secret_developer_env_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire, "iat": datetime.utcnow()})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)`,
    assignee_name: 'Alex Rivera',
    assignee_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    estimated_hours: 8,
    actual_hours: 5,
    due_date: '2026-09-24T17:00:00Z',
    created_at: '2026-09-20T09:00:00Z',
    updated_at: '2026-09-23T15:00:00Z',
    ai_assisted: true,
    comments_count: 3,
    labels: [
      { id: 1, name: 'Backend', color: '#6366F1' },
      { id: 2, name: 'Security', color: '#EF4444' },
      { id: 3, name: 'API', color: '#3B82F6' },
    ],
    subtasks: [
      { id: 1011, task_id: 101, title: 'Define User and Token Pydantic models', is_completed: true, order: 1 },
      { id: 1012, task_id: 101, title: 'Implement password hashing with bcrypt/argon2', is_completed: true, order: 2 },
      { id: 1013, task_id: 101, title: 'Create /auth/login and /auth/refresh endpoints', is_completed: true, order: 3 },
      { id: 1014, task_id: 101, title: 'Write FastAPI OAuth2PasswordBearer dependency', is_completed: true, order: 4 },
      { id: 1015, task_id: 101, title: 'Add frontend interceptor to retry on 401', is_completed: false, order: 5 },
      { id: 1016, task_id: 101, title: 'Write integration test suite with pytest', is_completed: false, order: 6 },
    ],
  },
  {
    id: 102,
    project_id: 2,
    project_name: 'Movie Recommendation System',
    task_number: 'REC-204',
    title: 'Build Collaborative Filtering Recommendation API',
    description: 'Construct high-throughput FastAPI inference endpoint that accepts user history vectors and returns top-20 cosine similar movies.',
    acceptance_criteria: [
      'Sub-50ms response time on 100k embedding index',
      'Graceful fallback to genre popularity when cold-starting',
      'Batch vector computation support',
    ],
    status: 'todo',
    priority: 'high',
    programming_language: 'Python',
    framework: 'FastAPI · PyTorch',
    code_snippet: `@router.post("/recommend", response_model=RecommendationResponse)
async def get_recommendations(
    request: RecommendationRequest,
    model: RecModel = Depends(get_recommender_model)
):
    embeddings = model.encode_user_history(request.history_ids)
    scores, indices = model.index.search(embeddings, k=20)
    return {"movie_ids": indices.tolist(), "scores": scores.tolist()}`,
    assignee_name: 'Elena Rostova',
    assignee_avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face',
    estimated_hours: 12,
    actual_hours: 2,
    due_date: '2026-09-25T18:00:00Z',
    created_at: '2026-09-21T11:00:00Z',
    ai_assisted: true,
    comments_count: 1,
    labels: [
      { id: 4, name: 'AI/ML', color: '#8B5CF6' },
      { id: 3, name: 'API', color: '#3B82F6' },
    ],
    subtasks: [
      { id: 1021, task_id: 102, title: 'Export trained PyTorch weights to ONNX format', is_completed: true, order: 1 },
      { id: 1022, task_id: 102, title: 'Build FAISS index loading pipeline', is_completed: false, order: 2 },
      { id: 1023, task_id: 102, title: 'Add Prometheus latency metrics middleware', is_completed: false, order: 3 },
      { id: 1024, task_id: 102, title: 'Validate cold start fallback scoring', is_completed: false, order: 4 },
    ],
  },
  {
    id: 103,
    project_id: 2,
    project_name: 'Movie Recommendation System',
    task_number: 'REC-208',
    title: 'Fix Movie Similarity Calculation Edge Cases',
    description: 'Diagnose zero-division and NaN score vectors when users have disjoint genre ratings or null runtime metadata.',
    acceptance_criteria: [
      'Handle zero-norm vector edge case with laplace smoothing',
      'Filter out unrated movies without valid feature matrices',
    ],
    status: 'testing',
    priority: 'critical',
    programming_language: 'Python',
    framework: 'NumPy · Scipy',
    code_snippet: `def cosine_similarity_safe(a: np.ndarray, b: np.ndarray, eps: float = 1e-8) -> float:
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    if norm_a < eps or norm_b < eps:
        return 0.0
    return float(np.dot(a, b) / (norm_a * norm_b))`,
    assignee_name: 'Liam Chen',
    assignee_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    estimated_hours: 4,
    actual_hours: 4,
    due_date: '2026-09-23T20:00:00Z',
    created_at: '2026-09-22T08:30:00Z',
    ai_assisted: true,
    comments_count: 5,
    labels: [
      { id: 5, name: 'Bugfix', color: '#EF4444' },
      { id: 4, name: 'AI/ML', color: '#8B5CF6' },
    ],
    subtasks: [
      { id: 1031, task_id: 103, title: 'Reproduce NaN similarity in test harness', is_completed: true, order: 1 },
      { id: 1032, task_id: 103, title: 'Add epsilon clamp to denominator', is_completed: true, order: 2 },
      { id: 1033, task_id: 103, title: 'Run matrix regression tests on 50k benchmark', is_completed: false, order: 3 },
    ],
  },
  {
    id: 104,
    project_id: 3,
    project_name: 'Developer Portfolio',
    task_number: 'DEV-301',
    title: 'Create React 3D Dashboard Canvas',
    description: 'Implement interactive particle background using Three.js and React Three Fiber with dynamic lighting and camera orbit.',
    status: 'done',
    priority: 'medium',
    programming_language: 'TypeScript',
    framework: 'React · Three.js',
    assignee_name: 'Alex Rivera',
    assignee_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    estimated_hours: 10,
    actual_hours: 9,
    due_date: '2026-09-18T16:00:00Z',
    created_at: '2026-09-14T10:00:00Z',
    ai_assisted: false,
    comments_count: 2,
    labels: [
      { id: 6, name: 'Frontend', color: '#10B981' },
      { id: 7, name: 'WebGL', color: '#06B6D4' },
    ],
    subtasks: [
      { id: 1041, task_id: 104, title: 'Setup R3F Canvas and orthographic camera', is_completed: true, order: 1 },
      { id: 1042, task_id: 104, title: 'Custom GLSL point shader with noise offset', is_completed: true, order: 2 },
      { id: 1043, task_id: 104, title: 'Window resize and DPR optimization', is_completed: true, order: 3 },
    ],
  },
  {
    id: 105,
    project_id: 1,
    project_name: 'AI Resume Analyzer',
    task_number: 'RES-105',
    title: 'Write Pytest Suite for Keyword Matcher',
    description: 'Comprehensive unit tests for TF-IDF keyword extraction, hard skill recognition, and education parsing engines.',
    status: 'in_review',
    priority: 'medium',
    programming_language: 'Python',
    framework: 'Pytest · spaCy',
    code_snippet: `def test_keyword_matcher_precision():
    sample_text = "Experienced Senior Python Engineer with 6 years of FastAPI and Docker."
    matcher = SkillExtractor()
    skills = matcher.extract(sample_text)
    assert "Python" in skills
    assert "FastAPI" in skills
    assert "Docker" in skills`,
    assignee_name: 'Sarah Connor',
    assignee_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    estimated_hours: 6,
    actual_hours: 5,
    due_date: '2026-09-24T12:00:00Z',
    created_at: '2026-09-20T14:00:00Z',
    ai_assisted: true,
    comments_count: 4,
    labels: [
      { id: 8, name: 'Testing', color: '#F59E0B' },
      { id: 1, name: 'Backend', color: '#6366F1' },
    ],
    subtasks: [
      { id: 1051, task_id: 105, title: 'Unit tests for regex date parsing', is_completed: true, order: 1 },
      { id: 1052, task_id: 105, title: 'Mock external Groq API calls in fixtures', is_completed: true, order: 2 },
      { id: 1053, task_id: 105, title: 'Achieve 85% branch coverage on extractor', is_completed: false, order: 3 },
    ],
  },
  {
    id: 106,
    project_id: 4,
    project_name: 'E-Commerce Platform',
    task_number: 'ECO-402',
    title: 'Optimize Database Queries & Composite Indexes',
    description: 'Analyze slow query log in PostgreSQL, optimize product search join paths, and create covering indexes for catalog queries.',
    status: 'in_progress',
    priority: 'high',
    programming_language: 'Go',
    framework: 'PostgreSQL · Gorm',
    code_snippet: `-- Covering index for catalog filtering
CREATE INDEX CONCURRENTLY idx_products_category_price_status
ON products (category_id, price ASC, status)
INCLUDE (title, thumbnail_url, rating);`,
    assignee_name: 'Elena Rostova',
    assignee_avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face',
    estimated_hours: 8,
    actual_hours: 6,
    due_date: '2026-09-26T15:00:00Z',
    created_at: '2026-09-19T13:00:00Z',
    ai_assisted: true,
    comments_count: 2,
    labels: [
      { id: 9, name: 'Database', color: '#10B981' },
      { id: 10, name: 'Performance', color: '#EC4899' },
    ],
    subtasks: [
      { id: 1061, task_id: 106, title: 'Run EXPLAIN ANALYZE on product filter query', is_completed: true, order: 1 },
      { id: 1062, task_id: 106, title: 'Add compound B-tree index on categories and price', is_completed: true, order: 2 },
      { id: 1063, task_id: 106, title: 'Benchmark p95 latency under 200 req/s load', is_completed: false, order: 3 },
    ],
  },
  {
    id: 107,
    project_id: 1,
    project_name: 'AI Resume Analyzer',
    task_number: 'RES-102',
    title: 'Implement Multi-Format File Upload (PDF/DOCX)',
    description: 'Build chunked file upload pipeline with MIME type verification, virus scan hook, and textract parsing pipeline.',
    status: 'done',
    priority: 'medium',
    programming_language: 'Python',
    framework: 'FastAPI · pdfminer',
    assignee_name: 'Liam Chen',
    assignee_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    estimated_hours: 6,
    actual_hours: 6,
    due_date: '2026-09-17T17:00:00Z',
    created_at: '2026-09-15T09:00:00Z',
    ai_assisted: false,
    comments_count: 1,
    labels: [
      { id: 1, name: 'Backend', color: '#6366F1' },
      { id: 3, name: 'API', color: '#3B82F6' },
    ],
    subtasks: [
      { id: 1071, task_id: 107, title: 'File size limit validation middleware', is_completed: true, order: 1 },
      { id: 1072, task_id: 107, title: 'Extract raw text from PDF and DOCX files', is_completed: true, order: 2 },
      { id: 1073, task_id: 107, title: 'Store sanitized files in S3-compatible storage', is_completed: true, order: 3 },
    ],
  },
  {
    id: 108,
    project_id: 1,
    project_name: 'AI Resume Analyzer',
    task_number: 'RES-109',
    title: 'Build Autonomous AI Task Planner with Groq',
    description: 'Integrate Groq ultra-low-latency LLaMA-3.3-70B model to parse user task requests and autonomously generate structured subtasks with time estimations.',
    acceptance_criteria: [
      'Structured JSON output adhering to TaskSchema',
      'Response latency < 650ms via Groq API',
      'Automatic dependency graph derivation',
    ],
    status: 'in_progress',
    priority: 'critical',
    programming_language: 'Python',
    framework: 'Groq SDK · LangChain',
    code_snippet: `from groq import Groq
client = Groq(api_key=GROQ_API_KEY)

def generate_task_plan(prompt: str) -> dict:
    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": "You are CodeFlow AI. Output valid JSON only."},
            {"role": "user", "content": f"Deconstruct into subtasks: {prompt}"}
        ],
        temperature=0.2,
        response_format={"type": "json_object"}
    )
    return json.loads(completion.choices[0].message.content)`,
    assignee_name: 'Alex Rivera',
    assignee_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    estimated_hours: 14,
    actual_hours: 8,
    due_date: '2026-09-24T18:00:00Z',
    created_at: '2026-09-18T10:00:00Z',
    ai_assisted: true,
    comments_count: 6,
    labels: [
      { id: 4, name: 'AI/ML', color: '#8B5CF6' },
      { id: 1, name: 'Backend', color: '#6366F1' },
      { id: 10, name: 'Performance', color: '#EC4899' },
    ],
    subtasks: [
      { id: 1081, task_id: 108, title: 'Setup Groq API client with fallback retry strategy', is_completed: true, order: 1 },
      { id: 1082, task_id: 108, title: 'Design zero-shot JSON decomposition system prompt', is_completed: true, order: 2 },
      { id: 1083, task_id: 108, title: 'Implement SSE streaming endpoint for AI thoughts', is_completed: true, order: 3 },
      { id: 1084, task_id: 108, title: 'Build one-click Batch Subtask Acceptance UI', is_completed: false, order: 4 },
      { id: 1085, task_id: 108, title: 'Telemetry and token usage cost tracking', is_completed: false, order: 5 },
    ],
  },
  {
    id: 109,
    project_id: 4,
    project_name: 'E-Commerce Platform',
    task_number: 'ECO-409',
    title: 'Configure Distributed Redis Cache Layer',
    description: 'Set up Redis cluster for catalog cache invalidation using pub/sub event channels triggered on inventory updates.',
    status: 'backlog',
    priority: 'medium',
    programming_language: 'Go',
    framework: 'Redis · Redigo',
    estimated_hours: 8,
    actual_hours: 0,
    due_date: '2026-09-30T17:00:00Z',
    created_at: '2026-09-21T15:00:00Z',
    ai_assisted: false,
    comments_count: 0,
    labels: [
      { id: 1, name: 'Backend', color: '#6366F1' },
      { id: 10, name: 'Performance', color: '#EC4899' },
    ],
    subtasks: [
      { id: 1091, task_id: 109, title: 'Redis cluster configuration Dockerfile', is_completed: false, order: 1 },
      { id: 1092, task_id: 109, title: 'Write Cache-Aside wrapper for product queries', is_completed: false, order: 2 },
    ],
  },
  {
    id: 110,
    project_id: 5,
    project_name: 'Quantum Cryptography Simulator',
    task_number: 'QCS-501',
    title: 'Qubit Entanglement Bell State Visualization',
    description: 'Render Bloch sphere state vectors and entangled Bell states (|Φ+⟩, |Ψ+⟩) using SVG phase angle indicators.',
    status: 'backlog',
    priority: 'low',
    programming_language: 'TypeScript',
    framework: 'React · SVG',
    estimated_hours: 12,
    actual_hours: 1,
    due_date: '2026-10-05T18:00:00Z',
    created_at: '2026-09-22T10:00:00Z',
    ai_assisted: true,
    comments_count: 1,
    labels: [
      { id: 6, name: 'Frontend', color: '#10B981' },
      { id: 4, name: 'AI/ML', color: '#8B5CF6' },
    ],
    subtasks: [
      { id: 1101, task_id: 110, title: 'Mathematical model for Bloch sphere coordinates', is_completed: true, order: 1 },
      { id: 1102, task_id: 110, title: 'Interactive rotation controls with mouse drag', is_completed: false, order: 2 },
    ],
  },
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Task Overdue Reminder',
    message: 'Fix Movie Similarity Calculation is scheduled for testing completion today.',
    type: 'task',
    timestamp: '10 minutes ago',
    read: false,
    link: '/tasks/103',
  },
  {
    id: 'notif-2',
    title: 'Sarah commented on your code',
    message: '"Great error handling structure on the auth middleware refresh flow!"',
    type: 'comment',
    timestamp: '1 hour ago',
    read: false,
    link: '/tasks/101',
  },
  {
    id: 'notif-3',
    title: 'AI Planning Generated',
    message: 'CodeFlow AI generated 5 optimized subtasks for "Autonomous AI Task Planner".',
    type: 'ai',
    timestamp: '3 hours ago',
    read: true,
    link: '/tasks/108',
  },
  {
    id: 'notif-4',
    title: 'Task Completed',
    message: 'Alex marked "Implement Multi-Format File Upload" as Done.',
    type: 'task',
    timestamp: 'Yesterday',
    read: true,
    link: '/tasks/107',
  },
];

export const INITIAL_CONVERSATIONS: AIConversation[] = [
  {
    id: 'conv-1',
    title: 'Task #101: JWT Auth Refresh Flow',
    taskId: 101,
    lastMessage: 'Here is the recommended sliding-window token refresh implementation.',
    timestamp: '10m ago',
    messages: [
      {
        id: 'msg-1',
        role: 'user',
        content: 'How should we handle concurrent token refresh requests from multiple frontend API calls without triggering race conditions?',
      },
      {
        id: 'msg-2',
        role: 'assistant',
        content: `To prevent race conditions during token renewal when multiple requests return 401 simultaneously:

1. **Use a Promise Queue / Lock**: Maintain a module-level \`isRefreshing\` boolean and a subscribers array.
2. **Batch Waiting Callbacks**: All subsequent failed requests subscribe to the single in-flight refresh promise.
3. **Replay Pending Requests**: Once the fresh JWT arrives, drain the queue and retry original requests with the updated Authorization header.`,
        code_language: 'typescript',
        code_block: `let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach(cb => cb(token));
  refreshSubscribers = [];
}

export async function handleAuthError(error: AxiosError, axiosInstance: AxiosInstance) {
  const originalRequest = error.config;
  if (error.response?.status === 401 && !originalRequest._retry) {
    if (isRefreshing) {
      return new Promise((resolve) => {
        subscribeTokenRefresh((newToken: string) => {
          originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
          resolve(axiosInstance(originalRequest));
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post('/api/v1/auth/refresh');
      const newToken = data.access_token;
      onRefreshed(newToken);
      return axiosInstance(originalRequest);
    } finally {
      isRefreshing = false;
    }
  }
  return Promise.reject(error);
}`,
      },
    ],
  },
  {
    id: 'conv-2',
    title: 'Task #103: Debug Movie Similarity NaN',
    taskId: 103,
    lastMessage: 'Zero-division was resolved by adding epsilon clamping.',
    timestamp: '2h ago',
    messages: [
      {
        id: 'msg-3',
        role: 'user',
        content: '/debug Why is the cosine similarity calculation occasionally returning NaN during sparse vector benchmarks?',
      },
      {
        id: 'msg-4',
        role: 'assistant',
        content: `The root cause is that when a movie or user has an all-zero or empty embedding, the Euclidean norm ||a|| or ||b|| evaluates to **0.0**. The denominator \`norm_a * norm_b\` becomes zero, resulting in IEEE 754 \`NaN\` (0 / 0).

**Solution:**
Add an epsilon \`eps = 1e-8\` clamp and explicitly guard against zero-length norms before division.`,
        code_language: 'python',
        code_block: `import numpy as np

def cosine_similarity_safe(a: np.ndarray, b: np.ndarray, eps: float = 1e-8) -> float:
    """Safe cosine similarity avoiding NaN on zero-norm vectors."""
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    
    # Explicit zero-vector check
    if norm_a < eps or norm_b < eps:
        return 0.0
        
    return float(np.dot(a, b) / (norm_a * norm_b))`,
      },
    ],
  },
  {
    id: 'conv-3',
    title: 'Architecture: Microservices vs Modular Monolith',
    lastMessage: 'Here is the comparative trade-off matrix for CodeFlow tasks.',
    timestamp: '1d ago',
    messages: [
      {
        id: 'msg-5',
        role: 'user',
        content: '/explain What are the pros and cons of using a modular monolith for our new E-commerce product service before splitting into Go microservices?',
      },
      {
        id: 'msg-6',
        role: 'assistant',
        content: `Starting with a **Modular Monolith** is heavily recommended for early-to-mid stage developer velocity:

* **Single Transaction Boundary**: ACID consistency across inventory and orders without complex two-phase commits or Sagas.
* **Shared Types & Schema**: No JSON/gRPC serialization drift or breaking API version mismatches.
* **Trivial Local Development**: One docker-compose / \`go run main.go\` rather than 8 separate containers.
* **Straightforward Extraction**: Maintain clean boundary interfaces in Go packages (\`package inventory\`, \`package catalog\`) so extracting to independent Go microservices later requires minimal rewriting.`,
      },
    ],
  },
];

export const INITIAL_ANALYTICS: AnalyticsSummary = {
  total_tasks: 10,
  completed_tasks: 2,
  in_progress_tasks: 4,
  pending_tasks: 3,
  overdue_tasks: 1,
  completion_rate: 68,
  avg_completion_hours: 4.8,
  total_estimated_hours: 88,
  total_actual_hours: 46,
  ai_assisted_count: 7,
  tasks_by_status: {
    backlog: 2,
    todo: 1,
    in_progress: 4,
    in_review: 1,
    testing: 1,
    done: 2,
  },
  tasks_by_priority: {
    critical: 2,
    high: 3,
    medium: 4,
    low: 1,
  },
  weekly_completion: [
    { day: 'Mon', completed: 3, created: 4 },
    { day: 'Tue', completed: 5, created: 3 },
    { day: 'Wed', completed: 6, created: 5 },
    { day: 'Thu', completed: 4, created: 2 },
    { day: 'Fri', completed: 7, created: 4 },
    { day: 'Sat', completed: 2, created: 1 },
    { day: 'Sun', completed: 3, created: 1 },
  ],
  ai_productivity_trend: [
    { week: 'W1', manualHours: 38, savedHours: 12 },
    { week: 'W2', manualHours: 35, savedHours: 18 },
    { week: 'W3', manualHours: 30, savedHours: 24 },
    { week: 'W4', manualHours: 26, savedHours: 32 },
  ],
};
