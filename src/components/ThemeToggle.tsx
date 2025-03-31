'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  
  // Logo URLs for reference
  const logoLight = 'https://ipfs.io/ipfs/bafkreic4h3qlk5ezs2ajufdtfvpaqcm7ogabsj4kbghthosc6bw6s3kwry';
  const logoDark = '/butt-banner-light.png';

  // Wait for component to mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initial empty state to avoid hydration mismatches
  if (!mounted) {
    return (
      <button 
        className="theme-toggle" 
        aria-label="Toggle dark mode"
      >
        <div style={{ width: 24, height: 24 }} />
      </button>
    );
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button 
      className="theme-toggle" 
      onClick={toggleTheme} 
      aria-label="Toggle dark mode"
    >
      <Image 
        src={resolvedTheme === 'dark' ? '/icons/sun.svg' : '/icons/moon.svg'} 
        alt="Theme" 
        width={24}
        height={24}
      />
    </button>
  );
} 