'use client';

import React, { FC, ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { detectDevice } from '@/utils/device-detection';

// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';

interface Props {
  children: ReactNode;
}

export const WalletProvider: FC<Props> = ({ children }) => {
  // You can also provide a custom RPC endpoint
  const endpoint = useMemo(() => process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'https://api.mainnet-beta.solana.com', []);

  // Initialize wallet adapters with appropriate configuration
  const wallets = useMemo(() => {
    // We're in the server environment during SSR
    if (typeof window === 'undefined') return [];
    
    // Always include PhantomWalletAdapter, but configure differently based on device
    const deviceInfo = detectDevice();
    
    if (deviceInfo.isMobile) {
      console.log('Mobile device detected: initializing wallet adapters');
      return [new PhantomWalletAdapter()];
    } else {
      console.log('Desktop device detected: providing passive wallet adapter');
      // Return PhantomWalletAdapter but don't autoConnect - let Jupiter Terminal handle it
      return [new PhantomWalletAdapter()];
    }
  }, []);

  // autoConnect only on mobile to avoid conflicts with Jupiter Terminal on desktop
  const deviceInfo = typeof window !== 'undefined' ? detectDevice() : { isMobile: false };
  const shouldAutoConnect = deviceInfo.isMobile;

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect={shouldAutoConnect}>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
}; 