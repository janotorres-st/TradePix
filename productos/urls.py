from django.urls import path
from . import views

urlpatterns = [
    # Rutas de navegación
    path('', views.index, name='index'),
    path('categoria/<str:categoria_nombre>/', views.categoria, name='categoria'),
    path('producto/<int:producto_id>/', views.producto_detalle, name='producto_detalle'),
    path('mantenedor/', views.mantenedor, name='mantenedor'),

    # Rutas del carrito
    path('agregar/<int:producto_id>/', views.agregar_al_carrito, name='agregar_al_carrito'),
    path('carrito/', views.carrito_view, name='carrito'),
    path('actualizar_carrito/<int:producto_id>/', views.actualizar_carrito, name='actualizar_carrito'),

    # Rutas de compra
    path('checkout/', views.checkout, name='checkout'),
    path('finalizar_compra/', views.finalizar_compra, name='finalizar_compra'),
    path('orden_confirmada/', views.orden_confirmada, name='orden_confirmada'),

    # Gestión usuarios
    path('gestion_usuarios/', views.gestion_usuarios, name='gestion_usuarios'), 
    path('gestion_usuarios/eliminar/<int:user_id>/', views.eliminar_usuario, name='eliminar_usuario'),
    path('gestion_usuarios/editar/<int:user_id>/', views.editar_usuario, name='editar_usuario'),
    path('gestion_usuarios/agregar/', views.agregar_usuario, name='agregar_usuario'),

    # Ruta API's externas
    path('indicadores_externos/', views.indicadores_externos, name='indicadores_externos'),
]