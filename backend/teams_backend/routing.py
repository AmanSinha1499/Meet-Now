# from django.conf.urls import url
# from consumers import consumer_socket

# websocket_urlpatterns = [
#     url(r'^ws/room/(?P<room_name>[0-9a-f-]+)/$', consumer_socket.SocketConsumer.as_asgi()),
# ]
# (?P<room_name>[0-9a-f-]+)
# (?P<room_name>[^/]+)

from django.conf.urls import url
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from consumers import consumer_socket

websocket_urlpatterns = [
    url(r'^ws/room/(?P<room_name>[0-9a-f-]+)/$', consumer_socket.SocketConsumer.as_asgi())
]

application = ProtocolTypeRouter({
    # http -> Django views is added by default
    'websocket': AuthMiddlewareStack(
        URLRouter(websocket_urlpatterns)
    ),
})