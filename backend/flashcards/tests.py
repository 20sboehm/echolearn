from django.contrib.auth.models import User
from django.test import TestCase
from flashcards.models import Deck, Card, Folder, SharedDeck

# Create your tests here.

class FlashcardsTestCase(TestCase):
    
    #MySQL test start here
    # Set up data for the whole TestCase
    def setUp(self):
        self.owner = User.objects.create_user('jzz', 'jzz@test.com', 'jpassword')
        self.root_folder = Folder.objects.create(name='Root Folder', owner=self.owner)
        self.sub_folder = Folder.objects.create(name='Sub Folder', owner=self.owner, parent=self.root_folder)
        self.deck = Deck.objects.create(name='Test Deck', description='A test deck', owner=self.owner, folder=self.root_folder)
        self.card = Card.objects.create(question='Who am I??', answer='Pikachu!', deck=self.deck, bucket=1)
        self.shared_with_user = User.objects.create_user('seth', 'seth@test.com', 'spassword')
        self.shared_deck = SharedDeck.objects.create(deck=self.deck, shared_with=self.shared_with_user)

    # Test folder creation
    def test_folder_creation(self):
        self.assertTrue(Folder.objects.filter(name='Root Folder').exists())
        self.assertTrue(Folder.objects.filter(name='Sub Folder').exists())
        self.assertEqual(Folder.objects.count(), 2)
        self.assertEqual(self.root_folder.children.first(), self.sub_folder)

    # Test subfolder creation
    def test_sub_folder_creation(self):
        self.assertEqual(self.sub_folder.parent, self.root_folder)
        self.assertTrue(Folder.objects.filter(name='Sub Folder', parent=self.root_folder).exists())

    # Test deck creation
    def test_deck_creation(self):
        self.assertTrue(Deck.objects.filter(name='Test Deck').exists())
        self.assertEqual(Deck.objects.count(), 1)
        self.assertEqual(Deck.objects.first(), self.deck)

    # Test card creation
    def test_card_creation(self):
        self.assertTrue(Card.objects.filter(question='Who am I??').exists())
        self.assertEqual(Card.objects.count(), 1)
        self.assertEqual(Card.objects.first(), self.card)

    # Test shared deck creation
    def test_shared_deck_creation(self):
        self.assertTrue(SharedDeck.objects.filter(deck=self.deck, shared_with=self.shared_with_user).exists())
        self.assertEqual(SharedDeck.objects.count(), 1)
        self.assertEqual(SharedDeck.objects.first(), self.shared_deck)
    #MySQL test end here