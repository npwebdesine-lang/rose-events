// =========================
// Year
// =========================
(() => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

// =========================
// To top (topnav button)
// =========================
(() => {
  const btn = document.querySelector(".topnav__totop");
  if (!btn) return;

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();

// =========================
// Smooth anchors
// =========================
(() => {
  const scrollToTarget = (target) => {
    const y = target.getBoundingClientRect().top + window.pageYOffset - 80;
    window.scrollTo({ top: Math.max(0, Math.round(y)), behavior: "smooth" });
  };

  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;

    const href = a.getAttribute("href");
    if (!href || href === "#") return;

    const id = href.slice(1);
    const target = document.getElementById(id);
    if (!target) return;

    e.preventDefault();
    history.pushState(null, "", href);
    scrollToTarget(target);
  });
})();

// =========================
// Carousels (works + about)
// =========================
(() => {
  const carousels = document.querySelectorAll("[data-carousel]");
  if (!carousels.length) return;

  const init = (root) => {
    const track = root.querySelector(".carousel__track");
    const slides = Array.from(track?.children || []);
    const prev = root.querySelector(".carousel__btn--prev");
    const next = root.querySelector(".carousel__btn--next");
    const dotsWrap = root.querySelector(".carousel__dots");
    if (!track || !slides.length || !prev || !next || !dotsWrap) return;

    // אם יש רק תמונה אחת – מסתירים כפתורי ניווט ונקודות
    const single = slides.length === 1;
    if (single) {
      prev.style.display = "none";
      next.style.display = "none";
      dotsWrap.style.display = "none";
      return;
    }

    let index = 0;

    dotsWrap.innerHTML = "";
    const dots = slides.map((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "carousel__dot" + (i === 0 ? " is-active" : "");
      b.setAttribute("aria-label", `לתמונה ${i + 1}`);
      b.addEventListener("click", () => go(i));
      dotsWrap.appendChild(b);
      return b;
    });

    const update = () => {
      // ב-RTL זה נוח יותר להזיז חיובי
      track.style.transform = `translateX(${index * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle("is-active", i === index));
    };

    const clamp = (n) => Math.max(0, Math.min(slides.length - 1, n));
    const go = (i) => {
      index = clamp(i);
      update();
    };

    prev.addEventListener("click", () => go(index - 1));
    next.addEventListener("click", () => go(index + 1));

    // swipe
    let startX = 0;
    let isDown = false;

    root.addEventListener("pointerdown", (e) => {
      isDown = true;
      startX = e.clientX;
    });

    root.addEventListener("pointerup", (e) => {
      if (!isDown) return;
      isDown = false;

      const dx = e.clientX - startX;
      if (Math.abs(dx) < 40) return;

      if (dx > 0) go(index - 1);
      else go(index + 1);
    });

    root.addEventListener("pointercancel", () => (isDown = false));

    update();
  };

  carousels.forEach(init);
})();

// =========================
// Match height: "בוא נכיר" - גובה הקרוסלה = גובה הטקסט
// (רק בדסקטופ)
(() => {
  const root = document.querySelector("[data-match-height]");
  if (!root) return;

  const selector = root.getAttribute("data-match-height");
  const target = document.querySelector(selector);
  if (!target) return;

  const apply = () => {
    // אם המסך קטן, לא מכריחים גובה
    if (window.matchMedia("(max-width: 980px)").matches) {
      root.style.height = "";
      return;
    }

    const h = target.getBoundingClientRect().height;
    if (h > 0) {
      root.style.height = `${Math.round(h)}px`;
      // גם התמונות יתאימו
      const imgs = root.querySelectorAll("img");
      imgs.forEach((img) => (img.style.height = "100%"));
    }
  };

  apply();
  window.addEventListener("resize", apply);
})();
