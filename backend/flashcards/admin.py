from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from flashcards.models import Deck, Card, Folder, SharedDeck, CustomUser, Image
from flashcards.forms import CustomUserCreationForm, CustomUserChangeForm

class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    list_display = ["email", "username", "age", "country"]

class SharedDeckAdmin(admin.ModelAdmin):
    list_display = ('share_id', 'deck', 'shared_with')

class CardAdmin(admin.ModelAdmin):
    list_display = ('card_id', 'deck', 'question', 'answer', 'bucket', 'last_reviewed', 'next_review', 'created_at', 'last_edited')

class DeckAdmin(admin.ModelAdmin):
    list_display = ('deck_id', 'folder', 'owner', 'name', 'description', 'statistics', 'created_at', 'last_edited', 'order_List')

class FolderAdmin(admin.ModelAdmin):
    list_display = ('folder_id', 'name', 'owner', 'created_at', 'last_edited')

class ImageAdmin(admin.ModelAdmin):
    list_display = ('image_id', 'owner', 'link', 'description')

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(SharedDeck)
admin.site.register(Card, CardAdmin)
admin.site.register(Deck, DeckAdmin)
admin.site.register(Folder, FolderAdmin)
admin.site.register(Image, ImageAdmin)