type DeviceInfo = {
  isMobile: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isBrowser: boolean;
  isPhantomBrowser: boolean;
  supportsDeeplinks: boolean;
};

export function detectDevice(): DeviceInfo {
  // Server-side check
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {
      isMobile: false,
      isIOS: false,
      isAndroid: false,
      isBrowser: false,
      isPhantomBrowser: false,
      supportsDeeplinks: false
    };
  }

  const userAgent = navigator.userAgent.toLowerCase();
  
  // iOS detection - more precise check
  const isIOS = /iphone|ipad|ipod/.test(userAgent) && !(window as any).MSStream;
  
  // Android detection - more precise check
  const isAndroid = /android/.test(userAgent);
  
  // General mobile detection (excludes tablets for better UX)
  const isMobile = /iphone|ipod|android.*mobile|windows.*phone|blackberry.*mobile/i.test(userAgent);

  // Detect if we're in the Phantom browser
  const isPhantomBrowser = window.location.href.startsWith('https://phantom.app/ul/browse') || 
                          userAgent.includes('phantom');

  // Support for deeplinks on mobile devices not in Phantom
  const supportsDeeplinks = isMobile && !isPhantomBrowser;
  
  return {
    isMobile,
    isIOS,
    isAndroid,
    isBrowser: true,
    isPhantomBrowser,
    supportsDeeplinks
  };
} 