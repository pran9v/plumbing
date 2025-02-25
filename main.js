// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            
            // Animate hamburger to X
            const spans = this.querySelectorAll('span');
            spans.forEach(span => span.classList.toggle('active'));
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add scroll event listener for header
    const header = document.querySelector('.main-header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            return;
        }

        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            // Scroll Down
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            // Scroll Up
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });

    // Checkout functionality
    if (window.location.pathname.includes('checkout.html')) {
        // Load selected services from localStorage
        const selectedServices = JSON.parse(localStorage.getItem('selectedServices')) || [];
        const selectedServicesContainer = document.getElementById('selected-services');
        const totalPriceElement = document.getElementById('total-price');
        let totalPrice = 0;

        selectedServices.forEach(service => {
            const serviceElement = document.createElement('div');
            serviceElement.className = 'service-item';
            serviceElement.innerHTML = `
                <span>${service.name}</span>
                <span>$${service.price}</span>
            `;
            selectedServicesContainer.appendChild(serviceElement);
            totalPrice += service.price;
        });

        totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
    }

    // Thank you page functionality
    if (window.location.pathname.includes('thankyou.html')) {
        const orderDetails = JSON.parse(localStorage.getItem('orderDetails'));
        if (orderDetails) {
            document.getElementById('orderId').textContent = orderDetails.orderId;
            const orderDetailsContainer = document.getElementById('orderDetails');
            
            orderDetailsContainer.innerHTML = `
                <p><strong>Name:</strong> ${orderDetails.name}</p>
                <p><strong>Email:</strong> ${orderDetails.email}</p>
                <p><strong>Phone:</strong> ${orderDetails.phone}</p>
                <p><strong>Address:</strong> ${orderDetails.address}</p>
                <p><strong>Service Date:</strong> ${orderDetails.date}</p>
                <p><strong>Preferred Time:</strong> ${orderDetails.time}</p>
                <p><strong>Payment Method:</strong> Cash on Delivery</p>
            `;
        }
    }
});

// Handle checkout form submission
function handleCheckout(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const orderDetails = {
        orderId: generateOrderId(),
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        date: formData.get('date'),
        time: formData.get('time'),
        cod: formData.get('cod') === 'on'
    };

    // Store order details in localStorage
    localStorage.setItem('orderDetails', JSON.stringify(orderDetails));

    // Redirect to thank you page
    window.location.href = 'thankyou.html';
}

// Generate a random order ID
function generateOrderId() {
    return 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Add service to cart
function addToCart(serviceName, price) {
    const selectedServices = JSON.parse(localStorage.getItem('selectedServices')) || [];
    selectedServices.push({ name: serviceName, price: parseFloat(price) });
    localStorage.setItem('selectedServices', JSON.stringify(selectedServices));
    window.location.href = 'checkout.html';
}