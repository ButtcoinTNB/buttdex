'use client';

import Script from 'next/script';
import Image from 'next/image';
import DirectTerminal from '@/components/DirectTerminal';
import ThemeToggle from '@/components/ThemeToggle';
import ThemeLogo from '@/components/ThemeLogo';

export default function Home() {
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

      <div className="footer">
        2025, Buttcoin - The Next Bitcoin
      </div>
    </>
  );
} 