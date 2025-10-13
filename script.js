// Smooth scrolling og menyfunksjonalitet
document.addEventListener('DOMContentLoaded', function() {
    // Hent alle navigasjonslenker
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    // Funksjon for å håndtere navigasjon
    function handleNavigation(link) {
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            // Fjern active klasse fra alle seksjoner og lenker
            sections.forEach(section => section.classList.remove('active'));
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            
            // Legg til active klasse på valgt seksjon og lenke
            targetSection.classList.add('active');
            
            // Finn og aktiver riktig navigasjonslenke
            const correspondingNavLink = document.querySelector(`a[href="#${targetId}"]`);
            if (correspondingNavLink) {
                correspondingNavLink.classList.add('active');
            }
            
            // Smooth scroll til seksjonen
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // Legg til klikk-eventer på alle navigasjonslenker
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            handleNavigation(this);
        });
    });
    
    // Legg til klikk-eventer på alle knapper
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            handleNavigation(this);
        });
    });
    
    // Booking system funksjonalitet
    let bookingData = {
        treatment: null,
        date: null,
        time: null,
        staff: null,
        customer: {}
    };

    // Steg 1: Velg behandling
    const treatmentOptions = document.querySelectorAll('.treatment-option');
    treatmentOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Fjern selected fra alle andre
            treatmentOptions.forEach(opt => opt.classList.remove('selected'));
            // Legg til selected på valgt
            this.classList.add('selected');
            
            // Lagre valgt behandling
            bookingData.treatment = this.dataset.treatment;
            
            // Gå til neste steg
            setTimeout(() => {
                showBookingStep(2);
                initializeCalendar();
            }, 500);
        });
    });

    // Steg 2: Kalender funksjonalitet
    let currentDate = new Date();
    
    function initializeCalendar() {
        updateCalendarDisplay();
        generateTimeSlots();
    }

    function updateCalendarDisplay() {
        const dateElement = document.getElementById('current-date');
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        dateElement.textContent = currentDate.toLocaleDateString('no-NO', options);
    }

    function generateTimeSlots() {
        const staffMembers = ['toril', 'nora', 'marie', 'gudrun'];
        const timeSlots = ['09:00', '10:30', '12:00', '13:30', '15:00', '16:30'];
        
        staffMembers.forEach(staff => {
            const container = document.getElementById(`${staff}-slots`);
            container.innerHTML = '';
            
            timeSlots.forEach(time => {
                const slot = document.createElement('div');
                slot.className = 'time-slot';
                slot.textContent = time;
                slot.dataset.time = time;
                slot.dataset.staff = staff;
                
                // Simuler tilgjengelighet (70% sjanse for ledig)
                const isAvailable = Math.random() > 0.3;
                
                if (isAvailable) {
                    slot.classList.add('available');
                    slot.addEventListener('click', selectTimeSlot);
                } else {
                    slot.classList.add('unavailable');
                }
                
                container.appendChild(slot);
            });
        });
    }

    function selectTimeSlot() {
        // Fjern selected fra alle andre
        document.querySelectorAll('.time-slot.selected').forEach(slot => {
            slot.classList.remove('selected');
        });
        
        // Legg til selected på valgt
        this.classList.add('selected');
        
        // Lagre valgt tid og behandler
        bookingData.time = this.dataset.time;
        bookingData.staff = this.dataset.staff;
        bookingData.date = currentDate.toISOString().split('T')[0];
        
        // Aktiver bekreft-knapp
        document.getElementById('confirm-time').disabled = false;
    }

    // Kalender navigasjon
    document.getElementById('prev-day').addEventListener('click', function() {
        currentDate.setDate(currentDate.getDate() - 1);
        updateCalendarDisplay();
        generateTimeSlots();
        document.getElementById('confirm-time').disabled = true;
    });

    document.getElementById('next-day').addEventListener('click', function() {
        currentDate.setDate(currentDate.getDate() + 1);
        updateCalendarDisplay();
        generateTimeSlots();
        document.getElementById('confirm-time').disabled = true;
    });

    // Bekreft time
    document.getElementById('confirm-time').addEventListener('click', function() {
        if (bookingData.time && bookingData.staff) {
            showBookingStep(3);
            updateBookingSummary();
        }
    });

    // Steg 3: Oppdater sammendrag
    function updateBookingSummary() {
        const treatmentNames = {
            'haircut': 'Hårklipp',
            'coloring': 'Hårfarging',
            'styling': 'Styling',
            'treatment': 'Hårbehandling'
        };

        const staffNames = {
            'toril': 'Toril',
            'nora': 'Nora',
            'marie': 'Marie',
            'gudrun': 'Gudrun'
        };

        document.getElementById('summary-treatment').textContent = treatmentNames[bookingData.treatment];
        document.getElementById('summary-date').textContent = currentDate.toLocaleDateString('no-NO');
        document.getElementById('summary-time').textContent = bookingData.time;
        document.getElementById('summary-staff').textContent = staffNames[bookingData.staff];
    }

    // Steg 3: Final booking form
    const finalBookingForm = document.getElementById('final-booking-form');
    if (finalBookingForm) {
        finalBookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Lagre kundeopplysninger
            bookingData.customer = {
                name: document.getElementById('customer-name').value,
                phone: document.getElementById('customer-phone').value,
                email: document.getElementById('customer-email').value,
                notes: document.getElementById('customer-notes').value
            };
            
            // Gå til bekreftelse
            showBookingStep(4);
            updateConfirmationDetails();
        });
    }

    // Steg 4: Oppdater bekreftelse
    function updateConfirmationDetails() {
        const treatmentNames = {
            'haircut': 'Hårklipp',
            'coloring': 'Hårfarging',
            'styling': 'Styling',
            'treatment': 'Hårbehandling'
        };

        const staffNames = {
            'toril': 'Toril',
            'nora': 'Nora',
            'marie': 'Marie',
            'gudrun': 'Gudrun'
        };

        document.getElementById('confirm-treatment').textContent = treatmentNames[bookingData.treatment];
        document.getElementById('confirm-date').textContent = currentDate.toLocaleDateString('no-NO');
        document.getElementById('confirm-time').textContent = bookingData.time;
        document.getElementById('confirm-staff').textContent = staffNames[bookingData.staff];
    }

    // Ny bestilling
    document.getElementById('new-booking').addEventListener('click', function() {
        // Reset booking data
        bookingData = {
            treatment: null,
            date: null,
            time: null,
            staff: null,
            customer: {}
        };
        
        // Reset form
        document.getElementById('final-booking-form').reset();
        
        // Gå tilbake til steg 1
        showBookingStep(1);
        
        // Reset treatment selection
        document.querySelectorAll('.treatment-option').forEach(option => {
            option.classList.remove('selected');
        });
    });

    // Hjelpefunksjon for å vise booking steg
    function showBookingStep(step) {
        document.querySelectorAll('.booking-step').forEach(stepElement => {
            stepElement.classList.remove('active');
        });
        document.getElementById(`booking-step-${step}`).classList.add('active');
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
