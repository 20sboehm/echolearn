import os, django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from django.core.files.base import ContentFile
from flashcards.models import User, Deck, Card

def initial_data():
    admin =  User.objects.create_superuser("echo", "echolearn@cs.utah.edu", "echo")
    new_deck = Deck.objects.create(
        deck_id=0,
        title="first deck"
    )
    Card.objects.create(
        card_id = 0,
        deck = new_deck,
        question = "what",
        answer = "know"
    )
if __name__ == "__main__":
    initial_data()