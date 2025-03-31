import { PublicKey, Transaction } from '@solana/web3.js';

interface JupiterTerminalOptions {
  displayMode: "modal" | "integrated";
  integratedTargetId?: string;
  endpoint: string;
  strictTokenList?: boolean;
  appearance?: "dark" | "light";
  defaultExplorer?: "Solana Explorer" | "Solscan" | "Solana Beach" | "SolanaFM";
  walletConnectionStrategy?: "auto" | "custom" | "inherit";
  enableWalletPassthrough?: boolean;
  passThoughWalletTokenAccounts?: boolean;
  formProps?: {
    fixedInputMint?: boolean;
    fixedOutputMint?: boolean;
    swapMode?: "ExactIn" | "ExactOut";
    fixedAmount?: boolean;
    initialAmount?: string;
    initialSlippageBps?: number;
    initialInputMint?: string;
    initialOutputMint?: string;
  };
  platformFeeAndAccounts?: Array<{
    feeBps: number;
    feeAccount: string;
  }>;
  containerStyles?: {
    width?: string;
    height?: string;
    borderRadius?: string;
    boxShadow?: string;
    backgroundColor?: string;
    padding?: string;
    margin?: string;
    marginBottom?: string;
  };
  containerClassName?: string;
  onSuccess?: (result: { txid: string; swapResult: any }) => void;
  onSwapError?: (error: { error: Error }) => void;
  onReady?: () => void;
}

/**
 * TypeScript declaration for Jupiter Terminal
 */

export interface JupiterTerminal {
  init: (options: JupiterTerminalOptions) => void;
  resume: () => void;
  close: () => void;
  syncProps?: (props: any) => void;
  _instance?: any;
}

declare global {
  interface Window {
    Jupiter: JupiterTerminal;
  }
}

export type { JupiterTerminalOptions }; 