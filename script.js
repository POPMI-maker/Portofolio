const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const progressBar = document.querySelector(".scroll-progress span");
const typewriter = document.querySelector(".typewriter");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  });
});

document.querySelector("#year").textContent = new Date().getFullYear();

if (!reducedMotion) {
  const introCopy = document.querySelector(".typing-copy");
  if (introCopy) {
    const fullCopy = introCopy.textContent;
    const description = introCopy.closest(".hero-copy");
    description.style.minHeight = `${description.getBoundingClientRect().height}px`;
    introCopy.textContent = "";

    let characterIndex = 0;
    const typeIntro = () => {
      characterIndex += 1;
      introCopy.textContent = fullCopy.slice(0, characterIndex);

      if (characterIndex < fullCopy.length) {
        const punctuationPause = /[,.]/.test(fullCopy[characterIndex - 1]) ? 120 : 28;
        window.setTimeout(typeIntro, punctuationPause);
      } else {
        description.style.minHeight = "";
      }
    };

    window.setTimeout(typeIntro, 300);
  }

  const phrases = ["UI/UX design", "App development", "Data management"];
  let phraseIndex = 0;
  let characterIndex = phrases[0].length;
  let deleting = true;

  const typeNext = () => {
    const phrase = phrases[phraseIndex];
    typewriter.textContent = phrase.slice(0, characterIndex);

    if (deleting) {
      characterIndex -= 1;
      if (characterIndex < 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        characterIndex = 0;
        window.setTimeout(typeNext, 350);
        return;
      }
    } else {
      characterIndex += 1;
      if (characterIndex > phrases[phraseIndex].length) {
        deleting = true;
        window.setTimeout(typeNext, 1400);
        return;
      }
    }

    window.setTimeout(typeNext, deleting ? 45 : 85);
  };

  window.setTimeout(typeNext, 1400);
}

let scrollUpdateScheduled = false;
const updateScrollProgress = () => {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
  progressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
  scrollUpdateScheduled = false;
};

window.addEventListener("scroll", () => {
  if (!scrollUpdateScheduled) {
    scrollUpdateScheduled = true;
    window.requestAnimationFrame(updateScrollProgress);
  }
}, { passive: true });
window.addEventListener("resize", updateScrollProgress);
updateScrollProgress();

if ("IntersectionObserver" in window) {
  const sectionLinks = new Map(
    [...navLinks.querySelectorAll('a[href^="#"]')].map((link) => [link.hash.slice(1), link])
  );
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        sectionLinks.forEach((link) => link.removeAttribute("aria-current"));
        const activeLink = sectionLinks.get(entry.target.id);
        if (activeLink) activeLink.setAttribute("aria-current", "location");
      }
    });
  }, { rootMargin: "-25% 0px -65% 0px" });
  sectionLinks.forEach((link, id) => {
    const section = document.getElementById(id);
    if (section) sectionObserver.observe(section);
  });
}

const revealItems = document.querySelectorAll(".reveal, [data-reveal]");
if ("IntersectionObserver" in window && !reducedMotion) {
  const revealObserver = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -24px 0px" });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
