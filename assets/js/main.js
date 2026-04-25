(() => {
  const toggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  const MOBILE_BREAKPOINT = 660;

  if (toggle && navLinks) {
    const setNavState = (open) => {
      navLinks.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));

      // Keep menu exposed to assistive tech on desktop, but hide when collapsed on mobile.
      const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
      navLinks.setAttribute("aria-hidden", String(isMobile ? !open : false));
    };

    setNavState(false);

    toggle.addEventListener("click", () => {
      const open = !navLinks.classList.contains("open");
      setNavState(open);
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        setNavState(false);
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && navLinks.classList.contains("open")) {
        setNavState(false);
        toggle.focus();
      }
    });

    document.addEventListener("click", (event) => {
      const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
      if (
        isMobile &&
        navLinks.classList.contains("open") &&
        !navLinks.contains(event.target) &&
        !toggle.contains(event.target)
      ) {
        setNavState(false);
      }
    });

    // Reset stale mobile nav state when resizing to desktop.
    window.addEventListener("resize", () => {
      if (window.innerWidth > MOBILE_BREAKPOINT) {
        setNavState(false);
      } else if (!navLinks.classList.contains("open")) {
        navLinks.setAttribute("aria-hidden", "true");
      }
    });
  }

  const sections = document.querySelectorAll("section[id]");
  const navAnchors = document.querySelectorAll(".nav-links a");

  if ("IntersectionObserver" in window && sections.length > 0 && navAnchors.length > 0) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navAnchors.forEach((anchor) => anchor.classList.remove("active"));
          const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
          if (active) {
            active.classList.add("active");
          }
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });

    sections.forEach((section) => navObserver.observe(section));
  }

  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("visible"));
  }
})();
