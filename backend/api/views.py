# pylint: disable=missing-class-docstring,too-many-ancestors,no-member
"""
This file contains the views for the API.
"""
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Video, Artist, Festival, Like, Comment, SavedVideo
from .serializers import (
    VideoSerializer,
    ArtistSerializer,
    FestivalSerializer,
    LikeSerializer,
    CommentSerializer,
    UserSerializer,
    SavedVideoSerializer,
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

class SavedVideoViewSet(viewsets.ModelViewSet):
    """
    API view for saved videos
    """
    permission_classes = [IsAuthenticated]
    serializer_class = SavedVideoSerializer
    queryset = SavedVideo.objects.all()

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)
    
    @action(detail=False, methods=["get"])
    def get(self, request):
        """
        Get all saved videos for the authenticated user.
        """
        saved_videos = self.get_queryset()
        serializer = self.get_serializer(saved_videos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=["get"])
    def is_saved(self, request, pk=None):
        """
        Check if a specific video is saved
        """
        video_id = request.query_params.get('video_id')
        if not video_id:
            return Response({"error": "Video ID is required"}, status=400)
        
        is_saved = SavedVideo.objects.filter(user=request.user, video_id=video_id).exists()
        return Response({"is_saved": is_saved})

    @action(detail=False, methods=["post"])
    def save(self, request):
        """
        Save a video for the authenticated user.
        """
        video_id = request.data.get('video')
        if not video_id:
            return Response({"error": "Video ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        video = Video.objects.filter(id=video_id).first()
        if not video:
            return Response({"error": "Video not found"}, status=status.HTTP_404_NOT_FOUND)

        saved_video, created = SavedVideo.objects.get_or_create(user=request.user, video=video)

        if not created:
            return Response({"message": "Video is already saved"}, status=status.HTTP_200_OK)

        serializer = self.get_serializer(saved_video)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=["delete"])
    def unsave(self, request):
        """
        Unsave a video for the authenticated user.
        """
        video_id = request.data.get('video')
        saved_video = SavedVideo.objects.filter(user=request.user, video_id=video_id).first()
        if saved_video:
            saved_video.delete()
            return Response({"message": "Video unsaved successfully"}, status=status.HTTP_204_NO_CONTENT)

        return Response({"error": "Save not found"}, status=status.HTTP_404_NOT_FOUND)

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
    """
    ViewSet for handling likes
    """
    queryset = Like.objects.all()
    serializer_class = LikeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Return likes for the authenticated user
        """
        return self.queryset.filter(user=self.request.user)

    @action(detail=True, methods=["get"])
    def is_liked(self, request, pk=None):
        """
        Check if a specific video is liked by the user
        """
        video_id = pk
        is_liked = Like.objects.filter(user=request.user, video_id=video_id).exists()
        return Response({"is_liked": is_liked}, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"])
    def get_liked_videos(self, request):
        """
        Get all liked videos for the authenticated user
        """
        likes = self.get_queryset()
        serializer = self.get_serializer(likes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=["post"])
    def like_video(self, request):
        """
        Like a video
        """
        video_id = request.data.get('video')
        if not video_id:
            return Response({"error": "Video ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        like, created = Like.objects.get_or_create(user=request.user, video_id=video_id)

        if created:
            return Response({"message": "Video liked successfully"}, status=status.HTTP_201_CREATED)
        else:
            return Response({"message": "Video already liked"}, status=status.HTTP_200_OK)

    @action(detail=False, methods=["delete"])
    def unlike_video(self, request):
        """
        Unlike a video
        """
        video_id = request.data.get('video')
        like = Like.objects.filter(user=request.user, video_id=video_id).first()

        if like:
            like.delete()
            return Response({"message": "Video unliked successfully"}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"error": "Like not found"}, status=status.HTTP_404_NOT_FOUND)

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
