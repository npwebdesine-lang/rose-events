// =========================
// Year
// =========================
(() => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

// =========================
// To top button
// =========================
(() => {
  const btn = document.querySelector(".to-top");
  if (!btn) return;

  const onScroll = () => {
    btn.classList.toggle("is-visible", window.scrollY > 600);
  };

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
})();

// =========================
// Reveal on scroll
// =========================
(() => {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("is-visible");
      });
    },
    { threshold: 0.12 }
  );

  items.forEach((el) => io.observe(el));
})();

// =========================
// Lightbox
// =========================
(() => {
  const lb = document.querySelector(".lightbox");
  const lbImg = document.querySelector(".lightbox__img");
  const closeBtn = document.querySelector(".lightbox__close");
  const triggers = document.querySelectorAll(".js-lightbox");

  if (!lb || !lbImg || !closeBtn || !triggers.length) return;

  const open = (src, alt) => {
    lb.classList.add("is-open");
    lbImg.src = src;
    lbImg.alt = alt || "תמונה מוגדלת";
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    lb.classList.remove("is-open");
    lbImg.src = "";
    document.body.style.overflow = "";
  };

  triggers.forEach((img) => {
    img.addEventListener("click", () => open(img.src, img.alt));
  });

  closeBtn.addEventListener("click", close);
  lb.addEventListener("click", (e) => {
    if (e.target === lb) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
})();

// =========================
// FIX ALL JUMPS + correct offset under sticky nav
// =========================
(() => {
  const nav = document.querySelector(".dotnav");
  if (!nav) return;

  const getOffset = () => {
    const navH = nav.getBoundingClientRect().height || 0;
    const gap = 14; // מרווח קטן מתחת ל-nav
    return navH + gap;
  };

  const applyCssOffset = () => {
    const offset = getOffset();
    document.documentElement.style.setProperty(
      "--anchor-offset",
      `${offset}px`
    );
  };

  const scrollToTarget = (target) => {
    if (!target) return;

    applyCssOffset();
    const offset = getOffset();

    const y = target.getBoundingClientRect().top + window.pageYOffset - offset;

    window.scrollTo({
      top: Math.max(0, Math.round(y)),
      behavior: "smooth",
    });
  };

  applyCssOffset();
  window.addEventListener("resize", applyCssOffset);

  // intercept hash clicks
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

    // force update after click
    setTimeout(() => window.dispatchEvent(new Event("scroll")), 50);
    setTimeout(() => window.dispatchEvent(new Event("scroll")), 200);
    setTimeout(() => window.dispatchEvent(new Event("scroll")), 450);
  });

  // load with hash
  window.addEventListener("load", () => {
    if (location.hash && location.hash.length > 1) {
      const id = location.hash.slice(1);
      const target = document.getElementById(id);
      if (target) setTimeout(() => scrollToTarget(target), 0);
    }
  });

  // back/forward
  window.addEventListener("popstate", () => {
    if (location.hash && location.hash.length > 1) {
      const id = location.hash.slice(1);
      const target = document.getElementById(id);
      if (target) scrollToTarget(target);
    }
  });
})();

// =========================
// DotNav Active (correct for ALL sections + bottom of page => contact)
// =========================
(() => {
  const nav = document.querySelector(".dotnav");
  const links = Array.from(document.querySelectorAll(".dotnav__item"));
  if (!nav || !links.length) return;

  const getOffsetLine = () => {
    const navH = nav.getBoundingClientRect().height || 0;
    return navH + 18;
  };

  const targets = links
    .map((a) => {
      const id = (a.getAttribute("href") || "").replace("#", "");
      const el = document.getElementById(id);
      return el ? { id, el } : null;
    })
    .filter(Boolean);

  const setActive = (id) => {
    links.forEach((a) => {
      const hrefId = (a.getAttribute("href") || "").replace("#", "");
      a.classList.toggle("is-active", hrefId === id);
    });
  };

  const update = () => {
    // bottom => contact
    const nearBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 6;

    if (nearBottom) {
      setActive("contact");
      return;
    }

    // top => top
    if (window.scrollY < 10) {
      setActive("top");
      return;
    }

    const line = getOffsetLine();
    let current = "top";

    for (const t of targets) {
      const r = t.el.getBoundingClientRect();
      if (r.top <= line) current = t.id;
    }

    setActive(current);
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      update();
      ticking = false;
    });
  };

  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", update);
})();
