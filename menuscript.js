// Funzione di supporto per distinguere il touch
function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.folder').forEach(folder => {
    const menu = folder.querySelector('.overlay-menu');
    if (!menu) return;
    // conserva l'HTML originale per poterlo ripristinare
    menu._originalHTML = menu.innerHTML;

    // Resetta la posizione quando si riapre
    const resetMenuPosition = () => {
      menu.classList.remove('slide-left');
    };

    if (isTouchDevice()) {
      // SOLO su dispositivi touch: attiva con click
      folder.addEventListener('click', (e) => {
        // Se clicco sulla freccia, non fare toggle ma gestisci solo lo slide
        if (e.target.closest('.arrow-button')) return;

        e.stopPropagation();
        resetMenuPosition();
        menu.classList.toggle('show');
        if (menu.classList.contains('show')) {
          buildCarousel(menu, folder);
        }
      });
    } else {
      // Su PC: hover mostra l'overlay, click sulla freccia per lo slide
      folder.addEventListener('mouseenter', () => {
        resetMenuPosition();
        menu.classList.add('show');
      });

      folder.addEventListener('mouseleave', () => {
        // Non chiudere immediatamente, altrimenti non si fa in tempo a cliccare la freccia
        setTimeout(() => {
          if (!menu.classList.contains('slide-left')) {
            menu.classList.remove('show');
          }
        }, 200);
      });
      // also open carousel on click with mouse
      folder.addEventListener('click', (e) => {
        if (e.target.closest('.arrow-button')) return;
        e.stopPropagation();
        resetMenuPosition();
        menu.classList.add('show');
        buildCarousel(menu, folder);
      });
    }
  });

  // Mostra automaticamente l'overlay della cartella centrale su touch
  if (isTouchDevice()) {
    const centralFolder = document.querySelector('.folder.center');
    const menu = centralFolder?.querySelector('.overlay-menu');
    if (menu) {
      menu.classList.add('no-transition', 'show');
      // Rimuove la classe dopo il rendering per non interferire con animazioni future
      setTimeout(() => {
        menu.classList.remove('no-transition');
      }, 50);
    }
  }
});

// Gestione della freccia (funziona sia su mobile che PC)
document.querySelectorAll('.arrow-button').forEach(button => {
  button.addEventListener('click', (e) => {
    e.stopPropagation();
    const overlay = button.closest('.overlay-menu');
    overlay.classList.add('slide-left');

    overlay.addEventListener('transitionend', () => {
      overlay.classList.remove('show', 'slide-left');
    }, { once: true });
  });
});

// Chiude i menu se si clicca/tocca fuori (tranne su touch per il centrale)
document.addEventListener('click', (e) => {
  document.querySelectorAll('.overlay-menu.show').forEach(menu => {
    const parentFolder = menu.closest('.folder');
    const isCentral = parentFolder?.classList.contains('center');
    if (!parentFolder.contains(e.target) && (!isTouchDevice() || !isCentral)) {
      menu.classList.remove('show', 'slide-left');
    }
  });
});

/* Build a simple two-page carousel (4 images per page) inside the overlay `menu`.
   - If the folder has `data-carousel` attribute (comma-separated URLs), use it.
   - Otherwise, pick 8 images from the page starting at this folder's image.
*/
function buildCarousel(menu, folder) {
  if (menu.querySelector('.carousel')) return; // già costruito

  // ottieni sorgenti immagini
  let images = [];
  if (folder.dataset.carousel) {
    images = folder.dataset.carousel.split(',').map(s => s.trim()).filter(Boolean);
  }

  if (images.length < 8) {
    // raccogli tutte le immagini delle cartelle nella pagina
    const allImgs = Array.from(document.querySelectorAll('.folder > img')).map(i => i.src);
    const thisImg = folder.querySelector('img')?.src;
    let start = Math.max(0, allImgs.indexOf(thisImg));
    if (start === -1) start = 0;
    for (let i = 0; images.length < 8 && allImgs.length > 0 && i < 8; i++) {
      images.push(allImgs[(start + i) % allImgs.length]);
    }
  }

  // assicurati di avere almeno 8 immagini (duplica se necessario)
  while (images.length < 8) images.push(images[images.length % images.length || 0]);

  // costruisci il DOM del carosello
  const carousel = document.createElement('div');
  carousel.className = 'carousel';

  const track = document.createElement('div');
  track.className = 'carousel-track';

  for (let p = 0; p < 2; p++) {
    const page = document.createElement('div');
    page.className = 'carousel-page';
    for (let i = 0; i < 4; i++) {
      const img = document.createElement('img');
      img.src = images[p * 4 + i] || images[(p * 4 + i) % images.length];
      img.alt = '';
      page.appendChild(img);
    }
    track.appendChild(page);
  }

  carousel.appendChild(track);

  // navigation
  const left = document.createElement('button');
  left.className = 'carousel-nav left';
  left.innerHTML = '&#9664;';
  const right = document.createElement('button');
  right.className = 'carousel-nav right';
  right.innerHTML = '&#9654;';
  carousel.appendChild(left);
  carousel.appendChild(right);

  // dots
  const dots = document.createElement('div');
  dots.className = 'carousel-dots';
  const dot0 = document.createElement('button');
  const dot1 = document.createElement('button');
  dot0.className = 'active';
  dots.appendChild(dot0);
  dots.appendChild(dot1);
  carousel.appendChild(dots);

  // stato
  let pageIndex = 0;
  const update = () => {
    track.style.transform = `translateX(${pageIndex * -50}%)`;
    dot0.classList.toggle('active', pageIndex === 0);
    dot1.classList.toggle('active', pageIndex === 1);
  };

  left.addEventListener('click', (e) => { e.stopPropagation(); pageIndex = Math.max(0, pageIndex - 1); update(); });
  right.addEventListener('click', (e) => { e.stopPropagation(); pageIndex = Math.min(1, pageIndex + 1); update(); });
  dot0.addEventListener('click', (e) => { e.stopPropagation(); pageIndex = 0; update(); });
  dot1.addEventListener('click', (e) => { e.stopPropagation(); pageIndex = 1; update(); });

  // swipe support
  let startX = 0;
  track.addEventListener('touchstart', (ev) => { startX = ev.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', (ev) => {
    const dx = ev.changedTouches[0].clientX - startX;
    if (dx > 50) { pageIndex = Math.max(0, pageIndex - 1); update(); }
    else if (dx < -50) { pageIndex = Math.min(1, pageIndex + 1); update(); }
  });

  // sostituisci il contenuto del menu
  menu.innerHTML = '';
  menu.appendChild(carousel);
  // rendi i controlli più accessibili
  left.setAttribute('aria-label', 'Previous page');
  right.setAttribute('aria-label', 'Next page');
  left.tabIndex = 0;
  right.tabIndex = 0;
  dot0.tabIndex = 0;
  dot1.tabIndex = 0;

  // keyboard support: left/right arrows to navigate, Escape to close
  const keyHandler = (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); pageIndex = Math.max(0, pageIndex - 1); update(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); pageIndex = Math.min(1, pageIndex + 1); update(); }
    else if (e.key === 'Escape') { menu.classList.remove('show'); }
  };

  // Make menu focusable and focus it so keyboard works
  menu.tabIndex = -1;
  menu.addEventListener('keydown', keyHandler);
  // focus first control for immediate keyboard interaction
  left.focus();

  // osserva la rimozione della classe 'show' per ripristinare il contenuto originale e pulire listener
  const mo = new MutationObserver((records) => {
    for (const r of records) {
      if (r.attributeName === 'class') {
        if (!menu.classList.contains('show')) {
          // pulisci listener e ripristina
          try { menu.removeEventListener('keydown', keyHandler); } catch (err) {}
          menu.tabIndex = null;
          menu.innerHTML = menu._originalHTML || '';
          mo.disconnect();
        }
      }
    }
  });
  mo.observe(menu, { attributes: true });
}
