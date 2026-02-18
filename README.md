# Gaza Donation Regime — Static Frontend

This workspace contains a static HTML/CSS/JS frontend scaffold plus simple API stubs for local testing.

Quick start:

1. Serve the folder with a static server (Python):

```bash
# from the project root
python -m http.server 8000
```

2. Open http://localhost:8000/index.html in your browser.

Notes:
- `public/` contains CSS, JS and placeholder images.
- `config/` contains example data used by `render.js`.
- `api/` contains simple PHP stubs — to test these you need a PHP-enabled server (e.g. `php -S localhost:8000`).
