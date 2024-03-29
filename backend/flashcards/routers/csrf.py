from ninja import Router
from flashcards.models import Card, Deck
from flashcards.schemas import CardSchema
from typing import List
from django.middleware.csrf import get_token
from django.http import JsonResponse
import json

csrf_router = Router()

def get_csrf(request):
    return JsonResponse({'csrfToken': get_token(request)})