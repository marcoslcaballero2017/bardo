const ENDPOINT = 'https://formspree.io/f/mkgvzebn';

const form = document.getElementById('form-coment');
const input = document.getElementById('coment');
const statusEl = document.getElementById('form-status');
const submitBtn = document.getElementById('submit-button');

function setStatus(msg, type = '') {
  statusEl.textContent = msg;
  statusEl.className = type;

  // Solo borrar automáticamente si es éxito o error
  const isEphemeral = type === 'status-success' || type === 'status-error';
  if (msg && isEphemeral) {
    setTimeout(() => {
      statusEl.textContent = '';
      statusEl.className = '';
    }, 3000);
  }
}

async function sendForm(fd) {
  return fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
    body: fd
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const value = (input.value || '').trim();
  if (value.length < 3) {
    input.setAttribute('aria-invalid', 'true');
    setStatus('Tu bardo debe tener al menos 3 caracteres.', 'status-error');
    input.focus();
    return;
  }
  input.setAttribute('aria-invalid', 'false');

  submitBtn.disabled = true;
  setStatus('Enviando BARDO…');

  try {
    const fd = new FormData(form);
    const res = await sendForm(fd);
    if (!res.ok) throw new Error('HTTP ' + res.status);

    form.reset();
    setStatus('¡Buena, crack! Enviaste un BARDO.', 'status-success');
    input.focus();
  } catch (err) {
    setStatus('Hubo un error al enviar tu BARDO. Probá de nuevo en un rato.', 'status-error');
  } finally {
    submitBtn.disabled = false;
  }
});

input.addEventListener('input', () => {
  const length = input.value.length;
  setStatus(length > 0 ? `${length} / 200` : '');
});

// ---- Intro animada BARDO CHAT GPT----
(function introBardo() {
  document.body.classList.add('preload');

  const original = document.getElementById('title-span');
  if (!original) {
    document.body.classList.remove('preload');
    return;
  }

  // Crear overlay + clon
  const overlay = document.createElement('div');
  overlay.id = 'intro-overlay';

  const clone = original.cloneNode(true);
  clone.className = 'clone-title';

  overlay.appendChild(clone);
  document.body.appendChild(overlay);

  // Esperar 0,8s antes de iniciar el movimiento
  setTimeout(() => {
    const rect = original.getBoundingClientRect();
    const endX = rect.left + rect.width / 2;
    const endY = rect.top + rect.height / 2;

    const anim = clone.animate([
      { top: '50%', left: '50%', transform: 'translate(-50%, -50%) scale(1.25)' },
      { top: `${endY}px`, left: `${endX}px`, transform: 'translate(-50%, -50%) scale(1)' }
    ], {
      duration: 900,
      easing: 'cubic-bezier(.2,.8,.2,1)',
      fill: 'forwards'
    });

    anim.finished.then(() => {
      overlay.style.opacity = '0';
      document.body.classList.remove('preload');
      document.body.classList.add('ready');
      setTimeout(() => overlay.remove(), 350);
    });
  }, 800); // <-- delay reducido a 0,8s
})();
