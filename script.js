// Navigasjon mellom seksjoner
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    // Håndter navigasjon
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Fjern active klasse fra alle lenker og seksjoner
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Legg til active klasse på klikket lenke
            this.classList.add('active');
            
            // Vis riktig seksjon
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
    
    // Håndter bestillingsskjema
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Hent form data
            const formData = new FormData(this);
            const orderData = {
                kebabType: document.getElementById('kebab-type').value,
                size: document.getElementById('size').value,
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                extras: []
            };
            
            // Hent tillegg
            const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
            checkboxes.forEach(checkbox => {
                orderData.extras.push(checkbox.value);
            });
            
            // Beregn totalpris
            let totalPrice = 0;
            const basePrices = {
                'kebabrull': 89,
                'kebabtallrik': 95,
                'kebabwrap': 79
            };
            
            totalPrice = basePrices[orderData.kebabType] || 0;
            
            if (orderData.size === 'stor') {
                totalPrice += 15;
            }
            
            if (orderData.extras.includes('ost')) {
                totalPrice += 10;
            }
            if (orderData.extras.includes('dressing')) {
                totalPrice += 5;
            }
            
            // Simuler betaling
            if (confirm(`Din bestilling:\n${orderData.kebabType} (${orderData.size})\nTillegg: ${orderData.extras.join(', ') || 'Ingen'}\nTotal: ${totalPrice}kr\n\nVil du fortsette med betaling?`)) {
                // Her ville du integrere med en ekte betalingsløsning
                alert('Takk for bestillingen! Din kebab vil bli levert til ' + orderData.address + ' innen 30-45 minutter.');
                
                // Reset form
                this.reset();
                
                // Gå tilbake til hjem
                navLinks.forEach(l => l.classList.remove('active'));
                sections.forEach(s => s.classList.remove('active'));
                document.querySelector('.nav-link[href="#home"]').classList.add('active');
                document.getElementById('home').classList.add('active');
            }
        });
    }
    
    // Smooth scrolling for CTA knapp
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Fjern active klasse fra alle lenker og seksjoner
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Legg til active klasse på bestill lenke og seksjon
            document.querySelector('.nav-link[href="#bestill"]').classList.add('active');
            document.getElementById('bestill').classList.add('active');
        });
    }
    
    // Animer meny elementer når de kommer inn i viewport
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observer meny elementer
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
    
    // Legg til hover effekter for meny elementer
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Legg til loading animasjon for bestillingsknapp
    const orderButton = document.querySelector('.order-button');
    if (orderButton) {
        orderButton.addEventListener('click', function() {
            const originalText = this.textContent;
            this.textContent = 'Behandler bestilling...';
            this.disabled = true;
            
            // Reset etter 2 sekunder (i tilfelle form ikke submitter)
            setTimeout(() => {
                this.textContent = originalText;
                this.disabled = false;
            }, 2000);
        });
    }
    
    // Legg til form validering i sanntid
    const formInputs = document.querySelectorAll('input[required], select[required]');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim() === '') {
                this.style.borderColor = '#dc2626';
                this.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
            } else {
                this.style.borderColor = '#10b981';
                this.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
            }
        });
        
        input.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                this.style.borderColor = '#10b981';
                this.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
            }
        });
    });
    
    // Legg til keyboard navigasjon
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Gå tilbake til hjem når ESC trykkes
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            document.querySelector('.nav-link[href="#home"]').classList.add('active');
            document.getElementById('home').classList.add('active');
        }
    });
    
    // Legg til touch/swipe støtte for mobile
    let startX = 0;
    let startY = 0;
    
    document.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', function(e) {
        if (!startX || !startY) return;
        
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        // Hvis swipe til venstre og vertikal bevegelse er liten
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) {
                // Swipe til venstre - gå til neste seksjon
                const currentActive = document.querySelector('.section.active');
                const currentIndex = Array.from(sections).indexOf(currentActive);
                const nextIndex = (currentIndex + 1) % sections.length;
                
                navLinks.forEach(l => l.classList.remove('active'));
                sections.forEach(s => s.classList.remove('active'));
                
                navLinks[nextIndex].classList.add('active');
                sections[nextIndex].classList.add('active');
            } else {
                // Swipe til høyre - gå til forrige seksjon
                const currentActive = document.querySelector('.section.active');
                const currentIndex = Array.from(sections).indexOf(currentActive);
                const prevIndex = currentIndex === 0 ? sections.length - 1 : currentIndex - 1;
                
                navLinks.forEach(l => l.classList.remove('active'));
                sections.forEach(s => s.classList.remove('active'));
                
                navLinks[prevIndex].classList.add('active');
                sections[prevIndex].classList.add('active');
            }
        }
        
        startX = 0;
        startY = 0;
    });
});
