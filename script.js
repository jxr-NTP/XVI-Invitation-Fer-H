// Abre la invitación y muestra el contenido principal
function openInvitation() {
    const welcomeScreen = document.getElementById('welcome-screen');
    const mainContent = document.getElementById('main-content');

    welcomeScreen.classList.add('hidden');

    setTimeout(() => {
        welcomeScreen.remove();
        mainContent.style.display = 'block';
        requestAnimationFrame(() => mainContent.style.opacity = '1');

        // Activar bordes laterales
        document.body.classList.add('side-borders');

        // Inicia animaciones de aparición al hacer scroll
        initScrollAnimations();

        // Inicia el contador regresivo
        startCountdown();

        // Generar estrellas al abrir invitación
        generarEstrellas();

        // Reproducir audio con fade-in
        playAudioFadeIn(3000); // fade de 3 segundos
    }, 1000);
}

// Detecta los contenedores visibles al hacer scroll
function initScrollAnimations() {
    const containers = document.querySelectorAll('.block-container');
    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');

                    // Si es la galería, activa animación de imágenes
                    if (entry.target.id === 'galeria') {
                        const galeria = entry.target.querySelector('.imagenes-galeria');
                        galeria.classList.add('animar');
                    }
                } else {
                    entry.target.classList.remove('visible');

                    // Si es la galería, reinicia animación
                    if (entry.target.id === 'galeria') {
                        const galeria = entry.target.querySelector('.imagenes-galeria');
                        galeria.classList.remove('animar');
                    }
                }
            });
        },
        { threshold: 0.3 } // el 30% del contenedor visible activa/desactiva
    );

    containers.forEach(container => observer.observe(container));
}

// Contador regresivo
let _countdownInterval = null;
const TARGET_DATE = new Date("2025-11-29T16:30:00"); // ISO sin Z = hora local

function pad2(n) {
    return String(n).padStart(2, '0');
}

function formatTimeParts(msDiff) {
    const totalSec = Math.floor(msDiff / 1000);
    const dias = Math.floor(totalSec / (60 * 60 * 24));
    const horas = Math.floor((totalSec % (60 * 60 * 24)) / (60 * 60));
    const minutos = Math.floor((totalSec % (60 * 60)) / 60);
    const segundos = totalSec % 60;
    return { dias, horas, minutos, segundos };
}

function actualizarContadorDOM() {
    const el = document.getElementById('countdown');
    if (!el) return;

    const ahora = new Date();
    const diff = TARGET_DATE - ahora;

    if (diff <= 0) {
        el.textContent = "¡Finalizado!";
        if (_countdownInterval) {
            clearInterval(_countdownInterval);
            _countdownInterval = null;
        }
        return;
    }

    const { dias, horas, minutos, segundos } = formatTimeParts(diff);

    if (dias > 0) {
        el.textContent = `${dias}d : ${pad2(horas)}h : ${pad2(minutos)}m : ${pad2(segundos)}s`;
    } else {
        el.textContent = `${pad2(horas)}:${pad2(minutos)}:${pad2(segundos)}`;
    }
}

function startCountdown() {
    // evitar duplicados
    if (_countdownInterval) {
        clearInterval(_countdownInterval);
        _countdownInterval = null;
    }

    // actualizar inmediatamente y luego cada 1s
    actualizarContadorDOM();
    _countdownInterval = setInterval(actualizarContadorDOM, 1000);
}

function stopCountdown() {
    if (_countdownInterval) {
        clearInterval(_countdownInterval);
        _countdownInterval = null;
    }
}

// Generar estrellas
function generarEstrellas() {
    const contenedor = document.querySelector('.estrellas-fondo');
    const NUM_ESTRELLAS = 30;

    for (let i = 0; i < NUM_ESTRELLAS; i++) {
        const star = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        star.setAttribute("viewBox", "0 0 24 24");
        star.innerHTML = `<polygon points="12,2 15,11 24,11 17,17 19,26 12,20 5,26 7,17 0,11 9,11" />`;

        const left = Math.random() * 100;
        const dur = 5 + Math.random() * 10;
        star.style.left = `${left}%`;
        star.style.animationDuration = `${dur}s`;

        contenedor.appendChild(star);
    }
}

// Reproduce el audio con efecto de fade-in
function playAudioFadeIn(duration = 3000) {
    const audio = document.getElementById('audio-fondo');
    if (!audio) return;

    audio.volume = 0;  // inicia en silencio
    audio.loop = true; // opcional: repetir la canción
    audio.play().catch(err => console.log('Error al reproducir audio:', err));

    const step = 0.01; // incremento de volumen
    const intervalTime = duration * step; // tiempo entre incrementos

    let vol = 0;
    const fadeInterval = setInterval(() => {
        vol += step;
        if (vol >= 1) {
            vol = 1;
            clearInterval(fadeInterval);
        }
        audio.volume = vol;
    }, intervalTime);
}
