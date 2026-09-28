from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Q

from .models import Project, Task, SubTask, TimeLog, ChatMessage
from .serializers import (
    ProjectSerializer, TaskSerializer, SubTaskSerializer,
    TimeLogSerializer, ChatMessageSerializer,
    UserSerializer, RegisterSerializer
)

# Authentication Views
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({'error': 'Please provide both username and password'}, status=status.HTTP_400_BAD_REQUEST)
    
    user = authenticate(username=username, password=password)
    if not user:
        # Check if demo user can be auto-logged in
        try:
            user = User.objects.get(username=username)
            if user.check_password(password):
                pass
            else:
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
            
    token, _ = Token.objects.get_or_create(user=user)
    return Response({
        'token': token.key,
        'user': UserSerializer(user).data
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def current_user(request):
    if request.user.is_authenticated:
        return Response(UserSerializer(request.user).data)
    # Default demo user info
    return Response({
        'id': 1,
        'username': 'demo_user',
        'first_name': 'Tom',
        'last_name': 'Pelosky',
        'email': 'tom@ronasit.com'
    })


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all().order_by('id')
    serializer_class = ProjectSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Project.objects.all()
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        return queryset


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Task.objects.all()
        project_id = self.request.query_params.get('project')
        status_val = self.request.query_params.get('status')
        priority = self.request.query_params.get('priority')
        search = self.request.query_params.get('search')

        if project_id:
            queryset = queryset.filter(project_id=project_id)
        if status_val:
            queryset = queryset.filter(status=status_val)
        if priority:
            queryset = queryset.filter(priority=priority)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | 
                Q(description__icontains=search) |
                Q(assignee_name__icontains=search)
            )
        return queryset

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        task = self.get_object()
        new_status = request.data.get('status')
        if new_status:
            task.status = new_status
            if new_status == 'done':
                task.progress_percentage = 100
            task.save()
            return Response(TaskSerializer(task).data)
        return Response({'error': 'status is required'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def add_subtask(self, request, pk=None):
        task = self.get_object()
        title = request.data.get('title')
        if not title:
            return Response({'error': 'title is required'}, status=status.HTTP_400_BAD_REQUEST)
        subtask = SubTask.objects.create(task=task, title=title)
        return Response(SubTaskSerializer(subtask).data, status=status.HTTP_201_CREATED)


class SubTaskViewSet(viewsets.ModelViewSet):
    queryset = SubTask.objects.all()
    serializer_class = SubTaskSerializer
    permission_classes = [AllowAny]

    @action(detail=True, methods=['post'])
    def toggle(self, request, pk=None):
        subtask = self.get_object()
        subtask.is_completed = not subtask.is_completed
        subtask.save()
        return Response(SubTaskSerializer(subtask).data)


class TimeLogViewSet(viewsets.ModelViewSet):
    queryset = TimeLog.objects.all().order_by('order')
    serializer_class = TimeLogSerializer
    permission_classes = [AllowAny]


class ChatMessageViewSet(viewsets.ModelViewSet):
    queryset = ChatMessage.objects.all().order_by('timestamp')
    serializer_class = ChatMessageSerializer
    permission_classes = [AllowAny]
