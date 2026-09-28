from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from tasks.models import Project, Task, SubTask, TimeLog, ChatMessage

class Command(BaseCommand):
    help = 'Seeds initial developer coding management dataset'

    def handle(self, *args, **options):
        self.stdout.write('Seeding developer tasks and repositories...')

        user, _ = User.objects.get_or_create(
            username='dev_lead',
            defaults={
                'email': 'alex@codeforge.io',
                'first_name': 'Alex',
                'last_name': 'Chen',
            }
        )

        # Repositories / Projects
        projects_data = [
            {
                'name': 'Hyperion Cloud Engine',
                'repo_name': 'hyperion/core-engine',
                'category': 'Core Services',
                'color': '#6366F1',
                'icon': 'cpu',
                'branch': 'main',
                'ci_status': 'passing',
                'description': 'High-throughput distributed event streaming platform and microservices engine.',
                'sprint_name': 'Sprint 42 • Realtime Streaming & Vector DB',
                'due_date_str': 'Oct 28, 2026',
                'tracked_time_str': '84 PRs merged • 99.4% CI pass',
                'members_count': 16,
            },
            {
                'name': 'DevPulse Web Client',
                'repo_name': 'hyperion/devpulse-ui',
                'category': 'Frontend Apps',
                'color': '#06B6D4',
                'icon': 'layout',
                'branch': 'v2.4-beta',
                'ci_status': 'passing',
                'description': 'Modern web dashboard with virtualized code editors and terminal emulation.',
                'sprint_name': 'Sprint 18 • Graph Visualizer',
                'due_date_str': 'Nov 12, 2026',
                'tracked_time_str': '52 PRs merged',
                'members_count': 9,
            },
            {
                'name': 'K8s Mesh & Ingress Controller',
                'repo_name': 'hyperion/infra-mesh',
                'category': 'Infrastructure',
                'color': '#10B981',
                'icon': 'server',
                'branch': 'production',
                'ci_status': 'running',
                'description': 'Zero-trust Envoy service mesh, auto-scaling HPA, and multi-region failover.',
                'sprint_name': 'Infra Sprint 9 • eBPF Security',
                'due_date_str': 'Oct 19, 2026',
                'tracked_time_str': '31 PRs merged',
                'members_count': 7,
            },
            {
                'name': 'AuthZero OAuth2 Service',
                'repo_name': 'hyperion/auth-gateway',
                'category': 'Core Services',
                'color': '#F59E0B',
                'icon': 'shield',
                'branch': 'main',
                'ci_status': 'passing',
                'description': 'JWT token exchange, RBAC permission evaluation, and SSO SAML connectors.',
                'sprint_name': 'Sprint 21 • PKCE Refresh',
                'due_date_str': 'Nov 02, 2026',
                'tracked_time_str': '44 PRs merged',
                'members_count': 5,
            }
        ]

        main_project = None
        for pdata in projects_data:
            proj, _ = Project.objects.update_or_create(
                name=pdata['name'],
                defaults={
                    'repo_name': pdata['repo_name'],
                    'category': pdata['category'],
                    'color': pdata['color'],
                    'icon': pdata['icon'],
                    'branch': pdata['branch'],
                    'ci_status': pdata['ci_status'],
                    'description': pdata['description'],
                    'sprint_name': pdata['sprint_name'],
                    'due_date_str': pdata['due_date_str'],
                    'tracked_time_str': pdata['tracked_time_str'],
                    'members_count': pdata['members_count'],
                    'owner': user
                }
            )
            if pdata['name'] == 'Hyperion Cloud Engine':
                main_project = proj

        # Clear existing tasks
        Task.objects.filter(project=main_project).delete()

        tasks_data = [
            # 1. Backlog / Triage
            {
                'title': 'Implement distributed rate limiting via Redis token bucket',
                'description': 'Prevent API quota abuse across tenant clusters by deploying sliding window token bucket with Redis cluster fallback.',
                'status': 'backlog',
                'priority': 'high',
                'branch_name': 'feat/redis-rate-limiter',
                'pr_number': '',
                'code_diff': '+310 -15',
                'language': 'Go',
                'assignee_name': 'Alex Chen',
                'assignee_avatar': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
                'tags': ['Backend', 'Redis', 'Distributed'],
                'comments_count': 5,
                'attachments_count': 2,
                'progress_percentage': 15,
                'order': 1,
            },
            {
                'title': 'Docker multi-stage build optimization for slim alpine images',
                'description': 'Strip build toolchains and debug symbols from final runtime image to shrink container footprint from 840MB down to 48MB.',
                'status': 'backlog',
                'priority': 'medium',
                'branch_name': 'chore/dockerfile-slim',
                'pr_number': '',
                'code_diff': '+45 -120',
                'language': 'Docker',
                'assignee_name': 'Elena Rostova',
                'assignee_avatar': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face',
                'tags': ['DevOps', 'Docker', 'Optimization'],
                'comments_count': 3,
                'attachments_count': 1,
                'progress_percentage': 0,
                'order': 2,
            },
            {
                'title': 'Add Prometheus custom metrics endpoint for gRPC connection pool',
                'description': 'Export channel starvation counters, P99 handshake durations, and socket buffer backpressure indicators.',
                'status': 'backlog',
                'priority': 'low',
                'branch_name': 'feat/grpc-prometheus-metrics',
                'pr_number': '',
                'code_diff': '+180 -22',
                'language': 'Rust',
                'assignee_name': 'Marcus Vance',
                'assignee_avatar': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
                'tags': ['Observability', 'Metrics', 'gRPC'],
                'comments_count': 2,
                'attachments_count': 3,
                'progress_percentage': 10,
                'order': 3,
            },

            # 2. In Development
            {
                'title': 'Architect WebSocket pub/sub clustering with Kafka event spine',
                'description': 'Replace single-node broadcast loop with consumer group partition routing to handle 250k concurrent client streams.',
                'status': 'in_dev',
                'priority': 'urgent',
                'branch_name': 'feat/websocket-kafka-spine',
                'pr_number': '',
                'code_diff': '+540 -80',
                'language': 'Python',
                'assignee_name': 'Alex Chen',
                'assignee_avatar': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
                'tags': ['Architecture', 'Kafka', 'WebSockets'],
                'comments_count': 14,
                'attachments_count': 4,
                'progress_percentage': 65,
                'order': 1,
            },
            {
                'title': 'Refactor SQL migration scripts with zero-downtime CONCURRENTLY indexing',
                'description': 'Audit primary key sequence overflow on event_logs table and create partial covering indices without table locks.',
                'status': 'in_dev',
                'priority': 'high',
                'branch_name': 'fix/db-concurrent-indexes',
                'pr_number': '',
                'code_diff': '+95 -40',
                'language': 'SQL',
                'assignee_name': 'Sarah Jenkins',
                'assignee_avatar': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
                'tags': ['PostgreSQL', 'Performance', 'DBA'],
                'comments_count': 7,
                'attachments_count': 2,
                'progress_percentage': 40,
                'order': 2,
            },
            {
                'title': 'GraphQL schema federation for user billing & team entitlement',
                'description': 'Define Apollo subgraph boundary schemas, query plan decorators, and batch DataLoader resolvers.',
                'status': 'in_dev',
                'priority': 'medium',
                'branch_name': 'feat/gql-federation-billing',
                'pr_number': '',
                'code_diff': '+260 -35',
                'language': 'TypeScript',
                'assignee_name': 'Kavita Patel',
                'assignee_avatar': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
                'tags': ['GraphQL', 'API', 'TypeScript'],
                'comments_count': 6,
                'attachments_count': 1,
                'progress_percentage': 50,
                'order': 3,
            },

            # 3. Code Review / PR
            {
                'title': 'PR #248: OAuth2 PKCE token rotation & biometric session refresh',
                'description': 'RFC 7636 compliant code verifier exchange with hardware secure enclave key persistence and automated refresh.',
                'status': 'code_review',
                'priority': 'urgent',
                'branch_name': 'feat/pkce-jwt-rotation',
                'pr_number': '#248',
                'code_diff': '+420 -65',
                'language': 'TypeScript',
                'assignee_name': 'Kavita Patel',
                'assignee_avatar': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
                'tags': ['Security', 'Auth', 'PR #248'],
                'comments_count': 22,
                'attachments_count': 5,
                'progress_percentage': 85,
                'order': 1,
            },
            {
                'title': 'PR #251: eBPF network packet filter for ingress DDoS suppression',
                'description': 'XDP hook kernel bytecode filtering invalid TCP SYN flood headers directly at the network interface driver layer.',
                'status': 'code_review',
                'priority': 'high',
                'branch_name': 'feat/ebpf-ddos-mitigation',
                'pr_number': '#251',
                'code_diff': '+680 -110',
                'language': 'Rust',
                'assignee_name': 'Marcus Vance',
                'assignee_avatar': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
                'tags': ['Kernel', 'eBPF', 'Rust', 'PR #251'],
                'comments_count': 11,
                'attachments_count': 3,
                'progress_percentage': 90,
                'order': 2,
            },

            # 4. CI/CD & Testing
            {
                'title': 'Automated Cypress end-to-end regression suite on staging cluster',
                'description': 'Run parallelized matrix testing across Chrome, Firefox, and WebKit on GitHub Actions self-hosted runners.',
                'status': 'testing',
                'priority': 'medium',
                'branch_name': 'test/cypress-e2e-matrix',
                'pr_number': '#253',
                'code_diff': '+750 -30',
                'language': 'TypeScript',
                'assignee_name': 'Elena Rostova',
                'assignee_avatar': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face',
                'tags': ['Testing', 'Cypress', 'CI/CD'],
                'comments_count': 8,
                'attachments_count': 6,
                'progress_percentage': 75,
                'order': 1,
            },

            # 5. Deployed / Done
            {
                'title': 'Release v2.3.0: Core RPC gateway latency reduced by 42%',
                'description': 'Migrated HTTP/1.1 JSON serializations to flatbuffers protocol over HTTP/2, verified in canary rollout.',
                'status': 'done',
                'priority': 'high',
                'branch_name': 'release/v2.3.0',
                'pr_number': '#239',
                'code_diff': '+1240 -680',
                'language': 'Go',
                'assignee_name': 'Alex Chen',
                'assignee_avatar': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
                'tags': ['Production', 'Release', 'v2.3.0'],
                'comments_count': 26,
                'attachments_count': 8,
                'progress_percentage': 100,
                'order': 1,
            }
        ]

        for tdata in tasks_data:
            task = Task.objects.create(
                project=main_project,
                title=tdata['title'],
                description=tdata['description'],
                status=tdata['status'],
                priority=tdata['priority'],
                branch_name=tdata['branch_name'],
                pr_number=tdata['pr_number'],
                code_diff=tdata['code_diff'],
                language=tdata['language'],
                assignee_name=tdata['assignee_name'],
                assignee_avatar=tdata['assignee_avatar'],
                tags=tdata['tags'],
                comments_count=tdata['comments_count'],
                attachments_count=tdata['attachments_count'],
                progress_percentage=tdata['progress_percentage'],
                order=tdata['order'],
            )
            SubTask.objects.create(task=task, title='Technical RFC & Architecture Review', is_completed=True)
            SubTask.objects.create(task=task, title='Unit test coverage >= 90% and benchmark runs', is_completed=task.status in ['in_dev', 'code_review', 'testing', 'done'])
            SubTask.objects.create(task=task, title='Staging deployment & canary traffic verification', is_completed=task.status in ['testing', 'done'])
            SubTask.objects.create(task=task, title='Merged to main branch & prod telemetry signoff', is_completed=task.status == 'done')

        # TimeLogs / Commit Velocity (Mon - Sun, Commits count)
        TimeLog.objects.all().delete()
        timelogs_data = [
            {'day': 'Mon', 'hours': 7.5, 'commits_count': 24, 'order': 1},
            {'day': 'Tue', 'hours': 8.8, 'commits_count': 38, 'order': 2},
            {'day': 'Wed', 'hours': 9.2, 'commits_count': 45, 'order': 3},
            {'day': 'Thu', 'hours': 6.5, 'commits_count': 19, 'order': 4},
            {'day': 'Fri', 'hours': 8.4, 'commits_count': 41, 'order': 5},
            {'day': 'Sat', 'hours': 4.2, 'commits_count': 12, 'order': 6},
            {'day': 'Sun', 'hours': 5.0, 'commits_count': 16, 'order': 7},
        ]
        for tld in timelogs_data:
            TimeLog.objects.create(
                project=main_project,
                day=tld['day'],
                hours=tld['hours'],
                commits_count=tld['commits_count'],
                order=tld['order']
            )

        # Developer Chat Messages
        ChatMessage.objects.all().delete()
        chat_data = [
            {
                'sender_type': 'team',
                'sender_name': 'Sarah Jenkins',
                'sender_avatar': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
                'message': 'Heads up: Migration PR #248 has passed all DB replication regression benchmarks on staging.'
            },
            {
                'sender_type': 'user',
                'sender_name': 'Alex Chen',
                'sender_avatar': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
                'message': 'Awesome Sarah! I am approving the PR now. Let us trigger the canary deployment.'
            },
            {
                'sender_type': 'ai',
                'sender_name': 'Groq Dev Copilot',
                'sender_avatar': '',
                'message': "⚡ **Sprint Pulse**: 84 PRs merged this cycle. CI pipeline build time is down 18%. Let me know if you need code reviews, architectural breakdown, or automated PR checklists!"
            }
        ]
        for c in chat_data:
            ChatMessage.objects.create(
                sender_type=c['sender_type'],
                sender_name=c['sender_name'],
                sender_avatar=c['sender_avatar'],
                message=c['message']
            )

        self.stdout.write(self.style.SUCCESS('Successfully re-seeded with developer coding system data!'))
