
const registrationForm = document.getElementById('registrationForm');
if (registrationForm) {
    registrationForm.addEventListener('submit', function(event) {
        event.preventDefault();
        event.stopPropagation();

        let form = this;
        form.classList.remove('was-validated');

document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault();
    event.stopPropagation();
    
    let form = this;
    form.classList.remove('was-validated');

    $('.invalid-feedback').text('');

    const fullName = form.fullName.value.trim();
    const username = form.username.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;
    const dob = form.dob.value;
    
    let isValid = true;
    
    if (!fullName) { document.getElementById('fullName').classList.add('is-invalid'); isValid = false; }
    if (!username) { document.getElementById('username').classList.add('is-invalid'); isValid = false; }
    if (!email) { document.getElementById('email').classList.add('is-invalid'); isValid = false; }
    if (!password) { document.getElementById('password').classList.add('is-invalid'); isValid = false; }
    if (!confirmPassword) { document.getElementById('confirmPassword').classList.add('is-invalid'); isValid = false; }
    if (!dob) { document.getElementById('dob').classList.add('is-invalid'); isValid = false; }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) && email) { 
        document.getElementById('email').classList.add('is-invalid'); 
        document.getElementById('email').nextElementSibling.textContent = 'El correo electrónico es inválido.';
        isValid = false;
    }
    
    if (password !== confirmPassword) { 
        document.getElementById('confirmPassword').classList.add('is-invalid'); 
        document.getElementById('confirmPasswordError').textContent = 'Las contraseñas no coinciden.';
        isValid = false; 
    }
    
    if (password.length > 0) {
        if (password.length < 6 || password.length > 18) {
            document.getElementById('password').classList.add('is-invalid'); 
            document.getElementById('passwordError').textContent = 'La contraseña debe tener entre 6 y 18 caracteres.';
            isValid = false;
        } else if (!/[A-Z]/.test(password)) {
            document.getElementById('password').classList.add('is-invalid');
            document.getElementById('passwordError').textContent = 'La contraseña debe contener al menos una mayúscula.';
            isValid = false;
        } else if (!/[0-9]/.test(password)) {
            document.getElementById('password').classList.add('is-invalid');
            document.getElementById('passwordError').textContent = 'La contraseña debe contener al menos un número.';
            isValid = false;
        }
    }

    if (dob) {
        const birthDate = new Date(dob);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        if (age < 13) {
            document.getElementById('dob').classList.add('is-invalid');
            document.getElementById('dobError').textContent = 'Debes ser mayor de 13 años para registrarte.';
            isValid = false;
        }
    }

    if (isValid) {
        alert('¡Registro exitoso, bienvenido a TradePix, a jugar!');
        form.reset();
    } else {
        form.classList.add('was-validated');
    }
});

});
}


$(document).ready(function() {

    const products = JSON.parse(localStorage.getItem('products')) || [];

    let inventory = {};
    if (products.length > 0) {
        products.forEach(product => {
            inventory[product.id] = product.stock;
        });
    }
    function saveInventory() {
        let updatedProducts = products.map(product => {
            return {
                ...product,
                stock: inventory[product.id] || 0
            };
        });
        localStorage.setItem('products', JSON.stringify(updatedProducts));
    }

    if (!localStorage.getItem('inventory')) {
        saveInventory();
    }

    function getCart() {
        return JSON.parse(localStorage.getItem('cart')) || {};
    }
    function saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    $(document).on('click', '.add-to-cart-btn', function() {
        let cart = getCart();
        const id = $(this).data('id');
        const name = $(this).data('name');
        const price = $(this).data('price');

        const product = products.find(p => p.id === id);
        const image = product ? product.image : 'img/default.jpg';

        if (inventory[id] > 0) {
            if (cart[id]) {
                cart[id].quantity++;
            } else {
                cart[id] = { name: name, price: price, quantity: 1, image: image };
            }
            inventory[id]--;
            saveInventory();
            saveCart(cart);
            alert(`${name} ha sido añadido al carrito. Quedan ${inventory[id]} unidades.`);
        } else {
            alert(`Lo sentimos, ${name} está agotado.`);
        }
    });

    $('#clear-cart-btn').on('click', function() {
        localStorage.removeItem('cart');
        renderCart();
    });

    $('#checkout-btn').on('click', function() {
        const cart = getCart();
        if (Object.keys(cart).length === 0) {
            alert('Tu carrito está vacío. No puedes proceder al pago.');
            return;
        }
        alert('¡Pago exitoso! Gracias por tu compra.');     
        localStorage.removeItem('cart');
        renderCart();
    });
    
    if (window.location.pathname.includes('carrito.html')) {
        renderCart();
    }

    function renderCart() {
        const cart = getCart();
        const cartItemsContainer = $('#cart-items');
        let subtotal = 0;
        cartItemsContainer.empty();
        
        if (Object.keys(cart).length === 0) {
            cartItemsContainer.html('<p class="text-center">Tu carrito está vacío.</p>');
            $('#cart-summary').addClass('d-none');
            return;
        }

        $.each(cart, function(id, item) {
            const itemPrice = item.price * item.quantity;
            subtotal += itemPrice;
            
            const itemHtml = `
                <div class="col-12 mb-3">
                    <div class="card bg-secondary text-white border-0">
                        <div class="row g-0 align-items-center">
                            <div class="col-md-4 col-sm-12 text-center">
                                <img src="${item.image}" class="img-fluid rounded-start" alt="Imagen de ${item.name}" style="max-width: 100px;">
                            </div>
                            <div class="col-md-8 col-sm-12">
                                <div class="card-body d-flex justify-content-between align-items-center">
                                    <div>
                                        <h5 class="card-title mb-0">${item.name}</h5>
                                        <p class="mb-0 text-muted">Cantidad: ${item.quantity}</p>
                                    </div>
                                    <div class="text-end">
                                        <p class="mb-0 fs-5 fw-bold text-warning">$${itemPrice.toLocaleString('es-CL')}</p>
                                        <button class="btn btn-danger btn-sm remove-from-cart-btn" data-id="${id}">Eliminar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        cartItemsContainer.append(itemHtml);
    });

        const iva = subtotal * 0.19;
        const total = subtotal + iva;
        
        $('#subtotal').text(`$${subtotal.toLocaleString('es-CL')}`);
        $('#iva').text(`$${iva.toLocaleString('es-CL')}`);
        $('#total').text(`$${total.toLocaleString('es-CL')}`);
        $('#cart-summary').removeClass('d-none');
        $('.remove-from-cart-btn').on('click', function() {
            const id = $(this).data('id');
            delete cart[id];
            saveCart(cart);
            renderCart();
        });
    }

if ($('#productForm').length > 0) {
    const products = JSON.parse(localStorage.getItem('products')) || [];

    function saveProducts() {
        localStorage.setItem('products', JSON.stringify(products));
    }

    function renderProducts() {
        const productsContainer = $('#products-container');
        if (productsContainer.length === 0) return;
        productsContainer.empty();

        if (products.length === 0) {
            productsContainer.html('<p class="text-center">No hay productos disponibles en este momento.</p>');
            return;
        }

        products.forEach(product => {
            const productHtml = `
                <div class="col-sm-12 col-md-6 col-lg-6">
                    <div class="card bg-secondary text-white h-100 border-0">
                        <div class="row g-0">
                            <div class="col-md-4">
                                <img src="${product.image}" class="img-fluid rounded-start" alt="Imagen de ${product.name}">
                            </div>
                            <div class="col-md-8">
                                <div class="card-body">
                                    <h5 class="card-title">${product.name}</h5>
                                    <p class="card-text"><small class="text-warning">Precio: $${product.price.toLocaleString('es-CL')}</small></p>
                                    <p class="card-text"><small class="text-muted">Stock: ${inventory[product.id]}</small></p>
                                    <button class="btn btn-primary add-to-cart-btn" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" ${inventory[product.id] <= 0 ? 'disabled' : ''}>Añadir al Carrito</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            productsContainer.append(productHtml);
        });
    }

    if ($('#products-container').length > 0) {
        renderProducts();
    }

    $('#productForm').on('submit', function(event) {
        event.preventDefault();
        const id = $('#productId').val();
        const name = $('#productName').val();
        const price = parseFloat($('#productPrice').val());
        const stock = parseInt($('#productStock').val());

        const existingProductIndex = products.findIndex(p => p.id === id);

        if (existingProductIndex !== -1) {
            products[existingProductIndex] = { id, name, price, stock };
            alert('Producto modificado exitosamente.');
        } else {
            products.push({ id, name, price, stock });
            alert('Producto añadido exitosamente.');
        }

        saveProducts();
        renderProducts();
        $('#productForm')[0].reset();
    });

    $(document).on('click', '.edit-product-btn', function() {
        const idToEdit = $(this).data('id');
        const productToEdit = products.find(p => p.id === idToEdit);

        if (productToEdit) {
            $('#productId').val(productToEdit.id).prop('readonly', true);
            $('#productName').val(productToEdit.name);
            $('#productPrice').val(productToEdit.price);
            $('#productStock').val(productToEdit.stock);
        }
    });

    $(document).on('click', '.delete-product-btn', function() {
        const idToDelete = $(this).data('id');
        const confirmation = confirm('¿Estás seguro de que deseas eliminar este producto?');

        if (confirmation) {
            const productIndex = products.findIndex(p => p.id === idToDelete);
            if (productIndex !== -1) {
                products.splice(productIndex, 1);
                saveProducts();
                renderProducts();
                alert('Producto eliminado exitosamente.');
            }
        }
    });

    renderProducts();
}
});