from django.db import models
from django.contrib.auth.models import User

class Project(models.Model):
    CATEGORY_CHOICES = [
        ('Core Services', 'Core Services'),
        ('Frontend Apps', 'Frontend Apps'),
        ('Infrastructure', 'Infrastructure'),
    ]

    name = models.CharField(max_length=150)
    repo_name = models.CharField(max_length=150, default='org/repo')
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Core Services')
    description = models.TextField(blank=True, default='')
    color = models.CharField(max_length=30, default='#6366F1')
    icon = models.CharField(max_length=50, default='terminal')
    branch = models.CharField(max_length=50, default='main')
    ci_status = models.CharField(max_length=30, default='passing') # passing, failing, running
    sprint_name = models.CharField(max_length=100, default='Sprint 24: Q3 Alpha Release')
    due_date_str = models.CharField(max_length=100, default='Oct 14, 2026')
    tracked_time_str = models.CharField(max_length=100, default='142 PRs merged')
    members_count = models.IntegerField(default=18)
    owner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='projects')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.repo_name})"


class Task(models.Model):
    STATUS_CHOICES = [
        ('backlog', 'Backlog / Triage'),
        ('in_dev', 'In Development'),
        ('code_review', 'Code Review / PR'),
        ('testing', 'CI/CD & Testing'),
        ('done', 'Deployed / Done'),
    ]

    PRIORITY_CHOICES = [
        ('low', 'P3 - Low'),
        ('medium', 'P2 - Medium'),
        ('high', 'P1 - High'),
        ('urgent', 'P0 - Blocker'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, default='')
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tasks')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='backlog')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    order = models.IntegerField(default=0)

    # Developer metadata
    branch_name = models.CharField(max_length=100, blank=True, default='feat/core-service')
    pr_number = models.CharField(max_length=50, blank=True, default='') # e.g. '#248'
    code_diff = models.CharField(max_length=50, blank=True, default='+142 -28')
    language = models.CharField(max_length=50, blank=True, default='TypeScript') # Python, TypeScript, Go, Rust, Docker, SQL

    # Assignee details
    assignee_name = models.CharField(max_length=100, default='Alex Chen')
    assignee_avatar = models.CharField(max_length=255, blank=True, default='')
    secondary_assignee_name = models.CharField(max_length=100, blank=True, default='')
    secondary_assignee_avatar = models.CharField(max_length=255, blank=True, default='')

    # Tags e.g. ["Backend", "Auth", "Security"]
    tags = models.JSONField(default=list, blank=True)

    comments_count = models.IntegerField(default=0)
    attachments_count = models.IntegerField(default=0)
    progress_percentage = models.IntegerField(default=0)
    due_date = models.CharField(max_length=100, blank=True, default='')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return f"{self.title} ({self.status})"


class SubTask(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='subtasks')
    title = models.CharField(max_length=255)
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {'Done' if self.is_completed else 'Pending'}"


class TimeLog(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='timelogs', null=True, blank=True)
    day = models.CharField(max_length=10) # Mon, Tue, Wed, Thu, Fri, Sat, Sun
    hours = models.FloatField(default=0.0)
    commits_count = models.IntegerField(default=12)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.day}: {self.hours}h ({self.commits_count} commits)"


class ChatMessage(models.Model):
    SENDER_TYPES = [
        ('user', 'Developer'),
        ('ai', 'Groq Dev Copilot'),
        ('team', 'Peer Engineer'),
    ]

    sender_type = models.CharField(max_length=20, choices=SENDER_TYPES, default='user')
    sender_name = models.CharField(max_length=100, default='Dev')
    sender_avatar = models.CharField(max_length=255, blank=True, default='')
    message = models.TextField()
    task = models.ForeignKey(Task, on_delete=models.SET_NULL, null=True, blank=True, related_name='chat_messages')
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"{self.sender_name}: {self.message[:30]}"
