import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from flashcards.models import Deck, Card, Folder, CustomUser

def initial_data():
    cards = {
        "us_pres_deck": [
            { "question": "1st president", "answer": "George Washington", "bucket": 5, "correct_count": 16, "incorrect_count": 7, "is_new": False },
            { "question": "2nd president", "answer": "John Adams", "bucket": 5, "correct_count": 3, "incorrect_count": 8, "is_new": False },
            { "question": "3rd president", "answer": "Thomas Jefferson", "bucket": 5, "correct_count": 7, "incorrect_count": 9, "is_new": False },
            { "question": "4th president", "answer": "James Madison", "bucket": 5, "correct_count": 5, "incorrect_count": 3, "is_new": False },
            { "question": "5th president", "answer": "James Monroe", "bucket": 4, "correct_count": 5, "incorrect_count": 1, "is_new": False },
            { "question": "6th president", "answer": "John Quincy Adams", "bucket": 4, "correct_count": 5, "incorrect_count": 1, "is_new": False },
            { "question": "7th president", "answer": "Andrew Jackson", "bucket": 4, "correct_count": 6, "incorrect_count": 3, "is_new": False },
            { "question": "8th president", "answer": "Martin Van Buren", "bucket": 4, "correct_count": 2, "incorrect_count": 1, "is_new": False },
            { "question": "9th president", "answer": "William Henry Harrison", "bucket": 4, "correct_count": 1, "incorrect_count": 1, "is_new": False },
            { "question": "10th president", "answer": "John Tyler", "bucket": 3, "correct_count": 3, "incorrect_count": 1, "is_new": False },
            { "question": "11th president", "answer": "James K. Polk", "bucket": 3, "correct_count": 2, "incorrect_count": 2, "is_new": False },
            { "question": "12th president", "answer": "Zachary Taylor", "bucket": 3, "correct_count": 3, "incorrect_count": 1, "is_new": False },
            { "question": "13th president", "answer": "Millard Fillmore", "bucket": 2, "correct_count": 3, "incorrect_count": 1, "is_new": False },
            { "question": "14th president", "answer": "Franklin Pierce", "bucket": 2, "correct_count": 3, "incorrect_count": 1, "is_new": False },
            { "question": "15th president", "answer": "James Buchanan", "bucket": 2, "correct_count": 3, "incorrect_count": 0, "is_new": False },
            { "question": "16th president", "answer": "Abraham Lincoln", "bucket": 1, "correct_count": 1, "incorrect_count": 1, "is_new": False },
            { "question": "17th president", "answer": "Andrew Johnson", "bucket": 1, "correct_count": 1, "incorrect_count": 0, "is_new": False },
            { "question": "18th president", "answer": "Ulysses S. Grant", "bucket": 0, "correct_count": 0, "incorrect_count": 1, "is_new": False },
            { "question": "19th president", "answer": "Rutherford B. Hayes", "bucket": 0, "correct_count": 0, "incorrect_count": 0, "is_new": True },
            { "question": "20th president", "answer": "James A. Garfield", "bucket": 0, "correct_count": 0, "incorrect_count": 0, "is_new": True },
            { "question": "21st president", "answer": "Chester A. Arthur", "bucket": 0, "correct_count": 0, "incorrect_count": 0, "is_new": True },
            { "question": "22nd president", "answer": "Grover Cleveland", "bucket": 0, "correct_count": 0, "incorrect_count": 0, "is_new": True },
            { "question": "23rd president", "answer": "Benjamin Harrison", "bucket": 0, "correct_count": 0, "incorrect_count": 0, "is_new": True },
            { "question": "24th president", "answer": "Grover Cleveland", "bucket": 0, "correct_count": 0, "incorrect_count": 0, "is_new": True },
            { "question": "25th president", "answer": "William McKinley", "bucket": 0, "correct_count": 0, "incorrect_count": 0, "is_new": True },
            { "question": "26th president", "answer": "Theodore Roosevelt", "bucket": 0, "correct_count": 0, "incorrect_count": 0, "is_new": True },
            { "question": "27th president", "answer": "William Howard Taft", "bucket": 0, "correct_count": 0, "incorrect_count": 0, "is_new": True },
            { "question": "28th president", "answer": "Woodrow Wilson", "bucket": 0, "correct_count": 0, "incorrect_count": 0, "is_new": True },
            { "question": "29th president", "answer": "Warren G. Harding", "bucket": 0, "correct_count": 0, "incorrect_count": 0, "is_new": True },
            { "question": "30th president", "answer": "Calvin Coolidge", "bucket": 0, "correct_count": 0, "incorrect_count": 0, "is_new": True },
            { "question": "31st president", "answer": "Herbert Hoover", "bucket": 0, "correct_count": 0, "incorrect_count": 0, "is_new": True },
            { "question": "32nd president", "answer": "Franklin D. Roosevelt", "bucket": 0, "correct_count": 0, "incorrect_count": 0, "is_new": True },
            { "question": "33rd president", "answer": "Harry S. Truman", "bucket": 0, "correct_count": 0, "incorrect_count": 0, "is_new": True},
            { "question": "34th president", "answer": "Dwight D. Eisenhower", "bucket": 0, "correct_count": 0, "incorrect_count": 0, "is_new": True },
            { "question": "35th president", "answer": "John F. Kennedy", "bucket": 0, "correct_count": 0, "incorrect_count": 0, "is_new": True },
            { "question": "36th president", "answer": "Lyndon B. Johnson", "bucket": 0, "correct_count": 0, "incorrect_count": 0, "is_new": True },
            { "question": "37th president", "answer": "Richard Nixon", "bucket": 0, "correct_count": 0, "incorrect_count": 0, "is_new": True },
            { "question": "38th president", "answer": "Gerald Ford", "bucket": 0, "correct_count": 0, "incorrect_count": 0, "is_new": True },
            { "question": "39th president", "answer": "Jimmy Carter", "bucket": 0, "correct_count": 0, "incorrect_count": 0, "is_new": True },
            { "question": "40th president", "answer": "Ronald Reagan", "bucket": 0, "correct_count": 0, "incorrect_count": 0, "is_new": True },
            { "question": "41st president", "answer": "George H. W. Bush", "bucket": 0, "correct_count": 0, "incorrect_count": 0, "is_new": True },
            { "question": "42nd president", "answer": "Bill Clinton", "bucket": 0, "correct_count": 0, "incorrect_count": 0, "is_new": True },
            { "question": "43rd president", "answer": "George W. Bush", "bucket": 0, "correct_count": 0, "incorrect_count": 0, "is_new": True },
            { "question": "44th president", "answer": "Barack Obama", "bucket": 0, "correct_count": 0, "incorrect_count": 0, "is_new": True },
            { "question": "45th president", "answer": "Donald Trump", "bucket": 0, "correct_count": 0, "incorrect_count": 0, "is_new": True },
            { "question": "46th president", "answer": "Joe Biden", "bucket": 0, "correct_count": 0, "incorrect_count": 0, "is_new": True }
        ],
        "addition_deck": [
            { "question": "2 + 2 = ?", "answer": "4" },
            { "question": "5 + 7 = ?", "answer": "12" },
            { "question": "24 + 21 = ?", "answer": "45" },
            { "question": "8 + 3 = ?", "answer": "11" },
            { "question": "6 + 9 = ?", "answer": "15" },
            { "question": "14 + 7 = ?", "answer": "21" },
            { "question": "20 + 25 = ?", "answer": "45" },
            { "question": "33 + 22 = ?", "answer": "55" },
            { "question": "50 + 50 = ?", "answer": "100" },
            { "question": "75 + 25 = ?", "answer": "100" },
            { "question": "9 + 16 = ?", "answer": "25" },
            { "question": "17 + 8 = ?", "answer": "25" },
            { "question": "40 + 60 = ?", "answer": "100" }
        ],
        "subtraction_deck": [
            { "question": "10 - 5 = ?", "answer": "5" },
            { "question": "15 - 8 = ?", "answer": "7" },
            { "question": "20 - 4 = ?", "answer": "16" },
            { "question": "30 - 15 = ?", "answer": "15" },
            { "question": "50 - 25 = ?", "answer": "25" },
            { "question": "100 - 50 = ?", "answer": "50" },
            { "question": "60 - 22 = ?", "answer": "38" },
            { "question": "45 - 20 = ?", "answer": "25" },
            { "question": "80 - 33 = ?", "answer": "47" },
            { "question": "90 - 9 = ?", "answer": "81" }
        ],
        "division_deck": [
            { "question": "What is 48 ÷ 6?", "answer": "8" },
            { "question": "What is 72 ÷ 8?", "answer": "9" },
            { "question": "What is 36 ÷ 4?", "answer": "9" },
            { "question": "What is 90 ÷ 10?", "answer": "9" },
            { "question": "What is 64 ÷ 8?", "answer": "8" },
            { "question": "What is 56 ÷ 7?", "answer": "8" },
            { "question": "What is 81 ÷ 9?", "answer": "9" },
            { "question": "What is 27 ÷ 3?", "answer": "9" },
            { "question": "What is 45 ÷ 5?", "answer": "9" },
            { "question": "What is 100 ÷ 25?", "answer": "4" }
        ],
        "spanish_nouns_deck": [
            { "question": "Dog", "answer": "El perro" },
            { "question": "House", "answer": "La casa" },
            { "question": "Car", "answer": "El coche" },
            { "question": "Book", "answer": "El libro" },
            { "question": "Tree", "answer": "El árbol" },
            { "question": "Sun", "answer": "El sol" },
            { "question": "Moon", "answer": "La luna" },
            { "question": "Chair", "answer": "La silla" },
            { "question": "Table", "answer": "La mesa" },
            { "question": "School", "answer": "La escuela" },
            { "question": "Teacher", "answer": "El profesor / la profesora" },
            { "question": "Student", "answer": "(El/La) estudiante" },
            { "question": "City", "answer": "La ciudad" },
            { "question": "Country", "answer": "El país" },
            { "question": "Food", "answer": "La comida" }
        ],
        "phones_deck": [
            { "question": "James", "answer": "111-222-3333" },
            { "question": "Jane", "answer": "222-333-444" },
            { "question": "John", "answer": "333-444-555" }
        ],
        "markdown_examples_deck": [
            {
                "question": "**Bold** \n *Italic* \n __Underline__ \n ***__Combination__*** \n",
                "answer": """
                | Header | Header |
                | ------ | ------ |
                | Data   | Data   |
                | Data   | Data   |
                """
            },
            {
                "question": "Please write your code in the `main` function. You may also write it in `foo`.",
                "answer": """
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
            }
        ],
        "spanish_verbs_deck": [
            { "question": "To eat", "answer": "Comer" },
            { "question": "To drink", "answer": "Beber" },
            { "question": "To write", "answer": "Escribir" },
            { "question": "To read", "answer": "Leer" },
            { "question": "To run", "answer": "Correr" },
            { "question": "To sleep", "answer": "Dormir" },
            { "question": "To speak", "answer": "Hablar" },
            { "question": "To walk", "answer": "Caminar" },
            { "question": "To listen", "answer": "Escuchar" },
            { "question": "To study", "answer": "Estudiar" }
        ],
        "python_deck": [
            { "question": "What is the output of `print(2 ** 3)`?", "answer": "8" },
            { "question": "How do you define a function in Python?", "answer": "Using the `def` keyword, e.g., `def my_function():`" },
            { "question": "How do you print 'Hello, World!' in Python?", "answer": "`print('Hello, World!')`" },
            { "question": "What does the following code return?\n ```python\nlist(range(5))\n```", "answer": "`[0, 1, 2, 3, 4]`" },
            { "question": "How do you import the math module in Python?", "answer": "`import math`" }
        ],
        "birthday_deck": [
            { "question": "What is the birthday of Albert Einstein?", "answer": "March 14, 1879" },
            { "question": "What is the birthday of Marie Curie?", "answer": "November 7, 1867" },
            { "question": "What is the birthday of Leonardo da Vinci?", "answer": "April 15, 1452" },
            { "question": "What is the birthday of William Shakespeare?", "answer": "April 23, 1564" },
            { "question": "What is the birthday of Jane Austen?", "answer": "December 16, 1775" }
        ],
        "vocabulary_deck": [
            { "question": "What does 'quintessential' mean?", "answer": "Representing the most perfect or typical example of a quality or class." },
            { "question": "What does 'ubiquitous' mean?", "answer": "Present, appearing, or found everywhere." },
            { "question": "What does 'juxtaposition' mean?", "answer": "The fact of two things being seen or placed close together for contrasting effect." },
            { "question": "What does 'cacophony' mean?", "answer": "A harsh, discordant mixture of sounds." },
            { "question": "What does 'ephemeral' mean?", "answer": "Lasting for a very short time." },
            { "question": "What does 'meticulous' mean?", "answer": "Showing great attention to detail; very careful and precise." },
            { "question": "What does 'paradox' mean?", "answer": "A statement that contradicts itself but might be true." },
            { "question": "What does 'zephyr' mean?", "answer": "A gentle, mild breeze." },
            { "question": "What does 'enigmatic' mean?", "answer": "Difficult to interpret or understand; mysterious." },
            { "question": "What does 'noxious' mean?", "answer": "Harmful, poisonous, or very unpleasant." },
            { "question": "What does 'insidious' mean?", "answer": "Proceeding in a gradual, subtle way, but with harmful effects." },
            { "question": "What does 'cognizant' mean?", "answer": "Having knowledge or being aware of." },
            { "question": "What does 'benevolent' mean?", "answer": "Well-meaning and kindly." },
            { "question": "What does 'ostentatious' mean?", "answer": "Characterized by vulgar or pretentious display; designed to impress or attract notice." },
            { "question": "What does 'resilient' mean?", "answer": "Able to withstand or recover quickly from difficult conditions." }
        ],
        "multiplication_deck": [
            { "question": "What is 6 x 7?", "answer": "42" },
            { "question": "What is 8 x 5?", "answer": "40" },
            { "question": "What is 9 x 4?", "answer": "36" },
            { "question": "What is 12 x 3?", "answer": "36" },
            { "question": "What is 7 x 8?", "answer": "56" }
        ],
        "alice_default_deck": [
            { "question": "question", "answer": "answer" }
        ],
        "bob_default_deck": [
            { "question": "question", "answer": "answer" }
        ]
    }

    # -------------------------------------------
    # ------------------ Users ------------------
    # -------------------------------------------

    admin = CustomUser.objects.create_superuser(username="echo", email="echolearn@cs.utah.edu", password="echo", age=22, country="USA")
    joe = CustomUser.objects.create_user(username="joe", email="joe@cs.utah.edu", password="joe", age=25, country="USA")
    alice = CustomUser.objects.create_user(username="alice", email="alice@cs.utah.edu", password="alice", age=30, country="USA")
    bob = CustomUser.objects.create_user(username="bob", email="bob@cs.utah.edu", password="bob", age=35, country="USA")

    # -------------------------------------------
    # ------------------ Folders ----------------
    # -------------------------------------------

    school_folder = Folder.objects.create(name="School", owner=admin)
    history_folder = Folder.objects.create(name="History", owner=admin, parent=school_folder)
    math_folder = Folder.objects.create(name="Math", owner=admin, parent=school_folder)
    spanish_folder = Folder.objects.create(name="Spanish", owner=admin)
    misc_folder = Folder.objects.create(name="Misc", owner=admin)
    comp_sci_folder = Folder.objects.create(name="Computer Science", owner=admin)
    words_and_phrases_folder = Folder.objects.create(name="Words & Phrases", owner=admin)

    math_folder_2 = Folder.objects.create(name="Math", owner=joe)

    alice_default_folder = Folder.objects.create(name="Example Folder", owner=alice)

    bob_default_folder = Folder.objects.create(name="Example Folder", owner=bob)

    # -------------------------------------------
    # ------------------ Decks ------------------
    # -------------------------------------------

    us_pres_deck = Deck.objects.create(folder=history_folder, owner=admin, name="US Presidents", description="A deck for United States presidents.", isPublic = True)
    addition_deck = Deck.objects.create(folder=math_folder, owner=admin, name="Addition", description="A deck for addition practice.", isPublic = True)
    subtraction_deck = Deck.objects.create(folder=math_folder, owner=admin, name="Subtraction", description="A deck for subtraction practice.", isPublic = True)
    division_deck = Deck.objects.create(folder=math_folder, owner=admin, name="Division", description="A deck for division practice.", isPublic = True)
    spanish_nouns_deck = Deck.objects.create(folder=spanish_folder, owner=admin, name="Common Spanish Nouns", description="A deck for Spanish nouns.", isPublic = True)
    spanish_verbs_deck = Deck.objects.create(folder=spanish_folder, owner=admin, name="Common Spanish Verbs", description="A deck for Spanish verbs.", isPublic = True)
    phones_deck = Deck.objects.create(folder=misc_folder, owner=admin, name="Phones", description="A deck for remembering people's phone numbers.", isPublic = True)
    markdown_examples_deck = Deck.objects.create(folder=misc_folder, owner=admin, name="Examples", description="A deck to show off our markdown renderer.", isPublic = True)
    birthday_deck = Deck.objects.create(folder=misc_folder, owner=admin, name="Birthdays", description="A deck for remembering people's birthdays.", isPublic = True)
    python_deck = Deck.objects.create(folder=comp_sci_folder, owner=admin, name="Python", description="A deck for learning Python.", isPublic = True)
    vocabulary_deck = Deck.objects.create(folder=words_and_phrases_folder, owner=admin, name="Vocabulary", description="A deck for vocabulary.", isPublic = True)

    multiplication_deck = Deck.objects.create(folder=math_folder_2, owner=joe, name="Multiplication", description="A deck for multiplication.", isPublic = True)

    alice_default_deck = Deck.objects.create(folder=alice_default_folder, owner=alice, name="Example Deck", description="Default deck.", isPublic = True)
    
    bob_default_deck = Deck.objects.create(folder=bob_default_folder, owner=bob, name="Example Deck", description="Default deck.", isPublic = True)


    # -------------------------------------------
    # ------------------ Cards ------------------
    # -------------------------------------------

    def create_deck(deck, card_data):
        if card_data == "us_pres_deck":
            card_objects = [
                Card(deck=deck, question=card["question"], answer=card["answer"], bucket=card["bucket"], correct_count=card["correct_count"], incorrect_count=card["incorrect_count"], is_new=card["is_new"])
                for card in cards[card_data]
            ]
        else:
            card_objects = [
                Card(deck=deck, question=card["question"], answer=card["answer"])
                for card in cards[card_data]
            ]
        deck_cards = Card.objects.bulk_create(card_objects)
        deck.order_List = [card.card_id for card in deck_cards]
        deck.save()

    create_deck(us_pres_deck, "us_pres_deck")
    create_deck(addition_deck, "addition_deck")
    create_deck(subtraction_deck, "subtraction_deck")
    create_deck(division_deck, "division_deck")
    create_deck(spanish_nouns_deck, "spanish_nouns_deck")
    create_deck(phones_deck, "phones_deck")
    create_deck(markdown_examples_deck, "markdown_examples_deck")
    create_deck(spanish_verbs_deck, "spanish_verbs_deck")
    create_deck(birthday_deck, "birthday_deck")
    create_deck(python_deck, "python_deck")
    create_deck(vocabulary_deck, "vocabulary_deck")

    create_deck(multiplication_deck, "multiplication_deck")

    create_deck(alice_default_deck, "alice_default_deck")

    create_deck(bob_default_deck, "bob_default_deck")


if __name__ == "__main__":
    initial_data()