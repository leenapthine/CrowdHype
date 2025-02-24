# pylint:
"""
URLS for the API
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    VideoViewSet,
    ArtistViewSet,
    FestivalViewSet,
    CommentViewSet,
    SignUpView,
    SavedVideoViewSet,
    CustomTokenObtainPairView,
)

router = DefaultRouter()
router.register(r'videos', VideoViewSet, basename='video')
router.register(r'artists', ArtistViewSet, basename='artist')
router.register(r'festivals', FestivalViewSet, basename='festival')
router.register(r'comments', CommentViewSet, basename='comment')
router.register(r'saved-videos', SavedVideoViewSet, basename='savedvideo')

urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('', include(router.urls)),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('saved-videos/is-saved/', SavedVideoViewSet.as_view({'get': 'is_saved'}), name='is-saved'),
    path('festivals/<int:pk>/toggle_privacy/', FestivalViewSet.as_view({
        'patch': 'toggle_privacy'
    }), name='toggle_privacy'),
    path('festivals/<int:pk>/delete/', FestivalViewSet.as_view({
        'delete': 'delete_festival'
    }), name='delete_festival'),
]
