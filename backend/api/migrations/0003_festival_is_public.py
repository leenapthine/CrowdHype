# Generated by Django 5.1.4 on 2025-01-31 04:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_savedvideo'),
    ]

    operations = [
        migrations.AddField(
            model_name='festival',
            name='is_public',
            field=models.BooleanField(default=True),
        ),
    ]
