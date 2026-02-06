// --- PAGE NAVIGATION ---
function goToPage(pageNum, audioId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    const activePage = document.getElementById('page' + pageNum);
    if (activePage) activePage.classList.add('active');

    // Scroll Fix: Lock Landing, Unlock Others
    if (pageNum === 1) {
        document.body.style.overflow = "hidden";
    } else {
        document.body.style.overflow = "auto";
    }

    stopAllMusic();
    let audio = document.getElementById(audioId);
    if (audio) {
        audio.play().catch(e => console.log("Audio blocked until interaction"));
    }
    window.scrollTo(0, 0);
}

function stopAllMusic() {
    document.querySelectorAll('audio').forEach(a => {
        a.pause();
        a.currentTime = 0;
    });
}

// --- NO BUTTON LOGIC ---
function moveNoButton() {
    const btn = document.getElementById('noBtn');
    const padding = 20;

    // Anchor current position before switching to fixed so it doesn't jump
    const rect = btn.getBoundingClientRect();
    btn.style.position = 'fixed';
    btn.style.left = rect.left + 'px';
    btn.style.top = rect.top + 'px';

    // Use actual rendered size to keep it fully in the viewport
    const size = btn.getBoundingClientRect();
    const maxX = Math.max(0, window.innerWidth - size.width - padding);
    const maxY = Math.max(0, window.innerHeight - size.height - padding);

    const randomX = Math.floor(Math.random() * (maxX + 1));
    const randomY = Math.floor(Math.random() * (maxY + 1));

    const targetX = Math.min(maxX, Math.max(0, randomX));
    const targetY = Math.min(maxY, Math.max(0, randomY));

    // Next frame lets CSS transition animate the move
    requestAnimationFrame(() => {
        btn.style.left = targetX + 'px';
        btn.style.top = targetY + 'px';
    });
}

// --- GALLERY LOGIC ---
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

// --- BURST EFFECT (New Feature) ---
function triggerBurst(element, emojiType) {
    // 1. Flip the card
    element.classList.toggle('flipped');
    
    // Only burst if opening (optional)
    if (!element.classList.contains('flipped')) return;

    // 2. Get card position
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // 3. Create particles
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'burst-item';
        particle.textContent = emojiType;
        
        // Random direction
        const angle = Math.random() * Math.PI * 2;
        const velocity = 100 + Math.random() * 200; // Fly distance
        const tx = Math.cos(angle) * velocity + 'px';
        const ty = Math.sin(angle) * velocity + 'px';

        particle.style.setProperty('--tx', tx);
        particle.style.setProperty('--ty', ty);
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        
        // Randomize spin
        particle.style.transform = `rotate(${Math.random() * 360}deg)`;

        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 1000); // Cleanup
    }
}

// --- VISIBILITY AUDIO FIX ---
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        document.querySelectorAll('audio').forEach(t => t.pause());
    } else {
        const activePage = document.querySelector('.page.active');
        if (activePage && activePage.id !== 'page1') {
            if (activePage.id === 'page2') document.getElementById('audio1').play();
            if (activePage.id === 'page3') document.getElementById('audio2').play();
            if (activePage.id === 'page4') document.getElementById('audio3').play();
        }
    }
});
