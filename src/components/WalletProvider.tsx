'use client';

import React, { FC, ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
// Remove Phantom adapter import since it's detected via standard wallet
// import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';

// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';

interface Props {
  children: ReactNode;
}

export const WalletProvider: FC<Props> = ({ children }) => {
  // You can also provide a custom RPC endpoint
  const endpoint = useMemo(() => process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'https://api.mainnet-beta.solana.com', []);

  // Initialize empty wallet adapters array
  // Let Jupiter Terminal detect wallets automatically
  const wallets = useMemo(() => [], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
}; 