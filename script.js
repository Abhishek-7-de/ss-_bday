/* ============================================
   BIRTHDAY WEBSITE — SCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('envelope-active');
    initEnvelope();
    initMusicPlayer();
    initFloatingElements();
});

/* ============================================
   ENVELOPE
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
            envelope.classList.add('opened');
            opened = true;
            setTimeout(() => { readyToClose = true; }, 800);
        } else if (readyToClose) {
            envelopeSection.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            envelopeSection.style.opacity = '0';
            envelopeSection.style.transform = 'translateY(-40px)';
            setTimeout(() => {
                envelopeSection.style.display = 'none';
                document.body.classList.remove('envelope-active');
                revealSections();
                tryAutoplayMusic();
            }, 800);
        }
    }
}

/* ============================================
   REVEAL SECTIONS
   ============================================ */
function revealSections() {
    const sections = document.querySelectorAll('.hidden-section');
    sections.forEach((s, i) => {
        setTimeout(() => s.classList.add('visible'), i * 100);
    });
    setTimeout(() => {
        initScrollAnimations();
        initComplimentGenerator();
        initMagicBall();
    }, 300);
}

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */
function initScrollAnimations() {
    const observerOptions = { root: null, rootMargin: '0px 0px -60px 0px', threshold: 0.15 };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                const children = entry.target.querySelectorAll('.polaroid, .sticky-note, .video-card, .masonry-item, .reveal-item');
                children.forEach((child, i) => {
                    setTimeout(() => child.classList.add('animate'), i * 150);
                });
                // Trigger typewriter when promise card is visible
                if (entry.target.classList.contains('promise-card')) {
                    startTypewriter();
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section-title, .note-card, .promise-card, .video-card, .compliment-card')
        .forEach(el => observer.observe(el));
    document.querySelectorAll('.polaroid-grid, .sticky-notes, .masonry-grid')
        .forEach(el => observer.observe(el));
    document.querySelectorAll('.polaroid, .sticky-note, .masonry-item')
        .forEach(el => observer.observe(el));

    initLightbox();
    initVideoAutoplay();
}

/* ============================================
   VIDEO AUTOPLAY ON SCROLL
   ============================================ */
function initVideoAutoplay() {
    const videos = document.querySelectorAll('.hero-video-bg video, .video-vibe-bg video');
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.play().catch(() => {});
            } else {
                entry.target.pause();
            }
        });
    }, { threshold: 0.3 });

    videos.forEach(v => videoObserver.observe(v));
}

/* ============================================
   MUSIC PLAYER
   ============================================ */
function initMusicPlayer() {
    const musicToggle = document.getElementById('music-toggle');
    const musicIcon = musicToggle.querySelector('.music-icon');
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
            icon.classList.remove('playing');
            icon.classList.add('paused');
        });
    }
}

/* ============================================
   FLOATING ELEMENTS
   ============================================ */
function initFloatingElements() {
    const container = document.getElementById('floating-elements');
    const elements = ['✿', '✦', '❀', '·', '✧', '♡', '⋆', '🦋'];
    const colors = ['#f0c36d', '#f27a93', '#c4a8e0', '#7ec8f0', '#7ee8c4', '#f0ece2'];

    function createFloat() {
        const el = document.createElement('div');
        el.classList.add('float-petal');
        el.textContent = elements[Math.floor(Math.random() * elements.length)];
        el.style.left = Math.random() * 100 + 'vw';
        el.style.top = -20 + 'px';
        el.style.fontSize = (14 + Math.random() * 14) + 'px';
        el.style.animationDuration = (8 + Math.random() * 8) + 's';
        el.style.animationDelay = Math.random() * 2 + 's';
        el.style.color = colors[Math.floor(Math.random() * colors.length)];
        container.appendChild(el);
        setTimeout(() => el.remove(), 18000);
    }

    setInterval(createFloat, 1000);
    for (let i = 0; i < 6; i++) setTimeout(createFloat, i * 300);
}

/* ============================================
   COMPLIMENT GENERATOR
   ============================================ */
function initComplimentGenerator() {
    const card = document.getElementById('compliment-card');
    const text = document.getElementById('compliment-text');
    if (!card || !text) return;

    const compliments = [
        "You're the kind of person people write songs about and don't even realize it 🎵",
        "Somewhere right now, someone is telling a story about you and smiling",
        "You make messy hair look like a whole fashion statement",
        "I bet even your bad photos are better than most people's good ones",
        "Your vibe? Unmatched. Literally no one comes close.",
        "The confidence you carry is lowkey intimidating and I'm here for it",
        "You're proof that some people are just born with it ✨",
        "If there was an award for making someone's day through a screen — you'd win every time",
        "Your existence makes the internet a better place. I said what I said.",
        "Some people light up a room. You light up a whole timeline.",
        "You're not like everyone else and that's exactly what makes you dangerous 🔥",
        "I'd bet my wifi password that you have no idea how special you actually are",
        "The world got a little more interesting the day you showed up on my screen",
    ];

    let lastIndex = -1;

    card.addEventListener('click', () => {
        let idx;
        do { idx = Math.floor(Math.random() * compliments.length); } while (idx === lastIndex);
        lastIndex = idx;

        text.style.opacity = '0';
        setTimeout(() => {
            text.textContent = compliments[idx];
            text.style.opacity = '1';
        }, 200);

        // Little haptic
        if (navigator.vibrate) navigator.vibrate(30);
    });
}

/* ============================================
   MAGIC 8-BALL WISHES
   ============================================ */
function initMagicBall() {
    const ball = document.getElementById('magic-ball');
    const wishText = document.getElementById('wish-text');
    if (!ball || !wishText) return;

    const wishes = [
        "This year, you'll get exactly what you didn't know you needed",
        "Someone is going to surprise you so hard you'll forget how to talk",
        "A road trip with your people. Windows down. No plans. Just vibes.",
        "That thing you've been overthinking? It's going to work out. Trust.",
        "You're going to laugh so hard this year your stomach will hurt for days",
        "Something really beautiful is going to happen when you least expect it",
        "The universe owes you one. And it's about to pay up.",
        "New city. New energy. New chapter. It's coming.",
        "Someone's going to look at you one day and just think… 'wow'",
        "This year, you stop settling. For anything. For anyone.",
    ];

    let lastIdx = -1;

    ball.addEventListener('click', () => {
        ball.classList.add('shake');
        wishText.style.opacity = '0';

        setTimeout(() => {
            ball.classList.remove('shake');
            let idx;
            do { idx = Math.floor(Math.random() * wishes.length); } while (idx === lastIdx);
            lastIdx = idx;
            wishText.textContent = wishes[idx];
            wishText.style.opacity = '1';
            wishText.style.fontSize = '12px';
        }, 600);

        if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
    });
}

/* ============================================
   TYPEWRITER — Promise Section
   ============================================ */
let typewriterStarted = false;
function startTypewriter() {
    if (typewriterStarted) return;
    typewriterStarted = true;

    const target = document.getElementById('typewriter-target');
    if (!target) return;

    const lines = [
        "One day the typing dots will become my actual voice.",
        "\nThe 'haha' will become me actually laughing next to you.",
        "\nThe late night texts will become late night conversations.",
        "\n\nAnd I'll look at you and say —",
        "\n\n\"Damn. You're even better in person.\"",
    ];

    const fullText = lines.join('');
    let i = 0;
    target.innerHTML = '<span class="typewriter-cursor"></span>';

    function type() {
        if (i < fullText.length) {
            const cursor = target.querySelector('.typewriter-cursor');
            const char = fullText[i];
            if (char === '\n') {
                cursor.insertAdjacentHTML('beforebegin', '<br>');
            } else {
                cursor.insertAdjacentText('beforebegin', char);
            }
            i++;
            // Variable speed for natural feel
            const delay = char === '.' || char === '—' ? 120 : char === ',' ? 80 : char === '\n' ? 200 : 35 + Math.random() * 25;
            setTimeout(type, delay);
        } else {
            // Remove cursor after done
            setTimeout(() => {
                const cursor = target.querySelector('.typewriter-cursor');
                if (cursor) cursor.remove();
            }, 2000);
        }
    }

    type();
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
document.getElementById('confetti-btn').addEventListener('click', () => launchConfetti());

function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confettiPieces = [];
    const colors = ['#f0c36d', '#f27a93', '#c4a8e0', '#7ec8f0', '#7ee8c4', '#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#fff'];

    for (let i = 0; i < 250; i++) {
        confettiPieces.push({
            x: Math.random() * canvas.width,
            y: -20 - Math.random() * canvas.height * 0.5,
            w: 6 + Math.random() * 8,
            h: 4 + Math.random() * 6,
            color: colors[Math.floor(Math.random() * colors.length)],
            shape: Math.random() > 0.5 ? 'rect' : 'circle',
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10,
            speedX: (Math.random() - 0.5) * 5,
            speedY: 2 + Math.random() * 5,
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
            if (p.y > canvas.height + 20) p.opacity -= 0.02;

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
    if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200]);
}

window.addEventListener('resize', () => {
    const canvas = document.getElementById('confetti-canvas');
    if (canvas) { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
});
