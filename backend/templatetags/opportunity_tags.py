from django import template
from backend.models import Application

register = template.Library()

@register.simple_tag(takes_context=True)
def has_applied(context, opportunity):
    request = context['request']
    if not request.user.is_authenticated or not hasattr(request.user, 'volunteer'):
        return False
    
    return Application.objects.filter(
        volunteer=request.user.volunteer,
        opportunity=opportunity
    ).exists()

@register.simple_tag(takes_context=True)
def application_status(context, opportunity):
    request = context['request']
    if not request.user.is_authenticated or not hasattr(request.user, 'volunteer'):
        return ''
    
    try:
        application = Application.objects.get(
            volunteer=request.user.volunteer,
            opportunity=opportunity
        )
        return application.status
    except Application.DoesNotExist:
        return ''
