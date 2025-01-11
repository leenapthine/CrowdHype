# pylint:
"""
This file is used to configure the app name for the Django admin panel.
"""
from django.apps import AppConfig


class CrowdappConfig(AppConfig):
    """
    This class is used to configure the app name for the Django admin panel.
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'crowdapp'
