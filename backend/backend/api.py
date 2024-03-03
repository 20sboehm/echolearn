from ninja import NinjaAPI
from flashcards.routers.decks import decks_router
from flashcards.routers.cards import cards_router

api = NinjaAPI()

api.add_router('/decks/', decks_router)
api.add_router('/cards/', cards_router)