'use client';

import { useEffect, useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { generateDappKeyPair, createSharedSecret, decryptPayload } from '@/utils/phantom/encryption';
import { createConnectURL } from '@/utils/phantom/deeplink';
import { saveSession, getSession, clearSession, getSharedSecretFromSession } from '@/utils/phantom/session';
import { detectDevice } from '@/utils/device-detection';

export type PhantomConnectionState = {
  isConnecting: boolean;
  isRedirecting: boolean;
  error: string | null;
  publicKey: string | null;
};

export function usePhantomConnection() {
  const wallet = useWallet();
  const [dappKeyPair] = useState(generateDappKeyPair);
  const [connectionState, setConnectionState] = useState<PhantomConnectionState>({
    isConnecting: false,
    isRedirecting: false,
    error: null,
    publicKey: null
  });
  const deviceInfo = detectDevice();

  // Process connection response from Phantom
  const processConnectionResponse = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const url = new URL(window.location.href);
      const params = url.searchParams;
      
      // Handle error responses
      if (params.has('errorCode')) {
        const errorCode = params.get('errorCode');
        const errorMessage = params.get('errorMessage');
        setConnectionState(state => ({
          ...state,
          isConnecting: false,
          error: errorMessage || `Error connecting to Phantom (${errorCode})`
        }));
        
        // Clean URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }
      
      // Process successful connection
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
        
        // Save the session for future use
        saveSession(
          decryptedData.public_key,
          decryptedData.session,
          sharedSecret
        );
        
        // Update state with public key
        setConnectionState({
          isConnecting: false,
          isRedirecting: false,
          error: null,
          publicKey: decryptedData.public_key
        });
        
        // Try to connect via wallet adapter
        if (wallet.wallet) {
          wallet.connect().catch(console.error);
        }
        
        // Clean URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (error) {
      console.error('Failed to process connection response:', error);
      setConnectionState(state => ({
        ...state,
        isConnecting: false,
        error: 'Failed to process connection response'
      }));
    }
  }, [dappKeyPair.secretKey, wallet]);

  // Check for initial session and URL parameters on mount
  useEffect(() => {
    // Try to restore session from storage
    const savedSession = getSession();
    if (savedSession?.publicKey) {
      setConnectionState(state => ({
        ...state,
        publicKey: savedSession.publicKey
      }));
    }
    
    // Check if we're returning from a deeplink
    processConnectionResponse();
  }, [processConnectionResponse]);

  // Connect to Phantom
  const connectToPhantom = useCallback(() => {
    if (!deviceInfo.isMobile || !deviceInfo.supportsDeeplinks) {
      // For desktop, use normal wallet adapter
      if (wallet.wallet) {
        wallet.connect().catch((err: Error) => {
          setConnectionState(state => ({
            ...state,
            error: 'Failed to connect wallet'
          }));
        });
      }
      return;
    }
    
    // For mobile, use deeplink
    try {
      setConnectionState(state => ({
        ...state,
        isConnecting: true,
        isRedirecting: true,
        error: null
      }));
      
      // Create full URL for the redirect back to this page
      const redirectUrl = `${window.location.origin}${window.location.pathname}`;
      
      // Create Phantom connection URL
      const phantomUrl = createConnectURL(
        dappKeyPair.publicKey,
        redirectUrl
      );
      
      // Redirect to Phantom
      window.location.href = phantomUrl;
    } catch (error) {
      console.error('Failed to create connection URL:', error);
      setConnectionState(state => ({
        ...state,
        isConnecting: false,
        isRedirecting: false,
        error: 'Failed to connect to Phantom'
      }));
    }
  }, [deviceInfo.isMobile, deviceInfo.supportsDeeplinks, dappKeyPair.publicKey, wallet]);

  // Disconnect from Phantom
  const disconnectFromPhantom = useCallback(() => {
    // Clear session
    clearSession();
    
    // Disconnect wallet adapter
    if (wallet.connected) {
      wallet.disconnect().catch(console.error);
    }
    
    // Reset state
    setConnectionState({
      isConnecting: false,
      isRedirecting: false,
      error: null,
      publicKey: null
    });
  }, [wallet]);

  return {
    ...connectionState,
    isMobile: deviceInfo.isMobile,
    connect: connectToPhantom,
    disconnect: disconnectFromPhantom,
    walletConnected: wallet.connected
  };
} 