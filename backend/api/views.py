# pylint: disable=missing-class-docstring,too-many-ancestors,no-member
"""
This file contains the views for the API.
"""
import os

# Django Imports
from django.conf import settings
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

# Third-Party Imports (DRF, SimpleJWT)
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action, api_view
from rest_framework.authtoken.models import Token
from rest_framework_simplejwt.views import TokenObtainPairView

# Local Imports (Models & Serializers)
from .models import Video, Artist, Festival, Comment, SavedVideo
from .serializers import (
    VideoSerializer,
    ArtistSerializer,
    FestivalSerializer,
    CommentSerializer,
    UserSerializer,
    SavedVideoSerializer,
    CustomTokenObtainPairSerializer
)

@api_view(["POST"])
def login_view(request):
    """ API endpoint for user login
    """
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
    queryset = Video.objects.all().order_by("-upload_date")
    serializer_class = VideoSerializer

class ArtistViewSet(viewsets.ModelViewSet):
    queryset = Artist.objects.all()
    serializer_class = ArtistSerializer

@method_decorator(csrf_exempt, name="dispatch")
class FestivalViewSet(viewsets.ModelViewSet):
    queryset = Festival.objects.all()
    serializer_class = FestivalSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        """ Set the user as the creator of the festival
        """
        serializer.save()

    @action(detail=True, methods=['patch'])
    def toggle_privacy(self, _request, _pk=None):
        """ Toggle the privacy of a festival
        """
        festival = self.get_object()
        festival.is_public = not festival.is_public
        festival.save()
        return Response({"is_public": festival.is_public})

    @action(detail=True, methods=['delete'])
    # pylint: disable=unused-argument
    def delete_festival(self, request, pk=None):
        """ Delete a festival
        """
        festival = self.get_object()

        # Check if festival has an image and delete it from filesystem
        if festival.image:
            image_path = os.path.join(settings.MEDIA_ROOT, str(festival.image))
            if os.path.exists(image_path):
                os.remove(image_path)

        festival.delete()
        return Response({"message": "Festival deleted"}, status=status.HTTP_204_NO_CONTENT)
    # pylint: enable=unused-argument

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
