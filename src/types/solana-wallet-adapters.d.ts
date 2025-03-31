/**
 * Declaration file for Solana wallet adapter packages
 */

declare module '@solana/wallet-adapter-react' {
  import { FC, ReactNode } from 'react';
  import { PublicKey, Transaction } from '@solana/web3.js';

  export interface Wallet {
    adapter: any;
    readyState: any;
  }

  export interface WalletContextState {
    wallet: Wallet | null;
    adapter: any | null;
    connecting: boolean;
    connected: boolean;
    disconnecting: boolean;
    publicKey: PublicKey | null;
    select: (walletName: string) => void;
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    sendTransaction: (transaction: Transaction, connection: any) => Promise<string>;
  }

  export function useWallet(): WalletContextState;

  export interface ConnectionProviderProps {
    children: ReactNode;
    endpoint: string;
  }

  export interface WalletProviderProps {
    children: ReactNode;
    wallets: any[];
    autoConnect?: boolean;
  }

  export const ConnectionProvider: FC<ConnectionProviderProps>;
  export const WalletProvider: FC<WalletProviderProps>;
}

declare module '@solana/wallet-adapter-react-ui' {
  import { FC, ReactNode } from 'react';

  export interface WalletModalProviderProps {
    children: ReactNode;
  }

  export const WalletModalProvider: FC<WalletModalProviderProps>;
}

declare module '@solana/wallet-adapter-phantom' {
  export class PhantomWalletAdapter {
    constructor();
    name: string;
  }
} 