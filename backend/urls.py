from django.urls import path, include
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('accounts/', include('allauth.urls')),
    path('volunteer/signup/', views.volunteer_signup, name='volunteer_signup'),
    path('organization/signup/', views.organization_signup, name='organization_signup'),
    path('login/', auth_views.LoginView.as_view(template_name='registration/login.html'), name='login'),
    path('opportunities/create/', views.create_opportunity, name='create_opportunity'),
    path('opportunities/<int:pk>/edit/', views.edit_opportunity, name='edit_opportunity'),
    path('opportunities/<int:pk>/join/', views.join_opportunity, name='join_opportunity'),
    path('opportunities/<int:pk>/', views.opportunity_detail, name='opportunity_detail'),
    path('my-applications/', views.my_applications, name='my_applications'),
    path('opportunities/<int:pk>/applications/', views.manage_applications, name='manage_applications'),
    path('applications/<int:pk>/update/', views.update_application, name='update_application'),
]