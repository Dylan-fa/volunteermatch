from models import Opportunity
from models import Category

def sort(opportunities, type):
    filtered = []

    for opportunity in opportunities:
        print(opportunity.categories.all())
        for category in opportunity.categories.all():
            if type == category.name:
                filtered.append(opportunity)

    return filtered

def filter_opportunities():
    elderly = False
    disability = False
    animal = False
    medical = False

    opportunities = Opportunity.objects.all()

    if elderly:
        opportunities = sort(opportunities, "elderly")
    if disability:
        opportunities = sort(opportunities, "disability")
    if animal:
        opportunities = sort(opportunities, "animal")
    if medical:
        opportunities = sort(opportunities, "medical")
    if elderly:
        opportunities = sort(opportunities, "elderly")
    if elderly:
        opportunities = sort(opportunities, "elderly")
    if elderly:
        opportunities = sort(opportunities, "elderly")
    if elderly:
        opportunities = sort(opportunities, "elderly")

    return opportunities