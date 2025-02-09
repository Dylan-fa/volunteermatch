from django import forms
from django import forms
from .models import Opportunity
from mapwidgets.widgets import GoogleMapPointFieldWidget
from django.contrib.auth.forms import UserCreationForm
from .models import User, Volunteer, Organization, Opportunity
from mapwidgets.widgets import GoogleMapPointFieldWidget
from django.conf import settings

class VolunteerSignUpForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = User
        fields = ('email', 'username', 'password1', 'password2')

    def save(self, commit=True):
        user = super().save(commit=False)
        user._profile_type = 'volunteer'
        if commit:
            user.save()
            Volunteer.objects.create(user=user)
        return user

class OrganizationSignUpForm(UserCreationForm):
    name = forms.CharField(max_length=200)
    charity_number = forms.CharField(max_length=100)
    description = forms.CharField(widget=forms.Textarea)
    logo = forms.ImageField(required=False)

    class Meta(UserCreationForm.Meta):
        model = User
        fields = ('email', 'username', 'password1', 'password2')

    def save(self, commit=True):
        user = super().save(commit=False)
        user._profile_type = 'organization'
        if commit:
            user.save()
            Organization.objects.create(
                user=user,
                name=self.cleaned_data.get('name'),
                charity_number=self.cleaned_data.get('charity_number'),
                description=self.cleaned_data.get('description'),
                logo=self.cleaned_data.get('logo')
            )
        return user

class OrganizationRegistrationForm(forms.ModelForm):
    class Meta:
        model = Organization
        fields = ['name', 'charity_number', 'logo', 'description']
        widgets = {
            'description': forms.Textarea(attrs={'rows': 4}),
        }

class OpportunityForm(forms.ModelForm):
    location_point = forms.CharField(widget=GoogleMapPointFieldWidget)
    location_name = forms.CharField(widget=forms.HiddenInput(), required=False)

    class Meta:
        model = Opportunity
        fields = ['title', 'description', 'requirements', 'location_name']
        widgets = {
            'description': forms.Textarea(attrs={'rows': 4}),
            'requirements': forms.Textarea(attrs={'rows': 4}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.pk and self.instance.latitude and self.instance.longitude:
            # Convert the lat/lng to GeoJSON format for the widget
            self.initial['location_point'] = f'{{"type":"Point","coordinates":[{self.instance.longitude},{self.instance.latitude}]}}'

    def save(self, commit=True):
        instance = super().save(commit=False)
        location_point = self.cleaned_data.get('location_point', '')
        instance.location_name = self.cleaned_data.get('location_name', '')
        
        if location_point:
            try:
                # Parse GeoJSON format
                import json
                geojson = json.loads(location_point)
                # GeoJSON coordinates are in [longitude, latitude] order
                instance.longitude = float(geojson['coordinates'][0])
                instance.latitude = float(geojson['coordinates'][1])
            except (ValueError, KeyError, json.JSONDecodeError):
                pass
        
        if commit:
            instance.save()
        return instance
