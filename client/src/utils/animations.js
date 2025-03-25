// animations.js - UI animation utilities for CompounDefi

/**
 * Creates a matrix animation for the background of the application
 * @param {HTMLCanvasElement} canvas - Canvas element to draw on
 * @param {Object} options - Configuration options for the animation
 * @returns {Object} Animation control functions
 */
export const createMatrixAnimation = (canvas, options = {}) => {
  if (!canvas) {
    console.error('No canvas element provided for matrix animation');
    return null;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('Could not get 2D context from canvas');
    return null;
  }

  // Default configuration
  const config = {
    fontSize: options.fontSize || 14,
    color: options.color || '#0f0',
    backgroundColor: options.backgroundColor || 'rgba(0, 0, 0, 0.05)',
    characters: options.characters || '01',
    density: options.density || 0.05,
    speed: options.speed || 1,
    paused: false
  };

  // Set canvas size to match its display size
  const resizeCanvas = () => {
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;
  };
  resizeCanvas();

  // Character drops
  const drops = [];
  const initDrops = () => {
    const columns = Math.floor(canvas.width / config.fontSize);
    drops.length = 0;
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -canvas.height;
    }
  };
  initDrops();

  // Animation frame handler
  let animationId = null;
  const draw = () => {
    if (config.paused) {
      animationId = requestAnimationFrame(draw);
      return;
    }

    // Semi-transparent black to create fade effect
    ctx.fillStyle = config.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set text properties
    ctx.fillStyle = config.color;
    ctx.font = `${config.fontSize}px monospace`;

    // Draw characters
    for (let i = 0; i < drops.length; i++) {
      // Random character
      const char = config.characters.charAt(Math.floor(Math.random() * config.characters.length));
      
      // Draw if within canvas and randomly based on density
      if (drops[i] > 0 && Math.random() < config.density) {
        const x = i * config.fontSize;
        const y = drops[i];
        ctx.fillText(char, x, y);
      }
      
      // Move drop down
      drops[i] += config.fontSize * config.speed;
      
      // Reset drop to top when it reaches bottom
      if (drops[i] > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
    }

    animationId = requestAnimationFrame(draw);
  };

  // Start animation
  const start = () => {
    if (animationId === null) {
      config.paused = false;
      animationId = requestAnimationFrame(draw);
    }
  };

  // Stop animation
  const stop = () => {
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  };

  // Pause animation
  const pause = () => {
    config.paused = true;
  };

  // Resume animation
  const resume = () => {
    config.paused = false;
  };

  // Handle window resize
  window.addEventListener('resize', () => {
    resizeCanvas();
    initDrops();
  });

  // Initialize animation
  start();

  // Return control functions
  return {
    start,
    stop,
    pause,
    resume,
    updateConfig: (newConfig) => {
      Object.assign(config, newConfig);
    }
  };
};

/**
 * Animate a number counting up or down
 * @param {HTMLElement} element - DOM element to update
 * @param {number} start - Starting value
 * @param {number} end - Ending value
 * @param {Object} options - Configuration options
 * @returns {Promise} Promise that resolves when animation completes
 */
export const animateCounter = (element, start, end, options = {}) => {
  if (!element) {
    console.error('No element provided for counter animation');
    return Promise.reject('No element provided');
  }

  const config = {
    duration: options.duration || 1000,
    decimals: options.decimals || 0,
    prefix: options.prefix || '',
    suffix: options.suffix || '',
    easing: options.easing || 'easeOutExpo',
    formatter: options.formatter || null
  };

  // Define easing functions
  const easingFunctions = {
    linear: t => t,
    easeInQuad: t => t * t,
    easeOutQuad: t => t * (2 - t),
    easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeInCubic: t => t * t * t,
    easeOutCubic: t => (--t) * t * t + 1,
    easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    easeOutExpo: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
  };
  
  // Get easing function
  const easing = easingFunctions[config.easing] || easingFunctions.easeOutExpo;

  return new Promise((resolve) => {
    const startTime = performance.now();
    const change = end - start;

    // Animation frame handler
    const updateValue = (timestamp) => {
      const runtime = timestamp - startTime;
      const progress = Math.min(runtime / config.duration, 1);
      const easedProgress = easing(progress);
      const currentValue = start + change * easedProgress;

      // Format the value
      let formattedValue;
      if (config.formatter) {
        formattedValue = config.formatter(currentValue);
      } else {
        formattedValue = currentValue.toFixed(config.decimals);
      }

      // Update element
      element.textContent = `${config.prefix}${formattedValue}${config.suffix}`;

      // Continue animation or resolve
      if (runtime < config.duration) {
        requestAnimationFrame(updateValue);
      } else {
        // Ensure final value is set precisely
        const finalFormattedValue = config.formatter ? 
          config.formatter(end) : 
          end.toFixed(config.decimals);
        element.textContent = `${config.prefix}${finalFormattedValue}${config.suffix}`;
        resolve();
      }
    };

    // Start animation
    requestAnimationFrame(updateValue);
  });
};

/**
 * Animate a progress bar
 * @param {HTMLElement} progressBar - Progress bar element
 * @param {number} targetPercentage - Target percentage (0-100)
 * @param {Object} options - Configuration options
 * @returns {Promise} Promise that resolves when animation completes
 */
export const animateProgressBar = (progressBar, targetPercentage, options = {}) => {
  if (!progressBar) {
    console.error('No progress bar element provided');
    return Promise.reject('No progress bar element provided');
  }

  const config = {
    duration: options.duration || 500,
    easing: options.easing || 'easeOutQuad',
    onProgress: options.onProgress || null
  };

  // Get current width
  const style = window.getComputedStyle(progressBar);
  const currentWidth = parseFloat(style.width) / parseFloat(style.maxWidth) * 100 || 0;

  // Define easing functions
  const easingFunctions = {
    linear: t => t,
    easeInQuad: t => t * t,
    easeOutQuad: t => t * (2 - t),
    easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
  };
  
  // Get easing function
  const easing = easingFunctions[config.easing] || easingFunctions.easeOutQuad;

  return new Promise((resolve) => {
    const startTime = performance.now();
    const change = targetPercentage - currentWidth;

    // Animation frame handler
    const updateProgress = (timestamp) => {
      const runtime = timestamp - startTime;
      const progress = Math.min(runtime / config.duration, 1);
      const easedProgress = easing(progress);
      const currentPercentage = currentWidth + change * easedProgress;

      // Update progress bar
      progressBar.style.width = `${currentPercentage}%`;

      // Call progress callback if provided
      if (config.onProgress) {
        config.onProgress(currentPercentage);
      }

      // Continue animation or resolve
      if (runtime < config.duration) {
        requestAnimationFrame(updateProgress);
      } else {
        // Ensure final percentage is set precisely
        progressBar.style.width = `${targetPercentage}%`;
        if (config.onProgress) {
          config.onProgress(targetPercentage);
        }
        resolve();
      }
    };

    // Start animation
    requestAnimationFrame(updateProgress);
  });
};

/**
 * Fade in animation
 * @param {HTMLElement} element - Element to animate
 * @param {Object} options - Animation options
 * @returns {Promise} Promise that resolves when animation completes
 */
export const fadeIn = (element, options = {}) => {
  if (!element) {
    console.error('No element provided for fade-in animation');
    return Promise.reject('No element provided');
  }

  const config = {
    duration: options.duration || 300,
    display: options.display || 'block',
    easing: options.easing || 'easeOutQuad'
  };

  // Define easing functions
  const easingFunctions = {
    linear: t => t,
    easeOutQuad: t => t * (2 - t)
  };
  
  // Get easing function
  const easing = easingFunctions[config.easing] || easingFunctions.easeOutQuad;

  // Set initial styles
  element.style.opacity = '0';
  element.style.display = config.display;

  return new Promise((resolve) => {
    const startTime = performance.now();

    // Animation frame handler
    const updateOpacity = (timestamp) => {
      const runtime = timestamp - startTime;
      const progress = Math.min(runtime / config.duration, 1);
      const easedProgress = easing(progress);
      
      element.style.opacity = easedProgress;

      if (runtime < config.duration) {
        requestAnimationFrame(updateOpacity);
      } else {
        element.style.opacity = '1';
        resolve();
      }
    };

    // Start animation
    requestAnimationFrame(updateOpacity);
  });
};

/**
 * Fade out animation
 * @param {HTMLElement} element - Element to animate
 * @param {Object} options - Animation options
 * @returns {Promise} Promise that resolves when animation completes
 */
export const fadeOut = (element, options = {}) => {
  if (!element) {
    console.error('No element provided for fade-out animation');
    return Promise.reject('No element provided');
  }

  const config = {
    duration: options.duration || 300,
    easing: options.easing || 'easeOutQuad',
    remove: options.remove || false
  };

  // Define easing functions
  const easingFunctions = {
    linear: t => t,
    easeOutQuad: t => t * (2 - t)
  };
  
  // Get easing function
  const easing = easingFunctions[config.easing] || easingFunctions.easeOutQuad;

  // Set initial opacity if not already set
  if (element.style.opacity === '') {
    element.style.opacity = '1';
  }

  return new Promise((resolve) => {
    const startTime = performance.now();
    const initialOpacity = parseFloat(element.style.opacity);

    // Animation frame handler
    const updateOpacity = (timestamp) => {
      const runtime = timestamp - startTime;
      const progress = Math.min(runtime / config.duration, 1);
      const easedProgress = easing(progress);
      
      element.style.opacity = initialOpacity - initialOpacity * easedProgress;

      if (runtime < config.duration) {
        requestAnimationFrame(updateOpacity);
      } else {
        element.style.opacity = '0';
        if (config.remove) {
          element.style.display = 'none';
        }
        resolve();
      }
    };

    // Start animation
    requestAnimationFrame(updateOpacity);
  });
};

/**
 * Apply a typing animation to text
 * @param {HTMLElement} element - Element to animate
 * @param {string} text - Text to type
 * @param {Object} options - Animation options
 * @returns {Promise} Promise that resolves when animation completes
 */
export const typeText = (element, text, options = {}) => {
  if (!element) {
    console.error('No element provided for typing animation');
    return Promise.reject('No element provided');
  }

  const config = {
    delay: options.delay || 30,
    initialDelay: options.initialDelay || 0,
    cursor: options.cursor !== undefined ? options.cursor : true,
    cursorChar: options.cursorChar || '|',
    cursorSpeed: options.cursorSpeed || 400
  };

  // Clear element content
  element.textContent = '';

  // Add cursor element if enabled
  let cursorElement = null;
  if (config.cursor) {
    cursorElement = document.createElement('span');
    cursorElement.textContent = config.cursorChar;
    cursorElement.className = 'typing-cursor';
    cursorElement.style.animation = `cursor-blink ${config.cursorSpeed}ms infinite`;
    element.appendChild(cursorElement);
  }

  return new Promise((resolve) => {
    // Initial delay
    setTimeout(() => {
      let index = 0;
      const type = () => {
        if (index < text.length) {
          // Get current character
          const char = text.charAt(index);
          
          // Create and append text node
          const textNode = document.createTextNode(char);
          element.insertBefore(textNode, cursorElement);
          
          // Increment index and schedule next character
          index++;
          setTimeout(type, config.delay);
        } else {
          resolve();
        }
      };
      
      // Start typing
      type();
    }, config.initialDelay);
  });
};

/**
 * Create a notification toast and animate it
 * @param {Object} options - Toast options
 * @returns {Object} Toast control functions
 */
export const showToast = (options = {}) => {
  const config = {
    message: options.message || '',
    type: options.type || 'info',
    duration: options.duration || 3000,
    position: options.position || 'top-right',
    onClose: options.onClose || null
  };

  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast toast-${config.type} toast-${config.position}`;
  toast.innerHTML = `
    <div class="toast-content">
      <span class="toast-message">${config.message}</span>
      <button class="toast-close-btn">&times;</button>
    </div>
  `;

  // Set initial styles for animation
  toast.style.opacity = '0';
  toast.style.transform = 'translateY(-20px)';
  toast.style.transition = 'opacity 300ms, transform 300ms';

  // Add to document
  document.body.appendChild(toast);

  // Animate in
  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  }, 10);

  // Set up auto-dismiss
  let timeoutId = null;
  if (config.duration > 0) {
    timeoutId = setTimeout(() => closeToast(), config.duration);
  }

  // Close handler
  const closeToast = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    // Animate out
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-20px)';
    
    // Remove after animation completes
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
        if (config.onClose) {
          config.onClose();
        }
      }
    }, 300);
  };

  // Set up close button
  const closeBtn = toast.querySelector('.toast-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeToast);
  }

  // Return control functions
  return {
    close: closeToast,
    updateMessage: (newMessage) => {
      const messageEl = toast.querySelector('.toast-message');
      if (messageEl) {
        messageEl.textContent = newMessage;
      }
    }
  };
};

export default {
  createMatrixAnimation,
  animateCounter,
  animateProgressBar,
  fadeIn,
  fadeOut,
  typeText,
  showToast
};