document.querySelectorAll('.folder-visual').forEach(visualContainer => {
    const coverImage = visualContainer.querySelector('.cover-image');
    const closeBtn = visualContainer.querySelector('.close-carousel');

    // 1. APERTURA: Se clicco sulla copertina
    if (coverImage) {
        coverImage.addEventListener('click', (e) => {
            // Blocchiamo la propagazione (altrimenti il document listener chiuderebbe SUBITO quello che stiamo aprendo)
            e.stopPropagation(); 
            
            // NOVITÀ: Prima di aprirmi, cerco se c'è qualcun altro aperto e lo chiudo
            document.querySelectorAll('.folder-visual.active').forEach(activeContainer => {
                // Rimuovo active da tutti gli altri container
                activeContainer.classList.remove('active');
            });

            // Ora apro quello corrente
            visualContainer.classList.add('active');
        });
    }

    // 2. CHIUSURA (X) - Questo rimane uguale
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

// GESTIONE NAVIGAZIONE CAROSELLO (Dinamico)
document.querySelectorAll('.carousel').forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    const dots = carousel.querySelectorAll('.dot');
    const btnLeft = carousel.querySelector('.carousel-nav.left');
    const btnRight = carousel.querySelector('.carousel-nav.right');
    
    if (!track) return;

    // Contiamo quante pagine ci sono realmente nel HTML
    const pages = track.querySelectorAll('.carousel-page');
    const maxPage = pages.length - 1; // Se ho 3 pagine, l'indice massimo è 2 (0, 1, 2)
    let currentPage = 0;

    function updateCarousel() {
      // Ora ci spostiamo del 100% per ogni pagina, non del 50%
      track.style.transform = `translateX(-${currentPage * 100}%)`;
      
      // Aggiorna i pallini (se presenti)
      dots.forEach((dot, index) => {
        if(dot) dot.classList.toggle('active', index === currentPage);
      });
      
      // Opzionale: Nascondi le frecce se sei al limite (UI più pulita)
      if(btnLeft) btnLeft.style.opacity = currentPage === 0 ? '0.3' : '1';
      if(btnRight) btnRight.style.opacity = currentPage === maxPage ? '0.3' : '1';
    }

    // Inizializza stato frecce
    updateCarousel();

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

    dots.forEach((dot, index) => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        currentPage = index;
        updateCarousel();
      });
    });
});