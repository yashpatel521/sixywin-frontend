// Simple share modal to prevent external script errors
(function () {
  "use strict";

  // Check if elements exist before adding event listeners
  function safeAddEventListener(selector, event, handler) {
    const element = document.querySelector(selector);
    if (element) {
      element.addEventListener(event, handler);
    }
  }

  // Initialize share modal functionality
  function initShareModal() {
    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initShareModal);
      return;
    }

    // Add event listeners safely
    safeAddEventListener(".share-button", "click", function (e) {
      e.preventDefault();
      // Handle share functionality
      console.log("Share button clicked");
    });

    safeAddEventListener(".share-modal-close", "click", function (e) {
      e.preventDefault();
      // Handle modal close
      const modal = document.querySelector(".share-modal");
      if (modal) {
        modal.style.display = "none";
      }
    });
  }

  // Initialize with delay to ensure DOM is ready
  setTimeout(initShareModal, 100);
})();
