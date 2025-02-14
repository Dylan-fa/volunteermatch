from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    email = models.EmailField(max_length=100, unique=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    
    class Meta:
        verbose_name_plural = "categories"
        
    def __str__(self):
        return self.name
    

class Interest(models.Model):
    name = models.CharField(max_length=100, unique=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='interests')
    description = models.TextField(blank=True)
    
    def __str__(self):
        return self.name

class Volunteer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    friends = models.ManyToManyField('self', through='Friendship', symmetrical=False)
    interests = models.ManyToManyField(Interest, related_name='interested_volunteers')


    def __str__(self):
        return self.user.email

class Friendship(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    ]
    
    from_volunteer = models.ForeignKey(Volunteer, on_delete=models.CASCADE, related_name='friendships_initiated')
    to_volunteer = models.ForeignKey(Volunteer, on_delete=models.CASCADE, related_name='friendships_received')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['from_volunteer', 'to_volunteer']
        
    def __str__(self):
        return f"{self.from_volunteer} -> {self.to_volunteer} ({self.status})"

class Organization(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    charity_number = models.CharField(max_length=100, unique=True)
    logo = models.ImageField(upload_to='organization_logos/', null=True, blank=True)
    description = models.TextField()
    approved = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class Opportunity(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='opportunities')
    title = models.CharField(max_length=200)
    description = models.TextField()
    requirements = models.TextField()
    location_name = models.CharField(max_length=200)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    categories = models.ManyToManyField(Category, related_name='opportunities')

    def __str__(self):
        return self.title

    def pending_applications_count(self):
        return self.applications.filter(status='pending').count()

class Application(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected')
    ]
    
    volunteer = models.ForeignKey(Volunteer, on_delete=models.CASCADE, related_name='applications')
    opportunity = models.ForeignKey(Opportunity, on_delete=models.CASCADE, related_name='applications')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    date_applied = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)
    notes = models.TextField(blank=True)

    class Meta:
        unique_together = ['volunteer', 'opportunity']

    def __str__(self):
        return f"{self.volunteer} - {self.opportunity}"

