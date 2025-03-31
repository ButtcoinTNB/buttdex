'use client';

import React, { ReactNode } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { PhantomConnectionHandler } from '@/components/phantom/PhantomConnectionHandler';
import { isMobile } from '@/utils/device';

// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';

interface WalletProviderWrapperProps {
  children: ReactNode;
}

export function WalletProviderWrapper({ children }: WalletProviderWrapperProps) {
  // You can also provide a custom RPC endpoint
  const endpoint = process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'https://api.mainnet-beta.solana.com';

  // Generate the wallet adapter
  const walletAdapter = React.useMemo(() => {
    return [new PhantomWalletAdapter()];
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={walletAdapter} autoConnect>
        <WalletModalProvider>
          {children}
          {isMobile() && <PhantomConnectionHandler />}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
} 