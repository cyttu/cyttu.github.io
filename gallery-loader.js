/**
 * gallery-loader.js
 * Builds all ".gallery > .folder" blocks from colorgallery.json so that
 * adding, removing, or editing a gallery only requires editing the JSON
 * file — no HTML editing needed.
 */

(function () {
  const DATA_URL = "colorgallery.json";
  const container = document.getElementById("gallery-list");

  if (!container) {
    console.error('gallery-loader.js: no element with id="gallery-list" found.');
    return;
  }

  fetch(DATA_URL)
    .then((res) => {
      if (!res.ok) throw new Error(`Failed to load ${DATA_URL}: ${res.status}`);
      return res.json();
    })
    .then((data) => {
      renderGalleries(data.folders || []);
    })
    .catch((err) => {
      console.error(err);
      container.innerHTML =
        '<p style="color:#fff;">Impossibile caricare le gallerie.</p>';
    });

  function renderGalleries(folders) {
    container.innerHTML = "";
    folders.forEach((folder) => {
      container.appendChild(buildFolder(folder));
    });

    // menuscript.js defines this. It wires up the lightbox open/close,
    // carousel arrows/dots/swipe, and video click-to-activate behavior.
    // Must run AFTER the folders above exist in the DOM.
    if (typeof window.initGalleryInteractions === "function") {
      window.initGalleryInteractions(container);
    } else {
      console.error(
        "gallery-loader.js: window.initGalleryInteractions is missing — " +
        "make sure menuscript.js is loaded before gallery-loader.js."
      );
    }

    // FIX: Esegue lo scroll automatico verso il progetto se presente l'hash nell'URL
    handleHashScroll();
  }

  function buildFolder(folder) {
    const gallery = document.createElement("div");
    gallery.className = "gallery";

    const folderEl = document.createElement("div");
    folderEl.className = "folder";

    const folderId = folder.id || slugify(folder.title);
    folderEl.id = folderId;

    folderEl.innerHTML = `
      <div class="overlay-menu">
        <h3>${escapeHtml(folder.title)}</h3>
        <h4>&gt; &gt; &gt;</h4>
      </div>
      <div class="folder-visual">
        <img src="${folder.cover}" alt="Cover" class="cover-image">
        <div class="carousel">
          <div class="carousel-track">
            <div class="carousel-page page-photos">
              ${(folder.photos || [])
                .map((p) => `<img src="${p.src}" alt="${escapeHtml(p.alt || "")}">`)
                .join("\n")}
            </div>
          </div>
        </div>
      </div>
    `;

    gallery.appendChild(folderEl);
    return gallery;
  }


  function handleHashScroll() {
    if (!window.location.hash) return;

    const targetId = window.location.hash.substring(1);

    // Piccolo timeout per garantire che il layout sia stato calcolato dal browser
    setTimeout(() => {
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    }, 250);
  }

  /**
   * Helper per trasformare stringhe in slug validi per gli ID HTML
   * Es: "Color Grading 2024!" -> "color-grading-2024"
   */
  function slugify(str) {
    return String(str)
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
})();