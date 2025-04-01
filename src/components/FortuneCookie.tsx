'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getRandomFortune } from '@/data/fortunes';

interface FortuneCookieProps {
  visible: boolean;
  onClose: () => void;
}

export default function FortuneCookie({ visible, onClose }: FortuneCookieProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [fortune, setFortune] = useState(getRandomFortune());
  const [isCopied, setIsCopied] = useState(false);

  // Reset state when visibility changes
  useEffect(() => {
    if (visible) {
      setIsOpen(false);
      setFortune(getRandomFortune());
      setIsCopied(false);
    }
  }, [visible]);

  if (!visible) return null;

  const handleClick = () => {
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const downloadImage = () => {
    // Create a canvas to combine the cookie and text
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 600;
    canvas.height = 400;

    // Fill with background color
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Buttcoin logo
    const logo = new Image();
    logo.onload = () => {
      ctx.drawImage(logo, canvas.width/2 - 50, 40, 100, 100);
      
      // Add text
      ctx.font = 'bold 24px Arial';
      ctx.fillStyle = '#FFD700';
      ctx.textAlign = 'center';
      ctx.fillText('My ButtDex Fortune:', canvas.width/2, 180);
      
      // Fortune text
      ctx.font = '18px Arial';
      ctx.fillStyle = '#FFFFFF';
      
      // Word wrap for fortune text
      const words = fortune.message.split(' ');
      let line = '';
      let y = 220;
      
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > canvas.width - 100 && i > 0) {
          ctx.fillText(line, canvas.width/2, y);
          line = words[i] + ' ';
          y += 30;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, canvas.width/2, y);
      
      // Add buttdex.com at the bottom
      ctx.font = '16px Arial';
      ctx.fillStyle = '#888';
      ctx.fillText('buttdex.com', canvas.width/2, 360);
      
      // Convert to image and download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'my-buttdex-fortune.png';
      link.href = dataUrl;
      link.click();
    };
    logo.src = '/buttcoin-shiny.png';
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(`My ButtDex Fortune: "${fortune.message}" 🥠✨\n\nGet your fortune at buttdex.com #Buttcoin #ButtDex`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`My ButtDex Fortune: "${fortune.message}" 🥠✨\n\nGet your fortune at buttdex.com`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[1001] bg-black/70" onClick={onClose}>
      <div 
        className="relative p-8 rounded-xl max-w-md w-full text-center transition-all duration-500 transform"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`transition-all duration-700 transform ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}>
          <div className="cursor-pointer" onClick={handleClick}>
            <Image 
              src="/fortune-cookie-closed.png" 
              alt="Fortune Cookie" 
              width={200} 
              height={200} 
              className="mx-auto hover:scale-105 transition-transform" 
            />
            <p className="text-yellow-400 mt-4 font-bold">Click the cookie to reveal your fortune!</p>
          </div>
        </div>

        <div className={`absolute top-0 left-0 w-full p-8 transition-all duration-700 transform ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
          <div>
            <Image 
              src="/fortune-cookie-open.png" 
              alt="Open Fortune Cookie" 
              width={200} 
              height={200} 
              className="mx-auto" 
            />
            <div className="mt-6 p-4 bg-white/10 backdrop-blur-md rounded-lg">
              <p className="text-white text-lg italic">"{fortune.message}"</p>
            </div>
            
            <div className="mt-6 flex justify-center space-x-3">
              <button 
                onClick={shareOnTwitter}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                Share on X
              </button>
              <button 
                onClick={downloadImage}
                className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition"
              >
                Download
              </button>
              <button 
                onClick={copyToClipboard}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
              >
                {isCopied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 