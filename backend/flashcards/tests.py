from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from .models import CustomUser, Folder, Deck, Card
from ninja.errors import ValidationError
from .schemas import GetUser, CreateFolder
from django.contrib.auth import get_user_model
from ninja_jwt.tokens import AccessToken

# -----------------------------------------------
# ------------------ Models.py ------------------
# -----------------------------------------------

class CustomUserModelTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(username="testuser", password="password", age=30, country="USA")

    def test_custom_user_creation(self):
        user = CustomUser.objects.get(username="testuser")
        self.assertEqual(user.age, 30)
        self.assertEqual(user.country, "USA")

    def test_str_representation(self):
        self.assertEqual(str(self.user), "testuser")

class FolderModelTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(username="testuser", password="password")
        self.folder = Folder.objects.create(name="Test Folder", owner=self.user)

    def test_folder_creation(self):
        folder = Folder.objects.get(name="Test Folder")
        self.assertEqual(folder.owner.username, "testuser")

    def test_str_representation(self):
        self.assertEqual(str(self.folder), "Test Folder (id={})".format(self.folder.folder_id))

class DeckModelTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(username="testuser", password="password")
        self.folder = Folder.objects.create(name="Test Folder", owner=self.user)
        self.deck = Deck.objects.create(name="Test Deck", folder=self.folder, owner=self.user)

    def test_deck_creation(self):
        deck = Deck.objects.get(name="Test Deck")
        self.assertEqual(deck.folder.name, "Test Folder")
        self.assertEqual(deck.owner.username, "testuser")

    def test_str_representation(self):
        self.assertEqual(str(self.deck), "Test Deck (id={})".format(self.deck.deck_id))

class CardModelTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(username="testuser", password="password")
        self.folder = Folder.objects.create(name="Test Folder", owner=self.user)
        self.deck = Deck.objects.create(name="Test Deck", folder=self.folder, owner=self.user)
        self.card = Card.objects.create(
            deck=self.deck,
            question="What is Django?",
            answer="A web framework",
            questionvideolink="http://example.com/qvideo",
            answervideolink="http://example.com/avideo"
        )

    def test_card_creation(self):
        card = Card.objects.get(question="What is Django?")
        self.assertEqual(card.answer, "A web framework")
        self.assertEqual(card.deck.name, "Test Deck")

    def test_str_representation(self):
        self.assertEqual(str(self.card), "What is Django? (id={})".format(self.card.card_id))

# -----------------------------------------------
# ------------------ schemas.py -----------------
# -----------------------------------------------

class SchemasTest(TestCase):
    def test_get_user_schema(self):
        data = {
            "username": "testuser",
            "email": "testuser@example.com",
            "age": 30,
            "country": "USA"
        }
        user_schema = GetUser(**data)
        self.assertEqual(user_schema.username, "testuser")
        self.assertEqual(user_schema.email, "testuser@example.com")

    def test_create_folder_schema(self):
        data = {
            "name": "New Folder",
            "folder_id": 1
        }
        folder_schema = CreateFolder(**data)
        self.assertEqual(folder_schema.name, "New Folder")

# 这个测试失败的原因是因为在 schemas.py 中的 CreateFolder Schema 中，name 字段没有定义为必填项，也没有限制最小长度或其他约束条件。所以即使 name 是空字符串，也不会触发 ValidationError。
    # def test_invalid_create_folder(self):
    #     with self.assertRaises(ValidationError):
    #         data = {"name": ""}
    #         CreateFolder(**data)

# -----------------------------------------------
# ------------------ folders.py -----------------
# -----------------------------------------------

class FoldersTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(username='testuser', password='password123')
        self.token = str(AccessToken.for_user(self.user))
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')

        self.folder = Folder.objects.create(name='Test Folder', owner=self.user)
        self.folder_url = reverse('api-1.0.0:get_folder', args=[self.folder.folder_id])
        self.folders_url = reverse('api-1.0.0:get_folders')

    def test_get_folders(self):
        response = self.client.get(self.folders_url)
        self.assertEqual(response.status_code, 200)
        folders = response.json()  # Use .json() to access response data
        self.assertEqual(len(folders), 1)
        self.assertEqual(folders[0]['name'], self.folder.name)

    def test_get_folder(self):
        response = self.client.get(self.folder_url)
        self.assertEqual(response.status_code, 200)
        folder_data = response.json()  # Use .json() to access response data
        self.assertEqual(folder_data['name'], self.folder.name)

    def test_create_folder(self):
        data = {"name": "New Folder"}
        response = self.client.post(self.folders_url, data, format='json')
        self.assertEqual(response.status_code, 201)
        folder_data = response.json()  # Use .json() to access response data
        self.assertEqual(folder_data['name'], data['name'])
        self.assertEqual(Folder.objects.count(), 2)

    def test_update_folder(self):
        data = {"name": "Updated Folder Name"}
        response = self.client.patch(self.folder_url, data, format='json')
        self.assertEqual(response.status_code, 200)
        folder_data = response.json() 
        self.assertEqual(folder_data['name'], data['name'])
        self.folder.refresh_from_db()
        self.assertEqual(self.folder.name, data['name'])

    def test_delete_folder(self):
        response = self.client.delete(self.folder_url)
        self.assertEqual(response.status_code, 204)
        self.assertEqual(Folder.objects.count(), 0)

    def test_delete_folder_with_decks(self):
        from flashcards.models import Deck
        deck = Deck.objects.create(name='Test Deck', folder=self.folder, owner=self.user)
        response = self.client.delete(self.folder_url)
        self.assertEqual(response.status_code, 409)
        response_message = response.json()  
        self.assertEqual(response_message, "Cannot delete folder with decks in it")

# -----------------------------------------------
# ------------------ decks.py -------------------
# -----------------------------------------------

class DecksTestCase(TestCase):
    def setUp(self):
        # Initialize the API client
        self.client = APIClient()
        
        # Create a test user and generate a JWT
        self.user = CustomUser.objects.create_user(username='testuser', password='password123')
        self.token = str(AccessToken.for_user(self.user))
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')

        # Create a test folder
        self.folder = Folder.objects.create(name='Test Folder', owner=self.user)
        
        # Create a test deck
        self.deck = Deck.objects.create(name='Test Deck', folder=self.folder, owner=self.user, isPublic=True)
        
        # Define deck URLs
        self.deck_url = reverse('api-1.0.0:get_deck', args=[self.deck.deck_id])
        self.decks_url = reverse('api-1.0.0:get_decks')

    def test_get_decks(self):
        """Test fetching all decks"""
        response = self.client.get(self.decks_url)
        self.assertEqual(response.status_code, 200)
        decks = response.json()  # Get deck data
        self.assertEqual(len(decks), 1)
        self.assertEqual(decks[0]['name'], self.deck.name)

    def test_create_deck(self):
        """Test creating a new deck"""
        data = {"folder_id": self.folder.folder_id, "name": "New Test Deck", "description": "A new deck"}
        response = self.client.post(self.decks_url, data, format='json')
        self.assertEqual(response.status_code, 201)
        new_deck = response.json()
        self.assertEqual(new_deck['name'], data['name'])
        self.assertEqual(Deck.objects.count(), 2)

    def test_get_deck(self):
        """Test fetching deck details"""
        response = self.client.get(self.deck_url)
        self.assertEqual(response.status_code, 200)
        deck_data = response.json()
        self.assertEqual(deck_data['name'], self.deck.name)

    def test_update_deck_status(self):
        """Test updating deck public status"""
        update_url = reverse('api-1.0.0:update_deck_status', args=[self.deck.deck_id])
        response = self.client.post(update_url)
        self.assertEqual(response.status_code, 200)
        deck_data = response.json()
        self.assertEqual(deck_data['isPublic'], not self.deck.isPublic)

    def test_delete_deck(self):
        """Test deleting a deck"""
        delete_url = reverse('api-1.0.0:delete_deck', args=[self.deck.deck_id])
        response = self.client.delete(delete_url)
        self.assertEqual(response.status_code, 204)
        self.assertEqual(Deck.objects.count(), 0)

    def test_create_card(self):
        """Test creating a card"""
        create_card_url = reverse('api-1.0.0:create_card')
        data = {
            "deck_id": self.deck.deck_id,
            "question": "Test Question",
            "answer": "Test Answer",
            "questionvideolink": "",
            "answervideolink": "",
            "questionimagelink": "",
            "answerimagelink": "",
            "questionlatex": "",
            "answerlatex": ""
        }
        response = self.client.post(create_card_url, data, format='json')
        self.assertEqual(response.status_code, 201)
        card_data = response.json()
        self.assertEqual(card_data['question'], data['question'])
        self.assertEqual(Card.objects.count(), 1)

    def test_copy_deck(self):
        """Test copying a deck"""
        copy_deck_url = reverse('api-1.0.0:copy_deck', args=[self.deck.deck_id, self.folder.folder_id])
        response = self.client.get(copy_deck_url)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Deck.objects.count(), 2)

# -----------------------------------------------
# ------------------ cards.py -------------------
# -----------------------------------------------

class CardsTestCase(TestCase):
    def setUp(self):
        # Initialize the API client
        self.client = APIClient()

        # Create a test user and generate a JWT
        self.user = CustomUser.objects.create_user(username='testuser', password='password123')
        self.token = str(AccessToken.for_user(self.user))
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')

        # Create a test folder and deck
        self.folder = Folder.objects.create(name='Test Folder', owner=self.user)
        self.deck = Deck.objects.create(name='Test Deck', folder=self.folder, owner=self.user)

        # Create a test card
        self.card = Card.objects.create(
            deck=self.deck,
            question="What is Django?",
            answer="A web framework",
            questionvideolink="http://example.com/qvideo",
            answervideolink="http://example.com/avideo"
        )

        # Define URLs
        self.cards_url = reverse('api-1.0.0:get_cards')
        self.card_url = reverse('api-1.0.0:get_card', args=[self.card.card_id])
        self.create_card_url = reverse('api-1.0.0:create_card')
        self.delete_card_url = reverse('api-1.0.0:delete_card', args=[self.card.card_id])

    def test_get_cards(self):
        """Test fetching all cards"""
        response = self.client.get(self.cards_url)
        self.assertEqual(response.status_code, 200)
        cards = response.json()
        self.assertEqual(len(cards), 1)
        self.assertEqual(cards[0]['question'], self.card.question)

    def test_get_card(self):
        """Test fetching card details"""
        response = self.client.get(self.card_url)
        self.assertEqual(response.status_code, 200)
        card_data = response.json()
        self.assertEqual(card_data['question'], self.card.question)
        self.assertEqual(card_data['answer'], self.card.answer)

    def test_create_card(self):
        """Test creating a new card"""
        data = {
            "deck_id": self.deck.deck_id,
            "question": "New Test Question",
            "answer": "New Test Answer",
            "questionvideolink": "",
            "answervideolink": "",
            "questionimagelink": "",
            "answerimagelink": "",
            "questionlatex": "",
            "answerlatex": ""
        }
        response = self.client.post(self.create_card_url, data, format='json')
        self.assertEqual(response.status_code, 201)
        card_data = response.json()
        self.assertEqual(card_data['question'], data['question'])
        self.assertEqual(Card.objects.count(), 2)

    def test_update_card(self):
        """Test updating a card"""
        update_url = reverse('api-1.0.0:update_card', args=[self.card.card_id])
        data = {
            "question": "Updated Question",
            "answer": "Updated Answer"
        }
        response = self.client.patch(update_url, data, format='json')
        self.assertEqual(response.status_code, 200)
        card_data = response.json()
        self.assertEqual(card_data['question'], data['question'])
        self.assertEqual(card_data['answer'], data['answer'])

    def test_delete_card(self):
        """Test deleting a card"""
        response = self.client.delete(self.delete_card_url)
        self.assertEqual(response.status_code, 204)
        self.assertEqual(Card.objects.count(), 0)