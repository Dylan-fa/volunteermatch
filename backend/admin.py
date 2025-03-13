from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import *


admin.site.register(User)
admin.site.register(Volunteer)
admin.site.register(Organization)
admin.site.register(Opportunity)
admin.site.register(Application)
admin.site.register(Category)
admin.site.register(Friendship)
admin.site.register(Messages)
admin.site.register(Interest)
