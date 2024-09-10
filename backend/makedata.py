import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from flashcards.models import Deck, Card, Folder, CustomUser

def initial_data():
    # Create users
    admin = CustomUser.objects.create_superuser(username="echo", email="echolearn@cs.utah.edu", password="echo")
    joe = CustomUser.objects.create_user(username="joe", email="joe@cs.utah.edu", password="joe", age=30, country="USA")

    # Create folders
    library = Folder.objects.create(name="Library", owner=admin)
    history_folder = Folder.objects.create(name="History", owner=admin, parent=library)
    math_folder = Folder.objects.create(name="Math", owner=admin, parent=library)
    misc_folder = Folder.objects.create(name="Misc", owner=admin, parent=library)
    spanish_folder = Folder.objects.create(name="Spanish", owner=admin)

    # Create decks
    us_pres_deck = Deck.objects.create(folder=history_folder, owner=admin, name="US Presidents", description="A deck for United States presidents.",isPublic = True)
    addition_deck = Deck.objects.create(folder=math_folder, owner=admin, name="Addition", description="A deck for addition practice.",isPublic = True)
    subtraction_deck = Deck.objects.create(folder=math_folder, owner=admin, name="Subtraction", description="A deck for subtraction practice.",isPublic = True)
    phones = Deck.objects.create(folder=misc_folder, owner=admin, name="Phones", description="A deck for remembering people's phone numbers.",isPublic = True)
    spanish_nouns = Deck.objects.create(folder=spanish_folder, owner=admin, name="Common Spanish Nouns", description="A deck for Spanish nouns.",isPublic = True)

    # Create cards
    Card.objects.create(deck=us_pres_deck, question="1st president", answer="George Washington")
    Card.objects.create(deck=us_pres_deck, question="2nd president", answer="John Adams")
    Card.objects.create(deck=us_pres_deck, question="3rd president", answer="Thomas Jefferson")
    Card.objects.create(deck=us_pres_deck, question="4th president", answer="James Madison")
    Card.objects.create(deck=us_pres_deck, question="5th president", answer="James Monroe")
    Card.objects.create(deck=us_pres_deck, question="6th president", answer="John Quincy Adams")
    Card.objects.create(deck=us_pres_deck, question="7th president", answer="Andrew Jackson")
    Card.objects.create(deck=us_pres_deck, question="8th president", answer="Martin Van Buren")
    Card.objects.create(deck=us_pres_deck, question="9th president", answer="William Henry Harrison")
    Card.objects.create(deck=us_pres_deck, question="10th president", answer="John Tyler")
    Card.objects.create(deck=us_pres_deck, question="11th president", answer="James K. Polk")
    Card.objects.create(deck=us_pres_deck, question="12th president", answer="Zachary Taylor")
    Card.objects.create(deck=us_pres_deck, question="13th president", answer="Millard Fillmore")
    Card.objects.create(deck=us_pres_deck, question="14th president", answer="Franklin Pierce")
    Card.objects.create(deck=us_pres_deck, question="15th president", answer="James Buchanan")
    Card.objects.create(deck=us_pres_deck, question="16th president", answer="Abraham Lincoln")
    Card.objects.create(deck=us_pres_deck, question="17th president", answer="Andrew Johnson")
    Card.objects.create(deck=us_pres_deck, question="18th president", answer="Ulysses S. Grant")
    Card.objects.create(deck=us_pres_deck, question="19th president", answer="Rutherford B. Hayes")
    Card.objects.create(deck=us_pres_deck, question="20th president", answer="James A. Garfield")
    Card.objects.create(deck=us_pres_deck, question="21st president", answer="Chester A. Arthur")
    Card.objects.create(deck=us_pres_deck, question="22nd president", answer="Grover Cleveland")
    Card.objects.create(deck=us_pres_deck, question="23rd president", answer="Benjamin Harrison")
    Card.objects.create(deck=us_pres_deck, question="24th president", answer="Grover Cleveland")


    Card.objects.create(deck=addition_deck, question="2 + 2 = ?", answer="4")
    Card.objects.create(deck=addition_deck, question="5 + 7 = ?", answer="12")
    Card.objects.create(deck=addition_deck, question="24 + 21 = ?", answer="45")
    Card.objects.create(deck=addition_deck, question="8 + 3 = ?", answer="11")
    Card.objects.create(deck=addition_deck, question="6 + 9 = ?", answer="15")
    Card.objects.create(deck=addition_deck, question="14 + 7 = ?", answer="21")
    Card.objects.create(deck=addition_deck, question="20 + 25 = ?", answer="45")
    Card.objects.create(deck=addition_deck, question="33 + 22 = ?", answer="55")
    Card.objects.create(deck=addition_deck, question="50 + 50 = ?", answer="100")
    Card.objects.create(deck=addition_deck, question="75 + 25 = ?", answer="100")
    Card.objects.create(deck=addition_deck, question="9 + 16 = ?", answer="25")
    Card.objects.create(deck=addition_deck, question="17 + 8 = ?", answer="25")
    Card.objects.create(deck=addition_deck, question="40 + 60 = ?", answer="100")


    Card.objects.create(deck=subtraction_deck, question="10 - 5 = ?", answer="5")
    Card.objects.create(deck=subtraction_deck, question="15 - 8 = ?", answer="7")
    Card.objects.create(deck=subtraction_deck, question="20 - 4 = ?", answer="16")
    Card.objects.create(deck=subtraction_deck, question="30 - 15 = ?", answer="15")
    Card.objects.create(deck=subtraction_deck, question="50 - 25 = ?", answer="25")
    Card.objects.create(deck=subtraction_deck, question="100 - 50 = ?", answer="50")
    Card.objects.create(deck=subtraction_deck, question="60 - 22 = ?", answer="38")
    Card.objects.create(deck=subtraction_deck, question="45 - 20 = ?", answer="25")
    Card.objects.create(deck=subtraction_deck, question="80 - 33 = ?", answer="47")
    Card.objects.create(deck=subtraction_deck, question="90 - 9 = ?", answer="81")

    Card.objects.create(deck=phones, question="James", answer="111-222-3333")
    Card.objects.create(deck=phones, question="Jane", answer="222-333-444")
    Card.objects.create(deck=phones, question="John", answer="333-444-555")

    Card.objects.create(deck=spanish_nouns, question="Dog", answer="El perro")
    Card.objects.create(deck=spanish_nouns, question="House", answer="La casa")
    Card.objects.create(deck=spanish_nouns, question="Car", answer="El coche")
    Card.objects.create(deck=spanish_nouns, question="Book", answer="El libro")
    Card.objects.create(deck=spanish_nouns, question="Tree", answer="El árbol")
    Card.objects.create(deck=spanish_nouns, question="Sun", answer="El sol")
    Card.objects.create(deck=spanish_nouns, question="Moon", answer="La luna")
    Card.objects.create(deck=spanish_nouns, question="Chair", answer="La silla")
    Card.objects.create(deck=spanish_nouns, question="Table", answer="La mesa")
    Card.objects.create(deck=spanish_nouns, question="School", answer="La escuela")
    Card.objects.create(deck=spanish_nouns, question="Teacher", answer="El profesor/la profesora")
    Card.objects.create(deck=spanish_nouns, question="Student", answer="El estudiante/la estudiante")
    Card.objects.create(deck=spanish_nouns, question="City", answer="La ciudad")
    Card.objects.create(deck=spanish_nouns, question="Country", answer="El país")
    Card.objects.create(deck=spanish_nouns, question="Food", answer="La comida")


if __name__ == "__main__":
    initial_data()