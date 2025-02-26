from django.urls import path, include
from django.contrib.auth import views as auth_views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views
from .views import login_view, google_login_callback, register_volunteer, register_organization
from django.conf import settings
from django.conf.urls.static import static

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
    path('api/opportunities/distance/filter/', views.api_filter_distance, name='api_filter_distance'),
    
    path('api/categories/', views.api_list_categories),

    path('api/organization/stats/', views.api_organization_stats, name='api_organization_stats'),
    path('api/organization/profile/', views.api_organization_profile, name='api_organization_profile'),

    path('api/volunteer/list/', views.api_volunteer_list, name='api_volunteer_list'),
    path('api/volunteer/<int:id>/', views.api_volunteer_detail, name='api_volunteer_detail'),

    path('api/friendship/delete/<int:friend_id>/<int:volunteer_id>/', views.delete_friendship),
    path('api/friendship/create/<int:friend_id>/<int:volunteer_id>/', views.create_friendship),
    path('api/friendship/accept/<int:friend_id>/<int:volunteer_id>/', views.accept_friendship),
    path('api/friendship/list/pending/', views.list_pending_friendships),

    path('<int:charity>/<int:volunteer>', views.calculate_impact),
    path('view/opportunity/all/', views.view_all_opportunities),
    path('view-all/badges/<slug:slug>/', views.view_all_badges),
    path('view/badges/<slug:slug>/', views.view_specified_badge),
    path('view/badges/', views.view_badges),
    path('view/friends/', views.view_friends),
    path('view/leaderboard/', views.view_leaderboard),
    path('', views.hello),
]