from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import login
from .forms import VolunteerSignUpForm, OrganizationSignUpForm
from .models import Organization, Volunteer

def home(request):
    if request.user.is_authenticated:
        context = {'show_feed': True}
        try:
            if hasattr(request.user, 'organization'):
                if not request.user.organization.approved:
                    messages.info(request, 'Your organization account is pending approval.')
        except Organization.DoesNotExist:
            pass
        return render(request, 'home.html', context)
    return render(request, 'home.html')

def volunteer_signup(request):
    if request.method == 'POST':
        form = VolunteerSignUpForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('home')
    else:
        form = VolunteerSignUpForm()
    return render(request, 'volunteer/signup.html', {'form': form})

def organization_signup(request):
    if request.method == 'POST':
        form = OrganizationSignUpForm(request.POST, request.FILES)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, 'Organization registration submitted successfully! We will review your application.')
            return redirect('home')
    else:
        form = OrganizationSignUpForm()
    return render(request, 'organization/signup.html', {'form': form})

# Create your views here.
