from rest_framework import serializers
from .models import Opportunity

class OpportunitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Opportunity
        fields = ['id', 'title', 'description', 'requirements', 'location_name', 'latitude', 'longitude', 'organization', 'start_time',
                   'end_time', 'estimated_effort_ranking', 'estimated_duration', 'start_date', 'end_date', 'capacity']
        read_only_fields = ['organization']