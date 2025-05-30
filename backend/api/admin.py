# pylint:
"""
admin.py is used to register the models to the admin panel
"""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Video, Artist, Festival, CustomUser, Comment, SavedVideo

admin.site.register(CustomUser, UserAdmin)
admin.site.register(Video)
admin.site.register(Artist)
admin.site.register(Festival)
admin.site.register(Comment)
admin.site.register(SavedVideo)
