from django.test import TestCase
from .models import CustomUser, Folder, Deck, Card
from .schemas import GetUser, CreateFolder
from django.urls import reverse
from rest_framework.test import APIClient
from ninja_jwt.tokens import AccessToken

# -----------------------------------------------
# ------------------ Models.py ------------------
# -----------------------------------------------

class CustomUserModelTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username="testuser", password="password", age=30, country="USA"
        )

    def test_custom_user_creation(self):
        self.assertEqual(self.user.age, 30)
        self.assertEqual(self.user.country, "USA")

    def test_str_representation(self):
        self.assertEqual(str(self.user), "testuser")

class FolderModelTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(username="testuser", password="password")
        self.folder = Folder.objects.create(name="Test Folder", owner=self.user)

    def test_folder_creation(self):
        self.assertEqual(self.folder.owner.username, "testuser")

    def test_str_representation(self):
        self.assertEqual(str(self.folder), f"Test Folder (id={self.folder.folder_id})")

class DeckModelTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(username="testuser", password="password")
        self.folder = Folder.objects.create(name="Test Folder", owner=self.user)
        self.deck = Deck.objects.create(name="Test Deck", folder=self.folder, owner=self.user)

    def test_deck_creation(self):
        self.assertEqual(self.deck.folder.name, "Test Folder")
        self.assertEqual(self.deck.owner.username, "testuser")

    def test_str_representation(self):
        self.assertEqual(str(self.deck), f"Test Deck (id={self.deck.deck_id})")

class CardModelTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(username="testuser", password="password")
        self.folder = Folder.objects.create(name="Test Folder", owner=self.user)
        self.deck = Deck.objects.create(name="Test Deck", folder=self.folder, owner=self.user)
        self.card = Card.objects.create(
            deck=self.deck, question="What is Django?", answer="A web framework"
        )

    def test_card_creation(self):
        self.assertEqual(self.card.answer, "A web framework")
        self.assertEqual(self.card.deck.name, "Test Deck")

    def test_str_representation(self):
        self.assertEqual(str(self.card), f"What is Django? (id={self.card.card_id})")

# -----------------------------------------------
# ------------------ schemas.py -----------------
# -----------------------------------------------

class SchemasTest(TestCase):
    def test_get_user_schema(self):
        data = {
            "id": 1,  # Added the required 'id' field
            "username": "testuser",
            "email": "test@example.com",
            "age": 30,
            "country": "USA"
        }
        user_schema = GetUser(**data)
        self.assertEqual(user_schema.id, 1)
        self.assertEqual(user_schema.username, "testuser")
        self.assertEqual(user_schema.email, "test@example.com")

    def test_create_folder_schema(self):
        data = {"name": "New Folder", "folder_id": 1}
        folder_schema = CreateFolder(**data)
        self.assertEqual(folder_schema.name, "New Folder")

# -----------------------------------------------
# ------------------ folders.py -----------------
# -----------------------------------------------

class FoldersTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(username='testuser', password='password123')
        self.token = str(AccessToken.for_user(self.user))
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.folder = Folder.objects.create(name='Test Folder', owner=self.user)

    def test_get_folders(self):
        response = self.client.get(reverse('api-1.0.0:get_folders'))
        self.assertEqual(response.status_code, 200)
        folders = response.json()
        self.assertEqual(folders[0]['name'], self.folder.name)

    def test_create_folder(self):
        data = {"name": "New Folder"}
        response = self.client.post(reverse('api-1.0.0:get_folders'), data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Folder.objects.count(), 2)

    def test_update_folder(self):
        data = {"name": "Updated Folder"}
        response = self.client.patch(reverse('api-1.0.0:get_folder', args=[self.folder.folder_id]), data, format='json')
        self.assertEqual(response.status_code, 200)
        self.folder.refresh_from_db()
        self.assertEqual(self.folder.name, "Updated Folder")

    def test_delete_folder(self):
        response = self.client.delete(reverse('api-1.0.0:get_folder', args=[self.folder.folder_id]))
        self.assertEqual(response.status_code, 204)
        self.assertEqual(Folder.objects.count(), 0)

# -----------------------------------------------
# ------------------ decks.py -------------------
# -----------------------------------------------

class DecksTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(username='testuser', password='password123')
        self.token = str(AccessToken.for_user(self.user))
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.folder = Folder.objects.create(name='Test Folder', owner=self.user)
        self.deck = Deck.objects.create(name='Test Deck', folder=self.folder, owner=self.user)

    def test_create_deck(self):
        data = {"folder_id": self.folder.folder_id, "name": "New Deck"}
        response = self.client.post(reverse('api-1.0.0:get_decks'), data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Deck.objects.count(), 2)

    def test_delete_deck(self):
        response = self.client.delete(reverse('api-1.0.0:get_deck', args=[self.deck.deck_id]))
        self.assertEqual(response.status_code, 204)
        self.assertEqual(Deck.objects.count(), 0)

# -----------------------------------------------
# ------------------ cards.py -------------------
# -----------------------------------------------

class CardsTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(username='testuser', password='password123')
        self.token = str(AccessToken.for_user(self.user))
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.folder = Folder.objects.create(name='Test Folder', owner=self.user)
        self.deck = Deck.objects.create(name='Test Deck', folder=self.folder, owner=self.user)
        self.card = Card.objects.create(deck=self.deck, question="What is Django?", answer="A web framework")

    def test_create_card(self):
        data = {"deck_id": self.deck.deck_id, "question": "New Question", "answer": "New Answer"}
        response = self.client.post(reverse('api-1.0.0:create_card'), data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Card.objects.count(), 2)

    def test_delete_card(self):
        response = self.client.delete(reverse('api-1.0.0:delete_card', args=[self.card.card_id]))
        self.assertEqual(response.status_code, 204)
        self.assertEqual(Card.objects.count(), 0)
