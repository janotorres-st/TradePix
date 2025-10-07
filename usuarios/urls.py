# usuarios/urls.py

from django.urls import path
from django.contrib.auth import views as auth_views 
from . import views 

urlpatterns = [
    # Login
    path('login/', auth_views.LoginView.as_view(template_name='usuarios/login.html'), name='login'), 
    
    # Logout
    path('logout/', auth_views.LogoutView.as_view(next_page='/'), name='logout'),
    
    # Registro
    path('register/', views.register, name='register'), 

]