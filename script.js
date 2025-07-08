document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const envelopeWrapper = document.getElementById('envelope');
  const envelope = envelopeWrapper.querySelector('.envelope');
  const music = document.getElementById('bg-music');
  const cake = document.querySelector('.cake');
  
  // State variables
  let confettiLoaded = false;
  let opened = false;
  let musicPlaying = false;

  // ================ POSITIONING ================
  function positionElements() {
  // Position envelope
  envelopeWrapper.style.position = 'absolute';
  envelopeWrapper.style.top = '50%';
  envelopeWrapper.style.left = '50%';
  envelopeWrapper.style.transform = 'translate(-50%, -50%)';
  
  // Position cake perfectly centered
  const cake = document.querySelector('.cake');
  cake.style.position = 'absolute';
  cake.style.bottom = '10%';
  cake.style.left = '50%';
  cake.style.transform = 'translateX(-50%)';
  cake.style.zIndex = '10';
}

  // ================ CONFETTI LOADING ================
  function loadConfetti() {
    return new Promise((resolve) => {
      if (typeof confetti === 'function') {
        confettiLoaded = true;
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
      script.onload = () => {
        confettiLoaded = true;
        resolve();
      };
      script.onerror = resolve;
      document.head.appendChild(script);
    });
  }

  // ================ MUSIC CONTROL ================
  function tryPlayMusic() {
    if (music.paused) {
      music.volume = 0.3;
      music.play()
        .then(() => {
          musicPlaying = true;
        })
        .catch(e => {
          console.log('Autoplay blocked:', e);
        });
    }
  }

  // ================ ENVELOPE INTERACTION ================
  function triggerInteraction() {
    if (!opened) {
      envelope.classList.add('opened');
      tryPlayMusic();
      opened = true;

      // Launch confetti once loaded
      if (confettiLoaded) {
        launchConfetti();
      } else {
        loadConfetti().then(() => {
          if (confettiLoaded) launchConfetti();
        });
      }
    }
  }

  // ================ CONFETTI EFFECTS ================
  function launchConfetti() {
    const duration = 5000;
    const endTime = Date.now() + duration;
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];

    const confettiInterval = setInterval(() => {
      if (Date.now() > endTime) {
        clearInterval(confettiInterval);
        return;
      }

      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });

      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });
    }, 250);

    // Big burst at the beginning
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }

  // ================ EVENT LISTENERS ================
  function setupEventListeners() {
    // Envelope interactions
    envelopeWrapper.addEventListener('mouseenter', triggerInteraction);
    envelopeWrapper.addEventListener('touchstart', triggerInteraction, { passive: true });
    envelopeWrapper.addEventListener('click', triggerInteraction);

    // Try to play music on any user interaction
    document.addEventListener('click', tryPlayMusic, { once: true });
    document.addEventListener('touchstart', tryPlayMusic, { once: true });
  }

  // ================ INITIALIZATION ================
  function init() {
    positionElements(); // Set initial positions
    loadConfetti();
    setupEventListeners();
    
    // Try to play music automatically
    tryPlayMusic();
    // Retry after delay if blocked
    setTimeout(tryPlayMusic, 1000);
  }

  init();
});
