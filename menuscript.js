document.querySelectorAll('.folder-visual').forEach(visualContainer => {
    const coverImage = visualContainer.querySelector('.cover-image');
    const closeBtn = visualContainer.querySelector('.close-carousel');

    // 1. APERTURA: Se clicco sulla copertina
    if (coverImage) {
        coverImage.addEventListener('click', (e) => {
            // Blocchiamo la propagazione (altrimenti il document listener chiuderebbe SUBITO quello che stiamo aprendo)
            e.stopPropagation(); 
            
            // Prima di aprirmi, cerco se c'è qualcun altro aperto e lo chiudo
            document.querySelectorAll('.folder-visual.active').forEach(activeContainer => {
                activeContainer.classList.remove('active');
            });

            // Ora apro quello corrente
            visualContainer.classList.add('active');
        });
    }

    // 2. CHIUSURA (X)
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation(); 
            visualContainer.classList.remove('active');
        });
    }
});

// CHIUSURA (CLICK OUTSIDE): Gestione click fuori dal carosello
document.addEventListener('click', (e) => {
    // Cerchiamo tutti i container attualmente aperti
    document.querySelectorAll('.folder-visual.active').forEach(activeContainer => {
        // Se l'elemento cliccato (e.target) NON è dentro il container attivo
        if (!activeContainer.contains(e.target)) {
            activeContainer.classList.remove('active');
        }
    });
});

// GESTIONE NAVIGAZIONE CAROSELLO (Dinamico + Swipe Touch)
document.querySelectorAll('.carousel').forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    // Prendo sia .dot che i bottoni in .carousel-dots per sicurezza, a seconda di come li hai nel HTML
    const dots = carousel.querySelectorAll('.dot, .carousel-dots button'); 
    const btnLeft = carousel.querySelector('.carousel-nav.left');
    const btnRight = carousel.querySelector('.carousel-nav.right');
    
    if (!track) return;

    // Contiamo quante pagine ci sono realmente nel HTML
    const pages = track.querySelectorAll('.carousel-page');
    const maxPage = pages.length - 1; // Se ho 3 pagine, l'indice massimo è 2 (0, 1, 2)
    let currentPage = 0;

    function updateCarousel() {
        // Spostamento visuale
        track.style.transform = `translateX(-${currentPage * 100}%)`;
      
        // Aggiorna i pallini attivi (se presenti)
        dots.forEach((dot, index) => {
            if(dot) dot.classList.toggle('active', index === currentPage);
        });
      
        // GESTIONE FRECCE: Scompaiono del tutto ai limiti (display none)
        if(btnLeft) btnLeft.style.display = currentPage === 0 ? 'none' : 'flex';
        if(btnRight) btnRight.style.display = currentPage === maxPage ? 'none' : 'flex';
    }

    // Inizializza stato frecce e pallini all'apertura
    updateCarousel();

    // --- EVENTI CLICK FRECCE ---
    if (btnRight) {
        btnRight.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentPage < maxPage) {
                currentPage++;
                updateCarousel();
            }
        });
    }

    if (btnLeft) {
        btnLeft.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentPage > 0) {
                currentPage--;
                updateCarousel();
            }
        });
    }

    // --- EVENTI CLICK PALLINI ---
    dots.forEach((dot, index) => {
        dot.addEventListener('click', (e) => {
            e.stopPropagation();
            currentPage = index;
            updateCarousel();
        });
    });

    // --- SUPPORTO TOUCH / SWIPE SU MOBILE ---
    let startX = 0;
    let endX = 0;

    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        let diffX = startX - endX;

        // Se lo swipe è più lungo di 50 pixel (evita micro-tocchi accidentali)
        if (Math.abs(diffX) > 50) {
            if (diffX > 0 && currentPage < maxPage) {
                // Swipe a sinistra -> Prossima pagina
                currentPage++;
                updateCarousel();
            } else if (diffX < 0 && currentPage > 0) {
                // Swipe a destra -> Pagina precedente
                currentPage--;
                updateCarousel();
            }
        }
    });
});