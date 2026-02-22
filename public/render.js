// Simple renderer to populate page using config files
// Note: Images are now loaded directly in HTML to prevent flashing
function renderPage() {
  try {
    // textos
    if (window.TEXTOS) {
      const title = document.getElementById('title');
      if (title) title.innerText = TEXTOS.title || '';
      
      const helpText = document.getElementById('help-text');
      if (helpText) helpText.innerText = TEXTOS.helpText || '';
      
      const whoWeAre = document.getElementById('who-we-are');
      if (whoWeAre) whoWeAre.innerText = TEXTOS.who || '';
      
      const donateTitle = document.getElementById('donate-modal-title');
      if (donateTitle) donateTitle.innerText = TEXTOS.donateTitle || 'Donate';
      
      const donateSubtitle = document.getElementById('donate-modal-sub-title');
      if (donateSubtitle) donateSubtitle.innerText = TEXTOS.donateSubtitle || '';
       
      // About section
      const aboutContent = document.getElementById('about-content');
      if (aboutContent && TEXTOS.aboutSection) {
        aboutContent.innerHTML = TEXTOS.aboutSection;
      }
    }

    // perguntas (FAQ)
    if (window.PERGUNTAS && Array.isArray(PERGUNTAS)) {
      const faq = document.getElementById('faq');
      if (faq) {
        faq.innerHTML = '';
        PERGUNTAS.forEach(q => {
          const item = document.createElement('div');
          item.className = 'faq-item';
          item.innerHTML = `<div class="faq-question"><h3>${q.q}</h3><span class="faq-icon">▾</span></div><div class="faq-answer"><p>${q.a}</p></div>`;
          faq.appendChild(item);
        });
        
        // Add click handlers for FAQ
        faq.querySelectorAll('.faq-question').forEach(question => {
          question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const icon = this.querySelector('.faq-icon');
            if (answer.style.display === 'block') {
              answer.style.display = 'none';
              icon.textContent = '▾';
            } else {
              answer.style.display = 'block';
              icon.textContent = '▴';
            }
          });
        });
      }
    }

    // comentarios
    if (window.COMENTARIOS && Array.isArray(COMENTARIOS)) {
      const area = document.getElementById('comments-area');

      function avatarGradient(color) {
        return `background: linear-gradient(135deg, ${color} 0%, ${color}dd 100%);`;
      }

      if (area) {
        COMENTARIOS.forEach((c, index) => {
          const div = document.createElement('div');
          div.className = 'comentario';
          
          let repliesHTML = '';
          if (c.replies && Array.isArray(c.replies)) {
            repliesHTML = '<div class="replies">';
            c.replies.forEach(r => {
              repliesHTML += `
                <div class="reply">
                  <div class="reply-avatar" style="${avatarGradient(r.color || '#666')}">${r.name ? r.name.charAt(0).toUpperCase() : '?'}</div>
                  <div class="reply-content">
                    <strong>${r.name || 'Anonymous'}</strong>
                    <p>${r.text || ''}</p>
                  </div>
                </div>
              `;
            });
            repliesHTML += '</div>';
          }

          div.innerHTML = `
            <div class="comentario-avatar" style="${avatarGradient(c.color || '#143eee')}">${c.name ? c.name.charAt(0).toUpperCase() : '?'}</div>
            <div class="comentario-content">
              <strong>${c.name || 'Anonymous'}</strong>
              <p>${c.text || ''}</p>
              ${repliesHTML}
            </div>
          `;
          area.appendChild(div);
        });
      }
    }

    // links
    if (window.LINKS) {
      const links = document.querySelectorAll('.social-link[href]');
      links.forEach(link => {
        const platform = link.getAttribute('href').toLowerCase();
        if (LINKS[platform]) {
          link.href = LINKS[platform];
        }
      });
    }
    
  } catch (e) {
    console.warn('renderPage error:', e);
  }
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderPage);
} else {
  // DOM already loaded, but defer slightly to avoid flash
  requestAnimationFrame(() => {
    requestAnimationFrame(renderPage);
  });
}
