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
    SavedVideoViewSet,
)

router = DefaultRouter()
router.register(r'videos', VideoViewSet, basename='video')
router.register(r'artists', ArtistViewSet, basename='artist')
router.register(r'festivals', FestivalViewSet, basename='festival')
router.register(r'likes', LikeViewSet, basename='like')
router.register(r'comments', CommentViewSet, basename='comment')
router.register(r'saved-videos', SavedVideoViewSet, basename='savedvideo')

urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('saved-videos/is-saved/', SavedVideoViewSet.as_view({'get': 'is_saved'}), name='is-saved'),
]
