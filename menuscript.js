// Funzione di supporto per distinguere il touch
function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.folder').forEach(folder => {
    const menu = folder.querySelector('.overlay-menu');
    if (!menu) return;

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
