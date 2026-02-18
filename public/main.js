// Minimal main.js placeholder
document.addEventListener('DOMContentLoaded', function () {
  // Keep global behavior safe if config scripts are missing
  if (typeof renderPage === 'function') {
    try { renderPage(); } catch (e) { console.warn('renderPage failed', e); }
  }
});
