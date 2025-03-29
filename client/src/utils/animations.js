// src/utils/animations.js
// Utility functions for animations and toast notifications

/**
 * Show a toast notification
 * @param {Object} options - Toast options
 * @param {string} options.message - Notification message
 * @param {string} options.type - Notification type ('success', 'error', 'warning', 'info')
 * @param {number} options.duration - Duration in milliseconds
 * @param {Function} options.onClose - Callback when toast closes
 */
export const showToast = (options) => {
  const { message, type = 'info', duration = 3000, onClose } = options;
  
  // Check if toast container exists, create if not
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'fixed top-4 right-4 z-50 flex flex-col space-y-2';
    document.body.appendChild(toastContainer);
  }
  
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `transform transition-all duration-300 ease-in-out translate-x-full opacity-0 flex items-center p-4 rounded-lg shadow-lg max-w-md ${getToastColorClass(type)}`;
  
  // Toast content
  toast.innerHTML = `
    <div class="flex-shrink-0 mr-3">
      ${getToastIcon(type)}
    </div>
    <div class="flex-1">
      <p class="text-sm font-medium">${message}</p>
    </div>
    <button class="ml-4 focus:outline-none opacity-70 hover:opacity-100" aria-label="Close">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>
  `;
  
  // Add to container
  toastContainer.appendChild(toast);
  
  // Add click listener to close button
  const closeButton = toast.querySelector('button');
  closeButton.addEventListener('click', () => {
    removeToast(toast);
  });
  
  // Animate in
  setTimeout(() => {
    toast.classList.remove('translate-x-full', 'opacity-0');
  }, 10);
  
  // Auto-remove after duration
  const timeoutId = setTimeout(() => {
    removeToast(toast);
  }, duration);
  
  // Store timeout ID for potential early removal
  toast._timeoutId = timeoutId;
  
  // Function to remove toast
  function removeToast(toastElement) {
    clearTimeout(toastElement._timeoutId);
    
    // Animate out
    toastElement.classList.add('translate-x-full', 'opacity-0');
    
    // Remove from DOM after animation
    setTimeout(() => {
      if (toastElement.parentNode) {
        toastElement.parentNode.removeChild(toastElement);
      }
      if (onClose) onClose();
      
      // Remove container if empty
      if (toastContainer.children.length === 0) {
        document.body.removeChild(toastContainer);
      }
    }, 300);
  }
};

/**
 * Get color class for toast type
 * @param {string} type - Toast type
 * @returns {string} CSS class
 */
function getToastColorClass(type) {
  switch (type) {
    case 'success':
      return 'bg-green-500 text-white';
    case 'error':
      return 'bg-red-500 text-white';
    case 'warning':
      return 'bg-yellow-500 text-white';
    case 'info':
    default:
      return 'bg-blue-500 text-white';
  }
}

/**
 * Get icon SVG for toast type
 * @param {string} type - Toast type
 * @returns {string} SVG markup
 */
function getToastIcon(type) {
  switch (type) {
    case 'success':
      return `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>`;
    case 'error':
      return `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>`;
    case 'warning':
      return `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
      </svg>`;
    case 'info':
    default:
      return `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>`;
  }
}

/**
 * Create a slide-in animation
 * @param {HTMLElement} element - Element to animate
 * @param {string} direction - Direction ('left', 'right', 'top', 'bottom')
 * @param {number} duration - Animation duration in ms
 * @param {Function} callback - Callback after animation
 */
export const slideIn = (element, direction = 'right', duration = 300, callback) => {
  if (!element) return;
  
  // Set initial position
  const initialTransform = {
    left: 'translateX(-100%)',
    right: 'translateX(100%)',
    top: 'translateY(-100%)',
    bottom: 'translateY(100%)'
  }[direction] || 'translateX(100%)';
  
  // Apply initial styles
  element.style.transform = initialTransform;
  element.style.opacity = '0';
  element.style.transition = `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`;
  
  // Force reflow
  void element.offsetWidth;
  
  // Animate in
  setTimeout(() => {
    element.style.transform = 'translate(0)';
    element.style.opacity = '1';
    
    // Callback after animation
    if (callback) {
      setTimeout(callback, duration);
    }
  }, 10);
};

/**
 * Create a slide-out animation
 * @param {HTMLElement} element - Element to animate
 * @param {string} direction - Direction ('left', 'right', 'top', 'bottom')
 * @param {number} duration - Animation duration in ms
 * @param {Function} callback - Callback after animation
 */
export const slideOut = (element, direction = 'right', duration = 300, callback) => {
  if (!element) return;
  
  // Set final position
  const finalTransform = {
    left: 'translateX(-100%)',
    right: 'translateX(100%)',
    top: 'translateY(-100%)',
    bottom: 'translateY(100%)'
  }[direction] || 'translateX(100%)';
  
  // Apply transition
  element.style.transition = `transform ${duration}ms ease-in, opacity ${duration}ms ease-in`;
  
  // Animate out
  element.style.transform = finalTransform;
  element.style.opacity = '0';
  
  // Callback after animation
  if (callback) {
    setTimeout(callback, duration);
  }
};

/**
 * Fade in animation
 * @param {HTMLElement} element - Element to animate
 * @param {number} duration - Animation duration in ms
 * @param {Function} callback - Callback after animation
 */
export const fadeIn = (element, duration = 300, callback) => {
  if (!element) return;
  
  // Set initial state
  element.style.opacity = '0';
  element.style.transition = `opacity ${duration}ms ease-in`;
  
  // Force reflow
  void element.offsetWidth;
  
  // Animate in
  setTimeout(() => {
    element.style.opacity = '1';
    
    // Callback after animation
    if (callback) {
      setTimeout(callback, duration);
    }
  }, 10);
};

/**
 * Fade out animation
 * @param {HTMLElement} element - Element to animate
 * @param {number} duration - Animation duration in ms
 * @param {Function} callback - Callback after animation
 */
export const fadeOut = (element, duration = 300, callback) => {
  if (!element) return;
  
  // Set transition
  element.style.transition = `opacity ${duration}ms ease-out`;
  
  // Animate out
  element.style.opacity = '0';
  
  // Callback after animation
  if (callback) {
    setTimeout(callback, duration);
  }
};

/**
 * Scale animation (grow/shrink)
 * @param {HTMLElement} element - Element to animate
 * @param {number} startScale - Starting scale
 * @param {number} endScale - Ending scale
 * @param {number} duration - Animation duration in ms
 * @param {Function} callback - Callback after animation
 */
export const scale = (element, startScale = 0.9, endScale = 1, duration = 300, callback) => {
  if (!element) return;
  
  // Set initial scale
  element.style.transform = `scale(${startScale})`;
  element.style.transition = `transform ${duration}ms ease-out`;
  
  // Force reflow
  void element.offsetWidth;
  
  // Animate to end scale
  setTimeout(() => {
    element.style.transform = `scale(${endScale})`;
    
    // Callback after animation
    if (callback) {
      setTimeout(callback, duration);
    }
  }, 10);
};

/**
 * Pulse animation
 * @param {HTMLElement} element - Element to animate
 * @param {number} duration - Animation duration in ms
 * @param {number} intensity - Scale intensity
 * @param {number} count - Number of pulses
 */
export const pulse = (element, duration = 300, intensity = 1.05, count = 1) => {
  if (!element) return;
  
  let pulseCount = 0;
  
  function doPulse() {
    // Scale up
    element.style.transition = `transform ${duration/2}ms ease-out`;
    element.style.transform = `scale(${intensity})`;
    
    // Scale back down
    setTimeout(() => {
      element.style.transform = 'scale(1)';
      
      // Continue pulsing if needed
      if (++pulseCount < count) {
        setTimeout(doPulse, duration);
      }
    }, duration/2);
  }
  
  doPulse();
};

const animations = {
  showToast,
  slideIn,
  slideOut,
  fadeIn,
  fadeOut,
  scale,
  pulse,
};

export default animations;