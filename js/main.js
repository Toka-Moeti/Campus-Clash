document.addEventListener("DOMContentLoaded", () => {
  const storageKeys = {
    events: "campusClashCustomEvents",
    saved: "campusClashSavedEvents",
  };

  const defaultEvents = [
    {
      id: "open-mic-clash",
      title: "Open Mic Clash",
      category: "music",
      date: "2026-08-12",
      time: "19:00",
      location: "Student Centre Main Stage",
      description:
        "Bring your voice, spoken word, poetry, or original music to the stage.",
    },
    {
      id: "faculty-five-a-side",
      title: "Faculty Five-a-Side",
      category: "sport",
      date: "2026-08-20",
      time: "14:00",
      location: "Campus Sports Grounds",
      description:
        "Represent your faculty in an afternoon of football, friendly rivalry, and support.",
    },
    {
      id: "design-sprint-showcase",
      title: "Design Sprint Showcase",
      category: "creative",
      date: "2026-08-28",
      time: "17:30",
      location: "Innovation Hub",
      description:
        "See student teams present bold ideas, prototypes, posters, and digital concepts.",
    },
    {
      id: "clash-night-finale",
      title: "Clash Night Finale",
      category: "music",
      date: "2026-09-05",
      time: "20:00",
      location: "Campus Amphitheatre",
      description:
        "A high-energy finale with DJs, dancers, performances, and creative battles.",
    },
    {
      id: "board-games-social",
      title: "Board Games Social",
      category: "social",
      date: "2026-09-11",
      time: "16:00",
      location: "Student Lounge",
      description:
        "Meet people, join a table, and take a break from lectures with classic games.",
    },
    {
      id: "street-art-session",
      title: "Street Art Session",
      category: "creative",
      date: "2026-09-18",
      time: "15:30",
      location: "Arts Courtyard",
      description:
        "A collaborative mural and visual-art session for beginners and experienced artists.",
    },
  ];

  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const siteNav = document.querySelector(".site-nav");
  const eventGrid = document.querySelector("#events-grid");
  const savedEventsContainer = document.querySelector("#saved-events");
  const searchInput = document.querySelector("#event-search");
  const filterSelect = document.querySelector("#event-filter");
  const resultsCount = document.querySelector("#results-count");
  const emptyState = document.querySelector("#empty-state");
  const savedEmptyState = document.querySelector("#saved-empty-state");
  const eventForm = document.querySelector("#event-form");
  const formMessage = document.querySelector("#form-message");
  const yearElement = document.querySelector("#current-year");

  const safeReadArray = (key) => {
    try {
      const savedValue = localStorage.getItem(key);
      const parsedValue = savedValue ? JSON.parse(savedValue) : [];
      return Array.isArray(parsedValue) ? parsedValue : [];
    } catch {
      return [];
    }
  };

  const safeWriteArray = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      if (formMessage) {
        formMessage.textContent =
          "Your browser could not save this change locally.";
      }
    }
  };

  let customEvents = safeReadArray(storageKeys.events);
  let savedEventIds = safeReadArray(storageKeys.saved).filter(
    (item) => typeof item === "string"
  );

  const getAllEvents = () => [...customEvents, ...defaultEvents];

  const escapeHtml = (value) => {
    const element = document.createElement("div");
    element.textContent = String(value);
    return element.innerHTML;
  };

  const normaliseCategory = (category) => {
    const allowedCategories = ["music", "sport", "creative", "social"];
    return allowedCategories.includes(category) ? category : "social";
  };

  const formatDate = (dateString) => {
    const date = new Date(`${dateString}T12:00:00`);

    if (Number.isNaN(date.getTime())) {
      return "Date to be confirmed";
    }

    return new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const formatTime = (timeString) => {
    if (!/^\d{2}:\d{2}$/.test(timeString)) {
      return "Time to be confirmed";
    }

    const [hours, minutes] = timeString.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    return new Intl.DateTimeFormat("en", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const isSaved = (eventId) => savedEventIds.includes(eventId);

  const eventCardTemplate = (event) => {
    const saved = isSaved(event.id);
    const safeTitle = escapeHtml(event.title);
    const safeCategory = escapeHtml(normaliseCategory(event.category));
    const safeLocation = escapeHtml(event.location);
    const safeDescription = escapeHtml(event.description);

    return `
      <article class="event-card">
        <div class="event-card-top">
          <span class="category-badge">${safeCategory}</span>
          <time class="event-date" datetime="${escapeHtml(event.date)}">
            ${formatDate(event.date)}
          </time>
        </div>

        <h3>${safeTitle}</h3>
        <p>${safeDescription}</p>

        <div class="event-meta">
          <span><strong>Time:</strong> ${formatTime(event.time)}</span>
          <span><strong>Place:</strong> ${safeLocation}</span>
        </div>

        <button
          class="button save-button ${saved ? "is-saved" : ""}"
          type="button"
          data-save-id="${escapeHtml(event.id)}"
          aria-pressed="${saved}"
        >
          ${saved ? "Saved event" : "Save event"}
        </button>
      </article>
    `;
  };

  const renderEvents = () => {
    if (!eventGrid) return;

    const searchTerm = (searchInput?.value || "").trim().toLowerCase();
    const selectedCategory = filterSelect?.value || "all";

    const filteredEvents = getAllEvents().filter((event) => {
      const searchableText = [
        event.title,
        event.category,
        event.location,
        event.description,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchableText.includes(searchTerm);
      const matchesCategory =
        selectedCategory === "all" || event.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    filteredEvents.sort((a, b) => {
      const aDate = new Date(`${a.date}T${a.time || "00:00"}`).getTime();
      const bDate = new Date(`${b.date}T${b.time || "00:00"}`).getTime();
      return aDate - bDate;
    });

    eventGrid.innerHTML = filteredEvents.map(eventCardTemplate).join("");

    if (resultsCount) {
      const count = filteredEvents.length;
      resultsCount.textContent = `${count} ${count === 1 ? "event" : "events"} found`;
    }

    if (emptyState) {
      emptyState.hidden = filteredEvents.length !== 0;
    }
  };

  const renderSavedEvents = () => {
    if (!savedEventsContainer || !savedEmptyState) return;

    const savedEvents = getAllEvents().filter((event) => isSaved(event.id));

    savedEventsContainer.innerHTML = savedEvents.map(eventCardTemplate).join("");
    savedEmptyState.hidden = savedEvents.length !== 0;
  };

  const toggleSavedEvent = (eventId) => {
    if (!eventId) return;

    if (isSaved(eventId)) {
      savedEventIds = savedEventIds.filter((id) => id !== eventId);
    } else {
      savedEventIds = [...new Set([...savedEventIds, eventId])];
    }

    safeWriteArray(storageKeys.saved, savedEventIds);
    renderEvents();
    renderSavedEvents();
  };

  const closeMenu = () => {
    if (!menuToggle || !siteNav) return;

    menuToggle.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    siteNav.classList.remove("is-open");
  };

  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  menuToggle?.addEventListener("click", () => {
    const isOpen = menuToggle.classList.toggle("is-open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );

    siteNav?.classList.toggle("is-open", isOpen);
  });

  siteNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");

      if (!href || href === "#") return;

      const target = document.querySelector(href);

      if (!target) return;

      event.preventDefault();

      const headerOffset = header ? header.offsetHeight + 14 : 14;
      const position =
        target.getBoundingClientRect().top + window.scrollY - headerOffset;

      window.scrollTo({
        top: position,
        behavior: "smooth",
      });
    });
  });

  searchInput?.addEventListener("input", renderEvents);
  filterSelect?.addEventListener("change", renderEvents);

  document.addEventListener("click", (event) => {
    const saveButton = event.target.closest("[data-save-id]");

    if (!saveButton) return;

    toggleSavedEvent(saveButton.dataset.saveId);
  });

  eventForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(eventForm);

    const title = String(formData.get("title") || "").trim();
    const category = normaliseCategory(String(formData.get("category") || ""));
    const date = String(formData.get("date") || "");
    const time = String(formData.get("time") || "");
    const location = String(formData.get("location") || "").trim();
    const description = String(formData.get("description") || "").trim();

    if (!title || !date || !time || !location || !description) {
      if (formMessage) {
        formMessage.textContent = "Complete every event field before submitting.";
      }
      return;
    }

    const newEvent = {
      id: `custom-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title: title.slice(0, 70),
      category,
      date,
      time,
      location: location.slice(0, 60),
      description: description.slice(0, 180),
    };

    customEvents = [newEvent, ...customEvents];
    safeWriteArray(storageKeys.events, customEvents);

    eventForm.reset();

    if (formMessage) {
      formMessage.textContent = `"${newEvent.title}" was added to your local calendar.`;
    }

    if (searchInput) {
      searchInput.value = "";
    }

    if (filterSelect) {
      filterSelect.value = "all";
    }

    renderEvents();
    renderSavedEvents();

    document.querySelector("#events")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });

  renderEvents();
  renderSavedEvents();
});
