from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.contrib.auth import login
from django.contrib.auth import authenticate
from django.conf import settings
from .forms import VolunteerSignUpForm, OrganizationSignUpForm, OpportunityForm
from .models import Organization, Volunteer, Opportunity
from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied

def home(request):
    if request.user.is_authenticated:
        opportunities = Opportunity.objects.filter(is_active=True).select_related('organization')
        context = {
            'show_feed': True,
            'opportunities': opportunities,
            'GOOGLE_MAP_API_KEY': settings.GOOGLE_MAP_API_KEY,
        }
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
            login(request, user, backend='django.contrib.auth.backends.ModelBackend')
            return redirect('home')
    else:
        form = VolunteerSignUpForm()
    return render(request, 'volunteer/signup.html', {'form': form})

def organization_signup(request):
    if request.method == 'POST':
        form = OrganizationSignUpForm(request.POST, request.FILES)
        if form.is_valid():
            user = form.save()
            login(request, user, backend='django.contrib.auth.backends.ModelBackend')
            messages.success(request, 'Registration successful! Please wait for admin approval.')
            return redirect('home')
    else:
        form = OrganizationSignUpForm()
    return render(request, 'organization/signup.html', {'form': form})

@login_required
def create_opportunity(request):
    if not hasattr(request.user, 'organization'):
        raise PermissionDenied
    
    if request.method == 'POST':
        form = OpportunityForm(request.POST)
        if form.is_valid():
            opportunity = form.save(commit=False)
            opportunity.organization = request.user.organization
            opportunity.location_name = form.cleaned_data.get('location_name', '')
            opportunity.save()
            messages.success(request, 'Opportunity created successfully!')
            return redirect('home')
    else:
        form = OpportunityForm()
    return render(request, 'opportunities/create.html', {
        'form': form,
        'GOOGLE_MAP_API_KEY': settings.GOOGLE_MAP_API_KEY,
    })

@login_required
def edit_opportunity(request, pk):
    opportunity = get_object_or_404(Opportunity, pk=pk, organization=request.user.organization)
    
    if request.method == 'POST':
        form = OpportunityForm(request.POST, instance=opportunity)
        if form.is_valid():
            form.save()
            messages.success(request, 'Opportunity updated successfully!')
            return redirect('opportunity_detail', pk=pk)
    else:
        form = OpportunityForm(instance=opportunity)
    
    return render(request, 'opportunities/edit.html', {
        'form': form,
        'opportunity': opportunity
    })

@login_required
def join_opportunity(request, pk):
    if not hasattr(request.user, 'volunteer'):
        raise PermissionDenied
    
    opportunity = get_object_or_404(Opportunity, pk=pk, is_active=True)
    
    if opportunity.has_user_applied():
        messages.info(request, 'You have already applied for this opportunity.')
        return redirect('opportunity_detail', pk=pk)
    
    Application.objects.create(
        volunteer=request.user.volunteer,
        opportunity=opportunity
    )
    messages.success(request, 'Application submitted successfully!')
    return redirect('opportunity_detail', pk=pk)

@login_required
def opportunity_detail(request, pk):
    opportunity = get_object_or_404(Opportunity, pk=pk)
    context = {
        'opportunity': opportunity,
        'is_owner': hasattr(request.user, 'organization') and opportunity.organization == request.user.organization,
        'GOOGLE_MAP_API_KEY': settings.GOOGLE_MAP_API_KEY,
    }
    return render(request, 'opportunities/detail.html', context)

@login_required
def my_applications(request):
    if not hasattr(request.user, 'volunteer'):
        raise PermissionDenied
    
    applications = Application.objects.filter(
        volunteer=request.user.volunteer
    ).select_related('opportunity', 'opportunity__organization')
    
    return render(request, 'volunteer/applications.html', {'applications': applications})

@login_required
def manage_applications(request, pk):
    if not hasattr(request.user, 'organization'):
        raise PermissionDenied
    
    opportunity = get_object_or_404(Opportunity, pk=pk, organization=request.user.organization)
    applications = opportunity.applications.select_related('volunteer', 'volunteer__user').order_by('-date_applied')
    
    return render(request, 'organization/manage_applications.html', {
        'opportunity': opportunity,
        'applications': applications
    })

@login_required
def update_application(request, pk):
    if not hasattr(request.user, 'organization'):
        raise PermissionDenied
    
    application = get_object_or_404(Application, 
        pk=pk, 
        opportunity__organization=request.user.organization
    )
    
    if request.method == 'POST':
        status = request.POST.get('status')
        if status in ['accepted', 'rejected']:
            application.status = status
            application.save()
            messages.success(request, f'Application {status} successfully.')
    
    return redirect('manage_applications', pk=application.opportunity.pk)

# Create your views here.

