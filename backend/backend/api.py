# from ninja import NinjaAPI
from ninja_extra import NinjaExtraAPI
from ninja_jwt.controller import NinjaJWTDefaultController
from flashcards.routers.decks import decks_router
from flashcards.routers.cards import cards_router
from flashcards.routers.folders import folders_router
from flashcards.routers.sidebars import sidebar_router
from flashcards.routers.reviews import review_router
from flashcards.routers.login import login_router
from flashcards.routers.users import users_router


api = NinjaExtraAPI()

# This controller comes with three routes: obtain_token, refresh_token and verify_token
api.register_controllers(NinjaJWTDefaultController)

api.add_router("/users", users_router)
api.add_router("/folders", folders_router)
api.add_router("/decks", decks_router)
api.add_router("/cards", cards_router)
api.add_router("/sidebar", sidebar_router)
api.add_router("/reviews", review_router)
api.add_router("/login", login_router)