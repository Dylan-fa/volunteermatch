from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import User, Organization, Volunteer

class VolunteerSignUpForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = User
        fields = ('email', 'username', 'password1', 'password2')

    def save(self, commit=True):
        user = super().save(commit=False)
        user._profile_type = 'volunteer'
        if commit:
            user.save()
        return user

class OrganizationSignUpForm(UserCreationForm):
    charity_number = forms.CharField(max_length=100)
    description = forms.CharField(widget=forms.Textarea(attrs={'rows': 4}))
    logo = forms.ImageField(required=False)

    class Meta(UserCreationForm.Meta):
        model = User
        fields = ('email', 'username', 'password1', 'password2')

    def save(self, commit=True):
        user = super().save(commit=False)
        user._profile_type = 'organization'
        if commit:
            user.save()
            organization = user.organization
            organization.charity_number = self.cleaned_data.get('charity_number')
            organization.description = self.cleaned_data.get('description')
            organization.logo = self.cleaned_data.get('logo')
            organization.save()
        return user

class OrganizationRegistrationForm(forms.ModelForm):
    class Meta:
        model = Organization
        fields = ['name', 'charity_number', 'email', 'logo', 'description']
        widgets = {
            'description': forms.Textarea(attrs={'rows': 4}),
        }
