'use client';

import { useEffect, useState } from 'react';
import type { JupiterTerminal as JupiterTerminalType } from '@/types/jupiter-terminal';
import { initPhantomDeeplinkHandler } from '@/utils/phantom/jupiter-deeplink-handler';
import { detectDevice } from '@/utils/device-detection';

declare global {
  interface Window {
    Jupiter: JupiterTerminalType;
    solana?: any;
    phantom?: any;
  }
}

const FALLBACK_RPC = "https://api.mainnet-beta.solana.com";
const RPC_ENDPOINTS = [
  "https://tame-wispy-sunset.solana-mainnet.quiknode.pro/6004706cdd1ee3b1c97ba63416f622fd874d02d8/",
  FALLBACK_RPC
];

export default function DirectTerminal() {
  const [isLoaded, setIsLoaded] = useState(false);
  const terminalId = 'integrated-terminal';
  const deviceInfo = detectDevice();
  
  // Initialize Phantom deeplink handler for mobile only
  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;
    
    // Only initialize the deeplink handler on mobile devices
    if (deviceInfo.isMobile) {
      try {
        initPhantomDeeplinkHandler();
        console.log('Phantom deeplink handler initialized for mobile');
      } catch (err) {
        console.log('Phantom deeplink handler failed to initialize');
      }
    } else {
      console.log('Skipping Phantom deeplink handler on desktop');
    }
  }, [deviceInfo.isMobile]);
  
  // More efficient Jupiter script loading detection
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Check once at the beginning
    if (window.Jupiter && typeof window.Jupiter.init === 'function') {
      setIsLoaded(true);
      return;
    }
    
    // Set up interval check if not immediately available
    const checkJupiterLoaded = setInterval(() => {
      if (window.Jupiter && typeof window.Jupiter.init === 'function') {
        clearInterval(checkJupiterLoaded);
        setIsLoaded(true);
      }
    }, 100);

    return () => clearInterval(checkJupiterLoaded);
  }, []);

  // Fix Phantom wallet detection on desktop
  useEffect(() => {
    if (typeof window === 'undefined' || deviceInfo.isMobile) return;
    
    // Only apply this fix on desktop
    if (window.solana && !window.phantom) {
      console.log('Setting phantom reference on window for better detection');
      window.phantom = window.solana;
    }
  }, [deviceInfo.isMobile]);
  
  // Initialize Jupiter when loaded
  useEffect(() => {
    if (!isLoaded || typeof window === 'undefined') return;
    
    // If an instance already exists, just resume it
    if (window.Jupiter._instance) {
      window.Jupiter.resume();
      return;
    }
    
    try {
      window.Jupiter.init({
        displayMode: 'integrated',
        integratedTargetId: terminalId,
        endpoint: RPC_ENDPOINTS[0],
        appearance: 'dark',
        defaultExplorer: 'Solana Explorer',
        strictTokenList: true,
        walletConnectionStrategy: deviceInfo.isMobile ? 'custom' : 'auto',
        enableWalletPassthrough: true,
        passThoughWalletTokenAccounts: true,
        containerStyles: {
          width: '100%',
          height: '100%',
          borderRadius: '20px',
          boxShadow: '0 0 20px var(--shadow-color)',
          backgroundColor: 'var(--terminal-bg-color)',
        },
        containerClassName: 'jupiter-terminal-custom',
        formProps: {
          initialInputMint: 'So11111111111111111111111111111111111111112', // SOL
          initialOutputMint: 'FasH397CeZLNYWkd3wWK9vrmjd1z93n3b59DssRXpump', // BUTTCOIN
          swapMode: 'ExactIn',
          initialAmount: '200000000',
          initialSlippageBps: 1,
        },
        platformFeeAndAccounts: [{
          feeBps: 99,
          feeAccount: '4R76yfzn8Gg9kbZ5dYfQSveGNUTaonheT92kEC3ao3w5'
        }],
        onSuccess: ({ txid }) => {
          console.log('Swap successful!', txid);
        },
        onSwapError: ({ error }) => {
          console.error('Swap error:', error);
        }
      });
    } catch (err) {
      console.error('Failed to initialize Jupiter Terminal:', err);
    }
  }, [isLoaded, deviceInfo.isMobile, terminalId]);

  return (
    <div id={terminalId} className="w-full h-full min-h-[580px]"></div>
  );
} 