# pylint: disable=missing-class-docstring,too-many-ancestors,no-member
"""
This file contains the views for the API.
"""
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action, api_view
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
    CustomTokenObtainPairSerializer
)

@api_view(["POST"])
def login_view(request):
    username = request.data.get("username")
    password = request.data.get("password")
    user = authenticate(username=username, password=password)

    if user:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            "accessToken": str(token),
            "role": user.role
        })
    return Response({"error": "Invalid credentials"}, status=400)

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
        # pylint: disable=unused-argument
        # - action decorator requires the request argument
        saved_videos = self.get_queryset()
        serializer = self.get_serializer(saved_videos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"])
    def is_saved(self, request, pk=None):
        """
        Check if a specific video is saved
        """
        if pk is None:
            return Response({"error": "Video ID (pk) is required"}, status=400)

        is_saved = SavedVideo.objects.filter(user=request.user, video_id=pk).exists()
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
            return Response(
                {"message": "Video unsaved successfully"}, status=status.HTTP_204_NO_CONTENT
            )

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
    queryset = Like.objects.all()
    serializer_class = LikeSerializer

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer