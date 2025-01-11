# pylint:
"""
admin.py is used to register the models to the admin panel
"""
from django.contrib import admin
from .models import Video, Artist, Festival

admin.site.register(Video)
admin.site.register(Artist)
admin.site.register(Festival)
