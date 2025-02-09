# Generated by Django 5.1.6 on 2025-02-09 00:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("backend", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Organization",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=200)),
                ("charity_number", models.CharField(max_length=100, unique=True)),
                ("email", models.EmailField(max_length=254, unique=True)),
                (
                    "logo",
                    models.ImageField(
                        blank=True, null=True, upload_to="organization_logos/"
                    ),
                ),
                ("description", models.TextField()),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("approved", models.BooleanField(default=False)),
            ],
        ),
    ]
