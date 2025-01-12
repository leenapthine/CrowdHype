import os
import shutil
from django.test import TestCase, override_settings
from django.conf import settings

# Use a temporary directory for media during tests
TEST_MEDIA_ROOT = os.path.join(settings.BASE_DIR, "test_media")

@override_settings(MEDIA_ROOT=TEST_MEDIA_ROOT)
class TestCaseBase(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        # Create the test media directory
        if not os.path.exists(TEST_MEDIA_ROOT):
            os.makedirs(TEST_MEDIA_ROOT)

    @classmethod
    def tearDownClass(cls):
        super().tearDownClass()
        # Delete the test media directory
        if os.path.exists(TEST_MEDIA_ROOT):
            shutil.rmtree(TEST_MEDIA_ROOT)
