from rest_framework import serializers
from .models import Opportunity

class OpportunitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Opportunity
        fields = ['id', 'title', 'description', 'requirements', 'location_name', 'latitude', 'longitude', 'organization']
        read_only_fields = ['organization']
