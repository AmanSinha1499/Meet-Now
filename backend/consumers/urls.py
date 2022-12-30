from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.conf.urls import url

from consumers.views.chat_room import ChatRoomViewSet 

router = DefaultRouter()
router.register(r'',ChatRoomViewSet)

urlpatterns = [
    path('', include(router.urls))
    # path('create_room/', CreateChatRoom.as_view(), name='create_room'),
]
