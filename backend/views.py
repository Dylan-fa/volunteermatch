from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.contrib.auth import login
from django.contrib.auth import authenticate
from django.conf import settings
from .models import *
from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied
from django.http import JsonResponse
from django.conf import settings
import requests
from django.http import JsonResponse, HttpResponse
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
import os
from datetime import datetime
from django.views.decorators.csrf import csrf_exempt
from django.db.models import F, Sum

from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut
from geopy.distance import geodesic


# Use this file for your templated views only
from django.http import HttpResponse, HttpResponseForbidden
from .serializers import *
from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponse
from .forms import *
from django.contrib.auth.decorators import login_required
from django.utils.translation import gettext as _

def view_all_opportunities(request):
    if request.method == "POST":
        return(filtered_opp(request))
    else:
        context = {
            'charities': Opportunity.objects.all(),
        }
        return render(request, 'viewAllOpportunities.html', context)

def view_badges(request):

    context = {

    }

    if(request.user.is_authenticated):
        return render(request, 'badgesView.html', context)
    return render(request, 'viewBadgeOptions.html')


@login_required
def view_specified_badge(request, slug):

    context = {
        "score":50,
        "global_score":50,
        "title": slug.replace("-", " "),
        "slug":slug
    }

    return render(request, 'singleBadgeView.html', context)

def view_all_badges(request, slug):

    badge1 = "/media/badge_placeholder.png"
    badge2 = "/media/badge_placeholder.png"
    badge3 = "/media/badge_placeholder.png"
    badge4 = "/media/badge_placeholder.png"
    badge5 = "/media/badge_placeholder.png"
    badge6 = "/media/badge_placeholder.png"

    if slug == "Elderly-Badges":
        badge1 = "/media/ElderlyBadge.png"
        badge2 = "/media/ElderlyBadge.png"
        badge3 = "/media/ElderlyBadge.png"
        badge4 = "/media/ElderlyBadge.png"


    context = {
        "badge1": badge1,
        "badge2": badge2,
        "badge3": badge3,
        "badge4": badge4,
        "badge5": badge5,
        "badge6": badge6,
        "title": slug.replace("-", " "),
    }

    return render(request, 'viewAllBadgeUpgrades.html', context)

def hello(request):         #  Used to collect all information needed to display the homepage and then reders the homepage
    message = ""


    charities = Organization.objects.all()
    friends = []
    current_user = None
    if request.user.is_authenticated:
        current_user = Volunteer.objects.get(user = request.user)
        if current_user == None:
            current_user = Organization.objects.get(user = request.user)

    if request.method == "POST":
        fID = request.POST.get("friend_id")
        try:
            friendship = Friendship.objects.get(to_volunteer = current_user, from_volunteer = Volunteer.objects.get(id = fID))
            friendship.delete()
        except:
            friendship = Friendship.objects.get(to_volunteer = Volunteer.objects.get(id = fID), from_volunteer = current_user)
            friendship.delete()

        message = "Removed Friend Successfully"

    for friendship in Friendship.objects.all():
        if friendship.to_volunteer == current_user or friendship.from_volunteer == current_user:
            if friendship.to_volunteer == current_user:
                friends.append(friendship.from_volunteer)
            elif friendship.from_volunteer == current_user:
                friends.append(friendship.to_volunteer)

    context = {
            'ongoingActivities': ['Activity 1', 'Activity 2'],
            'friends' : friends,
            'charities': charities,
            'message': message
        }

    if request.user.is_authenticated:
        return render(request, 'homepage.html', context)
    else:
        return render(request, 'noLoginHome.html', context)



def custom404(request, exception):          #  used to render the 404 page when a 404 error is thrown only when django debug settings set to False
    return render(request, "404Page.html", status = 404)

@api_view(["GET"])
def list_pending_friendships(request):
    friendships = Friendship.objects.filter(status = "pending")
    data = [{
        'id': friendship.id,
        'from_volunteer': friendship.from_volunteer.id,
        'to_volunteer': friendship.to_volunteer.id,
    } for friendship in friendships]
    return Response(data)

def calculate_impact(charity, volunteer):

    opportunity = charity
    volunteer = volunteer
    applications = Application.objects.all()
    current_application = None

    for application in applications:
        if  application.volunteer == volunteer and application.opportunity == opportunity:
            current_application = application
            break
    if current_application == None:
        return HttpResponse("No Application for this volunteer")

    # Open and load JSON file to get population data
    file_path = os.path.join(os.path.dirname(__file__), "components", "gb.json")
    with open(file_path, "r") as file:
        data = json.load(file)

    city = opportunity.location_name # get from organisation api
    start_time = opportunity.start_time
    end_time = opportunity.end_time
    opportunities_completed = volunteer.opportunities_completed
    duration_taken = datetime.now().day - application.date_applied.day
    estimated_duration = opportunity.estimated_duration
    effort_ranking = opportunity.estimated_effort_ranking
    if volunteer.last_completion != None:
        days_since_last_opportunity_completed = datetime.now().day - volunteer.last_completion.day
    else:
        days_since_last_opportunity_completed = 100000
    bonus_points = 0 #-----------------------------------------------FIXXXXXX
    start_date = opportunity.start_date
    date_time_applied = current_application.date_applied
    end_date = opportunity.end_date
    capacity = opportunity.capacity
    participants_at_application = current_application.current_volunteers


    people_helped = 0


    opening_duration = end_date.day - start_date.day    # finds how long the opportunity was posted for
    if ((end_date.day - date_time_applied.day) < opening_duration * 0.15) and participants_at_application < capacity / 2:
        bonus_points += round((end_date - date_time_applied).total_seconds() / 3600 / 6)

        # adds a point for every hour they applied before the closing when it is in the last 15% of opening time

    # each factors weights contributing to the final score

    weights = {
        "duration" : 20,    # the time it took them to complete in proportion to estimated time
        "effort" : 15,      # how physically straining it is
        "recent" : 10,      # how recent the last opportunity they completed was
        "time" : 15,        # the hours worked (early and late shifts get more points)
        "status" : 5,      # how new the user is (the more tasks completed = less points)"
        "population_affected" : 15      # the population of the closest city to charity
    }

    time_value = 0.5
    duration = end_time - start_time
    if duration < 0:
        duration += 24

    if start_time >= 9 and end_time <= 17:  #checking if shift(s) are a normal 9-5
        time_value = 0.5

    elif start_time > 17 and (end_time < 9 or end_time < 24):   # checking if the shift(s) starts after 5

        if end_time - start_time >= 6:  # checking if the shift(s) was more than 6 hours meaning it went into midnight
            time_value = 2
        else:
            time_value = 1.25

    elif duration >= 16:   # checking if the shift was more than 16 hours
        time_value = 2.5

    elif duration > 8:      # checking if the shift was more than 8 hours
        time_value = 1.75

    elif duration > 4:      # checking if the shift was more than 4 hours
        time_value = 1

        # this code ensures that a more experienced volunteer gets less points per completion
        # so that it becomes more of a challenge to unlock the next badges
    status_value = max(10 / (1 + opportunities_completed / 10), 1)
    status_value = round(status_value, 1)

    duration_value = 1

    """ this code ensures that a volunteer gets an adequate amount of points based on the time they took to complete the activity in proportion to
    how long it was expected to take"""
    duration_value = duration_taken / estimated_duration            # allows for volunteers that have spent a longer amount of time trying to
    duration_value = round(duration_value, 2)                       # complete an opportunity to gain more points and people who dont take as long
                                                                    # as they maybe should get a lower multiplier

    recent_value = 50 - (days_since_last_opportunity_completed - duration_taken)
    if recent_value < 0:
        recent_value = 0                # rewards volunteers with a multiplier based on how quickly they are doing
    recent_value /= 10                  #  new opportunities once one is finished

    population = 0
    for i in range(len(data)):
        if city == data[i]["city"]:
            population = data[i]["population"]
            break

    people_helped = int(population) / 5

    effort_value = 1

    if effort_ranking == "low":
        effort_value = 0.5              # if organisation ranks their opportunity as higher effort it is rewarded with higher points
        people_helped *= 0.5
    elif effort_ranking == "high":
        effort_value = 1
    else:
        people_helped *= 0.75

    people_helped = round(people_helped)


    #if duration_value < 0:
    #    duration_value = 0

    final_value = (time_value * weights.get("time")) + (status_value * weights.get("status")) + (duration_value * weights.get("duration")) + (recent_value * weights.get("recent")) + (effort_value * weights.get("effort")) + (min(3, max(people_helped / 100000, 0.5)) * weights.get("population_affected")) + bonus_points

    if days_since_last_opportunity_completed < 30 or days_since_last_opportunity_completed > 120:
        final_value *= 1.2              # adds a streak bonus to help volunteers keep going as it gives them incentive to do more volunteering

    if(opportunities_completed < 5):
        final_value *= 1 + (0.25 - opportunities_completed / 20)    # allows for new users to gain increased points for their first 5 opportunities

    final_value /= 2
    final_value = round(final_value)

    print(str(time_value) + " time")
    print(str(status_value) + " status")
    print(str(duration_value) + " duration")
    print(str(recent_value) + " recent")
    print(str(effort_value) + " effort")
    print(str((min(3, max(people_helped / 100000, 0.5)) * weights.get("population_affected"))) + " people")


    return final_value


@api_view(["DELETE"])
def delete_friendship(request, friend_id, volunteer_id):
    if request.method == "DELETE":
        u = Volunteer.objects.get(id = volunteer_id)
        friend = Volunteer.objects.get(id = friend_id)
        for friendship in Friendship.objects.all():
            if friendship.to_volunteer == u and friendship.from_volunteer == friend:
                friendship.delete()
            if friendship.from_volunteer == u and friendship.to_volunteer == friend:
                friendship.delete()

        return JsonResponse({"message": "Friendship removed successfully"}, status=200)
    return JsonResponse({"error": "Invalid request"}, status=400)

@api_view(["POST"])
def create_friendship(request, friend_id, volunteer_id):
    if request.method == "POST":
        u = Volunteer.objects.get(id = volunteer_id)
        friend = Volunteer.objects.get(id = friend_id)

        Friendship.objects.create(from_volunteer = u, to_volunteer = friend, status = "pending")

        return JsonResponse({"message": "Friend request sent"}, status=201)
    return JsonResponse({"error": "Invalid request"}, status=405)

@api_view(["POST"])
def accept_friendship(request, friend_id, volunteer_id):
    if request.method == "POST":
        u = Volunteer.objects.get(id = volunteer_id)
        friend = Volunteer.objects.get(id = friend_id)

        friendship = Friendship.objects.get(to_volunteer = u, from_volunteer = friend)
        friendship.status = "accepted"
        friendship.save()

        return JsonResponse({"message": "Friend request sent"}, status=201)
    return JsonResponse({"error": "Invalid request"}, status=405)

@login_required
def view_friends(request):
    message = ""
    if request.user.is_authenticated:
        current_user = Volunteer.objects.filter(user = request.user)
        if len(current_user) == 0:
            return HttpResponseForbidden("only volunteers can access this")

    fromV = Volunteer.objects.get(user = request.user)

    if request.method =="POST":
        if request.POST.get("accept"):
            friendship = Friendship.objects.get(id = request.POST.get("accept"))
            friendship.status = "accepted"
            friendship.save()
            message = "Added as a Friend Successfully"
        elif request.POST.get("cancel_friendship_id"):
            friendship = Friendship.objects.get(id = request.POST.get("cancel_friendship_id"))
            friendship.delete()
        else:

            toVol = request.POST.get("volunteer_id")
            toV = Volunteer.objects.get(id = toVol)
            message = "Sent a request to " + toV.display_name


            Friendship.objects.create(from_volunteer = fromV, to_volunteer = toV, status = "pending")

    reqs = []
    sent = []

    for friendship in Friendship.objects.filter(status = "pending"):
        if friendship.to_volunteer == fromV:
            reqs.append(friendship)
        if friendship.from_volunteer == fromV:
            sent.append(friendship)


    users = Volunteer.objects.exclude(id = fromV.id)

    for friendship in Friendship.objects.all():
        if friendship.to_volunteer == fromV or friendship.from_volunteer == fromV:
            users = users.exclude(id = friendship.to_volunteer.id)
            users = users.exclude(id = friendship.from_volunteer.id)


    context = {
            "message": message,
            "users": users,
            "requests": reqs,
            "sent_reqs": sent
        }

    return render(request, 'friends_page.html', context)

@api_view(['GET'])
def api_volunteer_list(request):
    users = Volunteer.objects.all()
    data = [{
        'id': user.id,
        'f_name': user.user.first_name,
        'l_name': user.user.last_name,
        'display_name': user.display_name,
        'opportunities_completed': user.opportunities_completed,
        'last_completion': user.last_completion,
        'email': user.user.email,
        'scores': {
            'elderly': user.elderly_score,
            'medical': user.medical_score,
            'community': user.community_score,
            'education': user.education_score,
            'animals': user.animals_score,
            'sports': user.sports_score,
            'disability': user.disability_score,
            'greener_planet': user.greener_planet_score,
        },
        'overall_score': user.elderly_score + user.medical_score + user.community_score + user.education_score + user.animals_score + user.sports_score + user.disability_score + user.greener_planet_score,
    } for user in users]
    return Response(data)

@api_view(['GET'])
def api_volunteer_pending(request, id):
    data = [{
        'id': app.volunteer.user.id,
        'application_id': app.id,
        'volunteer_id': app.volunteer.id,
        'f_name': app.volunteer.user.first_name,
        'l_name': app.volunteer.user.last_name,
        'display_name': app.volunteer.display_name,
        'opportunities_completed': app.volunteer.opportunities_completed,
        'last_completion': app.volunteer.last_completion,
        'email': app.volunteer.user.email,
        'scores': {
            'elderly': app.volunteer.elderly_score,
            'medical': app.volunteer.medical_score,
            'community': app.volunteer.community_score,
            'education': app.volunteer.education_score,
            'animals': app.volunteer.animals_score,
            'sports': app.volunteer.sports_score,
            'disability': app.volunteer.disability_score,
            'greener_planet': app.volunteer.greener_planet_score,
        },
        'overall_score': app.volunteer.elderly_score + app.volunteer.medical_score + app.volunteer.community_score + app.volunteer.education_score + app.volunteer.animals_score + app.volunteer.sports_score + app.volunteer.disability_score + app.volunteer.greener_planet_score,
    } for app in Application.objects.filter(opportunity = Opportunity.objects.get(id = id), status = "pending")]
    return Response(data)

@api_view(['GET'])
def api_volunteer_requested(request, id):
    data = [{
        'id': app.volunteer.user.id,
        'application_id': app.id,
        'volunteer_id': app.volunteer.id,
        'f_name': app.volunteer.user.first_name,
        'l_name': app.volunteer.user.last_name,
        'display_name': app.volunteer.display_name,
        'opportunities_completed': app.volunteer.opportunities_completed,
        'last_completion': app.volunteer.last_completion,
        'email': app.volunteer.user.email,
        'scores': {
            'elderly': app.volunteer.elderly_score,
            'medical': app.volunteer.medical_score,
            'community': app.volunteer.community_score,
            'education': app.volunteer.education_score,
            'animals': app.volunteer.animals_score,
            'sports': app.volunteer.sports_score,
            'disability': app.volunteer.disability_score,
            'greener_planet': app.volunteer.greener_planet_score,
        },
        'overall_score': app.volunteer.elderly_score + app.volunteer.medical_score + app.volunteer.community_score + app.volunteer.education_score + app.volunteer.animals_score + app.volunteer.sports_score + app.volunteer.disability_score + app.volunteer.greener_planet_score,
    } for app in Application.objects.filter(opportunity = Opportunity.objects.get(id = id), status = "requesting_complete")]
    return Response(data)

@api_view(['GET'])
def api_volunteer_detail(request, id):
    user = Volunteer.objects.get(id = id)

    pending_applications = Application.objects.filter(status = "pending", volunteer = user)
    accepted_applications = Application.objects.filter(status = "accepted", volunteer = user)

    friends = []
    for friendship in Friendship.objects.filter(status = "accepted"):
        if friendship.to_volunteer == user:
            friends.append(friendship.from_volunteer)
        elif friendship.from_volunteer == user:
            friends.append(friendship.to_volunteer)

    messages = Messages.objects.all()

    data = {
        'id': user.id,
        'hours': user.hours,
        'f_name': user.user.first_name,
        'l_name': user.user.last_name,
        'display_name': user.display_name,
        'opportunities_completed': user.opportunities_completed,
        'last_completion': user.last_completion,
        'scores': {
            'elderly': user.elderly_score,
            'medical': user.medical_score,
            'community': user.community_score,
            'education': user.education_score,
            'animals': user.animals_score,
            'sports': user.sports_score,
            'disability': user.disability_score,
            'greener_planet': user.greener_planet_score,
        },
        'overall_score': user.elderly_score + user.medical_score + user.community_score + user.education_score + user.animals_score + user.sports_score + user.disability_score + user.greener_planet_score,
        'friends': [{
            'id': friend.id,
            'f_name': friend.user.first_name,
            'l_name': friend.user.last_name,
            'display_name': friend.display_name,
            'opportunities_completed': friend.opportunities_completed,
            'last_completion': friend.last_completion,
            'overall_score': friend.elderly_score + friend.medical_score + friend.community_score + friend.education_score + friend.animals_score + friend.sports_score + friend.disability_score + friend.greener_planet_score,
        } for friend in friends],
        'messages': [{
            'id': message.id,
            'from_person': message.from_person,
            'message': message.message,
            'time_sent': message.time_sent
        } for message in messages],
        'pending_applications': [{
            'id': application.id,
            'opportunity': {
                "id": application.opportunity.id,
                "organisation_name": application.opportunity.organization.name,
                "opportunity_name": application.opportunity.title,
                "estimated_effort_ranking": application.opportunity.estimated_effort_ranking,
            },
            'date_applied': application.date_applied,
        } for application in pending_applications],
        'accepted_applications': [{
            'id': application.id,
            'opportunity': {
                "id": application.opportunity.id,
                "organisation_name": application.opportunity.organization.name,
                "opportunity_name": application.opportunity.title,
                "estimated_effort_ranking": application.opportunity.estimated_effort_ranking,
            },
            'date_applied': application.date_applied,
        } for application in accepted_applications]

    }
    return Response(data)

def volunteers_order(volunteers, order):

    volunteers = volunteers.annotate(
       overall_score=Sum(
           F("elderly_score") +
           F("medical_score") +
           F("community_score") +
           F("education_score") +
           F("animals_score") +
           F("sports_score") +
           F("disability_score") +
           F("greener_planet_score")
       ))

    if order == "most_points":
        volunteers = volunteers.order_by("-overall_score")  # Descending order
    elif order == "least_points":
        volunteers = volunteers.order_by("overall_score")  # Ascending order

    return volunteers

def view_leaderboard(request):
    leaderboard_order = request.POST.get('order')
    friends_only = request.POST.get('friends_only')
    friends = []

    volunteers = Volunteer.objects.all()



    if friends_only:
        current_user = Volunteer.objects.get(user = request.user)
        for friendship in Friendship.objects.filter(status = "accepted"):
            if friendship.to_volunteer == current_user:
                friends.append(friendship.from_volunteer)
            if friendship.from_volunteer == current_user:
                friends.append(friendship.to_volunteer)
        volunteers = friends

    if leaderboard_order != "-":
        volunteers = volunteers_order(volunteers, leaderboard_order)



    return render(request, "leaderboard.html", {"volunteers": volunteers})




def sort(opportunities, type):
    filtered = []

    for opportunity in opportunities:
        for category in opportunity.categories.all():
            if type == category.name:
                filtered.append(opportunity)

    return filtered

def sort_verified(opportunities, isverified):
    filtered = []
    for opportunity in opportunities:
        if opportunity.organisation.approved == isverified:
            filtered.append(opportunity)

    return filtered

def sort_effort(opportunities, effort):
    filtered = []
    for opportunity in opportunities:
        if opportunity.estimated_effort_ranking == effort:
            filtered.append(opportunity)

    return filtered

def get_coordinates_from_postcode(postcode):

    geolocator = Nominatim(user_agent="backend")

    try:
        location = geolocator.geocode(postcode)
        if location:
            return location.latitude, location.longitude
        else:
            return None, None
    except GeocoderTimedOut:
        return None, None

def calculate_opp_in_distance(opportunities, user_postcode, max_distance_km):

    user_lat, user_lon = get_coordinates_from_postcode(user_postcode)

    if user_lat is None or user_lon is None:
        return []  # No results if we can't determine user's location

    filtered = []

    for opportunity in opportunities:
        if opportunity.latitude is not None and opportunity.longitude is not None:
            opp_location = (opportunity.latitude, opportunity.longitude)
            user_location = (user_lat, user_lon)

            distance = geodesic(user_location, opp_location).km  # Calculate distance in km
            if float(distance) <= float(max_distance_km):
                filtered.append(opportunity)

    return filtered

def ordering(opportunities, order):
    if order == "nearest_deadline":
        ordered = opportunities.order_by("-start_time")

    elif order == "furthest_deadline":
        ordered = opportunities.order_by("start_time")

    elif order == "newest":
        ordered = opportunities.order_by("-date_created")

    elif order == "oldest":
        ordered = opportunities.order_by("date_created")
    return ordered

def filtered_opp(request):
    elderly = request.POST.get('elderly') == 'on'
    medical = request.POST.get('medical') == 'on'
    disability = request.POST.get('disability') == 'on'
    animal = request.POST.get('animal') == 'on'
    educational = request.POST.get('educational') == 'on'
    sport = request.POST.get('sport') == 'on'
    greener_planet = request.POST.get('greener_planet') == 'on'
    community = request.POST.get('community') == 'on'
    verification = request.POST.get('verification') == 'on'
    effort = request.POST.get('effort')
    user_postcode = request.POST.get('user_postcode')
    max_distance_km = request.POST.get('max_distance_km')
    order = request.POST.get('order')


    opportunities = Opportunity.objects.all()

    if elderly:
        opportunities = sort(opportunities, "Elderly")

    if medical:
        opportunities = sort(opportunities, "Medical")

    if disability:
        opportunities = sort(opportunities, "Disability")

    if animal:
        opportunities = sort(opportunities, "Animal")

    if educational:
        opportunities = sort(opportunities, "Educational")

    if sport:
        opportunities = sort(opportunities, "Sports")

    if greener_planet:
        opportunities = sort(opportunities, "Greener_Planet")

    if community:
        opportunities = sort(opportunities, "Community")

    if verification:
        opportunities = sort_verified(opportunities, True)

    if effort != "-":
        opportunities = sort_effort(opportunities, effort)

    if user_postcode and max_distance_km:
        opportunities = calculate_opp_in_distance(opportunities, user_postcode, max_distance_km)

    if order != "-":
        opportunities = ordering(opportunities, order)


    return render(request, "viewAllOpportunities.html", {"charities": opportunities})


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

        user_data = {
            'email': user.email,
            'is_organization': is_organization,
            'is_volunteer': not is_organization
        }

        if is_organization:
            user_data['organization_id'] = user.organization.id

        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': user_data
        })
    return Response({'error': 'Invalid credentials'}, status=400)

@api_view(['POST'])
def google_login_callback(request):
    try:
        credential = request.data.get('credential')
        if not credential:
            return Response({'error': 'No credential provided'}, status=400)

        # Verify the token with Google
        google_response = requests.get(
            'https://oauth2.googleapis.com/tokeninfo',
            params={'id_token': credential}
        )

        if not google_response.ok:
            return Response({'error': 'Invalid credential'}, status=400)

        google_data = google_response.json()
        email = google_data['email']
        first_name = google_data.get('given_name', '')
        last_name = google_data.get('family_name', '')
        picture_url = google_data.get('picture', '')  # Get profile picture URL
        user_type = request.data.get('user_type', 'volunteer')

        # Get or create user
        try:
            user = User.objects.get(email=email)

            # Check if user already has a volunteer profile
            if hasattr(user, 'volunteer'):
                volunteer = user.volunteer
            else:
                # Create volunteer profile if it doesn't exist
                if user_type == 'volunteer':
                    # Generate a unique display_name from email or name
                    base_display_name = email.split('@')[0][:12]  # Use part before @ in email, max 12 chars
                    display_name = base_display_name

                    # Ensure display_name is unique by appending numbers if needed
                    counter = 1
                    while Volunteer.objects.filter(display_name=display_name).exists():
                        suffix = str(counter)
                        max_base_length = 16 - len(suffix)
                        display_name = f"{base_display_name[:max_base_length]}{suffix}"
                        counter += 1

                    volunteer = Volunteer.objects.create(user=user, display_name=display_name)
                elif user_type == 'organization':
                    Organization.objects.create(user=user)

        except User.DoesNotExist:
            user = User.objects.create_user(
                username=email,
                email=email,
                first_name=first_name,
                last_name=last_name,
                avatar_url=picture_url
            )

            if user_type == 'volunteer':
                # Generate a unique display_name from email or name
                base_display_name = email.split('@')[0][:12]  # Use part before @ in email, max 12 chars
                display_name = base_display_name

                # Ensure display_name is unique by appending numbers if needed
                counter = 1
                while Volunteer.objects.filter(display_name=display_name).exists():
                    suffix = str(counter)
                    max_base_length = 16 - len(suffix)
                    display_name = f"{base_display_name[:max_base_length]}{suffix}"
                    counter += 1

                volunteer = Volunteer.objects.create(user=user, display_name=display_name)
            elif user_type == 'organization':
                Organization.objects.create(user=user)

        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'email': user.email,
                'is_volunteer': hasattr(user, 'volunteer'),
                'is_organization': hasattr(user, 'organization'),
                'avatar_url': picture_url  # Include directly in response
            }
        })
    except Exception as e:
        return Response({'error': str(e)}, status=400)

@api_view(['POST'])
def register_volunteer(request):
    email = request.data.get('email')
    first_name = request.data.get('first_name')
    last_name = request.data.get('last_name')
    display_name = request.data.get('display_name')
    password = request.data.get('password')
    password2 = request.data.get('password2')

    if password != password2:
        return Response({'error': 'Passwords do not match'}, status=400)

    try:
        user = User.objects.create_user(username=email, first_name = first_name, last_name = last_name, email=email, password=password)
        volunteer = Volunteer.objects.create(user=user, display_name = display_name)
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

@api_view(['GET', 'POST'])
def api_opportunity_list(request):
    opportunities = Opportunity.objects.filter(is_active=True).select_related('organization')
    if request.method == "POST":
        opportunities = filtered_opp(request)

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
        ),
        'effort' : opp.estimated_effort_ranking,
        'categories' : list(opp.categories.values_list('name', flat=True))
    } for opp in opportunities]
    return Response(data)

@api_view(['POST'])
def api_filter_distance(request):
    opportunities = Opportunity.objects.filter(is_active=True).select_related('organization')
    if request.method == "POST":
        opportunities = calculate_opp_in_distance(opportunities, request.data.get('postcode'), request.data.get('max_distance'))
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
            ),
            'effort' : opp.estimated_effort_ranking,
            'categories' : list(opp.categories.values_list('name', flat=True))
        } for opp in opportunities]

    return Response(data)

@api_view(['GET'])
def api_opportunity_detail(request, pk):
    opportunity = get_object_or_404(Opportunity, pk=pk)
    email = request.GET.get("email", "")
    user = User.objects.filter(email = email).first()
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

    geolocator = Nominatim(user_agent="my_geopy_app")

    data = request.data.copy()  # Make a mutable copy
    data['organization'] = request.user.organization.id


    location = geolocator.reverse(str(data['latitude']) + "," + str(data['longitude']))
    city = location.raw['address'].get('city', '')
    data['location_name'] = city

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
        'request_applications': sum(opp.applications.filter(status='requesting_complete').count() for opp in opportunities),
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

@api_view(['GET'])
def api_list_categories(request):
    categories = Category.objects.all()
    data = [{
        'id': category.id,
        'name': category.name,
        'description': category.description,
        'count' : Opportunity.objects.filter(categories = category).count()
    } for category in categories]
    return Response(data)

@api_view(["POST"])
def api_apply_opportunity(request, id):
    if request.method == "POST":
        data = json.loads(request.body)
        email = data.get("email", "")
        user = User.objects.get(email = email)
        volunteer = Volunteer.objects.get(user = user)
        opportunity = Opportunity.objects.get(id = id)
        cv = opportunity.current_volunteers_count
        Application.objects.create(volunteer = volunteer, opportunity = opportunity, status = "pending", current_volunteers = cv)
    return Response(None)

@api_view(["POST"])
def api_application_update(request, id, mode):
    if request.method == "POST":
        app = Application.objects.get(id = id)
        app.status = mode
        app.save()
        volunteer = app.volunteer
        organisation = app.opportunity.organization.name
        opportunity = app.opportunity.title
        if mode == "accepted":
            message = "Hi there, thank you for your recent application to our " + opportunity + " opportunity, we are contacting you to let you know that we have approved your application and were excited to see you soon!"
        elif mode == "requesting_complete":
            message = "Hi again, we have recieved your request to tick off you application for " + opportunity + ", it is under review and you should hear from us again soon!"
        elif mode == "rejected":
            message = "Hi again, we are sorry to inform you that you have not been succsessful in your application for " + opportunity + " this time, however we would still love to hear from you again and we wish you the best with your volunteering career!"
        elif mode == "not_completed":
            app.status = "accepted"
            app.save()
            message = "Hi, your work for the opportunity, " + opportunity + " has been reviewed and deemed not completed so carry on going and tell us when you have completed it to gain epic rewards. It has been put back into your opportunities in progress. Keep going!!"
        elif mode == "completed":
            points = calculate_impact(app.opportunity, app.volunteer)
            message = "Hi, were pleased to confirm that you have completed the opportunity and have been rewarded with " + str(points) + " points!! Thank you very much and we look forward to hearing from you again."
        Messages.objects.create(from_person = organisation, message = message, volunteer = volunteer)
    return Response("Application updated successfully")

@api_view(["DELETE"])
def api_remove_message(request, id):
    if request.method == "DELETE":
        app = Messages.objects.get(id = id)
        app.delete()
    return Response("Message deleted successfully")
