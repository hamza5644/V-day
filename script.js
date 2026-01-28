function goToPage(pageNum, audioId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page' + pageNum).classList.add('active');
    
    stopAllMusic();
    let audio = document.getElementById(audioId);
    if (audio) {
        audio.play().catch(e => console.log("Audio waiting for interaction"));
    }
    window.scrollTo(0, 0);
}

function stopAllMusic() {
    document.querySelectorAll('audio').forEach(a => {
        a.pause();
        a.currentTime = 0;
    });
}

function moveNoButton() {
    const btn = document.getElementById('noBtn');
    
    // We want to keep the button within the visible area
    const padding = 50;
    const maxX = window.innerWidth - btn.offsetWidth - padding;
    const maxY = window.innerHeight - btn.offsetHeight - padding;
    
    const randomX = Math.max(padding, Math.floor(Math.random() * maxX));
    const randomY = Math.max(padding, Math.floor(Math.random() * maxY));
    
    btn.style.position = 'fixed';
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