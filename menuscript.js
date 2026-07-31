window.initGalleryInteractions = function(container) {
    // Cerchiamo gli elementi all'interno del contenitore appena creato
    const parentContainer = container || document;
    
    parentContainer.querySelectorAll('.folder-visual').forEach(visualContainer => {
        const coverImage = visualContainer.querySelector('img.cover-image');

        if (coverImage && !coverImage.dataset.bound) {
            coverImage.dataset.bound = 'true';
            coverImage.addEventListener('click', (e) => {
                e.stopPropagation(); 
               
                // Chiude altre gallerie aperte
                document.querySelectorAll('.folder-visual.active').forEach(active => {
                    active.classList.remove('active');
                });
               
                visualContainer.classList.add('active');
            });
        }
    });
};
// 2. EVENTI GLOBALI E CUSTOM VIDEO PLAYER
document.addEventListener('DOMContentLoaded', () => {
    
    // Chiusura globale (click ovunque fuori per chiudere la galleria)
    document.addEventListener('click', () => {
        document.querySelectorAll('.folder-visual.active').forEach(activeContainer => {
            activeContainer.classList.remove('active');
            activeContainer.querySelectorAll('.video-wrapper').forEach(vw => {
                vw.classList.remove('is-interactable');
            });
        });
    });

    // ---- CUSTOM VIDEO PLAYER ----
    const video = document.getElementById("showreel");
    const playBtn = document.getElementById("playBtn");
    const playIcon = document.getElementById("playIcon");
    const pauseIcon = document.getElementById("pauseIcon");

    const muteBtn = document.getElementById("muteBtn");
    const volumeIcon = document.getElementById("volumeIcon");
    const mutedIcon = document.getElementById("mutedIcon");

    if (video) {
        let controlsTimeout;

        // Function to hide controls (specifically for phones/touch devices)
        const hideControls = () => {
            if (!video.paused && playBtn) {
                playBtn.style.opacity = '0';
                playBtn.style.pointerEvents = 'none'; // Prevents the invisible button from blocking video taps
            }
        };

        // Function to show controls and restart the timer
        const showControls = () => {
            if (playBtn) {
                playBtn.style.opacity = '1';
                playBtn.style.pointerEvents = 'auto';
                playBtn.style.transition = 'opacity 0.3s ease'; // Smooth fade effect
            }
            
            clearTimeout(controlsTimeout);
            
            // If the video is playing, hide the buttons after 2 seconds of inactivity
            if (!video.paused) {
                controlsTimeout = setTimeout(hideControls, 2000);
            }
        };

        const togglePlayback = () => {
            if (video.paused) {
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        playBtn.classList.add("is-playing");
                        playIcon.classList.add("hidden");
                        pauseIcon.classList.remove("hidden");
                        showControls(); // Trigger the auto-hide timer when playing starts
                    }).catch(error => {
                        console.warn("Browser blocked video playback:", error);
                    });
                }
            } else {
                video.pause();
                playBtn.classList.remove("is-playing");
                playIcon.classList.remove("hidden");
                pauseIcon.classList.add("hidden");
                showControls(); // Keep controls visible permanently while paused
            }
        };

        // Wake up controls if the user touches the video or moves the mouse
        video.addEventListener("mousemove", showControls);
        video.addEventListener("touchstart", showControls, { passive: true });

        // Play / Pause cliccando direttamente sul video
        video.addEventListener("click", (e) => {
            e.stopPropagation();
            togglePlayback();
        });

        // Play / Pause cliccando sull'icona centrale
        if (playBtn) {
            playBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                togglePlayback();
            });

            video.addEventListener("ended", () => {
                playBtn.classList.remove("is-playing");
                playIcon.classList.remove("hidden");
                pauseIcon.classList.add("hidden");
                showControls(); // Keep controls visible when ended
            });
        }

        // Mute toggle
        if (muteBtn) {
            const updateMuteUI = () => {
                if (video.muted) {
                    volumeIcon.classList.add("hidden");
                    mutedIcon.classList.remove("hidden");
                } else {
                    volumeIcon.classList.remove("hidden");
                    mutedIcon.classList.add("hidden");
                }
            };

            updateMuteUI();

            muteBtn.addEventListener("click", (e) => {
                e.stopPropagation(); 
                video.muted = !video.muted;
                updateMuteUI();
                showControls(); // Wake up controls if user interacts with mute
            });
        }
    }
});