/* ============================================================
   Prime Harvest Lanka (Pvt) Ltd. — Main JavaScript
   main.js
   ============================================================ */

/* ----------------------------------------------------------------
   EMAIL JS CONFIGURATION
   Replace the three placeholders below with your real credentials
   from your EmailJS dashboard: https://www.emailjs.com/
   ---------------------------------------------------------------- */
const EMAILJS_PUBLIC_KEY  = 'KLireaftGOD275--d';   // e.g. 'abc123XYZ'
const EMAILJS_SERVICE_ID  = 'service_tfgzz52';   // e.g. 'service_xxxxxxx'
const EMAILJS_TEMPLATE_ID = 'template_go7ip6b';  // e.g. 'template_xxxxxxx'

// Initialise EmailJS once the script loads
emailjs.init(EMAILJS_PUBLIC_KEY);

/* ----------------------------------------------------------------
   NAVBAR — transparent on hero, solid on scroll
   ---------------------------------------------------------------- */
const navbar = document.getElementById('navbar');

function handleNavScroll() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

/* ----------------------------------------------------------------
   SCROLL-TO-TOP BUTTON — appears after 400px scroll
   ---------------------------------------------------------------- */
const scrollTopBtn = document.getElementById('scrollTop');

function handleScrollTopVisibility() {
  if (window.scrollY > 400) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
}

// Single scroll listener for both navbar + scroll-top
window.addEventListener('scroll', () => {
  handleNavScroll();
  handleScrollTopVisibility();
}, { passive: true });

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ----------------------------------------------------------------
   MOBILE MENU TOGGLE
   ---------------------------------------------------------------- */
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  const icon = document.getElementById('menuIcon');
  menu.classList.toggle('open');
  icon.className = menu.classList.contains('open')
    ? 'fa-solid fa-xmark text-xl'
    : 'fa-solid fa-bars text-xl';
}

/* ----------------------------------------------------------------
   SMOOTH ANCHOR SCROLL — accounts for fixed navbar height (80px)
   ---------------------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const NAVBAR_OFFSET = 80;
    window.scrollTo({
      top: target.offsetTop - NAVBAR_OFFSET,
      behavior: 'smooth',
    });
  });
});

/* ----------------------------------------------------------------
   INTERSECTION OBSERVER — scroll-reveal animations
   Classes: .reveal | .reveal-left | .reveal-right
   ---------------------------------------------------------------- */
const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px',
};

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const delayMs = parseFloat(entry.target.style.transitionDelay || 0) * 1000;
      setTimeout(() => entry.target.classList.add('visible'), delayMs);
      scrollObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

document
  .querySelectorAll('.reveal, .reveal-left, .reveal-right')
  .forEach(el => scrollObserver.observe(el));

/* ----------------------------------------------------------------
   NOTIFICATION TOAST
   type: 'success' | 'error'
   ---------------------------------------------------------------- */
function showNotify(type, message) {
  const el = document.getElementById('notify');
  el.className = `notify ${type}`;
  el.innerHTML = message;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 5000);
}

/* ----------------------------------------------------------------
   CONTACT FORM — EmailJS submission
   Sends to: primeharvest@gmail.com
   ---------------------------------------------------------------- */
document.getElementById('contactForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const btn     = document.getElementById('submitBtn');
  const btnText = document.getElementById('btnText');
  const btnIcon = btn.querySelector('i');

  // --- Loading state ---
  btn.disabled      = true;
  btn.style.opacity = '0.75';
  btnText.textContent = 'Sending…';
  btnIcon.className   = 'fa-solid fa-spinner fa-spin';

  const templateParams = {
    from_name:  document.getElementById('name').value.trim(),
    from_email: document.getElementById('email').value.trim(),
    phone:      document.getElementById('phone').value.trim() || 'Not provided',
    subject:    document.getElementById('subject').value.trim(),
    message:    document.getElementById('message').value.trim(),
    to_email:   'hello@primeharvestlanka.lk',
  };

  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
    showNotify('success', '✅ Message sent successfully! We\'ll get back to you soon.');
    this.reset();
  } catch (err) {
    console.error('EmailJS error:', err);
    showNotify('error', '❌ Failed to send message. Please call us directly at +94 775 950 050.');
  } finally {
    // --- Restore button ---
    btn.disabled        = false;
    btn.style.opacity   = '1';
    btnText.textContent = 'Send Message';
    btnIcon.className   = 'fa-solid fa-paper-plane';
  }
});
