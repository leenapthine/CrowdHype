# pylint:
"""
Models for the api app
"""
import uuid
import os
from datetime import datetime
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

def unique_video_filename(instance, filename):
    """
    Generate a unique filename to prevent overwrites.
    """
    ext = os.path.splitext(filename)[-1]
    unique_name = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{uuid.uuid4().hex[:8]}{ext}"
    return os.path.join("videos/", unique_name)

class Video(models.Model):
    """
    Video model
    """
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    uploader = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='videos', default=1
    )
    video_file = models.FileField(upload_to=unique_video_filename)
    upload_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.title)

    class Meta:
        ordering = ["-upload_date"]

class SavedVideo(models.Model):
    """
    Model for saved videos
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    video = models.ForeignKey(Video, on_delete=models.CASCADE, related_name='saved_videos')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        """
        Meta class for SavedVideo
        """
        # pylint: disable=too-few-public-methods
        unique_together = ('user', 'video')

    def __str__(self):
        # pylint: disable=no-member
        # - pylint cannot infer object attribute username and title
        return f"{self.user.username} saved {self.video.title}"

class Artist(models.Model):
    """
    Artist model
    """
    name = models.CharField(max_length=255)
    bio = models.TextField(blank=True)
    image = models.ImageField(upload_to='artists/', blank=True, null=True)

    def __str__(self):
        return str(self.name)

class Festival(models.Model):
    """
    Festival model
    """
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    start_date = models.DateField()
    end_date = models.DateField()
    location = models.CharField(max_length=255, blank=True)
    image = models.ImageField(upload_to='festivals/', blank=True, null=True)
    is_public = models.BooleanField(default=True)

    def __str__(self):
        return str(self.name)

class Comment(models.Model):
    """
    Comment model
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    video = models.ForeignKey(Video, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} commented on {self.video.title}"

class CustomUser(AbstractUser):
    """
    Custom user model
    """
    ROLE_CHOICES = [
        ('member', 'Member'),
        ('promoter', 'Promoter'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='member')
