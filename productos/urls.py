from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('producto/<int:producto_id>/', views.producto_detalle, name='producto_detalle'),
    path('carrito/', views.carrito_view, name='carrito'),
    path('actualizar_carrito/<int:producto_id>/', views.actualizar_carrito, name='actualizar_carrito'),
    path('checkout/', views.checkout, name='checkout'),
    path('finalizar_compra/', views.finalizar_compra, name='finalizar_compra'),
    path('orden_confirmada/', views.orden_confirmada, name='orden_confirmada'),
    path('gestion_usuarios/', views.gestion_usuarios, name='gestion_usuarios'),
    path('eliminar_usuario/<int:user_id>/', views.eliminar_usuario, name='eliminar_usuario'), # <-- Agrega esta línea
    path('agregar_usuario/', views.agregar_usuario, name='agregar_usuario'),
    path('editar_usuario/<int:user_id>/', views.editar_usuario, name='editar_usuario'), # <-- Agrega esta línea
    path('<str:categoria_nombre>/', views.categoria, name='categoria'),
]