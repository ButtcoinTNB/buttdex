'use client';

import { useEffect } from 'react';
import { detectDevice } from '@/utils/device-detection';

export default function PhantomMobileRedirect() {
  const deviceInfo = detectDevice();
  
  useEffect(() => {
    if (!deviceInfo.isMobile || typeof window === 'undefined') return;
    
    // Add click event listener for Jupiter Terminal's "Connect Wallet" button
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Element;
      
      // Very specific targeting of the Connect Wallet div
      const isConnectWalletDiv = 
        target.classList.contains('p-5') && 
        target.classList.contains('text-md') && 
        target.classList.contains('font-semibold') && 
        target.classList.contains('h-full') && 
        target.classList.contains('w-full') && 
        target.classList.contains('leading-none') && 
        target.textContent === 'Connect Wallet';
        
      // Also check if the click is on a parent of the div
      const hasConnectWalletDiv = 
        target.querySelector('div.p-5.text-md.font-semibold.h-full.w-full.leading-none') !== null;
      
      if (isConnectWalletDiv || hasConnectWalletDiv || target.closest('button')?.querySelector('div.p-5.text-md.font-semibold.h-full.w-full.leading-none') !== null) {
        console.log('Intercepted Connect Wallet button click');
        e.preventDefault();
        e.stopPropagation();
        
        // Simple Phantom browse URL - no encryption or complex connection flow needed
        const phantomBrowseUrl = `https://phantom.app/ul/browse/${encodeURIComponent('https://buttdex.com')}`;
        window.location.href = phantomBrowseUrl;
        return false;
      }
    };
    
    // We need to use capture phase to intercept the click before Jupiter Terminal does
    document.addEventListener('click', handleClick, { capture: true });
    
    return () => {
      document.removeEventListener('click', handleClick, { capture: true });
    };
  }, [deviceInfo.isMobile]);
  
  return null;
} 