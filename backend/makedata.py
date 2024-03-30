import os, django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from flashcards.models import User, Deck, Card, Folder


def initial_data():
    admin =  User.objects.create_superuser("echo", "echolearn@cs.utah.edu", "echo")

    new_folder = Folder.objects.create(
        name = "Root",
        owner = admin
    )

    new_deck = Deck.objects.create(
        folder = new_folder,
        owner = admin,
        name = "US History",
        description = "A deck for United States history."
    )

    Card.objects.create(
        deck = new_deck,
        question = "Who was the first United States president?",
        answer = "George Washington"
    )

if __name__ == "__main__":
    initial_data()