'use client';

import { launchButtcoinConfetti } from '@/utils/confetti';

export default function TestConfetti() {
  const triggerConfetti = () => {
    launchButtcoinConfetti({
      particleCount: 100,
      spread: 90,
      startVelocity: 40,
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={triggerConfetti}
        className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded shadow-lg"
      >
        Test Confetti
      </button>
    </div>
  );
} 