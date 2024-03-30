import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from django.contrib.auth.models import User
from flashcards.models import Deck, Card, Folder

def initial_data():
    # Create users
    admin = User.objects.create_superuser(username="echo", email="echolearn@cs.utah.edu", password="echo")
    joe = User.objects.create_user(username="joe", email="joe@cs.utah.edu", password="joe")

    # Create folders
    history_folder = Folder.objects.create(name="History", owner=admin)
    math_folder = Folder.objects.create(name="Math", owner=admin)

    # Create decks
    us_pres_deck = Deck.objects.create(folder=history_folder, owner=admin, name="US Presidents", description="A deck for United States presidents.")
    addition_deck = Deck.objects.create(folder=math_folder, owner=admin, name="Addition", description="A deck for addition practice.")
    subtraction_deck = Deck.objects.create(folder=math_folder, owner=admin, name="Subtraction", description="A deck for subtraction practice.")

    # Create cards
    Card.objects.create(deck=us_pres_deck, question="1st president", answer="George Washington")
    Card.objects.create(deck=us_pres_deck, question="2nd president", answer="John Adams")
    Card.objects.create(deck=us_pres_deck, question="3rd president", answer="Thomas Jefferson")
    Card.objects.create(deck=us_pres_deck, question="4th president", answer="James Madison")

    Card.objects.create(deck=addition_deck, question="2 + 2 = ?", answer="4")
    Card.objects.create(deck=addition_deck, question="5 + 7 = ?", answer="12")
    Card.objects.create(deck=addition_deck, question="24 + 21 = ?", answer="45")

    Card.objects.create(deck=subtraction_deck, question="10 - 5 = ?", answer="5")
    Card.objects.create(deck=subtraction_deck, question="15 - 8 = ?", answer="7")

if __name__ == "__main__":
    initial_data()