// API Configuration
const API_BASE_URL = "http://localhost:3000/api";

// Fetch videos from channel
async function fetchVideos() {
  try {
    const response = await fetch(`${API_BASE_URL}/videos`);
    const videos = await response.json();
    return videos;
  } catch (error) {
    console.error("Error fetching videos:", error);
    return [];
  }
}

// Fetch video details
async function fetchVideoDetails(videoId) {
  try {
    const response = await fetch(`${API_BASE_URL}/videos/${videoId}`);
    const video = await response.json();
    return video;
  } catch (error) {
    console.error("Error fetching video details:", error);
    return null;
  }
}

// Update video grid with fetched videos
async function updateVideoGrid() {
  // Only target the "More Videos" section, not the drone section
  const videoGrid = document.querySelector("#videos .video-grid");
  if (!videoGrid) return;

  try {
    const videos = await fetchVideos();

    // Clear existing content
    videoGrid.innerHTML = "";

    // Add each video card
    videos.forEach((video) => {
      const videoCard = document.createElement("div");
      videoCard.className = "video-card animate";
      videoCard.setAttribute("data-video-id", video.id);

      videoCard.innerHTML = `
        <div class="video-thumbnail">
          <img src="${video.thumbnail}" alt="${video.title}" />
          <div class="play-button">
            <i class="fas fa-play"></i>
          </div>
        </div>
        <h3>${video.title}</h3>
        <p>${video.description.substring(0, 100)}...</p>
        <div class="video-meta">
          <span><i class="fas fa-calendar"></i> ${new Date(
            video.publishedAt
          ).toLocaleDateString()}</span>
        </div>
      `;

      videoGrid.appendChild(videoCard);
    });

    // Add click events to all video cards (including drone section)
    const videoCards = document.querySelectorAll(".video-card");
    videoCards.forEach((card) => {
      card.addEventListener("click", () => {
        const videoId = card.getAttribute("data-video-id");
        openVideoModal(videoId);
      });
    });
  } catch (error) {
    console.error("Error updating video grid:", error);
  }
}

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

  // Modal Video Player functionality
  const modal = document.querySelector(".modal");
  const modalContent = document.querySelector(".modal-content");
  const closeModal = document.querySelector(".close-modal");
  const videoPlayer = document.querySelector("#modalVideo");

  // Function to open modal and play video
  function openVideoModal(videoId) {
    const videoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    videoPlayer.src = videoUrl;
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
  }

  // Function to close modal
  function closeVideoModal() {
    modal.classList.remove("show");
    videoPlayer.src = "";
    document.body.style.overflow = "";
  }

  // Fetch and display videos
  updateVideoGrid();

  // Close modal when clicking the close button
  closeModal.addEventListener("click", closeVideoModal);

  // Close modal when clicking outside the video
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeVideoModal();
    }
  });

  // Close modal when pressing Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("show")) {
      closeVideoModal();
    }
  });

  // Refresh videos every 5 minutes
  setInterval(updateVideoGrid, 5 * 60 * 1000);
});
