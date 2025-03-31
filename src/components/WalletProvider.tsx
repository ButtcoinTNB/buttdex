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

  // Only initialize wallet adapters on the client
  const wallets = useMemo(() => {
    // We're in the server environment during SSR
    if (typeof window === 'undefined') return [];
    
    // On the client, check if we're on mobile
    const deviceInfo = detectDevice();
    if (deviceInfo.isMobile) {
      console.log('Mobile device detected: initializing wallet adapters');
      return [new PhantomWalletAdapter()];
    } else {
      console.log('Desktop device detected: skipping wallet adapter initialization');
      // Return an empty array to avoid conflicts with Jupiter Terminal
      // This lets Jupiter Terminal handle wallet connections on desktop
      return [];
    }
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
}; 