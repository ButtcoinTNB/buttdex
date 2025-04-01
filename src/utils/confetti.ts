export interface ConfettiOptions {
  particleCount?: number;
  spread?: number;
  startVelocity?: number;
  gravity?: number;
  drift?: number;
  scalar?: number;
  ticks?: number;
}

export const launchButtcoinConfetti = (options: ConfettiOptions = {}) => {
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

    // Create a Buttcoin image shape
    const buttcoin = new Image();
    buttcoin.src = '/buttcoin-shiny.png';
    
    // Wait for the image to load
    buttcoin.onload = () => {
      // Create a temporary canvas to generate a particle shape
      const canvas = document.createElement('canvas');
      const size = 24; // Size of each particle
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;
      
      // Draw a scaled-down version of the Buttcoin
      ctx.drawImage(buttcoin, 0, 0, size, size);
      
      // Create the shape
      const shape = confetti.shapeFromPath({
        path: canvas.toDataURL(),
      });
      
      // Launch the confetti with the Buttcoin shape
      confetti({
        ...mergedOptions,
        shapes: [shape],
        colors: ['#FFD700', '#FFA500', '#FF8C00'], // Golden colors to match Buttcoin
        origin: { x: 0.5, y: 0.7 }, // Start from bottom center
      });
    };
  }).catch(error => {
    console.error('Failed to load confetti library:', error);
  });
}; 