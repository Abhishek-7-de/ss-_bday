/* ============================================
   BIRTHDAY WEBSITE — SCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Lock scroll while envelope is shown
    document.body.classList.add('envelope-active');

    initEnvelope();
    initMusicPlayer();
    initFloatingElements();
});

/* ============================================
   ENVELOPE INTERACTION
   ============================================ */
function initEnvelope() {
    const envelope = document.getElementById('envelope');
    const envelopeSection = document.getElementById('envelope-section');
    let opened = false;
    let readyToClose = false;

    envelope.addEventListener('click', handleEnvelopeClick);
    envelope.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') handleEnvelopeClick();
    });

    function handleEnvelopeClick() {
        if (!opened) {
            // First click: open envelope
            envelope.classList.add('opened');
            opened = true;
            setTimeout(() => { readyToClose = true; }, 800);
        } else if (readyToClose) {
            // Second click: transition to main content
            envelopeSection.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            envelopeSection.style.opacity = '0';
            envelopeSection.style.transform = 'translateY(-40px)';

            setTimeout(() => {
                envelopeSection.style.display = 'none';
                document.body.classList.remove('envelope-active');
                revealSections();
                // Try autoplaying music after user interaction
                tryAutoplayMusic();
            }, 800);
        }
    }
}

/* ============================================
   REVEAL ALL SECTIONS
   ============================================ */
function revealSections() {
    const sections = document.querySelectorAll('.hidden-section');
    sections.forEach((s, i) => {
        setTimeout(() => {
            s.classList.add('visible');
        }, i * 100);
    });

    // Start scroll observer
    setTimeout(initScrollAnimations, 300);
}

/* ============================================
   SCROLL ANIMATIONS (Intersection Observer)
   ============================================ */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                // For containers, animate children too
                const children = entry.target.querySelectorAll('.polaroid, .sticky-note, .video-card, .masonry-item, .reveal-item');
                children.forEach((child, i) => {
                    setTimeout(() => child.classList.add('animate'), i * 150);
                });
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.section-title, .note-card, .promise-card, .video-card').forEach(el => observer.observe(el));
    
    // Observe gallery sections as a whole
    document.querySelectorAll('.polaroid-grid, .sticky-notes, .masonry-grid').forEach(el => observer.observe(el));

    // Observe individual items for staggered reveal
    document.querySelectorAll('.polaroid, .sticky-note, .masonry-item').forEach(el => observer.observe(el));

    // Image lightbox
    initLightbox();
}

/* ============================================
   MUSIC PLAYER
   ============================================ */
function initMusicPlayer() {
    const musicToggle = document.getElementById('music-toggle');
    const musicIcon = musicToggle.querySelector('.music-icon');
    
    // Use the Spotify preview URL as background audio
    const audio = new Audio('https://p.scdn.co/mp3-preview/b44fc8a0d6c644ac3b9ddc1aca2fe99c0f2f3554');
    audio.loop = true;
    audio.volume = 0.4;

    window._bgAudio = audio;
    window._musicIcon = musicIcon;

    let isPlaying = false;

    musicToggle.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            musicIcon.classList.remove('playing');
            musicIcon.classList.add('paused');
            isPlaying = false;
        } else {
            audio.play().then(() => {
                musicIcon.classList.add('playing');
                musicIcon.classList.remove('paused');
                isPlaying = true;
            }).catch(() => {});
        }
    });

    // Store state
    window._isMusicPlaying = () => isPlaying;
    window._setMusicPlaying = (val) => { isPlaying = val; };
}

function tryAutoplayMusic() {
    const audio = window._bgAudio;
    const icon = window._musicIcon;
    if (audio && !window._isMusicPlaying()) {
        audio.play().then(() => {
            icon.classList.add('playing');
            icon.classList.remove('paused');
            window._setMusicPlaying(true);
        }).catch(() => {
            // Autoplay blocked, user can click manually
            icon.classList.remove('playing');
            icon.classList.add('paused');
        });
    }
}

/* ============================================
   FLOATING ELEMENTS (petals, sparkles)
   ============================================ */
function initFloatingElements() {
    const container = document.getElementById('floating-elements');
    const elements = ['✿', '✦', '❀', '·', '✧', '♡', '⋆'];

    function createFloat() {
        const el = document.createElement('div');
        el.classList.add('float-petal');
        el.textContent = elements[Math.floor(Math.random() * elements.length)];
        el.style.left = Math.random() * 100 + 'vw';
        el.style.top = -20 + 'px';
        el.style.fontSize = (12 + Math.random() * 12) + 'px';
        el.style.animationDuration = (8 + Math.random() * 8) + 's';
        el.style.animationDelay = Math.random() * 2 + 's';
        el.style.color = ['#e8c47c', '#d4778e', '#b8a9c9', '#f0ece2'][Math.floor(Math.random() * 4)];
        container.appendChild(el);

        // Remove after animation
        setTimeout(() => el.remove(), 18000);
    }

    // Create periodically
    setInterval(createFloat, 1200);
    // Initial batch
    for (let i = 0; i < 5; i++) {
        setTimeout(createFloat, i * 400);
    }
}

/* ============================================
   IMAGE LIGHTBOX
   ============================================ */
function initLightbox() {
    const images = document.querySelectorAll('.polaroid-img-wrap img, .masonry-item img');

    images.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            openLightbox(img.src);
        });
    });
}

function openLightbox(src) {
    const overlay = document.createElement('div');
    overlay.classList.add('lightbox-overlay');
    
    const img = document.createElement('img');
    img.src = src;
    overlay.appendChild(img);
    document.body.appendChild(overlay);

    requestAnimationFrame(() => overlay.classList.add('active'));

    overlay.addEventListener('click', () => {
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 300);
    });
}

/* ============================================
   CONFETTI 🎉
   ============================================ */
document.getElementById('confetti-btn').addEventListener('click', () => {
    launchConfetti();
});

function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confettiPieces = [];
    const colors = ['#e8c47c', '#d4778e', '#b8a9c9', '#f0ece2', '#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff'];
    const shapes = ['rect', 'circle'];

    // Create confetti pieces
    for (let i = 0; i < 200; i++) {
        confettiPieces.push({
            x: Math.random() * canvas.width,
            y: -20 - Math.random() * canvas.height * 0.5,
            w: 6 + Math.random() * 8,
            h: 4 + Math.random() * 6,
            color: colors[Math.floor(Math.random() * colors.length)],
            shape: shapes[Math.floor(Math.random() * shapes.length)],
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10,
            speedX: (Math.random() - 0.5) * 4,
            speedY: 2 + Math.random() * 4,
            gravity: 0.05 + Math.random() * 0.05,
            opacity: 1,
            swing: Math.random() * Math.PI * 2,
            swingSpeed: 0.02 + Math.random() * 0.03
        });
    }

    let animationId;
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let alive = false;

        confettiPieces.forEach(p => {
            if (p.opacity <= 0) return;
            alive = true;

            p.x += p.speedX + Math.sin(p.swing) * 0.5;
            p.y += p.speedY;
            p.speedY += p.gravity;
            p.rotation += p.rotationSpeed;
            p.swing += p.swingSpeed;

            if (p.y > canvas.height + 20) {
                p.opacity -= 0.02;
            }

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation * Math.PI / 180);
            ctx.globalAlpha = Math.max(0, p.opacity);
            ctx.fillStyle = p.color;

            if (p.shape === 'rect') {
                ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            } else {
                ctx.beginPath();
                ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();
        });

        if (alive) {
            animationId = requestAnimationFrame(animate);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            cancelAnimationFrame(animationId);
        }
    }

    animate();

    // Also trigger some vibration if available
    if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100, 50, 200]);
    }
}

// Handle resize
window.addEventListener('resize', () => {
    const canvas = document.getElementById('confetti-canvas');
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});
