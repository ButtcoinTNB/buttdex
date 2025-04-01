'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import DirectTerminal from '@/components/DirectTerminal';
import ThemeToggle from '@/components/ThemeToggle';
import ThemeLogo from '@/components/ThemeLogo';
import { launchButtcoinConfetti } from '@/utils/confetti';
import ConfettiTester from '@/components/ConfettiTester';
import FortuneCookie from '@/components/FortuneCookie';

export default function Home() {
  const [showFortuneCookie, setShowFortuneCookie] = useState(false);
  
  // Listen for swap success events
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleSwapSuccess = (event: Event) => {
      const customEvent = event as CustomEvent<{ txid: string }>;
      console.log('Swap success event received:', customEvent.detail.txid);
      
      // Launch buttcoin confetti celebration with callback
      launchButtcoinConfetti(
        {
          particleCount: 100,
          spread: 90,
          startVelocity: 40,
        },
        // Show fortune cookie when confetti ends
        () => setShowFortuneCookie(true)
      );
    };
    
    // Add event listener
    window.addEventListener('jupiterSwapSuccess', handleSwapSuccess);
    
    // Cleanup
    return () => {
      window.removeEventListener('jupiterSwapSuccess', handleSwapSuccess);
    };
  }, []);
  
  // Check if we're in development mode
  const isDev = process.env.NODE_ENV === 'development';
  
  return (
    <>
      <Script 
        src="https://terminal.jup.ag/main-v4.js" 
        strategy="beforeInteractive"
        data-preload
      />
      
      <div className="header">
        <a href="https://thenextbitcoin.fun" target="_blank" rel="noopener noreferrer">
          <ThemeLogo />
        </a>
      </div>

      <ThemeToggle />

      <div className="main-content">
        <h1 className="title-special">welcome to the buttdex</h1>
        <div id="terminal-wrapper" className="terminal-container">
          <DirectTerminal />
        </div>

        <div className="community-message">
          Buttcoin is the next Bitcoin: swap on ButtDex to help{' '}
          <a href="https://t.me/buttcointnbsol" target="_blank" rel="noopener noreferrer">
            the community
          </a>{' '}
          grow!
        </div>

        <div className="social-icons">
          <a href="https://x.com/ButtcoinTNB" target="_blank" rel="noopener noreferrer" className="social-icon" title="Follow on X">
            <Image src="/icons/x.svg" alt="X Logo" width={22} height={22} />
          </a>
          <a href="https://tiktok.com/@ButtcoinTNB" target="_blank" rel="noopener noreferrer" className="social-icon" title="Follow on TikTok">
            <Image src="/icons/tiktok.svg" alt="TikTok Logo" width={22} height={22} />
          </a>
          <a href="https://instagram.com/buttcointnb" target="_blank" rel="noopener noreferrer" className="social-icon" title="Follow on Instagram">
            <Image src="/icons/instagram.svg" alt="Instagram Logo" width={22} height={22} />
          </a>
          <a href="https://thenextbitcoin.fun" target="_blank" rel="noopener noreferrer" className="social-icon" title="Visit Website">
            <Image src="/icons/website.svg" alt="Website" width={22} height={22} />
          </a>
        </div>
      </div>
      
      {/* Fortune Cookie component */}
      <FortuneCookie 
        visible={showFortuneCookie} 
        onClose={() => setShowFortuneCookie(false)} 
      />
      
      {/* Only show test button in development */}
      {isDev && <ConfettiTester />}

      <div className="footer">
        2025, Buttcoin - The Next Bitcoin
      </div>
    </>
  );
} 