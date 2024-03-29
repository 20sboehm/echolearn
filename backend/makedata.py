import os, django
from datetime import date
from django.utils.timezone import now
from django.core.files.base import ContentFile
# from django.contrib.auth.models import User
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from flashcards.models import User, Deck, Card, Folder


def initial_data():
    admin =  User.objects.create_superuser("echo", "echolearn@cs.utah.edu", "echo")

    new_folder = Folder.objects.create(
        folder_id = 0,
        last_edited = now(),
        created_at = now(),
        name = "first folder",
    )

    new_deck = Deck.objects.create(
        deck_id=0,
        name = "first deck",
        folder = new_folder,
        last_edited = now(),
        created_at = now(),
        statistics = 1,
        description ="why need a description?",
    )
    
    Card.objects.create(
        card_id = 0,
        deck = new_deck,
        question = "what",
        answer = "know",
        last_edited = now(),
        created_at = now(),
        last_reviewed = now(),
        next_review = now(),
        bucket = 1
    )

if __name__ == "__main__":
    initial_data()