// Funzione di supporto per distinguere il touch
  function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  document.querySelectorAll('.folder').forEach(folder => {
    const menu = folder.querySelector('.overlay-menu');
    if (!menu) return;

    if (isTouchDevice()) {
      // SOLO su dispositivi touch: attiva con click
      folder.addEventListener('click', (e) => {
        e.stopPropagation(); // evita propagazione
        menu.classList.toggle('show');
      });
    } else {
      // Hover su desktop
      folder.addEventListener('mouseenter', () => {
        menu.classList.add('show');
      });

      folder.addEventListener('mouseleave', () => {
        menu.classList.remove('show');
      });
    }
  });

  // Chiude i menu se si clicca/tocca fuori
  document.addEventListener('click', (e) => {
    document.querySelectorAll('.overlay-menu.show').forEach(menu => {
      if (!menu.parentElement.contains(e.target)) {
        menu.classList.remove('show');
      }
    });
  });