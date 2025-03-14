# pylint: disable=missing-class-docstring,too-few-public-methods
"""
Serializers for the API
"""
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Video, Artist, Festival, Comment, CustomUser, SavedVideo

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom token serializer to include user role
    """
    # pylint: disable=abstract-method
    def validate(self, attrs):
        data = super().validate(attrs)
        data["role"] = self.user.role
        return data
    # pylint: enable=abstract-method

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for creating a user
    """
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'password', 'email', 'role']

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password'],
            role=validated_data.get('role', 'member'),
        )
        return user

class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = '__all__'

class ArtistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artist
        fields = '__all__'

class FestivalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Festival
        fields = [
            'id',
            'name',
            'description',
            'start_date',
            'end_date',
            'location',
            'image',
            'is_public'
        ]

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'

class SavedVideoSerializer(serializers.ModelSerializer):
    video = VideoSerializer()

    class Meta:
        model = SavedVideo
        fields = ['id', 'user', 'video', 'created_at']
