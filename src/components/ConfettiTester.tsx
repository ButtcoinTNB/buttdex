'use client';

import { useState } from 'react';
import { launchButtcoinConfetti } from '@/utils/confetti';

// Only use this component during development for testing
export default function ConfettiTester() {
  const [isVisible, setIsVisible] = useState(false);
  
  const triggerConfetti = () => {
    // Simulate swap success event
    const event = new CustomEvent('jupiterSwapSuccess', { 
      detail: { txid: 'test-transaction' } 
    });
    window.dispatchEvent(event);
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-[2000]">
      {isVisible ? (
        <button
          onClick={triggerConfetti}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded shadow-lg"
        >
          Test Confetti
        </button>
      ) : (
        <button
          onClick={() => setIsVisible(true)}
          className="bg-gray-500 hover:bg-gray-600 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-lg"
        >
          ?
        </button>
      )}
    </div>
  );
} 