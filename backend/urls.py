from django.urls import path, include
from django.contrib.auth import views as auth_views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views
from .views import login_view, google_login_callback, register_volunteer, register_organization

urlpatterns = [
    path('api/charity-search/', views.charity_search, name='charity_search'),
    path('api/charity-details/<int:reg_number>/<int:suffix>/', views.charity_details, name='charity_details'),
    path('api/charity-details/<int:reg_number>/', views.charity_details, name='charity_details_no_suffix'),
    path('api/token/', TokenObtainPairView.as_view()),
    path('api/token/refresh/', TokenRefreshView.as_view()),
    path('api/auth/login/', login_view),
    path('api/auth/google/callback/', google_login_callback),
    path('api/auth/volunteer/register/', register_volunteer),
    path('api/auth/organization/register/', register_organization),
    path('api/opportunities/', views.api_opportunity_list, name='api_opportunity_list'),
    path('api/opportunities/<int:pk>/', views.api_opportunity_detail, name='api_opportunity_detail'),
    path('api/opportunities/create/', views.api_create_opportunity, name='api_create_opportunity'),
    path('api/organization/stats/', views.api_organization_stats, name='api_organization_stats'),
    path('api/organization/profile/', views.api_organization_profile, name='api_organization_profile'),
]