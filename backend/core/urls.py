from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from tasks.views import (
    ProjectViewSet, TaskViewSet, SubTaskViewSet,
    TimeLogViewSet, ChatMessageViewSet,
    register_user, login_user, current_user
)
from ai_agent.views import ai_chat, ai_decompose, ai_parse_task, ai_test_key

router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'tasks', TaskViewSet, basename='task')
router.register(r'subtasks', SubTaskViewSet, basename='subtask')
router.register(r'timelogs', TimeLogViewSet, basename='timelog')
router.register(r'chat-messages', ChatMessageViewSet, basename='chatmessage')

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # REST API endpoints
    path('api/', include(router.urls)),
    
    # Auth endpoints
    path('api/auth/register/', register_user, name='register'),
    path('api/auth/login/', login_user, name='login'),
    path('api/auth/me/', current_user, name='current_user'),
    
    # AI Agent endpoints
    path('api/ai/chat/', ai_chat, name='ai_chat'),
    path('api/ai/decompose/', ai_decompose, name='ai_decompose'),
    path('api/ai/parse-task/', ai_parse_task, name='ai_parse_task'),
    path('api/ai/test-key/', ai_test_key, name='ai_test_key'),
]
