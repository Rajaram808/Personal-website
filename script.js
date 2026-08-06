(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

  /* ---------- Loader ---------- */
  const loader = document.getElementById("loader");
  window.addEventListener("load", () => {
    requestAnimationFrame(() => {
      loader?.classList.add("is-done");
      setTimeout(() => loader?.remove(), 600);
    });
  });

  /* ---------- Custom cursor & glow ---------- */
  const cursor = document.getElementById("cursor");
  const glow = document.getElementById("cursor-glow");

  if (!reducedMotion && !coarsePointer && cursor && glow) {
    let x = 0;
    let y = 0;
    let gx = 0;
    let gy = 0;

    document.addEventListener("mousemove", (e) => {
      x = e.clientX;
      y = e.clientY;
      cursor.style.left = `${x}px`;
      cursor.style.top = `${y}px`;
    });

    const animateGlow = () => {
      gx += (x - gx) * 0.12;
      gy += (y - gy) * 0.12;
      glow.style.left = `${gx}px`;
      glow.style.top = `${gy}px`;
      requestAnimationFrame(animateGlow);
    };
    animateGlow();

    document.querySelectorAll("a, button, input, textarea, .glass-card").forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("is-hover"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("is-hover"));
    });
  }

  /* ---------- Scroll progress ---------- */
  const progress = document.getElementById("scroll-progress");
  const updateProgress = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const value = max > 0 ? (doc.scrollTop / max) * 100 : 0;
    if (progress) {
      progress.style.width = `${value}%`;
      progress.setAttribute("aria-valuenow", String(Math.round(value)));
    }
  };

  /* ---------- Sticky header ---------- */
  const header = document.getElementById("header");
  const backTop = document.getElementById("back-top");

  const onScroll = () => {
    const y = window.scrollY;
    header?.classList.toggle("is-scrolled", y > 24);
    backTop?.classList.toggle("is-visible", y > 500);
    updateProgress();
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  backTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  });

  /* ---------- Mobile menu ---------- */
  const menuToggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("nav");

  const setMenu = (open) => {
    menuToggle?.setAttribute("aria-expanded", String(open));
    menuToggle?.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav?.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
  };

  menuToggle?.addEventListener("click", () => {
    const open = menuToggle.getAttribute("aria-expanded") !== "true";
    setMenu(open);
  });

  nav?.querySelectorAll(".nav__link").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });

  /* ---------- Active nav link ---------- */
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav__link");

  const setActiveNav = () => {
    let current = "";
    sections.forEach((section) => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) current = section.id;
    });
    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      link.classList.toggle("is-active", href === `#${current}`);
    });
  };

  window.addEventListener("scroll", setActiveNav, { passive: true });
  setActiveNav();

  /* ---------- Typing effect ---------- */
  const typedEl = document.getElementById("typed-text");
  const phrases = ["IT Student", "Frontend Developer", "AI Video Creator"];

  if (typedEl) {
    if (reducedMotion) {
      typedEl.textContent = phrases.join(" · ");
    } else {
      let phraseIndex = 0;
      let charIndex = 0;
      let deleting = false;

      const type = () => {
        const current = phrases[phraseIndex];
        typedEl.textContent = current.slice(0, charIndex);

        if (!deleting && charIndex < current.length) {
          charIndex += 1;
          setTimeout(type, 70);
        } else if (!deleting && charIndex === current.length) {
          deleting = true;
          setTimeout(type, 1600);
        } else if (deleting && charIndex > 0) {
          charIndex -= 1;
          setTimeout(type, 40);
        } else {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(type, 400);
        }
      };

      type();
    }
  }

  /* ---------- Reveal on scroll ---------- */
  const reveals = document.querySelectorAll(".reveal");

  if (reducedMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
    );
    reveals.forEach((el) => revealObserver.observe(el));
  }

  /* ---------- Skill bars ---------- */
  const skillCards = document.querySelectorAll(".skill-card");

  if (reducedMotion || !("IntersectionObserver" in window)) {
    skillCards.forEach((card) => card.classList.add("is-animated"));
  } else {
    const skillObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-animated");
          skillObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.4 }
    );
    skillCards.forEach((card) => skillObserver.observe(card));
  }

  /* ---------- Button ripple ---------- */
  document.querySelectorAll(".ripple-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      btn.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    });
  });

  /* ---------- Contact form ---------- */
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();

    form.querySelectorAll("input, textarea").forEach((field) => {
      field.classList.remove("is-invalid");
    });

    let valid = true;
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name) {
      form.name.classList.add("is-invalid");
      valid = false;
    }
    if (!emailOk) {
      form.email.classList.add("is-invalid");
      valid = false;
    }
    if (!message) {
      form.message.classList.add("is-invalid");
      valid = false;
    }

    if (!valid) {
      if (status) status.textContent = "Please fill in all fields correctly.";
      return;
    }

    const subject = encodeURIComponent(`Portfolio message from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
    window.location.href = `mailto:rajaramlamichhane0@gmail.com?subject=${subject}&body=${body}`;

    if (status) status.textContent = "Opening your email app…";
    form.reset();
  });
})();
