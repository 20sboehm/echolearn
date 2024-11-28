# from ninja import NinjaAPI
from ninja_extra import NinjaExtraAPI
from ninja_jwt.controller import NinjaJWTDefaultController
from flashcards.routers.decks import decks_router
from flashcards.routers.cards import cards_router
from flashcards.routers.folders import folders_router
from flashcards.routers.sidebars import sidebar_router
from flashcards.routers.reviews import review_router
from flashcards.routers.signup import signup_router
from flashcards.routers.users import users_router
from flashcards.routers.profile import profile_router
from flashcards.routers.friends import friends_router
from flashcards.routers.images import images_router
from flashcards.routers.quiz import quiz_router
from flashcards.routers.gptgeneration import gpt_router
from flashcards.routers.shared import shared_router
from flashcards.routers.study import study_router
from flashcards.routers.emails import emails_router

api = NinjaExtraAPI()

# This controller comes with three routes: obtain_token, refresh_token and verify_token
api.register_controllers(NinjaJWTDefaultController)

api.add_router("/users", users_router)
api.add_router("/folders", folders_router)
api.add_router("/decks", decks_router)
api.add_router("/cards", cards_router)
api.add_router("/sidebar", sidebar_router)
api.add_router("/reviews", review_router)
api.add_router("/signup", signup_router)
api.add_router("/profile", profile_router)
api.add_router("/friends", friends_router)
api.add_router("/images", images_router)
api.add_router("/gptgeneration",gpt_router)
api.add_router("/quiz", quiz_router)
api.add_router("/shared", shared_router)
api.add_router("/study", study_router)
api.add_router("/emails", emails_router)
