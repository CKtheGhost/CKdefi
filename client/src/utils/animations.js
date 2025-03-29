// src/utils/animations.js
// Animation utilities for CompounDefi UI

/**
 * Animation presets for common UI interactions
 * Compatible with Framer Motion and React Spring
 */

// Fade animations
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 }
};

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.4 }
};

export const fadeInDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4 }
};

export const fadeInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.4 }
};

export const fadeInRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.4 }
};

// Scale animations
export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
  transition: { duration: 0.3 }
};

export const scaleInFast = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
  transition: { duration: 0.2 }
};

// Slide animations
export const slideInRight = {
  initial: { x: '100%' },
  animate: { x: 0 },
  exit: { x: '100%' },
  transition: { type: 'spring', stiffness: 300, damping: 30 }
};

export const slideInLeft = {
  initial: { x: '-100%' },
  animate: { x: 0 },
  exit: { x: '-100%' },
  transition: { type: 'spring', stiffness: 300, damping: 30 }
};

export const slideInUp = {
  initial: { y: '100%' },
  animate: { y: 0 },
  exit: { y: '100%' },
  transition: { type: 'spring', stiffness: 300, damping: 30 }
};

export const slideInDown = {
  initial: { y: '-100%' },
  animate: { y: 0 },
  exit: { y: '-100%' },
  transition: { type: 'spring', stiffness: 300, damping: 30 }
};

// Special animations
export const popIn = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.8, opacity: 0 },
  transition: { 
    type: 'spring',
    stiffness: 500,
    damping: 25
  }
};

export const bounceIn = {
  initial: { scale: 0 },
  animate: { scale: 1 },
  transition: {
    type: 'spring',
    stiffness: 400,
    damping: 10
  }
};

// Staggered animation helpers
export const staggerContainer = (staggerChildren = 0.05, delayChildren = 0) => ({
  animate: {
    transition: {
      staggerChildren,
      delayChildren
    }
  }
});

export const staggerItems = (index, delayFactor = 0.05) => ({
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { delay: index * delayFactor }
  },
  exit: { opacity: 0, y: 20 }
});

// Animation for number counters
export const numberCount = {
  initial: { opacity: 0 },
  animate: (custom) => ({
    opacity: 1,
    transition: { 
      duration: custom?.duration || 2,
      ease: 'easeOut' 
    }
  })
};

// Animation for charts
export const chartAnimation = {
  initial: { opacity: 0, pathLength: 0 },
  animate: { 
    opacity: 1, 
    pathLength: 1,
    transition: { 
      duration: 1.5, 
      ease: 'easeInOut'
    }
  }
};

// Animation for success/completion
export const successAnimation = {
  initial: { scale: 0, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20
    }
  }
};

// Animation for loading states
export const pulseAnimation = {
  animate: {
    scale: [1, 1.03, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      repeatType: 'loop'
    }
  }
};

// Animation for notification toast
export const toastAnimation = {
  initial: { opacity: 0, y: -20, scale: 0.9 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
  transition: { duration: 0.3 }
};

// Custom hook compatible animation presets for React Spring
export const springFadeIn = {
  from: { opacity: 0 },
  to: { opacity: 1 },
  config: { tension: 280, friction: 20 }
};

export const springFadeInUp = {
  from: { opacity: 0, y: 20 },
  to: { opacity: 1, y: 0 },
  config: { tension: 280, friction: 20 }
};

// Animation for recommendations flow
export const recommendationStepAnimation = (step, activeStep) => ({
  opacity: activeStep >= step ? 1 : 0.3,
  scale: activeStep === step ? 1 : 0.95,
  y: activeStep > step ? -10 : activeStep === step ? 0 : 10,
  transition: { duration: 0.4 }
});

// Animation for portfolio allocation sunburst/donut chart
export const portfolioChartAnimation = {
  initial: { opacity: 0, scale: 0.8, rotate: -15 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    rotate: 0,
    transition: { 
      duration: 0.8, 
      ease: 'easeOut' 
    }
  }
};

// Animation for tabbed interfaces
export const tabAnimation = {
  initial: { opacity: 0, height: 0 },
  animate: { 
    opacity: 1, 
    height: 'auto',
    transition: { 
      height: { duration: 0.3 },
      opacity: { duration: 0.2, delay: 0.1 }
    }
  },
  exit: { 
    opacity: 0, 
    height: 0,
    transition: { 
      height: { duration: 0.3 },
      opacity: { duration: 0.2 }
    }
  }
};