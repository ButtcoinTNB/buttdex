export interface ConfettiOptions {
  particleCount?: number;
  spread?: number;
  startVelocity?: number;
  gravity?: number;
  drift?: number;
  scalar?: number;
  ticks?: number;
}

export const launchButtcoinConfetti = (
  options: ConfettiOptions = {}, 
  onComplete?: () => void
) => {
  if (typeof window === 'undefined') return;

  // Dynamically import the confetti module
  import('canvas-confetti').then(({ default: confetti }) => {
    const defaults = {
      particleCount: 50,
      spread: 70,
      startVelocity: 30,
      gravity: 1.2,
      drift: 0,
      scalar: 0.7,
      ticks: 200,
    };

    const mergedOptions = { ...defaults, ...options };

    try {
      // Configure confetti to NOT use web workers
      const myConfetti = confetti.create(undefined, {
        resize: true,
        useWorker: false, // Disable Web Worker to avoid CSP issues
      });
      
      // Simple approach without custom shapes
      myConfetti({
        ...mergedOptions,
        colors: ['#FFD700', '#FFA500', '#FF8C00'], // Golden colors to match Buttcoin
        origin: { x: 0.5, y: 0.7 }, // Start from bottom center
      });
      
      // Add a delayed second burst for extra effect
      setTimeout(() => {
        myConfetti({
          ...mergedOptions,
          particleCount: Math.floor(mergedOptions.particleCount / 2),
          origin: { x: 0.4, y: 0.7 },
        });
      }, 250);
      
      // Add a third burst for a fuller effect
      setTimeout(() => {
        myConfetti({
          ...mergedOptions,
          particleCount: Math.floor(mergedOptions.particleCount / 2),
          origin: { x: 0.6, y: 0.7 },
        });

        // Call onComplete after confetti animation
        if (onComplete) {
          // Wait a bit longer than the confetti animation
          const totalDuration = mergedOptions.ticks ? mergedOptions.ticks * 10 : 2000;
          setTimeout(onComplete, totalDuration);
        }
      }, 400);
      
    } catch (error) {
      console.error('Failed to create confetti:', error);
      // Still call onComplete even if confetti fails
      if (onComplete) onComplete();
    }
  }).catch(error => {
    console.error('Failed to load confetti library:', error);
    // Still call onComplete even if confetti fails
    if (onComplete) onComplete();
  });
}; 