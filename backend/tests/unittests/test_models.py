# pylint:
"""
This module contains the tests for the api models.
"""
from datetime import date, datetime
from django.core.files.uploadedfile import SimpleUploadedFile
from api.models import Video, Artist, Festival, Comment, CustomUser
from tests.unittests.base_test import TestCaseBase


# pylint: disable=no-member
class TestModels(TestCaseBase):
    """Test case for the models"""
    def setUp(self):
        super().setUp()
        # Create a sample user
        self.user = CustomUser.objects.create_user(username='testuser', password='password')
        # Create a sample video
        self.video = Video.objects.create(
            title='Test Video',
            description='Test Description',
            uploader=self.user,
            video_file=SimpleUploadedFile('test.mp4', b'file_content'),
            upload_date=datetime.now()
        )
        # Create a sample artist
        self.artist = Artist.objects.create(
            name='Test Artist',
            bio='Test Bio',
        )
        # Create a sample festival
        self.festival = Festival.objects.create(
            name='Test Festival',
            description='Test Description',
            start_date=date(2025, 1, 1),
            end_date=date(2025, 1, 5),
            location='Test Location'
        )
        # Create a sample comment
        self.comment = Comment.objects.create(
            user=self.user,
            video=self.video,
            content='Test Content',
            created_at=datetime.now()
        )

    def test_video_str(self):
        """Test the video model string representation"""
        self.assertEqual(str(self.video), "Test Video")

    def test_artist_str(self):
        """Test the artist model string representation"""
        self.assertEqual(str(self.artist), "Test Artist")

    def test_festival_str(self):
        """Test the festival model string representation"""
        self.assertEqual(str(self.festival), "Test Festival")

    def test_comment_str(self):
        """Test the comment model string representation"""
        self.assertEqual(str(self.comment), f"{self.user.username} commented on {self.video.title}")

    def test_video_fields(self):
        """Test the video fields"""
        self.assertEqual(self.video.title, 'Test Video')
        self.assertEqual(self.video.description, 'Test Description')
        self.assertEqual(self.video.uploader, self.user)
        self.assertTrue(self.video.video_file.name.startswith('videos/'))
        self.assertEqual(self.video.upload_date.date(), datetime.now().date())

    def test_artist_fields(self):
        """Test the artist fields"""
        self.assertEqual(self.artist.name, 'Test Artist')
        self.assertEqual(self.artist.bio, 'Test Bio')

    def test_festival_fields(self):
        """Test the festival fields"""
        self.assertEqual(self.festival.name, 'Test Festival')
        self.assertEqual(self.festival.description, 'Test Description')
        self.assertEqual(self.festival.start_date, date(2025, 1, 1))
        self.assertEqual(self.festival.end_date, date(2025, 1, 5))
        self.assertEqual(self.festival.location, 'Test Location')

    def test_comment_relationship(self):
        """Test the comment relationship"""
        self.assertEqual(self.comment.user, self.user)
        self.assertEqual(self.comment.video, self.video)
        self.assertEqual(self.comment.content, 'Test Content')
        self.assertEqual(self.comment.created_at.date(), datetime.now().date())
