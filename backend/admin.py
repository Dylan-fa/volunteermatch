from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Volunteer, Organization


admin.site.register(User)
admin.site.register(Volunteer)
admin.site.register(Organization)
