# Generated by Django 5.1.6 on 2025-02-09 02:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("backend", "0002_opportunity"),
    ]

    operations = [
        migrations.RenameField(
            model_name="opportunity",
            old_name="location",
            new_name="location_name",
        ),
        migrations.AddField(
            model_name="opportunity",
            name="latitude",
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="opportunity",
            name="longitude",
            field=models.FloatField(blank=True, null=True),
        ),
    ]
