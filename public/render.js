// Simple renderer to populate page using config files
function renderPage() {
  try {
    // textos
    if (window.TEXTOS) {
      document.getElementById('title').innerText = TEXTOS.title || '';
      document.getElementById('help-text').innerText = TEXTOS.helpText || '';
      document.getElementById('who-we-are').innerText = TEXTOS.who || '';
      document.getElementById('donate-modal-title').innerText = TEXTOS.donateTitle || 'Donate';
      document.getElementById('donate-modal-sub-title').innerText = TEXTOS.donateSubtitle || '';
    }

    // imagens
    if (window.IMAGENS) {
      const logo = document.getElementById('logo');
      if (logo && IMAGENS.logo) logo.src = IMAGENS.logo;
      const mainImage = document.getElementById('main-image');
      if (mainImage && IMAGENS.main) mainImage.src = IMAGENS.main;
    }

    // perguntas (FAQ)
    if (window.PERGUNTAS && Array.isArray(PERGUNTAS)) {
      const faq = document.getElementById('faq');
      PERGUNTAS.forEach(q => {
        const item = document.createElement('div');
        item.className = 'faq-item';
        item.innerHTML = `<div class="faq-question"><h3>${q.q}</h3><span class="faq-icon">▾</span></div><div class="faq-answer"><p>${q.a}</p></div>`;
        faq.appendChild(item);
      });
    }

    // comentarios
    if (window.COMENTARIOS && Array.isArray(COMENTARIOS)) {
      const area = document.getElementById('comments-area');
      COMENTARIOS.forEach(c => {
        const div = document.createElement('div');
        div.className = 'comentario';
        div.innerHTML = `<strong>${c.author}</strong><p>${c.text}</p>`;
        area.appendChild(div);
      });
    }

    // set CSS vars from CORES
    if (window.CORES) {
      for (const k in CORES) {
        document.documentElement.style.setProperty(`--${k}`, CORES[k]);
      }
    }

  } catch (err) { console.error('renderPage error', err); }
}
