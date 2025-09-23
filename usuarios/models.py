from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    fecha_nacimiento = models.DateField(null=True, blank=True)
    
    # Agrega related_name para evitar conflictos con los modelos de Auth de Django
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='customuser_set',
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='customuser_set',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )
