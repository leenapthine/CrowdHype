# pylint:
"""
URLS for the API
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VideoViewSet, ArtistViewSet, FestivalViewSet, LikeViewSet, CommentViewSet

router = DefaultRouter()
router.register(r'videos', VideoViewSet, basename='video')
router.register(r'artists', ArtistViewSet, basename='artist')
router.register(r'festivals', FestivalViewSet, basename='festival')
router.register(r'likes', LikeViewSet, basename='like')
router.register(r'comments', CommentViewSet, basename='comment')

urlpatterns = [
    path('', include(router.urls)),
]
