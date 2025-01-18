# pylint: disable=missing-class-docstring,too-many-ancestors,no-member
"""
This file contains the views for the API.
"""
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Video, Artist, Festival, Like, Comment
from .serializers import (
    VideoSerializer,
    ArtistSerializer,
    FestivalSerializer,
    LikeSerializer,
    CommentSerializer,
    UserSerializer,
)

class SignUpView(APIView):
    """
    API endpoint for user sign-up
    """
    def post(self, request):
        """
        Create a new user
        """
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "User created successfully"}, status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VideoViewSet(viewsets.ModelViewSet):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer

class ArtistViewSet(viewsets.ModelViewSet):
    queryset = Artist.objects.all()
    serializer_class = ArtistSerializer

class FestivalViewSet(viewsets.ModelViewSet):
    queryset = Festival.objects.all()
    serializer_class = FestivalSerializer

class LikeViewSet(viewsets.ModelViewSet):
    queryset = Like.objects.all()
    serializer_class = LikeSerializer

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
