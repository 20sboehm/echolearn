from ninja import NinjaAPI
from flashcards.routers.decks import decks_router
from flashcards.routers.cards import cards_router
from flashcards.routers.csrf import csrf_router

api = NinjaAPI()

api.add_router("/decks", decks_router)
api.add_router("/cards", cards_router)
api.add_router("/csrf", csrf_router)