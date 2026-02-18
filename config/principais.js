// principais.js - core helpers
function __get__(s) {
  // join segments and attempt base64 decode; fall back to joined string
  try {
    const joined = s.join('');
    try { return atob(joined); } catch (e) { return joined; }
  } catch (e) { return '' }
}

// Default tracking interval
var INTERVALO_ENTRE_NOTIFICACOES = 10;
