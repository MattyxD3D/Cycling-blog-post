document.addEventListener("DOMContentLoaded", () => {
  // Handle video card clicks
  const videoCards = document.querySelectorAll(".video-card");

  videoCards.forEach((card) => {
    card.addEventListener("click", () => {
      // In a real implementation, this would load the selected video
      // and update the featured video section
      console.log("Video card clicked");
    });
  });

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });

  // Intersection Observer for scroll animations
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements for animations
  const animatedElements = document.querySelectorAll(
    ".video-container, .video-card, .route-details, .series-description"
  );
  animatedElements.forEach((element) => {
    observer.observe(element);
  });

  // Parallax effect for hero section
  const hero = document.querySelector(".hero");
  if (hero) {
    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset;
      hero.style.backgroundPositionY = -(scrolled * 0.5) + "px";
    });
  }

  // Add animation classes to elements
  const addAnimationClasses = () => {
    const elements = document.querySelectorAll(".animate");
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add("fade-in-up");
      }, index * 200);
    });
  };

  // Initial animation
  addAnimationClasses();
});
