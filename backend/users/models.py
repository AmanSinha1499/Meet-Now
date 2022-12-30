from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):

    email = models.EmailField(
        _('email address'),
        unique=True,
    )

    display_picture = models.ImageField(
        upload_to='display_pictures',
        max_length=255,
        blank=True,
        null=True,
    )

    def __str__(self):
        email = self.email
        # name = self.name
        return f"{email} "
