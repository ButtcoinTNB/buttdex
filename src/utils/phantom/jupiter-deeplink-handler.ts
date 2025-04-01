'use client';

import { detectDevice } from '../device-detection';

interface RedirectState {
  readonly timestamp: number;
  readonly returnUrl: string;
}

// Constants with literal types for better type safety
const JUPITER_WALLET_BUTTON_SELECTOR = 'button[data-testid="connect-wallet-button"]';
const PHANTOM_CONNECT_URL = 'https://phantom.app/ul/v1/connect';
const REDIRECT_STATE_KEY = 'phantomRedirectState';
const FRESH_RETURN_WINDOW = 5 * 60 * 1000; // 5 minutes in milliseconds

// Type declarations for constants
type JupiterButtonSelector = typeof JUPITER_WALLET_BUTTON_SELECTOR;
type PhantomBrowserUrl = typeof PHANTOM_CONNECT_URL;
type RedirectStateKey = typeof REDIRECT_STATE_KEY;
type FreshReturnWindow = typeof FRESH_RETURN_WINDOW;

type CleanupFunction = () => void;

// Singleton state
let isInitialized = false;

/**
 * Initializes the Phantom deeplink handler for mobile devices
 * @returns A cleanup function or void if initialization is skipped
 */
export function initPhantomDeeplinkHandler(): CleanupFunction | void {
  if (typeof window === 'undefined' || isInitialized) {
    return;
  }
  
  const deviceInfo = detectDevice();
  
  // Only apply on mobile devices not in Phantom browser
  if (!deviceInfo.isMobile || deviceInfo.isPhantomBrowser) {
    isInitialized = true;
    return;
  }
  
  console.log('Initializing Phantom deeplink handler for mobile');
  
  // Create a MutationObserver to watch for the connect button
  const observer = new MutationObserver((_, obs) => {
    try {
      const connectButton = document.querySelector<HTMLButtonElement>(JUPITER_WALLET_BUTTON_SELECTOR);
      
      if (connectButton) {
        // Remove any previous listeners to avoid duplicates
        connectButton.removeEventListener('click', handleConnectClick);
        
        // Add our interceptor
        connectButton.addEventListener('click', handleConnectClick, { capture: true });
        
        // Stop observing once we've found and modified the button
        obs.disconnect();
        isInitialized = true;
      }
    } catch (error) {
      console.error('Failed to setup connect button:', error instanceof Error ? error.message : String(error));
    }
  });
  
  // Start observing DOM changes
  observer.observe(document.body, { 
    childList: true, 
    subtree: true,
  });

  // Return cleanup function
  const cleanup: CleanupFunction = () => {
    try {
      observer.disconnect();
      const connectButton = document.querySelector<HTMLButtonElement>(JUPITER_WALLET_BUTTON_SELECTOR);
      if (connectButton) {
        connectButton.removeEventListener('click', handleConnectClick);
      }
    } catch (error) {
      console.error('Failed to cleanup:', error instanceof Error ? error.message : String(error));
    }
  };

  return cleanup;
}

/**
 * Handles the connect button click event
 * @param event The mouse event from the button click
 */
function handleConnectClick(event: MouseEvent): void {
  try {
    const deviceInfo = detectDevice();
    
    if (!deviceInfo.supportsDeeplinks) {
      return;
    }
    
    event.preventDefault();
    event.stopPropagation();
    
    // Use proper Phantom deeplink format
    const params = new URLSearchParams({
      cluster: 'mainnet',
      app_url: window.location.href,
      redirect_url: window.location.origin
    });
    
    const phantomUrl = `${PHANTOM_CONNECT_URL}?${params.toString()}`;
    
    console.log('Redirecting to Phantom:', phantomUrl);
    window.location.href = phantomUrl;
  } catch (error) {
    console.error('Failed to handle connect:', error);
    return;
  }
}

/**
 * Processes the response after returning from Phantom browser
 */
function processDeeplinkResponse(): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    const savedState = sessionStorage.getItem(REDIRECT_STATE_KEY);
    if (!savedState) return;

    const state = JSON.parse(savedState) as RedirectState;
    
    // Validate parsed state
    if (!state || typeof state.timestamp !== 'number' || typeof state.returnUrl !== 'string') {
      throw new Error('Invalid state data');
    }
    
    // Clear the saved state immediately
    sessionStorage.removeItem(REDIRECT_STATE_KEY);
    
    if (Date.now() - state.timestamp < FRESH_RETURN_WINDOW) {
      console.log('Returned from Phantom browser');
      // Let Jupiter Terminal handle the connection
    }
  } catch (error) {
    console.error('Failed to process return from Phantom:', error instanceof Error ? error.message : String(error));
  }
} 