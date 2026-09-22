/* ---------- Design tokens ---------- */
:root {
  --paper: #eef2ee;
  --ink: #12302a;
  --muted: #566b64;
  --line: #cbd6cf;
  --accent: #f2b632;
  --accent-ink: #2b2000;
  --console-bg: #12302a;
  --console-text: #dff0e6;

  --font-display: "Bricolage Grotesque", "Trebuchet MS", system-ui, sans-serif;
  --font-body: "Public Sans", system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-code: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
}

/* ---------- Base ---------- */
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--paper);
  color: var(--ink);
  font-family: var(--font-body);
  font-size: 1.0625rem;
  line-height: 1.6;
}

h1,
h2 {
  font-family: var(--font-display);
  line-height: 1.1;
  margin: 0;
}

/* ---------- Layout ---------- */
.site-header,
.page,
.site-footer {
  width: min(100% - 2.5rem, 46rem);
  margin-inline: auto;
}

.site-header {
  padding-block: 1.75rem 0;
}

.wordmark {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 1.25rem;
  letter-spacing: -0.01em;
}

.page {
  padding-block: 3.5rem 4rem;
  display: grid;
  gap: 3.5rem;
}

/* ---------- Intro ---------- */
h1 {
  font-size: clamp(2.5rem, 8vw, 4.25rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  max-width: 14ch;
}

.lead {
  margin: 1.5rem 0 2rem;
  max-width: 52ch;
  color: var(--muted);
}

.btn {
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 600;
  color: var(--accent-ink);
  background: var(--accent);
  border: 2px solid var(--ink);
  border-radius: 0.5rem;
  padding: 0.85rem 1.5rem;
  cursor: pointer;
  box-shadow: 4px 4px 0 var(--ink);
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}

.btn:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 var(--ink);
}

.btn:active {
  transform: translate(4px, 4px);
  box-shadow: 0 0 0 var(--ink);
}

.btn:focus-visible {
  outline: 3px solid var(--ink);
  outline-offset: 3px;
}

.hint {
  margin: 1.25rem 0 0;
  font-size: 0.95rem;
  color: var(--muted);
}

kbd {
  font-family: var(--font-code);
  font-size: 0.85em;
  background: #fff;
  border: 1px solid var(--line);
  border-bottom-width: 2px;
  border-radius: 0.3rem;
  padding: 0.1em 0.4em;
}

/* ---------- Sections ---------- */
h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.steps {
  margin: 0;
  padding-left: 1.4rem;
  max-width: 52ch;
}

.steps li {
  padding-left: 0.4rem;
  margin-bottom: 0.5rem;
}

.steps li::marker {
  font-family: var(--font-display);
  font-weight: 800;
}

/* ---------- Console preview ---------- */
.console {
  margin: 0;
  padding: 1.5rem;
  background: var(--console-bg);
  color: var(--console-text);
  border-radius: 0.75rem;
  font-family: var(--font-code);
  font-size: 0.9rem;
  line-height: 1.55;
  overflow-x: auto;
}

/* ---------- Footer ---------- */
.site-footer {
  padding-block: 1.5rem 2.5rem;
  border-top: 1px solid var(--line);
  color: var(--muted);
  font-size: 0.9rem;
}

.site-footer p {
  margin: 0;
}

/* ---------- Motion preferences ---------- */
@media (prefers-reduced-motion: reduce) {
  .btn {
    transition: none;
  }
}
