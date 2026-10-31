/* NikiZip.dev — каталог, навигация и заявки */
document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("nav");
  const burger = document.getElementById("navBurger");
  const links = document.getElementById("navLinks");

  const updateNav = () => nav?.classList.toggle("is-scrolled", window.scrollY > 12);
  updateNav();
  window.addEventListener("scroll", updateNav, { passive: true });

  const closeMenu = () => {
    links?.classList.remove("is-open");
    burger?.classList.remove("is-open");
    burger?.setAttribute("aria-expanded", "false");
    burger?.setAttribute("aria-label", "Открыть меню");
  };
  burger?.addEventListener("click", () => {
    const isOpen = links?.classList.toggle("is-open") ?? false;
    burger.classList.toggle("is-open", isOpen);
    burger.setAttribute("aria-expanded", String(isOpen));
    burger.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
  });
  links?.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") { closeMenu(); }
  });

  // Плавное появление блоков. При отключённой поддержке observer контент остаётся видимым.
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -25px 0px" });
    revealItems.forEach(item => revealObserver.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("is-visible"));
  }

  // Каталог: фильтр по категории + поиск по тексту.
  const cards = [...document.querySelectorAll(".service")];
  const filters = [...document.querySelectorAll(".filter")];
  const search = document.getElementById("serviceSearch");
  const count = document.getElementById("serviceCount");
  const empty = document.getElementById("emptyState");
  let activeCategory = "all";

  const updateCatalog = () => {
    const query = (search?.value || "").trim().toLocaleLowerCase("ru");
    let visible = 0;
    cards.forEach(card => {
      const categoryMatch = activeCategory === "all" || card.dataset.category === activeCategory;
      const text = `${card.dataset.search || ""} ${card.textContent || ""}`.toLocaleLowerCase("ru");
      const searchMatch = !query || text.includes(query);
      const show = categoryMatch && searchMatch;
      card.hidden = !show;
      if (show) { visible++; }
    });
    if (count) { count.textContent = String(visible); }
    if (empty) { empty.hidden = visible !== 0; }
  };
  filters.forEach(button => button.addEventListener("click", () => {
    activeCategory = button.dataset.filter || "all";
    filters.forEach(item => item.classList.toggle("is-active", item === button));
    updateCatalog();
  }));
  search?.addEventListener("input", updateCatalog);
  updateCatalog();

  // Заполнение формы выбранной карточкой.
  const serviceSelect = document.getElementById("orderService");
  document.querySelectorAll(".order-service").forEach(button => {
    button.addEventListener("click", () => {
      const serviceName = button.dataset.service || "";
      if (serviceSelect) {
        const matchingOption = [...serviceSelect.options].find(option =>
          option.value === serviceName || option.textContent.trim() === serviceName
        );
        if (matchingOption) serviceSelect.value = matchingOption.value;
        else serviceSelect.value = "Другая задача";
      }
      document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });
      window.setTimeout(() => serviceSelect?.focus(), 450);
    });
  });

  // Форма только готовит текст и открывает Telegram — ничего не отправляет автоматически.
  const form = document.getElementById("orderForm");
  const formError = document.getElementById("formError");
  form?.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const service = String(data.get("service") || "").trim();
    const budget = String(data.get("budget") || "Не определён").trim();
    const details = String(data.get("details") || "").trim();

    if (!service || !details) {
      if (formError) { formError.hidden = false; }
      (!service ? serviceSelect : form.elements.details)?.focus();
      return;
    }
    if (formError) { formError.hidden = true; }

    const messageArray = [
      `Здравс твуйте! Хочу обсудить заказ.\n`,
      name ? `Имя: ${name}\n` : "",
      `Услуга: ${service}\n`,
      `Бюджет: ${budget}\n`,
      `Описание: ${details}\n`
    ];

    const message = messageArray.join(''); 

    const telegramAppUrl = `tg://resolve?domain=NikiZ1p&text=${encodeURIComponent(message)}`;
    const telegramWebUrl = 'https://t.me/NikiZ1p';
    
    const opened = window.open(telegramAppUrl, "_blank", "noopener,noreferrer");

    if (!opened) {
      try { navigator.clipboard?.writeText(message).catch(() => {}); } catch (_) {}
      window.open(telegramWebUrl, "_blank", "noopener,noreferrer");
    }
  });

  // Пасхалка.
  const secretBtn = document.getElementById("secretBtn");
  const secretPanel = document.getElementById("secretPanel");
  secretBtn?.addEventListener("click", () => {
    if (!secretPanel) return;
    const willOpen = secretPanel.hidden;
    secretPanel.hidden = !willOpen;
    secretBtn.setAttribute("aria-expanded", String(willOpen));
    secretBtn.textContent = willOpen ? "🙈 убрать" : "🤫 здесь спрятан секрет";
  });

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
});