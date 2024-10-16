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
    school_folder = Folder.objects.create(name="School", owner=admin)
    history_folder = Folder.objects.create(name="History", owner=admin, parent=school_folder)
    math_folder = Folder.objects.create(name="Math", owner=admin, parent=school_folder)
    spanish_folder = Folder.objects.create(name="Spanish", owner=admin)
    misc_folder = Folder.objects.create(name="Misc", owner=admin)

    # Create decks
    us_pres_deck = Deck.objects.create(folder=history_folder, owner=admin, name="US Presidents", description="A deck for United States presidents.", isPublic = True)
    addition_deck = Deck.objects.create(folder=math_folder, owner=admin, name="Addition", description="A deck for addition practice.", isPublic = True)
    subtraction_deck = Deck.objects.create(folder=math_folder, owner=admin, name="Subtraction", description="A deck for subtraction practice.", isPublic = True)
    spanish_nouns_deck = Deck.objects.create(folder=spanish_folder, owner=admin, name="Common Spanish Nouns", description="A deck for Spanish nouns.", isPublic = True)
    phones_deck = Deck.objects.create(folder=misc_folder, owner=admin, name="Phones", description="A deck for remembering people's phone numbers.", isPublic = True)
    markdown_examples_deck = Deck.objects.create(folder=misc_folder, owner=admin, name="Examples", description="A deck to show off our markdown renderer.", isPublic = True)

    # Create cards
    card1 = Card.objects.create(deck=us_pres_deck, question="1st president", answer="George Washington", bucket=4, correct_count=4, incorrect_count=0)
    card2 =Card.objects.create(deck=us_pres_deck, question="2nd president", answer="John Adams", bucket=3, correct_count=3, incorrect_count=1)
    card3 =Card.objects.create(deck=us_pres_deck, question="3rd president", answer="Thomas Jefferson", bucket=3, correct_count=2, incorrect_count=1)
    card4 =Card.objects.create(deck=us_pres_deck, question="4th president", answer="James Madison", bucket=3, correct_count=2, incorrect_count=2)
    card5 =Card.objects.create(deck=us_pres_deck, question="5th president", answer="James Monroe", bucket=2, correct_count=3, incorrect_count=1)
    card6 =Card.objects.create(deck=us_pres_deck, question="6th president", answer="John Quincy Adams", bucket=2, correct_count=2, incorrect_count=1)
    card7 =Card.objects.create(deck=us_pres_deck, question="7th president", answer="Andrew Jackson", bucket=2, correct_count=2, incorrect_count=0)
    card8 =Card.objects.create(deck=us_pres_deck, question="8th president", answer="Martin Van Buren", bucket=1, correct_count=2, incorrect_count=1)
    card9 =Card.objects.create(deck=us_pres_deck, question="9th president", answer="William Henry Harrison", bucket=1, correct_count=1, incorrect_count=0)
    card10 =Card.objects.create(deck=us_pres_deck, question="10th president", answer="John Tyler", bucket=1, correct_count=1, incorrect_count=0)
    card11 =Card.objects.create(deck=us_pres_deck, question="11th president", answer="James K. Polk", bucket=0, correct_count=1, incorrect_count=2)
    card12 =Card.objects.create(deck=us_pres_deck, question="12th president", answer="Zachary Taylor")
    card13 =Card.objects.create(deck=us_pres_deck, question="13th president", answer="Millard Fillmore")
    card14 =Card.objects.create(deck=us_pres_deck, question="14th president", answer="Franklin Pierce")
    card15 =Card.objects.create(deck=us_pres_deck, question="15th president", answer="James Buchanan")
    card16 =Card.objects.create(deck=us_pres_deck, question="16th president", answer="Abraham Lincoln")
    card17 =Card.objects.create(deck=us_pres_deck, question="17th president", answer="Andrew Johnson")
    card18 =Card.objects.create(deck=us_pres_deck, question="18th president", answer="Ulysses S. Grant")
    card19 =Card.objects.create(deck=us_pres_deck, question="19th president", answer="Rutherford B. Hayes")
    card20 =Card.objects.create(deck=us_pres_deck, question="20th president", answer="James A. Garfield")
    card21 =Card.objects.create(deck=us_pres_deck, question="21st president", answer="Chester A. Arthur")
    card22 =Card.objects.create(deck=us_pres_deck, question="22nd president", answer="Grover Cleveland")
    card23 =Card.objects.create(deck=us_pres_deck, question="23rd president", answer="Benjamin Harrison")
    card24 =Card.objects.create(deck=us_pres_deck, question="24th president", answer="Grover Cleveland")
    
    us_pres_deck.order_List = [card1.card_id,card2.card_id,card3.card_id,card4.card_id,card5.card_id,card6.card_id,card7.card_id,card8.card_id,card9.card_id,
                               card10.card_id,card11.card_id,card12.card_id,card13.card_id,card14.card_id,card15.card_id,card16.card_id,card17.card_id,card18.card_id,
                               card19.card_id,card20.card_id,card21.card_id,card22.card_id,card23.card_id,card24.card_id]
    us_pres_deck.save()
    
    card25 = Card.objects.create(deck=addition_deck, question="2 + 2 = ?", answer="4")
    card26 =Card.objects.create(deck=addition_deck, question="5 + 7 = ?", answer="12")
    card27 =Card.objects.create(deck=addition_deck, question="24 + 21 = ?", answer="45")
    card28 =Card.objects.create(deck=addition_deck, question="8 + 3 = ?", answer="11")
    card29 =Card.objects.create(deck=addition_deck, question="6 + 9 = ?", answer="15")
    card30 =Card.objects.create(deck=addition_deck, question="14 + 7 = ?", answer="21")
    card31 =Card.objects.create(deck=addition_deck, question="20 + 25 = ?", answer="45")
    card32 =Card.objects.create(deck=addition_deck, question="33 + 22 = ?", answer="55")
    card33 =Card.objects.create(deck=addition_deck, question="50 + 50 = ?", answer="100")
    card34 =Card.objects.create(deck=addition_deck, question="75 + 25 = ?", answer="100")
    card35 =Card.objects.create(deck=addition_deck, question="9 + 16 = ?", answer="25")
    card36 =Card.objects.create(deck=addition_deck, question="17 + 8 = ?", answer="25")
    card37 =Card.objects.create(deck=addition_deck, question="40 + 60 = ?", answer="100")
    
    addition_deck.order_List = [card25.card_id,card26.card_id,card27.card_id,card28.card_id,card29.card_id,card30.card_id,card31.card_id,card32.card_id,card33.card_id,card34.card_id,
                     card35.card_id,card36.card_id,card37.card_id]
    addition_deck.save()
    
    card38 = Card.objects.create(deck=subtraction_deck, question="10 - 5 = ?", answer="5")
    card39 =Card.objects.create(deck=subtraction_deck, question="15 - 8 = ?", answer="7")
    card40 =Card.objects.create(deck=subtraction_deck, question="20 - 4 = ?", answer="16")
    card41 =Card.objects.create(deck=subtraction_deck, question="30 - 15 = ?", answer="15")
    card42 =Card.objects.create(deck=subtraction_deck, question="50 - 25 = ?", answer="25")
    card43 =Card.objects.create(deck=subtraction_deck, question="100 - 50 = ?", answer="50")
    card44 =Card.objects.create(deck=subtraction_deck, question="60 - 22 = ?", answer="38")
    card45 =Card.objects.create(deck=subtraction_deck, question="45 - 20 = ?", answer="25")
    card46 =Card.objects.create(deck=subtraction_deck, question="80 - 33 = ?", answer="47")
    card47 =Card.objects.create(deck=subtraction_deck, question="90 - 9 = ?", answer="81")
    
    subtraction_deck.order_List = [card38.card_id,card39.card_id,card40.card_id,card41.card_id,card42.card_id,card43.card_id,card44.card_id,card45.card_id,card46.card_id,
                                   card47.card_id]
    subtraction_deck.save()
    
    card48 =Card.objects.create(deck=spanish_nouns_deck, question="Dog", answer="El perro")
    card49 =Card.objects.create(deck=spanish_nouns_deck, question="House", answer="La casa")
    card50 =Card.objects.create(deck=spanish_nouns_deck, question="Car", answer="El coche")
    card51 =Card.objects.create(deck=spanish_nouns_deck, question="Book", answer="El libro")
    card52 =Card.objects.create(deck=spanish_nouns_deck, question="Tree", answer="El árbol")
    card53 =Card.objects.create(deck=spanish_nouns_deck, question="Sun", answer="El sol")
    card54 =Card.objects.create(deck=spanish_nouns_deck, question="Moon", answer="La luna")
    card55 =Card.objects.create(deck=spanish_nouns_deck, question="Chair", answer="La silla")
    card56 =Card.objects.create(deck=spanish_nouns_deck, question="Table", answer="La mesa")
    card57 =Card.objects.create(deck=spanish_nouns_deck, question="School", answer="La escuela")
    card58 =Card.objects.create(deck=spanish_nouns_deck, question="Teacher", answer="El profesor / la profesora")
    card59 =Card.objects.create(deck=spanish_nouns_deck, question="Student", answer="(El/La) estudiante")
    card60 =Card.objects.create(deck=spanish_nouns_deck, question="City", answer="La ciudad")
    card61 =Card.objects.create(deck=spanish_nouns_deck, question="Country", answer="El país")
    card62 =Card.objects.create(deck=spanish_nouns_deck, question="Food", answer="La comida")
    
    spanish_nouns_deck.order_List = [card48.card_id,card49.card_id,card50.card_id,card51.card_id,card52.card_id,card53.card_id,card54.card_id,card55.card_id,card56.card_id,
                                     card57.card_id,card58.card_id,card59.card_id,card60.card_id,card61.card_id,card62.card_id]
    spanish_nouns_deck.save()
    
    card63 =Card.objects.create(deck=phones_deck, question="James", answer="111-222-3333")
    card64 =Card.objects.create(deck=phones_deck, question="Jane", answer="222-333-444")
    card65 =Card.objects.create(deck=phones_deck, question="John", answer="333-444-555")

    phones_deck.order_List=[card63.card_id,card64.card_id,card65.card_id]
    phones_deck.save()
    
    card66 =Card.objects.create(
        deck=markdown_examples_deck, 
        question="**Bold** \n *Italic* \n __Underline__ \n ***__Combination__*** \n ",
        answer="""
| Header | Header |
| ------ | ------ |
| Data   | Data   |
| Data   | Data   |
"""
    )
    card67 =Card.objects.create(
        deck=markdown_examples_deck, 
        question="Please write your code in the `main` function. You may also write it in `foo`.",
        answer="""
function add(a, b) {
  return a + b;
}

function main() {
  console.log("Hello EchoLearn!");
  let a = 7;
  let b = 12;
  console.log(add(a, b));
}

main();
"""
    )
    card68 =Card.objects.create(
        deck=markdown_examples_deck, 
        question="# Header 1 \n Content \n\n ## Header 2 \n Content \n\n ### Header 3 \n Content \n\n --- \n More Content",
        answer="![image of apple](https://shorturl.at/jsPr9) \n Here is a link: [facebook](https://www.facebook.com/)"
    )

    markdown_examples_deck.order_List = [card66.card_id,card67.card_id,card68.card_id]
    markdown_examples_deck.save()

if __name__ == "__main__":
    initial_data()