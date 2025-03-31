'use client';

import { generateDappKeyPair } from './encryption';
import { createConnectURL } from './deeplink';
import { detectDevice } from '../device-detection';
import { saveSession, getSession } from './session';

/**
 * This utility handles Phantom deeplinks for the Jupiter Terminal
 * It detects when the connect wallet button is clicked in the terminal
 * and redirects to Phantom app on mobile
 */

// Initialize state
let dappKeyPair = generateDappKeyPair();
let isInitialized = false;

// Class name of Jupiter's connect wallet button
const JUPITER_WALLET_BUTTON_SELECTOR = 'button[data-testid="connect-wallet-button"]';

export function initPhantomDeeplinkHandler() {
  if (typeof window === 'undefined' || isInitialized) return;
  
  const deviceInfo = detectDevice();
  isInitialized = true;
  
  // Only apply on mobile devices
  if (!deviceInfo.isMobile) return;
  
  console.log('Initializing Phantom deeplink handler for mobile devices');
  
  // We need to intercept Jupiter's wallet connection flow
  // by watching for the connect wallet button click
  const observer = new MutationObserver((mutations) => {
    // Check if Jupiter Terminal is loaded and the connect button exists
    const connectButton = document.querySelector(JUPITER_WALLET_BUTTON_SELECTOR) as HTMLButtonElement | null;
    
    if (connectButton) {
      // Remove any previous listeners to avoid duplicates
      connectButton.removeEventListener('click', handleConnectClick);
      
      // Add a listener that will intercept the click
      connectButton.addEventListener('click', handleConnectClick);
    }
  });
  
  // Start observing DOM changes
  observer.observe(document.body, { 
    childList: true, 
    subtree: true 
  });
  
  // Check for incoming parameters from Phantom redirect
  processDeeplinkResponse();
}

// Handle connect button click
function handleConnectClick(event: MouseEvent) {
  const deviceInfo = detectDevice();
  
  // Only intercept on mobile
  if (!deviceInfo.isMobile) return;
  
  // Stop the original click event
  event.preventDefault();
  event.stopPropagation();
  
  // Create the redirect URL (current page)
  const redirectUrl = window.location.href;
  
  // Generate the Phantom deeplink
  const phantomUrl = createConnectURL(
    dappKeyPair.publicKey,
    redirectUrl
  );
  
  // Redirect to Phantom app
  console.log('Redirecting to Phantom app');
  window.location.href = phantomUrl;
}

// Process incoming deeplink response from Phantom
function processDeeplinkResponse() {
  if (typeof window === 'undefined') return;
  
  try {
    const url = new URL(window.location.href);
    const params = url.searchParams;
    
    // Check if we've received a Phantom response
    if (params.has('phantom_encryption_public_key') && params.has('data') && params.has('nonce')) {
      console.log('Detected Phantom deeplink response, processing...');
      
      // The actual processing is handled by the PhantomConnection hook
      // This is just a placeholder - the connection should be handled separately
      // and the WalletAdapter will be updated automatically
      
      // Clean URL parameters to avoid processing again on refresh
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  } catch (error) {
    console.error('Failed to process deeplink response:', error);
  }
} 