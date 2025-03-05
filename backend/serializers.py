from rest_framework import serializers
from .models import Opportunity, Application

class OpportunitySerializer(serializers.ModelSerializer):

    pending_applications = serializers.SerializerMethodField()
    request_applications = serializers.SerializerMethodField()

    class Meta:
        model = Opportunity
        
        fields = ['id', 'title', 'description', 'requirements', 'location_name', 'latitude', 'longitude', 'organization', 'start_time',
                   'end_time', 'estimated_effort_ranking', 'estimated_duration', 'start_date', 'end_date', 'capacity', 'pending_applications',
                     'request_applications']
        read_only_fields = ['organization']

    def get_pending_applications(self, obj):
        return Application.objects.filter(opportunity=obj, status="pending").count()
    
    def get_request_applications(self, obj):
        return Application.objects.filter(opportunity=obj, status="requesting_complete").count()