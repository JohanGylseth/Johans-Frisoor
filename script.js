// Smooth scrolling og menyfunksjonalitet
document.addEventListener('DOMContentLoaded', function() {
    // Hent alle navigasjonslenker
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    // Legg til klikk-eventer på alle navigasjonslenker
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Hent target seksjon ID
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Fjern active klasse fra alle seksjoner og lenker
                sections.forEach(section => section.classList.remove('active'));
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                
                // Legg til active klasse på valgt seksjon og lenke
                targetSection.classList.add('active');
                this.classList.add('active');
                
                // Smooth scroll til seksjonen
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Booking form funksjonalitet
    const bookingForm = document.querySelector('.booking-form form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Hent form data
            const formData = new FormData(this);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Simuler sending av bestilling
            alert('Takk for din bestilling! Vi kontakter deg snart for å bekrefte timen.');
            
            // Reset form
            this.reset();
        });
    }
    
    // Legg til hover-effekter på treatment cards
    const treatmentCards = document.querySelectorAll('.treatment-card');
    treatmentCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Legg til hover-effekter på gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.05)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Legg til animasjoner når elementer kommer inn i viewport
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
    
    // Observer alle cards og items
    const animatedElements = document.querySelectorAll('.treatment-card, .gallery-item, .booking-info, .booking-form, .about-text, .contact-info, .map-placeholder');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Legg til keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Reset til hjem-seksjon hvis escape trykkes
            sections.forEach(section => section.classList.remove('active'));
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            
            document.getElementById('home').classList.add('active');
            document.querySelector('a[href="#home"]').classList.add('active');
        }
    });
    
    // Legg til touch/swipe support for mobile
    let startX = 0;
    let startY = 0;
    
    document.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', function(e) {
        if (!startX || !startY) {
            return;
        }
        
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        // Sjekk om det er en horizontal swipe
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            const currentActiveSection = document.querySelector('.section.active');
            const currentIndex = Array.from(sections).indexOf(currentActiveSection);
            
            if (diffX > 0 && currentIndex < sections.length - 1) {
                // Swipe left - neste seksjon
                const nextSection = sections[currentIndex + 1];
                const nextLink = document.querySelector(`a[href="#${nextSection.id}"]`);
                
                sections.forEach(section => section.classList.remove('active'));
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                
                nextSection.classList.add('active');
                nextLink.classList.add('active');
            } else if (diffX < 0 && currentIndex > 0) {
                // Swipe right - forrige seksjon
                const prevSection = sections[currentIndex - 1];
                const prevLink = document.querySelector(`a[href="#${prevSection.id}"]`);
                
                sections.forEach(section => section.classList.remove('active'));
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                
                prevSection.classList.add('active');
                prevLink.classList.add('active');
            }
        }
        
        startX = 0;
        startY = 0;
    });
    
    // Legg til loading animasjon
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });
});
