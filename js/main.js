const firebaseConfig = {
  apiKey: "AIzaSyBLglzupI41PY6W7VJ5c_-EQ_vbbVDBbf0",
  authDomain: "fynx-f09d8.firebaseapp.com",
  projectId: "fynx-f09d8",
  storageBucket: "fynx-f09d8.firebasestorage.app",
  messagingSenderId: "184364852664",
  appId: "1:184364852664:android:3c67cf6da748f0e8291b4d"
};

let db;
if (typeof firebase !== 'undefined') {
  try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
  } catch (e) {
    console.error("Firebase init failed:", e);
  }
}

document.addEventListener('DOMContentLoaded', () => {

  // ── Scroll animations ──
  const faders = document.querySelectorAll('.fade-up');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  faders.forEach(el => observer.observe(el));

  // Fallback for first-visible elements
  setTimeout(() => faders.forEach(f => f.classList.add('visible')), 1200);

  // ── Nav scroll effect ──
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }, { passive: true });

  // ── Mobile hamburger menu ──
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });

    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  // ── FAQ Accordion ──
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      const answer = btn.nextElementSibling;

      // Close all
      document.querySelectorAll('.faq-question').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        b.nextElementSibling.classList.remove('open');
      });

      // Open clicked if was closed
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        answer.classList.add('open');
      }
    });
  });

  // ── Waitlist form ──
  const form = document.getElementById('waitlist-form');
  const emailInput = document.getElementById('waitlist-email');
  const btn = document.getElementById('waitlist-btn');
  const msg = document.getElementById('waitlist-message');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();
      if (!email) return;

      if (!db) {
        msg.textContent = "Error de conexión. Por favor, intenta más tarde.";
        msg.className = "waitlist-message error";
        return;
      }

      btn.disabled = true;
      btn.textContent = "Guardando...";
      msg.textContent = "";
      msg.className = "waitlist-message";

      try {
        await db.collection("waitlist_leads").add({
          email,
          timestamp: new Date().toISOString(),
          source: "ios_waitlist"
        });
        emailInput.value = "";
        msg.textContent = "¡Listo! Te notificaremos cuando llegue a iOS.";
        msg.className = "waitlist-message success";
      } catch (error) {
        console.error("Error saving lead:", error);
        msg.textContent = "Hubo un error. Intenta de nuevo.";
        msg.className = "waitlist-message error";
      } finally {
        btn.disabled = false;
        btn.textContent = "Avisarme";
      }
    });
  }

  // ── Smooth scroll for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
