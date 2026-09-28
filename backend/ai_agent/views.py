from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from . import groq_service

def extract_api_key(request):
    return request.headers.get('X-Groq-Api-Key') or request.data.get('groq_api_key')

@api_view(['POST'])
@permission_classes([AllowAny])
def ai_chat(request):
    message = request.data.get('message', '')
    if not message:
        return Response({'error': 'Message is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    context = request.data.get('context', {})
    api_key = extract_api_key(request)
    
    result = groq_service.chat_with_agent(message, context=context, api_key=api_key)
    return Response(result)


@api_view(['POST'])
@permission_classes([AllowAny])
def ai_decompose(request):
    title = request.data.get('title', '')
    if not title:
        return Response({'error': 'Title is required'}, status=status.HTTP_400_BAD_REQUEST)
        
    description = request.data.get('description', '')
    api_key = extract_api_key(request)
    
    result = groq_service.decompose_task(title, description, api_key=api_key)
    return Response(result)


@api_view(['POST'])
@permission_classes([AllowAny])
def ai_parse_task(request):
    text = request.data.get('text', '')
    if not text:
        return Response({'error': 'Text is required'}, status=status.HTTP_400_BAD_REQUEST)
        
    api_key = extract_api_key(request)
    result = groq_service.parse_natural_language_task(text, api_key=api_key)
    return Response(result)


@api_view(['POST'])
@permission_classes([AllowAny])
def ai_test_key(request):
    api_key = extract_api_key(request)
    if not api_key:
        return Response({'valid': False, 'message': 'No API key provided'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        from groq import Groq
        client = Groq(api_key=api_key)
        # Test call
        res = client.chat.completions.create(
            messages=[{"role": "user", "content": "Ping"}],
            model="llama-3.3-70b-versatile",
            max_tokens=5
        )
        return Response({'valid': True, 'message': 'Groq API Key is active & connected!'})
    except Exception as e:
        return Response({'valid': False, 'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
