# Generated by Django 5.1.6 on 2025-02-19 19:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0007_volunteer_display_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='volunteer',
            name='animals_score',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='volunteer',
            name='community_score',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='volunteer',
            name='disability_score',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='volunteer',
            name='education_score',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='volunteer',
            name='elderly_score',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='volunteer',
            name='greener_planet_score',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='volunteer',
            name='medical_score',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='volunteer',
            name='sports_score',
            field=models.IntegerField(default=0),
        ),
    ]
