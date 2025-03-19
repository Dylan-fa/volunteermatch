# Generated by Django 5.1.6 on 2025-03-17 23:58

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0007_discussion_answer'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='discussion',
            name='organization',
        ),
        migrations.AddField(
            model_name='discussion',
            name='opportunity',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='backend.opportunity'),
        ),
    ]
