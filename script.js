function moveNoButton() {
    const btn = document.getElementById('noBtn');
    
    // Calculate bounds so it stays within the phone screen
    const maxX = window.innerWidth - btn.offsetWidth - 20;
    const maxY = window.innerHeight - btn.offsetHeight - 20;
    
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);
    
    btn.style.position = 'fixed'; // Changed from absolute to fixed
    btn.style.left = randomX + 'px';
    btn.style.top = randomY + 'px';
}

function expandImage(imgElement, caption) {
    const modal = document.getElementById("photoModal");
    const modalImg = document.getElementById("fullImage");
    const captionText = document.getElementById("captionText");

    modal.style.display = "block";
    modalImg.src = imgElement.src;
    captionText.innerHTML = caption;
}

function closeModal() {
    document.getElementById("photoModal").style.display = "none";
}

// Function to handle page transitions and music
function goToPage(pageNum, audioId) {
    // 1. Remove active class from all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    // 2. Activate the new page
    const activePage = document.getElementById('page' + pageNum);
    if (activePage) activePage.classList.add('active');

    // 3. Scroll Logic: Lock on Page 1, unlock for others
    if (pageNum === 1) {
        document.body.style.overflow = "hidden";
    } else {
        document.body.style.overflow = "auto";
    }

    // 4. Handle Music (This is the fixed part)
    stopAllMusic();
    let audio = document.getElementById(audioId);
    if (audio) {
        // Play returns a promise; we catch the error if the browser blocks it
        audio.play().catch(error => {
            console.log("Audio play blocked by browser. It will start on the next click.");
        });
    }
    
    window.scrollTo(0, 0);
}

function stopAllMusic() {
    document.querySelectorAll('audio').forEach(a => {
        a.pause();
        a.currentTime = 0; // Reset to start
    });
}

// Keep your existing moveNoButton, expandImage, and Heart Trail code below this...

// Detect when the user leaves the tab or minimizes the browser
document.addEventListener("visibilitychange", () => {
    const tracks = document.querySelectorAll('audio');
    
    if (document.hidden) {
        // User left the app/tab - Pause all music
        tracks.forEach(track => track.pause());
    } else {
        // User came back - Find which page we are on and resume that specific audio
        // Only resumes if we aren't on Page 1 (since Page 1 usually needs a click)
        const activePage = document.querySelector('.page.active');
        if (activePage && activePage.id !== 'page1') {
            // Logic to play the audio associated with the current page
            // For example, if on page 2, play audio1
            if (activePage.id === 'page2') document.getElementById('audio1').play();
            if (activePage.id === 'page3') document.getElementById('audio2').play();
            if (activePage.id === 'page4') document.getElementById('audio3').play();
        }
    }
});

/* Heart trail: spawn a heart emoji on touch/click and make it float up and fade.
   Optimizations: throttle spawn rate and cap active hearts to prevent overload. */
(function() {
    const MAX_HEARTS = 30; // cap number of hearts in DOM
    const THROTTLE_MS = 60; // minimum ms between spawns while dragging
    let lastSpawn = 0;
    let activeCount = 0;
    let pointerDown = false;

    function spawnHeart(x, y) {
        // If too many, remove the oldest one to stay under cap
        const existing = document.querySelectorAll('.heart');
        if (existing.length >= MAX_HEARTS) {
            if (existing[0]) existing[0].remove();
        }

        const el = document.createElement('div');
        el.className = 'heart';
        el.textContent = '❤️';

        // small random variations for more natural look
        const scale = (0.9 + Math.random() * 0.6).toFixed(2);
        const rot = (Math.random() * 40 - 20).toFixed(2);
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        el.style.transform = `translate(-50%, -50%) scale(${scale}) rotate(${rot}deg)`;

        document.body.appendChild(el);
        activeCount++;

        // Remove after animation ends to free memory
        el.addEventListener('animationend', () => {
            el.remove();
            activeCount = Math.max(0, activeCount - 1);
        }, { once: true });
    }

    function handleEvent(e) {
        const now = Date.now();
        if (now - lastSpawn < THROTTLE_MS) return;
        lastSpawn = now;

        let clientX, clientY;
        if (e.touches && e.touches[0]) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        spawnHeart(clientX, clientY);
    }

    window.addEventListener('pointerdown', (e) => {
        pointerDown = true;
        handleEvent(e);
    });
    window.addEventListener('pointerup', () => pointerDown = false);
    window.addEventListener('pointermove', (e) => { if (pointerDown) handleEvent(e); });

    // Extra coverage for touch-only browsers and clicks
    window.addEventListener('touchstart', (e) => handleEvent(e), { passive: true });
    window.addEventListener('click', (e) => handleEvent(e));
})();

