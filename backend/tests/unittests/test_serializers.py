# pylint:
from tests.unittests.base_test import TestCaseBase
from django.contrib.auth.models import User
from rest_framework.exceptions import ValidationError
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from io import BytesIO
from datetime import date
from django.core.files.uploadedfile import SimpleUploadedFile
from api.models import Video, Artist, Festival, Like, Comment
from api.serializers import (
    VideoSerializer,
    ArtistSerializer,
    FestivalSerializer,
    LikeSerializer,
    CommentSerializer,
)


class SerializerTestCase(TestCaseBase):
    def setUp(self):
        super().setUp()
        # Create a sample user
        self.user = User.objects.create_user(username="testuser", password="password")

        # Create a sample video
        self.video = Video.objects.create(
            title="Sample Video",
            description="A sample video description.",
            uploader=self.user,
            video_file=SimpleUploadedFile("test.mp4", b"file_content"),
        )

        # Create a sample artist
        self.artist = Artist.objects.create(
            name="Sample Artist",
            bio="A sample artist bio.",
        )

        # Create a sample festival
        self.festival = Festival.objects.create(
            name="Sample Festival",
            description="A sample festival description.",
            start_date=date(2025, 1, 1),
            end_date=date(2025, 1, 5),
            location="Sample Location",
        )

        # Create a like
        self.like = Like.objects.create(user=self.user, video=self.video)

        # Create a comment
        self.comment = Comment.objects.create(
            user=self.user, video=self.video, content="This is a sample comment."
        )

    def test_video_serializer(self):
        """Test the VideoSerializer"""
        serializer = VideoSerializer(instance=self.video)
        self.assertEqual(serializer.data["title"], "Sample Video")
        self.assertEqual(serializer.data["uploader"], self.user.id)

    def test_artist_serializer(self):
        """Test the ArtistSerializer"""
        serializer = ArtistSerializer(instance=self.artist)
        self.assertEqual(serializer.data["name"], "Sample Artist")
        self.assertEqual(serializer.data["bio"], "A sample artist bio.")

    def test_festival_serializer(self):
        """Test the FestivalSerializer"""
        serializer = FestivalSerializer(instance=self.festival)
        self.assertEqual(serializer.data["name"], "Sample Festival")
        self.assertEqual(serializer.data["start_date"], "2025-01-01")
        self.assertEqual(serializer.data["end_date"], "2025-01-05")

    def test_like_serializer(self):
        """Test the LikeSerializer"""
        serializer = LikeSerializer(instance=self.like)
        self.assertEqual(serializer.data["user"], self.user.id)
        self.assertEqual(serializer.data["video"], self.video.id)

    def test_comment_serializer(self):
        """Test the CommentSerializer"""
        serializer = CommentSerializer(instance=self.comment)
        self.assertEqual(serializer.data["user"], self.user.id)
        self.assertEqual(serializer.data["content"], "This is a sample comment.")

    def test_video_serializer_validation(self):
        """Test VideoSerializer validation"""
        invalid_data = {
            "title": "",
            "description": "A sample video description.",
            "uploader": self.user.id,
        }
        serializer = VideoSerializer(data=invalid_data)
        with self.assertRaises(ValidationError):
            serializer.is_valid(raise_exception=True)

    def test_artist_serializer_deserialization(self):
        """Test deserialization with ArtistSerializer"""
        data = {"name": "New Artist", "bio": "A new artist bio."}
        serializer = ArtistSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        artist = serializer.save()
        self.assertEqual(artist.name, "New Artist")
        self.assertEqual(artist.bio, "A new artist bio.")

    def test_json_serialization(self):
        """Test JSON serialization and deserialization"""
        # Serialize a video instance
        serializer = VideoSerializer(instance=self.video)
        json_data = JSONRenderer().render(serializer.data)

        # Deserialize the JSON data
        stream = BytesIO(json_data)
        parsed_data = JSONParser().parse(stream)
        self.assertEqual(parsed_data["title"], "Sample Video")
        self.assertEqual(parsed_data["uploader"], self.user.id)
