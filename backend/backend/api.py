from ninja import NinjaAPI
from flashcards.routers.decks import decks_router
from flashcards.routers.cards import cards_router
from flashcards.routers.folders import folders_router
from flashcards.routers.sidebars import sidebar_router
from flashcards.routers.reviews import review_router
from flashcards.routers.login import login_router
from flashcards.routers.signup import signup_router

api = NinjaAPI()

api.add_router("/folders", folders_router)
api.add_router("/decks", decks_router)
api.add_router("/cards", cards_router)
api.add_router("/sidebar", sidebar_router)
api.add_router("/reviews", review_router)
api.add_router("/login", login_router)
api.add_router("/signup", signup_router)