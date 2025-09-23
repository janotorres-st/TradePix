from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required, user_passes_test
from .models import Producto, Categoria, Orden, OrdenItem
from decimal import Decimal
from .forms import CustomUserCreationForm
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import UserChangeForm


@login_required(login_url='login')
def carrito_view(request):
    return render(request, 'carrito.html')

def index(request):
    return render(request, 'index.html')

def categoria(request, categoria_nombre):
    try:
        categoria_obj = Categoria.objects.get(nombre__iexact=categoria_nombre)
    except Categoria.DoesNotExist:
        return render(request, '404.html', {'error_message': 'La categoría no existe.'})
    
    productos = Producto.objects.filter(categoria=categoria_obj)
    
    context = {
        'productos': productos,
        'categoria_nombre': categoria_obj.nombre,
    }
    
    return render(request, 'categoria.html', context)

def producto_detalle(request, producto_id):
    producto = get_object_or_404(Producto, pk=producto_id)
    return render(request, 'producto_detalle.html', {'producto': producto})
    
def mantenedor(request):
    return render(request, 'mantenedor.html')

def agregar_al_carrito(request, producto_id):
    cart = request.session.get('cart', {})
    if str(producto_id) in cart:
        cart[str(producto_id)]['quantity'] += 1
    else:
        cart[str(producto_id)] = {'quantity': 1}
    request.session['cart'] = cart
    return redirect('carrito')

def carrito_view(request):
    cart = request.session.get('cart', {})
    producto_ids = cart.keys()
    productos = Producto.objects.filter(id__in=producto_ids)
    
    carrito_productos = []
    subtotal_bruto = Decimal('0.00')
    
    for producto in productos:
        quantity = cart[str(producto.id)]['quantity']
        item_total_bruto = producto.precio * quantity
        subtotal_bruto += item_total_bruto
        
        item = {
            'producto_obj': producto,
            'quantity': quantity,
            'item_total': item_total_bruto,
        }
        carrito_productos.append(item)
    
    factor_iva = Decimal('1.19')
    total_neto = subtotal_bruto / factor_iva
    total_iva = subtotal_bruto - total_neto
    
    context = {
        'carrito_productos': carrito_productos,
        'subtotal_bruto': subtotal_bruto,
        'total_neto': total_neto,
        'total_iva': total_iva,
    }

    return render(request, 'carrito.html', context)

def actualizar_carrito(request, producto_id):
    if request.method == 'POST':
        action = request.POST.get('action')
        cart = request.session.get('cart', {})
        
        producto_id_str = str(producto_id)
        
        if action == 'add':
            if producto_id_str in cart:
                cart[producto_id_str]['quantity'] += 1
            else:
                cart[producto_id_str] = {'quantity': 1}
        elif action == 'subtract':
            if producto_id_str in cart and cart[producto_id_str]['quantity'] > 1:
                cart[producto_id_str]['quantity'] -= 1
            elif producto_id_str in cart and cart[producto_id_str]['quantity'] == 1:
                del cart[producto_id_str]
        elif action == 'remove':
            if producto_id_str in cart:
                del cart[producto_id_str]
            
        request.session['cart'] = cart
        
    return redirect('carrito')

@login_required
def checkout(request):
    cart = request.session.get('cart', {})
    
    carrito_items = []
    subtotal_bruto = Decimal('0')
    
    if cart:
        producto_ids = cart.keys()
        productos = Producto.objects.filter(id__in=producto_ids)
        
        for producto in productos:
            quantity = cart[str(producto.id)]['quantity']
            item_subtotal = producto.precio * quantity
            subtotal_bruto += item_subtotal
            
            item = {
                'producto_obj': producto,
                'cantidad': quantity,
                'subtotal': item_subtotal,
            }
            carrito_items.append(item)
            
    context = {
        'carrito_items': carrito_items,
        'total_carrito': subtotal_bruto,
    }
    
    return render(request, 'checkout.html', context)

def finalizar_compra(request):
    if request.method == 'POST':
        # Está simulando, que pasa, cuando termina simplemente vacía el carro, no voy a estar agregando pagos reales jajaj.
        if 'cart' in request.session:
            del request.session['cart']
        
        return redirect('orden_confirmada')
    
    return redirect('index')

def orden_confirmada(request):
    return render(request, 'orden_confirmada.html')

def es_staff(user):
    return user.is_staff

@user_passes_test(es_staff)
def gestion_usuarios(request):
    User = get_user_model()
    usuarios = User.objects.all().order_by('username')
    context = {
        'usuarios': usuarios
    }
    return render(request, 'gestion_usuarios.html', context)

@user_passes_test(es_staff)
def eliminar_usuario(request, user_id):
    if request.method == 'POST':
        User = get_user_model()
        usuario_a_eliminar = get_object_or_404(User, id=user_id)
        if usuario_a_eliminar.is_superuser:
            return redirect('gestion_usuarios')
        usuario_a_eliminar.delete()
    return redirect('gestion_usuarios')

@user_passes_test(es_staff)
def editar_usuario(request, user_id):
    User = get_user_model()
    usuario_a_editar = get_object_or_404(User, id=user_id)
    
    if request.method == 'POST':
        form = UserChangeForm(request.POST, instance=usuario_a_editar)
        if form.is_valid():
            form.save()
            return redirect('gestion_usuarios')
    else:
        form = UserChangeForm(instance=usuario_a_editar)
    
    context = {
        'form': form,
        'usuario': usuario_a_editar
    }
    return render(request, 'editar_usuario.html', context)

@user_passes_test(es_staff)
def agregar_usuario(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('gestion_usuarios')
    else:
        form = CustomUserCreationForm()
    
    context = {
        'form': form
    }
    return render(request, 'agregar_usuario.html', context)

@login_required
def finalizar_compra(request):
    if request.method == 'POST':
        if 'carrito' in request.session and request.session['carrito']:
            carrito = request.session['carrito']
            
            # 1. Crea la Orden
            total_orden = sum(item['subtotal'] for item in carrito.values())
            orden = Orden.objects.create(
                user=request.user,
                total=Decimal(str(total_orden))
            )
            
            # 2. Guardar los compras
            for item_id, item_data in carrito.items():
                producto = get_object_or_404(Producto, id=int(item_id))
                OrdenItem.objects.create(
                    orden=orden,
                    producto=producto,
                    cantidad=item_data['cantidad'],
                    subtotal=Decimal(str(item_data['subtotal']))
                )
            
            # 3. Carro limpio
            request.session['carrito'] = {}
            
            return redirect('orden_confirmada')
    return redirect('checkout')