from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
from django.dispatch import receiver

class User(AbstractUser):
    email = models.EmailField(max_length=100, unique=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

class Volunteer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    # Add any volunteer-specific fields here

    def __str__(self):
        return self.user.email

class Organization(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    charity_number = models.CharField(max_length=100, unique=True)
    logo = models.ImageField(upload_to='organization_logos/', null=True, blank=True)
    description = models.TextField()
    approved = models.BooleanField(default=False)

    def __str__(self):
        return self.user.email

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """Create corresponding profile when a user is created"""
    if created and hasattr(instance, '_profile_type'):
        if instance._profile_type == 'volunteer':
            Volunteer.objects.create(user=instance)
        elif instance._profile_type == 'organization':
            Organization.objects.create(user=instance)

