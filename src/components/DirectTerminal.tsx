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
  
  interface Navigator {
    wallets?: any[];
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
  
  // Hide token program message using MutationObserver
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Create a style element for any immediate styling
    const style = document.createElement('style');
    style.textContent = `
      /* More selective CSS to only hide token program messages */
      #jupiter-terminal div:has(> p:contains("token program")) {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
    
    // Function to hide token program messages
    const hideTokenProgramMessage = (node: Node) => {
      // Skip non-element nodes
      if (node.nodeType !== Node.ELEMENT_NODE) return;
      
      // Check if this element or its children contain the token program message
      const hasTokenProgramText = (element: Element): boolean => {
        if (!element) return false;
        
        // Check the element's text content - be more specific
        const text = element.textContent?.toLowerCase() || '';
        if (text.includes('token program') && 
            text.includes('execute the trade') && 
            text.length < 200) { // Only match shorter messages to avoid hiding larger UI sections
          return true;
        }
        
        return false;
      };
      
      // Hide the element if it contains the token program message
      if (hasTokenProgramText(node as Element)) {
        // Use inline style for immediate effect
        (node as HTMLElement).style.display = 'none';
        (node as Element).setAttribute('data-hidden-by-observer', 'true');
        console.debug('Token program message hidden by observer');
      }
      
      // Process child nodes - only direct children to be more selective
      Array.from((node as Element).children || []).forEach((child: Element) => {
        if (hasTokenProgramText(child)) {
          (child as HTMLElement).style.display = 'none';
          child.setAttribute('data-hidden-by-observer', 'true');
        }
      });
    };
    
    // Set up the observer
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        // Process added nodes
        mutation.addedNodes.forEach(node => {
          hideTokenProgramMessage(node);
        });
        
        // Check if target element now contains token program message
        if (mutation.type === 'childList' || mutation.type === 'characterData') {
          hideTokenProgramMessage(mutation.target);
        }
      });
    });
    
    // Start observing once Jupiter Terminal is loaded
    const startObserving = () => {
      const terminalEl = document.getElementById('jupiter-terminal');
      if (terminalEl) {
        // Process already existing content
        hideTokenProgramMessage(terminalEl);
        
        // Observe future changes
        observer.observe(terminalEl, {
          childList: true,
          subtree: true,
          characterData: true
        });
        
        return true;
      }
      return false;
    };
    
    // Try to start observing immediately
    if (!startObserving()) {
      // If not available yet, set up an interval to try again
      const checkInterval = setInterval(() => {
        if (startObserving()) {
          clearInterval(checkInterval);
        }
      }, 500);
      
      // Clean up interval if component unmounts
      return () => {
        clearInterval(checkInterval);
        observer.disconnect();
        if (document.head.contains(style)) {
          document.head.removeChild(style);
        }
      };
    }
    
    // Clean up observer if component unmounts
    return () => {
      observer.disconnect();
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);
  
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
    if (typeof window === 'undefined') return;
    
    // Store original console.error
    const originalConsoleError = window.console.error;
    
    // Ensure proper wallet detection initialization
    const initializeWalletDetection = () => {
      try {
        // Initialize empty wallets array if it doesn't exist
        if (!window.navigator.wallets) {
          Object.defineProperty(window.navigator, 'wallets', {
            value: [],
            writable: true,
            configurable: true
          });
        }
        
        // Set Phantom reference if available
        if (window.solana && !window.phantom) {
          window.phantom = window.solana;
        }
        
        // Override console.error to filter out specific errors
        window.console.error = function(...args) {
          // Filter out the specific error about wallets not being an array
          if (args[0] && typeof args[0] === 'string' && args[0].includes('window.navigator.wallets is not an array')) {
            return; // Don't log this specific error
          }
          
          // Pass through all other errors to the original console.error
          return originalConsoleError.apply(this, args);
        };
      } catch (error) {
        console.warn('Wallet detection initialization failed:', error);
      }
    };

    initializeWalletDetection();
    
    // Clean up console.error override on unmount
    return () => {
      try {
        // Restore original console.error
        window.console.error = originalConsoleError;
      } catch (error) {
        // Ignore cleanup errors
      }
    };
  }, []);
  
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
        walletConnectionStrategy: 'auto',
        enableWalletPassthrough: false,
        passThoughWalletTokenAccounts: false,
        containerClassName: 'jupiter-terminal-container jupiter-terminal-custom',
        containerStyles: {
          width: '100%',
          height: '100%',
          borderRadius: '20px',
          boxShadow: '0 0 20px var(--shadow-color)',
          backgroundColor: 'var(--terminal-bg-color)',
        },
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
          // Dispatch custom event for the parent page to handle
          const successEvent = new CustomEvent('jupiterSwapSuccess', { 
            detail: { txid } 
          });
          window.dispatchEvent(successEvent);
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