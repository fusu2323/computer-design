/**
 * Shared spring configs for framer-motion
 * Used for natural, physics-based animations
 */

export const gentle = {
  type: 'spring',
  stiffness: 100,
  damping: 15,
};

export const smooth = {
  type: 'spring',
  stiffness: 80,
  damping: 20,
};

export const snappy = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

export const page = {
  type: 'spring',
  stiffness: 80,
  damping: 20,
  duration: 0.3,
};

export const bouncy = {
  type: 'spring',
  stiffness: 400,
  damping: 10,
};
