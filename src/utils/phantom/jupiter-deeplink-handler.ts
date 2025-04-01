'use client';

import { detectDevice } from '../device-detection';

/**
 * This utility handles Phantom deeplinks for the Jupiter Terminal
 * It detects when the connect wallet button is clicked in the terminal
 * and redirects to Phantom browser on mobile
 */

// Initialize state
let isInitialized = false;

// Class name of Jupiter's connect wallet button
const JUPITER_WALLET_BUTTON_SELECTOR = 'button[data-testid="connect-wallet-button"]';

// Base URL for Phantom browser
const PHANTOM_BROWSER_URL = 'https://phantom.app/ul/browse';

// Storage key for redirect state
const REDIRECT_STATE_KEY = 'phantomRedirectState';

export function initPhantomDeeplinkHandler() {
  if (typeof window === 'undefined' || isInitialized) return;
  
  const deviceInfo = detectDevice();
  
  // Only apply on mobile devices
  if (!deviceInfo.isMobile || deviceInfo.isPhantomBrowser) {
    isInitialized = true;
    return;
  }
  
  console.log('Initializing Phantom deeplink handler for mobile');
  
  // Create a MutationObserver to watch for the connect button
  const observer = new MutationObserver((mutations, obs) => {
    const connectButton = document.querySelector(JUPITER_WALLET_BUTTON_SELECTOR) as HTMLButtonElement | null;
    
    if (connectButton) {
      // Remove any previous listeners to avoid duplicates
      connectButton.removeEventListener('click', handleConnectClick);
      
      // Add our interceptor
      connectButton.addEventListener('click', handleConnectClick, { capture: true });
      
      // Stop observing once we've found and modified the button
      obs.disconnect();
      isInitialized = true;
    }
  });
  
  // Start observing DOM changes
  observer.observe(document.body, { 
    childList: true, 
    subtree: true 
  });

  // Clean up function
  return () => {
    observer.disconnect();
    const connectButton = document.querySelector(JUPITER_WALLET_BUTTON_SELECTOR) as HTMLButtonElement | null;
    if (connectButton) {
      connectButton.removeEventListener('click', handleConnectClick);
    }
  };
}

// Handle connect button click
function handleConnectClick(event: MouseEvent) {
  const deviceInfo = detectDevice();
  
  // Only intercept on mobile devices not in Phantom
  if (!deviceInfo.supportsDeeplinks) return;
  
  // Stop the original click event
  event.preventDefault();
  event.stopPropagation();
  
  // Get the current URL without any query parameters
  const currentUrl = window.location.origin + window.location.pathname;
  
  // Create the Phantom browser URL
  const phantomUrl = `${PHANTOM_BROWSER_URL}/${encodeURIComponent(currentUrl)}`;
  
  // Save current state before redirect
  const currentState = {
    timestamp: Date.now(),
    returnUrl: currentUrl
  };
  
  try {
    sessionStorage.setItem(REDIRECT_STATE_KEY, JSON.stringify(currentState));
    
    // Redirect to Phantom browser
    console.log('Redirecting to Phantom browser:', phantomUrl);
    window.location.href = phantomUrl;
  } catch (error) {
    console.error('Failed to save redirect state:', error);
    // Still try to redirect even if we can't save state
    window.location.href = phantomUrl;
  }
}

// Process incoming deeplink response from Phantom
function processDeeplinkResponse() {
  if (typeof window === 'undefined') return;
  
  try {
    // Check if we're returning from Phantom
    const savedState = sessionStorage.getItem(REDIRECT_STATE_KEY);
    if (savedState) {
      const state = JSON.parse(savedState);
      
      // Clear the saved state
      sessionStorage.removeItem(REDIRECT_STATE_KEY);
      
      // If this is a fresh return (within last 5 minutes)
      if (Date.now() - state.timestamp < 300000) {
        console.log('Returned from Phantom browser');
        
        // Let Jupiter Terminal handle the connection
        // The WalletAdapter will detect Phantom automatically
      }
    }
  } catch (error) {
    console.error('Failed to process return from Phantom:', error);
  }
} 