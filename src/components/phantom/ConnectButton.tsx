'use client';

import React from 'react';
import { usePhantomConnection } from './PhantomConnection';

export function PhantomConnectButton() {
  const {
    isConnecting,
    isRedirecting,
    error,
    publicKey,
    walletConnected,
    connect,
    disconnect,
    isMobile
  } = usePhantomConnection();

  // Format public key for display
  const formattedPublicKey = publicKey && 
    `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`;
  
  // Handle connection error
  const handleRetry = () => {
    connect();
  };

  if (error) {
    return (
      <div className="flex flex-col gap-2">
        <button 
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700" 
          onClick={handleRetry}
        >
          Connection Error - Retry
        </button>
        <p className="text-xs text-red-500">{error}</p>
      </div>
    );
  }

  if (isConnecting) {
    return (
      <button 
        disabled 
        className="w-full bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
      >
        <span className="mr-2">
          {/* Simple loading spinner */}
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </span>
        {isRedirecting ? 'Opening Phantom...' : 'Connecting...'}
      </button>
    );
  }

  if (walletConnected || publicKey) {
    return (
      <button 
        className="w-full border border-gray-300 text-white px-4 py-2 rounded hover:bg-gray-700"
        onClick={disconnect}
      >
        {formattedPublicKey || 'Connected'}
      </button>
    );
  }

  return (
    <button 
      onClick={connect} 
      className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
    >
      Connect {isMobile ? 'with Phantom' : 'Wallet'}
    </button>
  );
} 