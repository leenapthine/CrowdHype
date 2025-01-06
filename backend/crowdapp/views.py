# pylint:
from rest_framework import viewsets
from .models import Video, Artist, Festival, Like, Comment
from .serializers import VideoSerializer, ArtistSerializer, FestivalSerializer, LikeSerializer, CommentSerializer

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