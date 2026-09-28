import os
import json
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

def get_groq_client(api_key=None):
    key = api_key or os.environ.get('GROQ_API_KEY') or getattr(settings, 'GROQ_API_KEY', '')
    if not key:
        return None
    try:
        from groq import Groq
        return Groq(api_key=key)
    except Exception as e:
        logger.error(f"Failed to initialize Groq client: {e}")
        return None


def chat_with_agent(message, context=None, api_key=None):
    client = get_groq_client(api_key)
    tasks_summary = ""
    if context and 'tasks' in context:
        tasks_summary = "Active Repository Tasks & PRs:\n"
        for t in context['tasks'][:10]:
            tasks_summary += f"- [{t.get('status')}] {t.get('title')} (Branch: {t.get('branch_name')}, Lang: {t.get('language')}, Priority: {t.get('priority')})\n"

    system_prompt = f"""You are DevPulse AI Copilot, a principal software architect and DevOps AI assistant embedded in a high-performance engineering task & coding management platform.
You assist developers with:
- System design and microservices architecture
- Breaking down complex features into PRs and technical milestones
- Code review checklists and security auditing
- CI/CD pipeline troubleshooting and Kubernetes optimization
- Git workflows, merge conflict resolutions, and test coverage

Be concise, technically accurate, and provide practical code or CLI snippets whenever applicable.
{tasks_summary}
"""

    if client:
        try:
            chat_completion = client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": message},
                ],
                model=getattr(settings, 'GROQ_MODEL', 'llama-3.3-70b-versatile'),
                temperature=0.4,
                max_tokens=900,
            )
            return {
                "reply": chat_completion.choices[0].message.content,
                "provider": "groq",
                "model": getattr(settings, 'GROQ_MODEL', 'llama-3.3-70b-versatile')
            }
        except Exception as e:
            logger.warning(f"Groq API call error: {e}")

    # Fallback developer responses
    lower = message.lower()
    if "sprint" in lower or "progress" in lower or "status" in lower:
        reply = "🚀 **Sprint 42 Health Report**:\n• **In Development**: 3 active services (`feat/websocket-kafka-spine`, `fix/db-concurrent-indexes`, `feat/gql-federation`).\n• **Code Review**: 2 PRs awaiting approval (`PR #248` PKCE Token Rotation, `PR #251` eBPF Filter).\n• **CI/CD Build**: Staging regression suite running (Cypress E2E matrix).\n• **Velocity**: 195 commits logged this week with 99.4% pipeline pass rate!"
    elif "pr" in lower or "review" in lower or "checklist" in lower:
        reply = "🔍 **PR Code Review Checklist for Active Sprints**:\n1. Ensure atomic database migrations use `CREATE INDEX CONCURRENTLY`.\n2. Verify zero-allocation byte buffers in gRPC request dispatch.\n3. Validate cryptographic entropy on token refresh generation.\n4. Ensure integration tests pass across matrix architectures (`amd64` and `arm64`)."
    elif "decompose" in lower or "break down" in lower:
        reply = "To break down any engineering feature or bugfix, click the **⚡ AI Decompose** action on any card. I will generate RFC requirements, subtasks, unit testing specs, and branch conventions automatically!"
    else:
        reply = f"⚡ DevPulse Copilot analyzed: **\"{message}\"**.\nRepository `hyperion/core-engine` is currently green on branch `main`. I can help draft PR specifications, review diffs, or generate unit test templates."

    return {
        "reply": reply,
        "provider": "groq-fallback",
        "model": "dev-copilot-simulated"
    }


def decompose_task(title, description="", api_key=None):
    client = get_groq_client(api_key)
    prompt = f"""You are a Principal Software Architect. Decompose this coding task/feature into 4 to 6 technical engineering subtasks.
Task Title: {title}
Description: {description}

Return ONLY valid JSON matching this schema:
{{
    "subtasks": [
        "Write RFC architecture design and protobuf/schema contracts",
        "Implement core business logic & concurrency handling",
        "Add unit tests with table-driven tests & fuzz testing",
        "Set up Docker compose integration test harness",
        "Configure CI/CD canary rollout and Prometheus metrics"
    ],
    "suggested_priority": "low" | "medium" | "high" | "urgent",
    "suggested_tags": ["Backend", "Go", "Docker"],
    "suggested_language": "Go" | "TypeScript" | "Python" | "Rust" | "SQL" | "Docker",
    "suggested_branch": "feat/short-slug",
    "estimated_hours": 8
}}
"""
    if client:
        try:
            response = client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model=getattr(settings, 'GROQ_MODEL', 'llama-3.3-70b-versatile'),
                temperature=0.2,
                response_format={"type": "json_object"}
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            logger.warning(f"Groq decomposition error: {e}")

    # Fallback decomposition
    words = title.lower()
    lang = "Go"
    tags = ["Backend", "Distributed"]
    if "redis" in words or "rate" in words:
        lang = "Go"
        tags = ["Backend", "Redis", "Distributed"]
    elif "docker" in words or "container" in words or "k8s" in words:
        lang = "Docker"
        tags = ["DevOps", "Docker", "Infra"]
    elif "sql" in words or "postgres" in words or "db" in words:
        lang = "SQL"
        tags = ["Database", "PostgreSQL", "Performance"]
    elif "auth" in words or "token" in words or "pkce" in words:
        lang = "TypeScript"
        tags = ["Security", "OAuth2", "Auth"]
    elif "ebpf" in words or "kernel" in words or "rust" in words:
        lang = "Rust"
        tags = ["Systems", "eBPF", "Rust"]

    return {
        "subtasks": [
            f"Draft architecture spec and interface interfaces for '{title}'",
            "Implement high-throughput core routines and memory pooling",
            "Write comprehensive unit tests with >=90% branch coverage",
            "Deploy staging canary and verify latency telemetry",
            "PR code review signoff and merge into main"
        ],
        "suggested_priority": "high",
        "suggested_tags": tags,
        "suggested_language": lang,
        "suggested_branch": f"feat/{title.lower().replace(' ', '-')[:25]}",
        "estimated_hours": 6
    }


def parse_natural_language_task(text, api_key=None):
    client = get_groq_client(api_key)
    prompt = f"""Parse this developer prompt into a structured engineering task:
"{text}"

Return ONLY valid JSON matching this schema:
{{
    "title": "Concise technical issue title",
    "description": "Technical specification with rationale",
    "priority": "low" | "medium" | "high" | "urgent",
    "status": "backlog" | "in_dev" | "code_review" | "testing" | "done",
    "language": "Go" | "TypeScript" | "Python" | "Rust" | "SQL" | "Docker",
    "branch_name": "feat/slug or fix/slug",
    "tags": ["Tag1", "Tag2"],
    "assignee_name": "Alex Chen"
}}
"""
    if client:
        try:
            response = client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model=getattr(settings, 'GROQ_MODEL', 'llama-3.3-70b-versatile'),
                temperature=0.2,
                response_format={"type": "json_object"}
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            logger.warning(f"Groq parsing error: {e}")

    # Fallback
    lower = text.lower()
    priority = "high" if "urgent" in lower or "fix" in lower or "bug" in lower or "blocker" in lower else "medium"
    status = "in_dev" if "start" in lower or "dev" in lower else "backlog"
    lang = "Go"
    if "python" in lower or "fastapi" in lower: lang = "Python"
    elif "react" in lower or "ui" in lower or "ts" in lower: lang = "TypeScript"
    elif "rust" in lower: lang = "Rust"
    elif "docker" in lower or "k8s" in lower: lang = "Docker"
    elif "sql" in lower or "db" in lower: lang = "SQL"

    prefix = "fix" if "fix" in lower or "bug" in lower else "feat"
    slug = text.lower().replace(' ', '-')[:24]

    return {
        "title": text.capitalize(),
        "description": f"Engineered by Groq Dev Copilot from technical prompt: '{text}'",
        "priority": priority,
        "status": status,
        "language": lang,
        "branch_name": f"{prefix}/{slug}",
        "tags": ["Engineered", lang],
        "assignee_name": "Alex Chen"
    }
