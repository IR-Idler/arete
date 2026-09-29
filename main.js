// Arete website interactions. No dependencies, no tracking.
(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Splash: plays once per browser session, then fades away.
  const splash = document.querySelector(".splash");
  if (splash) {
    if (sessionStorage.getItem("areteSplashSeen") || reduceMotion) {
      splash.remove();
    } else {
      sessionStorage.setItem("areteSplashSeen", "1");
      const hide = () => {
        splash.classList.add("hide");
        setTimeout(() => splash.remove(), 800);
      };
      setTimeout(hide, 2100);
      splash.addEventListener("click", hide);
    }
  }

  // Fade sections in as they scroll into view.
  const revealed = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealed.forEach((el) => observer.observe(el));
  } else {
    revealed.forEach((el) => el.classList.add("in"));
  }

  // Screenshot coverflow. One continuous "focus" position (0 = first phone) drives every
  // phone's transform. On desktop it eases toward the pointer; on narrow screens it follows
  // the native horizontal scroll. Nothing uses :hover, so nothing flickers between phones.
  const gallery = document.querySelector(".gallery");
  if (gallery) {
    const phones = Array.from(gallery.querySelectorAll(".phone"));
    const rest = (phones.length - 1) / 2;
    const narrow = window.matchMedia("(max-width: 960px)");
    let focus = rest;
    let target = rest;
    let frame = null;
    let last = 0;

    const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

    const render = () => {
      const compact = narrow.matches;
      phones.forEach((phone, i) => {
        const d = i - focus;
        const ad = Math.min(Math.abs(d), 2.5);
        const near = Math.max(0, 1 - ad);
        const rotate = compact ? clamp(-d * 12, -24, 24) : clamp(-d * 16, -32, 32);
        const depth = compact ? -ad * 40 : -ad * 80;
        const lift = compact ? 0 : -22 * near;
        const scale = compact ? 1 - Math.min(ad, 1.5) * 0.1 : 1.06 - ad * 0.07;
        phone.style.transform =
          `translate3d(0, ${lift.toFixed(2)}px, ${depth.toFixed(2)}px) rotateY(${rotate.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
        phone.style.zIndex = String(100 - Math.round(ad * 10));
        phone.style.setProperty("--focus", near.toFixed(3));
      });
    };

    // Frame-rate independent easing, so it feels the same at 60 Hz and 120 Hz.
    const step = (now) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      focus += (target - focus) * (1 - Math.exp(-dt * 8));
      if (Math.abs(target - focus) < 0.0005) focus = target;
      render();
      if (focus !== target) {
        frame = requestAnimationFrame(step);
      } else {
        frame = null;
        last = 0;
      }
    };

    const animateTo = (value) => {
      target = clamp(value, 0, phones.length - 1);
      if (reduceMotion) {
        focus = target;
        render();
      } else if (!frame) {
        frame = requestAnimationFrame(step);
      }
    };

    // Desktop: map the pointer's x position across the row of phones. Layout offsets are
    // used rather than bounding rects, which move with the transforms and would wobble.
    const pointerFocus = (clientX) => {
      const x = clientX - gallery.getBoundingClientRect().left + gallery.scrollLeft;
      const first = phones[0];
      const lastPhone = phones[phones.length - 1];
      const start = first.offsetLeft + first.offsetWidth / 2;
      const end = lastPhone.offsetLeft + lastPhone.offsetWidth / 2;
      return ((x - start) / (end - start)) * (phones.length - 1);
    };

    gallery.addEventListener("pointermove", (event) => {
      if (narrow.matches || event.pointerType === "touch") return;
      animateTo(pointerFocus(event.clientX));
    });
    gallery.addEventListener("pointerleave", () => {
      if (!narrow.matches) animateTo(rest);
    });

    // Narrow screens: the scroll position is the focus. Read it once per frame.
    let scrollQueued = false;
    const scrollFocus = () => {
      const center = gallery.scrollLeft + gallery.clientWidth / 2;
      const pitch = phones[1].offsetLeft - phones[0].offsetLeft;
      const firstCenter = phones[0].offsetLeft + phones[0].offsetWidth / 2;
      return (center - firstCenter) / pitch;
    };
    gallery.addEventListener("scroll", () => {
      if (!narrow.matches || scrollQueued) return;
      scrollQueued = true;
      requestAnimationFrame(() => {
        scrollQueued = false;
        focus = target = clamp(scrollFocus(), 0, phones.length - 1);
        render();
      });
    }, { passive: true });

    // Tapping a phone brings it to the middle.
    phones.forEach((phone, i) => {
      phone.addEventListener("click", () => {
        if (narrow.matches) {
          const left = phone.offsetLeft + phone.offsetWidth / 2 - gallery.clientWidth / 2;
          gallery.scrollTo({ left, behavior: reduceMotion ? "auto" : "smooth" });
        } else {
          animateTo(i);
        }
      });
    });

    const layout = () => {
      if (narrow.matches) {
        // Start centred on the middle screenshot.
        const middle = phones[Math.round(rest)];
        gallery.scrollLeft = middle.offsetLeft + middle.offsetWidth / 2 - gallery.clientWidth / 2;
        focus = target = clamp(scrollFocus(), 0, phones.length - 1);
      } else {
        focus = target = rest;
      }
      render();
    };
    narrow.addEventListener("change", layout);
    layout();
  }

  // Footer year.
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();
