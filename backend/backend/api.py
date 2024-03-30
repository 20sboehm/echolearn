from ninja import NinjaAPI
from flashcards.routers.decks import decks_router
from flashcards.routers.cards import cards_router
from flashcards.routers.folders import folders_router

api = NinjaAPI()

api.add_router("/decks", decks_router)
api.add_router("/cards", cards_router)
api.add_router("/folders", folders_router)