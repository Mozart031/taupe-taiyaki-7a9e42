const firebaseConfig = {
  apiKey: "AIzaSyBLglzupI41PY6W7VJ5c_-EQ_vbbVDBbf0",
  authDomain: "fynx-f09d8.firebaseapp.com",
  projectId: "fynx-f09d8",
  storageBucket: "fynx-f09d8.firebasestorage.app",
  messagingSenderId: "184364852664",
  appId: "1:184364852664:android:3c67cf6da748f0e8291b4d"
};

// Initialize Firebase using compat syntax
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', () => {
  // Animaciones de scroll
  const faders = document.querySelectorAll('.fade-in');
  const appearOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };

  const appearOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, appearOptions);

  faders.forEach(fader => appearOnScroll.observe(fader));

  // Lógica de Captura de Leads
  const form = document.getElementById('waitlist-form');
  const emailInput = document.getElementById('waitlist-email');
  const btn = document.getElementById('waitlist-btn');
  const msg = document.getElementById('waitlist-message');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();
      if (!email) return;

      btn.disabled = true;
      btn.textContent = "Guardando...";
      msg.textContent = "";
      msg.className = "waitlist-message";

      try {
        await db.collection("waitlist_leads").add({
          email: email,
          timestamp: new Date().toISOString()
        });
        
        emailInput.value = "";
        msg.textContent = "¡Gracias por unirte! Te notificaremos pronto.";
        msg.classList.add("success");
      } catch (error) {
        console.error("Error saving lead: ", error);
        msg.textContent = "Hubo un error al guardar tu correo. Intenta de nuevo.";
        msg.classList.add("error");
      } finally {
        btn.disabled = false;
        btn.textContent = "Unirme a la lista VIP";
      }
    });
  }
});
