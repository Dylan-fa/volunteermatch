from django.contrib import admin

# Register your models here.
from django.contrib import admin
from django.contrib.auth import get_user_model

VolunteerUser = get_user_model()

admin.site.register(VolunteerUser)
