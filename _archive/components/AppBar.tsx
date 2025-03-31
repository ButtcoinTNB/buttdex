import { FC } from 'react';
import Link from "next/link";
import dynamic from 'next/dynamic';
import React, { useState } from "react";
import { useAutoConnect } from '../contexts/AutoConnectProvider';
import NetworkSwitcher from './NetworkSwitcher';
import NavElement from './nav-element';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useTheme } from 'next-themes';

const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export const AppBar: React.FC = () => {
  const { autoConnect, setAutoConnect } = useAutoConnect();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex-none px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" passHref>
            <div className="flex items-center gap-2 cursor-pointer">
              <img
                src={theme === 'dark' ? '/butt-banner-light.png' : '/butt-banner1.png'}
                alt="ButtDex Logo"
                className="h-8"
              />
            </div>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <button
            className="text-2xl"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? '🌞' : '🌙'}
          </button>
          <WalletMultiButton />
        </div>
      </div>
    </div>
  );
};
