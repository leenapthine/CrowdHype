# pylint:
"""
URLS for the API
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    VideoViewSet,
    ArtistViewSet,
    FestivalViewSet,
    LikeViewSet,
    CommentViewSet,
    SignUpView,
)

router = DefaultRouter()
router.register(r'videos', VideoViewSet, basename='video')
router.register(r'artists', ArtistViewSet, basename='artist')
router.register(r'festivals', FestivalViewSet, basename='festival')
router.register(r'likes', LikeViewSet, basename='like')
router.register(r'comments', CommentViewSet, basename='comment')

urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),  # Removed redundant 'api/'
    path('', include(router.urls)),  # DefaultRouter routes
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # Removed 'api/'
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Removed 'api/'
]
