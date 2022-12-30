from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.conf.urls import url

from users.views import FacebookLogin, GoogleLogin
router = DefaultRouter()

urlpatterns = [
    path('', include(router.urls)),
    path('rest-auth/facebook/', FacebookLogin.as_view(), name='fb_login'),
    path('rest-auth/google/', GoogleLogin.as_view(), name='google_login'),
    url(r'^rest-auth/', include('rest_auth.urls'), name='rest_auth_urls'),
    url(r'^accounts/', include('allauth.urls'), name='socialaccount_signup'),

]
