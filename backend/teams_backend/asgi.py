"""
ASGI config for teams_backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/asgi/
"""

# import os
# import django
# from django.core.asgi import get_asgi_application

# from channels.auth import AuthMiddlewareStack
# from channels.routing import ProtocolTypeRouter, URLRouter
# from django.core.asgi import get_asgi_application
# import teams_backend.routing

# django.setup()
# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'teams_backend.settings')
# # application = get_asgi_application()

# application = ProtocolTypeRouter({
#   "http": get_asgi_application(),
#   "websocket": AuthMiddlewareStack(
#         URLRouter(
#             teams_backend.routing.websocket_urlpatterns
#         )
#     ),
# })


import os

import django
from channels.routing import get_default_application

# Set the Django environment with the settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', "teams_backend.settings")

# Since this is not the Django-backed WSGI spec, we need to configure Django
django.setup()

# Return the ASGI application
application = get_default_application()