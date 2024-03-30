from django.contrib import admin
from flashcards.models import Deck, Card, Folder, SharedDeck

class CardAdmin(admin.ModelAdmin):
    list_display = ('card_id', 'deck', 'question', 'answer', 'bucket', 'last_reviewed', 'next_review', 'created_at', 'last_edited')

class DeckAdmin(admin.ModelAdmin):
    list_display = ('deck_id', 'folder', 'owner', 'name', 'description', 'statistics', 'created_at', 'last_edited')

class FolderAdmin(admin.ModelAdmin):
    list_display = ('folder_id', 'name', 'owner', 'created_at', 'last_edited')

class SharedDeckAdmin(admin.ModelAdmin):
    list_display = ('share_id', 'deck', 'shared_with')

admin.site.register(Card, CardAdmin)
admin.site.register(Deck, DeckAdmin)
admin.site.register(Folder, FolderAdmin)
admin.site.register(SharedDeck)
