from django.urls import path
from .views import chat_api, delete_chat

urlpatterns = [
    path("chat", chat_api),
    path("chat/delete", delete_chat),
]