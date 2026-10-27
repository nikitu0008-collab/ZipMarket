/* ============================================================
    NikiZip.dev — сайт услуг
    Простые UI-взаимодействия, без зависимостей
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- граница навигации при скролле ---------- */
  const nav = document.getElementById("nav");
  const onScroll = () => nav?.classList.toggle("is-scrolled", window.scrollY > 12);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- мобильное меню ---------- */
  const burger = document.getElementById("navBurger");
  const links = document.querySelector(".nav__links");

  const closeMenu = () => {
    links?.classList.remove("is-open");
    burger?.classList.remove("is-open");
    burger?.setAttribute("aria-expanded", "false");
  };

  burger?.addEventListener("click", () => {
    const open = links?.classList.toggle("is-open");
    burger.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(!!open));
  });

  links?.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  /* ---------- появление секций при скролле ---------- */
  const revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- подсветка активного пункта меню ---------- */
  const sections = Array.from(document.querySelectorAll("section[id]"));
  const navLinks = Array.from(document.querySelectorAll(".nav__links a"));

  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          navLinks.forEach((a) => {
            a.style.color = a.getAttribute("href") === `#${id}` ? "var(--text)" : "";
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- пасхалка в подвале ---------- */
  const secretBtn = document.getElementById("secretBtn");
  const secretPanel = document.getElementById("secretPanel");

  const LABEL_CLOSED = "🤫 здесь спрятан секрет";
  const LABEL_OPENED = "🙈 убрать";

  secretBtn?.addEventListener("click", () => {
    if (!secretPanel) return;

    const isHidden = secretPanel.hasAttribute("hidden");

    if (isHidden) {
      secretPanel.removeAttribute("hidden");
      secretBtn.setAttribute("aria-expanded", "true");
      secretBtn.textContent = LABEL_OPENED;
    } else {
        secretPanel.setAttribute("hidden", "");
        secretBtn.setAttribute("aria-expanded", "false");
        secretBtn.textContent = LABEL_CLOSED;
    }
});

  /* ---------- год в подвале ---------- */
    const year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();
});