from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('accounts/', include('allauth.urls')),
    path('volunteer/signup/', views.volunteer_signup, name='volunteer_signup'),
    path('organization/signup/', views.organization_signup, name='organization_signup'),
]