
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
        document.getElementById('email').nextElementSibling.textContent = 'El formato del correo electrónico es inválido.';
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
            document.getElementById('passwordError').textContent = 'La contraseña debe contener al menos una letra mayúscula.';
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
            document.getElementById('dobError').textContent = 'Debes tener al menos 13 años para registrarte.';
            isValid = false;
        }
    }

    if (isValid) {
        alert('¡Registro exitoso! ¡Bienvenido a TradePix!');
        form.reset();
    } else {
        form.classList.add('was-validated');
    }
});

});
}


$(document).ready(function() {
    function getCart() {
        return JSON.parse(localStorage.getItem('cart')) || {};
    }
    function saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    $('.add-to-cart-btn').on('click', function() {
        console.log("¡Botón clickeado!");
        let cart = getCart();
        const id = $(this).data('id');
        const name = $(this).data('name');
        const price = $(this).data('price');
        if (cart[id]) {
            cart[id].quantity++;
        } else {
            cart[id] = { name: name, price: price, quantity: 1 };
        }
        saveCart(cart);
        alert(`${name} ha sido añadido al carrito.`);
    });

    $('#clear-cart-btn').on('click', function() {
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
});