from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductoViewSet, CategoriaViewSet

router = DefaultRouter()
router.register(r'productos', ProductoViewSet) # hacia /api/productos/
router.register(r'categorias', CategoriaViewSet) # hacia /api/categorias/

urlpatterns = [
    path('', include(router.urls)),
]