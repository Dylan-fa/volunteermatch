from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.contrib.auth import login
from django.contrib.auth import authenticate
from django.conf import settings
from .models import Organization, Volunteer, Opportunity
from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied
from django.http import JsonResponse
from django.conf import settings
import requests
from django.http import JsonResponse
from django.views.decorators.http import require_GET
import json
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from .models import User, Volunteer, Organization
from .serializers import OpportunitySerializer

@require_GET
def charity_search(request):
    query = request.GET.get('q', '').strip()
    limit = int(request.GET.get('limit', 50))  # Default to 50 results
    
    if len(query) < 3:
        return JsonResponse([], safe=False)

    api_url = f"https://api.charitycommission.gov.uk/register/api/searchCharityName/{query}"
    headers = {
        'Ocp-Apim-Subscription-Key': settings.CHARITY_API_KEY,
        'Cache-Control': 'no-cache'
    }

    try:
        response = requests.get(api_url, headers=headers)
        response.raise_for_status()
        charities = response.json()
        # Format the response according to the actual API fields and limit results
        formatted_charities = [
            {
                'organisation_number': charity.get('organisation_number'),
                'reg_charity_number': charity.get('reg_charity_number'),
                'group_subsid_suffix': charity.get('group_subsid_suffix'),
                'charity_name': charity.get('charity_name'),
                'reg_status': charity.get('reg_status'),
                'date_of_registration': charity.get('date_of_registration'),
                'date_of_removal': charity.get('date_of_removal')
            }
            for charity in charities[:limit]  # Limit the number of results
        ]
        return JsonResponse(formatted_charities, safe=False)
    except requests.RequestException as e:
        return JsonResponse({'error': str(e)}, status=400)

@require_GET
def charity_details(request, reg_number, suffix=0):
    if not reg_number:
        return JsonResponse({'error': 'Registration number required'}, status=400)

    api_url = f"https://api.charitycommission.gov.uk/register/api/charityoverview/{reg_number}/{suffix}"
    headers = {
        'Ocp-Apim-Subscription-Key': settings.CHARITY_API_KEY,
        'Cache-Control': 'no-cache'
    }

    try:
        response = requests.get(api_url, headers=headers)
        response.raise_for_status()
        data = response.json()
        return JsonResponse({
            'activities': data.get('activities', '')
        })
    except requests.RequestException as e:
        return JsonResponse({'error': str(e)}, status=400)

@api_view(['POST'])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')
    user = authenticate(email=email, password=password)
    
    if user:
        refresh = RefreshToken.for_user(user)
        is_organization = hasattr(user, 'organization')
        
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'email': user.email,
                'is_organization': is_organization,
                'organization_id': user.organization.id if is_organization else None
            }
        })
    return Response({'error': 'Invalid credentials'}, status=400)

@api_view(['POST'])
def google_login_callback(request):
    adapter = GoogleOAuth2Adapter(request)
    try:
        app = adapter.get_provider().app
        token = request.data.get('access_token')
        user = adapter.complete_login(request, app, token)
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'email': user.email,
                'is_volunteer': hasattr(user, 'volunteer'),
                'is_organization': hasattr(user, 'organization')
            }
        })
    except Exception as e:
        return Response({'error': str(e)}, status=400)

@api_view(['POST'])
def register_volunteer(request):
    email = request.data.get('email')
    password = request.data.get('password')
    password2 = request.data.get('password2')
    
    if password != password2:
        return Response({'error': 'Passwords do not match'}, status=400)
        
    try:
        user = User.objects.create_user(username=email, email=email, password=password)
        volunteer = Volunteer.objects.create(user=user)
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'email': user.email,
                'is_volunteer': True
            }
        })
    except Exception as e:
        return Response({'error': str(e)}, status=400)

@api_view(['POST'])
def register_organization(request):
    try:
        # Extract form data
        email = request.data.get('email')
        username = request.data.get('username')
        password = request.data.get('password')
        password2 = request.data.get('password2')
        name = request.data.get('name')
        charity_number = request.data.get('charity_number')
        description = request.data.get('description')
        logo = request.FILES.get('logo')
        selected_charity_data = request.data.get('selected_charity_data')
        
        if not all([email, username, password, password2, name, description]):
            return Response({
                'error': 'All required fields must be provided'
            }, status=400)

        if password != password2:
            return Response({
                'error': 'Passwords do not match'
            }, status=400)
            
        # Create user
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )
        
        # Create organization
        organization = Organization.objects.create(
            user=user,
            name=name,
            charity_number=charity_number,
            description=description,
            logo=logo,
            approved=False  # Organizations need admin approval
        )

        # Generate tokens
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'email': user.email,
                'is_organization': True
            }
        })
        
    except Exception as e:
        # If user was created but organization creation failed, delete the user
        if 'user' in locals():
            user.delete()
        return Response({
            'error': str(e)
        }, status=400)

@api_view(['GET'])
def api_opportunity_list(request):
    opportunities = Opportunity.objects.filter(is_active=True).select_related('organization')
    data = [{
        'id': opp.id,
        'title': opp.title,
        'description': opp.description,
        'organization': {
            'name': opp.organization.name,
            'logo': opp.organization.logo.url if opp.organization.logo else None,
        },
        'location_name': opp.location_name,
        'latitude': opp.latitude,
        'longitude': opp.longitude,
        'requirements': opp.requirements,
        'pending_applications': opp.pending_applications_count(),
        'has_applied': bool(
            request.user.is_authenticated and 
            hasattr(request.user, 'volunteer') and 
            opp.applications.filter(volunteer=request.user.volunteer).exists()
        )
    } for opp in opportunities]
    return Response(data)

@api_view(['GET'])
def api_opportunity_detail(request, pk):
    opportunity = get_object_or_404(Opportunity, pk=pk)
    data = {
        'id': opportunity.id,
        'title': opportunity.title,
        'description': opportunity.description,
        'requirements': opportunity.requirements,
        'organization': {
            'name': opportunity.organization.name,
            'logo': opportunity.organization.logo.url if opportunity.organization.logo else None,
        },
        'location_name': opportunity.location_name,
        'latitude': opportunity.latitude,
        'longitude': opportunity.longitude,
        'is_owner': bool(
            request.user.is_authenticated and 
            hasattr(request.user, 'organization') and 
            opportunity.organization == request.user.organization
        ),
        'has_applied': bool(
            request.user.is_authenticated and 
            hasattr(request.user, 'volunteer') and 
            opportunity.applications.filter(volunteer=request.user.volunteer).exists()
        ),
        'application_status': opportunity.applications.filter(
            volunteer=request.user.volunteer
        ).first().status if (
            request.user.is_authenticated and 
            hasattr(request.user, 'volunteer') and 
            opportunity.applications.filter(volunteer=request.user.volunteer).exists()
        ) else None
    }
    return Response(data)

@api_view(['POST'])
def api_create_opportunity(request):
    if not request.user.is_authenticated:
        return Response({'error': 'Authentication required'}, 
                       status=status.HTTP_401_UNAUTHORIZED)
    
    if not hasattr(request.user, 'organization'):
        return Response({'error': 'Only organizations can create opportunities'}, 
                       status=status.HTTP_403_FORBIDDEN)
    
    data = request.data.copy()  # Make a mutable copy
    data['organization'] = request.user.organization.id
    
    serializer = OpportunitySerializer(data=data)
    if serializer.is_valid():
        opportunity = serializer.save(organization=request.user.organization)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def api_organization_stats(request):
    if not request.user.is_authenticated or not hasattr(request.user, 'organization'):
        return Response({'error': 'Not authorized'}, status=403)
    
    org = request.user.organization
    opportunities = Opportunity.objects.filter(organization=org)
    recent_opportunities = opportunities.order_by('-date_created')[:5]  # Get 5 most recent
    
    data = {
        'total_opportunities': opportunities.count(),
        'active_opportunities': opportunities.filter(is_active=True).count(),
        'total_applications': sum(opp.applications.count() for opp in opportunities),
        'pending_applications': sum(opp.applications.filter(status='pending').count() for opp in opportunities),
        'recent_opportunities': OpportunitySerializer(
            recent_opportunities,
            many=True
        ).data,
    }
    return Response(data)

@api_view(['GET', 'PUT'])
def api_organization_profile(request):
    if not request.user.is_authenticated or not hasattr(request.user, 'organization'):
        return Response({'error': 'Not authorized'}, status=403)
    
    org = request.user.organization
    
    if request.method == 'GET':
        return Response({
            'name': org.name,
            'description': org.description,
            'charity_number': org.charity_number,
            'logo': org.logo.url if org.logo else None,
            'email': org.user.email
        })
    
    elif request.method == 'PUT':
        try:
            if 'name' in request.data:
                org.name = request.data['name']
            if 'description' in request.data:
                org.description = request.data['description']
            if 'logo' in request.FILES:
                org.logo = request.FILES['logo']
            org.save()
            
            return Response({
                'name': org.name,
                'description': org.description,
                'charity_number': org.charity_number,
                'logo': org.logo.url if org.logo else None,
                'email': org.user.email
            })
        except Exception as e:
            return Response({'error': str(e)}, status=400)

