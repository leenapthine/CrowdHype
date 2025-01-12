from tests.unittests.base_test import TestCaseBase
from rest_framework import status
from django.contrib.auth.models import User
from api.models import Video, Artist, Festival, Like, Comment
from django.core.files.uploadedfile import SimpleUploadedFile
from datetime import date

class TestViews(TestCaseBase):
    def setUp(self):
        """Setup common data for tests"""
        super().setUp()
        # Create a test user
        self.user = User.objects.create_user(username="testuser", password="password")
        self.client.login(username="testuser", password="password")

        Video.objects.all().delete()  # Ensure no leftover videos
        
        # Create a sample video
        self.video = Video.objects.create(
            title="Test Video",
            description="Test Description",
            uploader=self.user,
            video_file=SimpleUploadedFile("test.mp4", b"file_content", content_type="video/mp4"),
        )

        # Create a sample artist
        self.artist = Artist.objects.create(
            name="Test Artist",
            bio="This is a test bio."
        )

        # Create a sample festival
        self.festival = Festival.objects.create(
            name="Test Festival",
            description="Test Description",
            start_date=date(2025, 1, 1),
            end_date=date(2025, 1, 5),
            location="Test Location",
        )

        # Create a sample like
        self.like = Like.objects.create(
            user=self.user,
            video=self.video,
        )

        # Create a sample comment
        self.comment = Comment.objects.create(
            user=self.user,
            video=self.video,
            content="Test Comment"
        )

    def test_video_list(self):
        """Test retrieving the list of videos"""
        response = self.client.get("/api/videos/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], "Test Video")

    def test_video_detail(self):
        """Test retrieving a single video"""
        response = self.client.get(f"/api/videos/{self.video.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Test Video")

    def test_video_create(self):
        """Test creating a new video"""
        video_data = {
            "title": "New Video",
            "description": "New Description",
            "video_file": SimpleUploadedFile("new_test.mp4", b"file_content", content_type="video/mp4"),
        }
        response = self.client.post("/api/videos/", video_data, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Video.objects.count(), 2)

    def test_video_update(self):
        """Test updating a video"""
        updated_data = {
            "title": "Updated Title",
        }
        response = self.client.patch(
            f"/api/videos/{self.video.id}/",
            updated_data,
            content_type="application/json",  # Specify the correct content type
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.video.refresh_from_db()
        self.assertEqual(self.video.title, "Updated Title")


    def test_video_delete(self):
        """Test deleting a video"""
        response = self.client.delete(f"/api/videos/{self.video.id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Video.objects.count(), 0)

    def test_artist_list(self):
        """Test retrieving the list of artists"""
        response = self.client.get("/api/artists/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "Test Artist")

    def test_festival_list(self):
        """Test retrieving the list of festivals"""
        response = self.client.get("/api/festivals/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "Test Festival")

    def test_like_create(self):
        """Test creating a like"""
        like_data = {
            "user": self.user.id,
            "video": self.video.id,
        }
        response = self.client.post("/api/likes/", like_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Like.objects.count(), 2)

    def test_comment_create(self):
        """Test creating a comment"""
        comment_data = {
            "user": self.user.id,
            "video": self.video.id,
            "content": "New Comment",
        }
        response = self.client.post("/api/comments/", comment_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Comment.objects.count(), 2)

    def test_comment_list(self):
        """Test retrieving comments for a video"""
        response = self.client.get(f"/api/comments/?video={self.video.id}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["content"], "Test Comment")
