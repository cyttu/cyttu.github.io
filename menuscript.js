document.querySelectorAll('.folder-visual').forEach(visualContainer => {
    const coverImage = visualContainer.querySelector('.cover-image');
    const closeBtn = visualContainer.querySelector('.close-carousel');

    // 1. APERTURA
    if (coverImage) {
        coverImage.addEventListener('click', (e) => {
            e.stopPropagation(); 
            document.querySelectorAll('.folder-visual.active').forEach(active => {
                active.classList.remove('active');
            });
            visualContainer.classList.add('active');
        });
    }

    // 2. CHIUSURA (X)
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation(); 
            visualContainer.classList.remove('active');
            // Reset interattività video alla chiusura
            visualContainer.querySelectorAll('.video-wrapper').forEach(vw => vw.classList.remove('is-interactable'));
        });
    }
});

// CHIUSURA (CLICK OUTSIDE)
document.addEventListener('click', (e) => {
    document.querySelectorAll('.folder-visual.active').forEach(activeContainer => {
        if (!activeContainer.contains(e.target)) {
            activeContainer.classList.remove('active');
            activeContainer.querySelectorAll('.video-wrapper').forEach(vw => vw.classList.remove('is-interactable'));
        }
    });
});

// GESTIONE CAROSELLO
document.querySelectorAll('.carousel').forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    const dots = carousel.querySelectorAll('.dot, .carousel-dots button'); 
    const btnLeft = carousel.querySelector('.carousel-nav.left');
    const btnRight = carousel.querySelector('.carousel-nav.right');
    const videoWrappers = carousel.querySelectorAll('.video-wrapper');
    
    if (!track) return;

    const pages = track.querySelectorAll('.carousel-page');
    const maxPage = pages.length - 1; 
    let currentPage = 0;

    function updateCarousel() {
        track.style.transform = `translateX(-${currentPage * 100}%)`;
      
        dots.forEach((dot, index) => {
            if(dot) dot.classList.toggle('active', index === currentPage);
        });
      
        if(btnLeft) btnLeft.style.display = currentPage === 0 ? 'none' : 'flex';
        if(btnRight) btnRight.style.display = currentPage === maxPage ? 'none' : 'flex';

        // OGNI VOLTA CHE CAMBI PAGINA: 
        // Disattiviamo l'interazione dei video per rendere di nuovo possibile lo swipe
        videoWrappers.forEach(vw => vw.classList.remove('is-interactable'));
    }

    // GESTIONE CLICK SUI VIDEO PER ATTIVARLI
    videoWrappers.forEach(wrapper => {
        wrapper.addEventListener('click', (e) => {
            // Al primo click, attiviamo il video e impediamo lo swipe
            if (!wrapper.classList.contains('is-interactable')) {
                e.stopPropagation();
                wrapper.classList.add('is-interactable');
            }
        });
    });

    updateCarousel();

    // NAVIGAZIONE (Frecce e Dots)
    if (btnRight) {
        btnRight.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentPage < maxPage) { currentPage++; updateCarousel(); }
        });
    }

    if (btnLeft) {
        btnLeft.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentPage > 0) { currentPage--; updateCarousel(); }
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', (e) => {
            e.stopPropagation();
            currentPage = index;
            updateCarousel();
        });
    });

    // TOUCH SWIPE
    let startX = 0;
    let endX = 0;

    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        let diffX = startX - endX;

        if (Math.abs(diffX) > 50) {
            if (diffX > 0 && currentPage < maxPage) {
                currentPage++;
                updateCarousel();
            } else if (diffX < 0 && currentPage > 0) {
                currentPage--;
                updateCarousel();
            }
        }
    });
});