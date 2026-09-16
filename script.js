/* ================================================================
   Himanshi Srivastava — Portfolio script.js v3
   ================================================================ */

// ── Navbar: dark background from the very start to prevent flash ──
const navbar = document.getElementById('navbar');
// Immediately apply scrolled class if page was reloaded mid-scroll
if (window.scrollY > 10) navbar.classList.add('scrolled');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// ── Active nav link ───────────────────────────────────────────────
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const a = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (a) a.classList.add('active');
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });

sections.forEach(s => sectionObserver.observe(s));

// ── Hamburger / Mobile Nav ────────────────────────────────────────
const hamburger    = document.getElementById('hamburger');
const navLinksList = document.getElementById('nav-links');
const body         = document.body;

function openMenu() {
  hamburger.classList.add('open');
  navLinksList.classList.add('open');
  body.style.overflow = 'hidden'; // prevent scroll while menu open
}
function closeMenu() {
  hamburger.classList.remove('open');
  navLinksList.classList.remove('open');
  body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  if (hamburger.classList.contains('open')) closeMenu();
  else openMenu();
});

// Close on link click
navLinksList.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Close on backdrop click (clicking outside nav)
document.addEventListener('click', (e) => {
  if (
    navLinksList.classList.contains('open') &&
    !navLinksList.contains(e.target) &&
    !hamburger.contains(e.target)
  ) closeMenu();
});

// Close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});

// ── Typewriter ────────────────────────────────────────────────────
const roles = [
  'scalable backends.',
  'REST APIs.',
  'AI-powered apps.',
  'clean, fast code.',
  'microservices.'
];
let ri = 0, ci = 0, deleting = false;
const typeEl = document.getElementById('role-typewriter');

function type() {
  if (!typeEl) return;
  const word = roles[ri];
  if (!deleting) {
    typeEl.textContent = word.slice(0, ++ci);
    if (ci === word.length) { deleting = true; setTimeout(type, 2000); return; }
  } else {
    typeEl.textContent = word.slice(0, --ci);
    if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
  }
  setTimeout(type, deleting ? 50 : 90);
}
type();

// ── Scroll reveal ─────────────────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal');

const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 70);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => revealObs.observe(el));

// ── Contact form ──────────────────────────────────────────────────
const form       = document.getElementById('contact-form');
const successMsg = document.getElementById('form-success');
const submitBtn  = document.getElementById('submit-btn');
const btnLabel   = document.getElementById('btn-label');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name    = document.getElementById('contact-name').value.trim();
    const email   = document.getElementById('contact-email').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    // Client-side validation
    if (!name || !email || !message) {
      form.style.animation = 'shake 0.4s ease';
      setTimeout(() => form.style.animation = '', 420);
      return;
    }

    // Send state
    btnLabel.textContent = 'Sending…';
    submitBtn.disabled = true;
    successMsg.style.display = 'none';

    try {
      const formData = new FormData(form);
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();

      if (data.success) {
        // ✅ Real success — email delivered to sri.himanshi16@gmail.com
        successMsg.style.display = 'block';
        successMsg.style.color = 'var(--success, #1a7344)';
        successMsg.textContent = '✓ Message sent! I\'ll get back to you shortly.';
        btnLabel.textContent = 'Sent ✓';
        form.reset();
        setTimeout(() => {
          successMsg.style.display = 'none';
          btnLabel.textContent = 'Send Message →';
          submitBtn.disabled = false;
        }, 5000);
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (err) {
      // ❌ Network / API error
      successMsg.style.display = 'block';
      successMsg.style.color = 'var(--error, #b91c1c)';
      successMsg.textContent = '✗ Something went wrong. Please email me directly at sri.himanshi16@gmail.com';
      btnLabel.textContent = 'Try Again';
      submitBtn.disabled = false;
      console.error('Web3Forms error:', err);
    }
  });
}

// ── Smooth scroll (anchor links) ──────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Minimalist Architectural Cursor Follower (desktop only) ───────
if (window.matchMedia('(pointer: fine)').matches && window.innerWidth > 1024) {
  const cursor = document.createElement('div');
  cursor.style.cssText = `
    position: fixed; width: 28px; height: 28px;
    border: 1px solid rgba(15, 15, 15, 0.35);
    border-radius: 0;
    pointer-events: none; z-index: 9999; transform: translate(-50%,-50%);
    transition: left 0.08s ease-out, top 0.08s ease-out, width 0.2s, height 0.2s, border-color 0.2s;
    will-change: transform, left, top;
  `;
  document.body.appendChild(cursor);

  let mx = 0, my = 0;
  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  }, { passive: true });

  // Subtle expansion on interactive elements
  document.querySelectorAll('a, button, input, textarea, .tech-icon-tile, .proj-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '42px';
      cursor.style.height = '42px';
      cursor.style.borderColor = '#000000';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '28px';
      cursor.style.height = '28px';
      cursor.style.borderColor = 'rgba(15, 15, 15, 0.35)';
    });
  });
}

// ── Console branding ──────────────────────────────────────────────
console.log('%c👩‍💻 Himanshi Srivastava', 'color:#8b5cf6;font-size:1.4rem;font-weight:900;font-family:monospace');
console.log('%c   Software Developer · Backend · AI', 'color:#22d3ee;font-family:monospace;font-size:0.9rem');
console.log('%c📧 sri.himanshi16@gmail.com', 'color:#6366f1;font-family:monospace');
console.log('%c🔗 github.com/himanshisri-dev', 'color:#6366f1;font-family:monospace');
