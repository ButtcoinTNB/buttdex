'use client';

import React, { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { generateDappKeyPair, createSharedSecret, decryptPayload } from '@/utils/phantom/encryption';
import { saveSession, getSession } from '@/utils/phantom/session';

/**
 * This component doesn't render anything visible
 * It just handles the Phantom deeplink connection process
 * by processing URL parameters and updating the wallet context
 */
export function PhantomConnectionHandler() {
  const wallet = useWallet();
  const [dappKeyPair] = useState(generateDappKeyPair);
  
  // Process Phantom deeplink response
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      // Check for Phantom response in URL
      const url = new URL(window.location.href);
      const params = url.searchParams;
      
      // Handle connection response
      if (params.has('phantom_encryption_public_key') && params.has('data') && params.has('nonce')) {
        const phantomEncryptionPublicKey = params.get('phantom_encryption_public_key')!;
        const data = params.get('data')!;
        const nonce = params.get('nonce')!;
        
        // Create shared secret
        const sharedSecret = createSharedSecret(
          phantomEncryptionPublicKey,
          dappKeyPair.secretKey
        );
        
        // Decrypt the response data
        const decryptedData = decryptPayload(data, nonce, sharedSecret);
        
        // Save session for future use
        saveSession(
          decryptedData.public_key,
          decryptedData.session,
          sharedSecret
        );
        
        console.log('Successfully processed Phantom connection:', decryptedData.public_key);
        
        // Connect to wallet via wallet adapter
        if (wallet.wallet && !wallet.connected) {
          wallet.connect().catch(console.error);
        }
        
        // Clean URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (error) {
      console.error('Failed to process Phantom connection:', error);
    }
  }, [dappKeyPair.secretKey, wallet]);
  
  // Check for saved session
  useEffect(() => {
    const savedSession = getSession();
    if (savedSession && savedSession.publicKey && wallet.wallet && !wallet.connected) {
      // Try to reconnect if we have a saved session
      wallet.connect().catch(console.error);
    }
  }, [wallet]);
  
  // Only handle connection if Jupiter Terminal isn't managing it
  useEffect(() => {
    if (!window.Jupiter && wallet.wallet && !wallet.connected) {
      wallet.connect().catch(console.error);
    }
  }, [wallet]);
  
  // Don't render anything - this is just processing
  return null;
} 