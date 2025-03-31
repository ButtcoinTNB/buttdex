'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function ThemeLogo() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  
  // Logo URLs
  const logoLight = 'https://ipfs.io/ipfs/bafkreic4h3qlk5ezs2ajufdtfvpaqcm7ogabsj4kbghthosc6bw6s3kwry';
  const logoDark = '/butt-banner-light.png';

  // Wait for component to mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initial render with empty alt to prevent layout shift
  if (!mounted) {
    return (
      <div 
        className="logo" 
        style={{ 
          width: '160px', 
          height: '40px',
          display: 'block'
        }}
      />
    );
  }

  return (
    <Image 
      src={resolvedTheme === 'dark' ? logoDark : logoLight}
      alt="ButtDex Logo" 
      className="logo" 
      width={160}
      height={40}
      priority
      quality={100}
      loading="eager"
    />
  );
} 