from django.conf import settings

def google_maps_api_key(request):
    return {'GOOGLE_MAP_API_KEY': settings.GOOGLE_MAP_API_KEY}
