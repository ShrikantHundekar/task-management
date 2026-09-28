from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Project, Task, SubTask, TimeLog, ChatMessage

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
        )
        return user


class SubTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubTask
        fields = ['id', 'task', 'title', 'is_completed', 'created_at']


class TaskSerializer(serializers.ModelSerializer):
    subtasks = SubTaskSerializer(many=True, read_only=True)
    project_name = serializers.CharField(source='project.name', read_only=True)

    class Meta:
        model = Task
        fields = [
            'id', 'project', 'project_name', 'title', 'description',
            'status', 'priority', 'order',
            'branch_name', 'pr_number', 'code_diff', 'language',
            'assignee_name', 'assignee_avatar',
            'secondary_assignee_name', 'secondary_assignee_avatar',
            'tags', 'comments_count', 'attachments_count',
            'progress_percentage', 'due_date',
            'subtasks', 'created_at', 'updated_at'
        ]


class ProjectSerializer(serializers.ModelSerializer):
    tasks_count = serializers.SerializerMethodField()
    completed_tasks_count = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'name', 'repo_name', 'category', 'description', 'color', 'icon',
            'branch', 'ci_status', 'sprint_name',
            'due_date_str', 'tracked_time_str',
            'members_count', 'owner', 'created_at', 'updated_at',
            'tasks_count', 'completed_tasks_count'
        ]

    def get_tasks_count(self, obj):
        return obj.tasks.count()

    def get_completed_tasks_count(self, obj):
        return obj.tasks.filter(status='done').count()


class TimeLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeLog
        fields = ['id', 'project', 'day', 'hours', 'commits_count', 'order']


class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['id', 'sender_type', 'sender_name', 'sender_avatar', 'message', 'task', 'timestamp']
