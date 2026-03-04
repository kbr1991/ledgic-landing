// ── Navbar scroll behaviour ───────────────────────────────────
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// ── Mobile menu toggle ────────────────────────────────────────
const hamburger = document.getElementById('navHamburger');
const navLinks  = document.getElementById('navLinks');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// ── Scroll reveal ─────────────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ── Form submission helper ────────────────────────────────────
async function submitForm(form, endpoint, msgEl) {
  const btn = form.querySelector('button[type="submit"]');
  const origText = btn.textContent;
  btn.textContent = 'Sending…'; btn.disabled = true;
  msgEl.className = 'form-msg'; msgEl.style.display = 'none';

  const data = {};
  new FormData(form).forEach((v, k) => data[k] = v);

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();

    if (res.ok && json.success) {
      msgEl.textContent = json.message;
      msgEl.className = 'form-msg success';
      form.reset();
    } else {
      msgEl.textContent = json.error || 'Something went wrong. Please try again.';
      msgEl.className = 'form-msg error';
    }
  } catch {
    msgEl.textContent = 'Network error. Please check your connection and try again.';
    msgEl.className = 'form-msg error';
  } finally {
    btn.textContent = origText; btn.disabled = false;
    msgEl.style.display = 'block';
    msgEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

// ── Contact form ──────────────────────────────────────────────
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    submitForm(contactForm, '/api/contact', document.getElementById('contactMsg'));
  });
}

// ── Careers form ──────────────────────────────────────────────
const careersForm = document.getElementById('careersForm');
if (careersForm) {
  careersForm.addEventListener('submit', e => {
    e.preventDefault();
    submitForm(careersForm, '/api/careers', document.getElementById('careerMsg'));
  });
}

// ── Active nav link on scroll ─────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');
if (sections.length && navAnchors.length) {
  const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navAnchors.forEach(a => {
          a.style.color = '';
          if (a.getAttribute('href') === `/#${e.target.id}` || a.getAttribute('href') === `#${e.target.id}`) {
            a.style.color = 'var(--gold)';
          }
        });
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => sectionObs.observe(s));
}
