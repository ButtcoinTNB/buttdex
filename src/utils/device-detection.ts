// Augment Window interface globally
declare global {
  interface Window {
    MSStream?: unknown;
  }
}

interface DeviceInfo {
  readonly isMobile: boolean;
  readonly isIOS: boolean;
  readonly isAndroid: boolean;
  readonly isBrowser: boolean;
  readonly isPhantomBrowser: boolean;
  readonly supportsDeeplinks: boolean;
}

/**
 * Detects device information and capabilities
 * @returns Immutable device information object
 */
export function detectDevice(): Readonly<DeviceInfo> {
  // Server-side check
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return Object.freeze({
      isMobile: false,
      isIOS: false,
      isAndroid: false,
      isBrowser: false,
      isPhantomBrowser: false,
      supportsDeeplinks: false,
    });
  }

  const userAgent = navigator.userAgent.toLowerCase();
  
  // iOS detection - more precise check
  const isIOS = /iphone|ipad|ipod/.test(userAgent) && !window.MSStream;
  
  // Android detection - more precise check
  const isAndroid = /android/.test(userAgent);
  
  // General mobile detection (excludes tablets for better UX)
  const isMobile = /iphone|ipod|android.*mobile|windows.*phone|blackberry.*mobile/i.test(userAgent);

  // Detect if we're in the Phantom browser
  const isPhantomBrowser = 
    window.location.href.startsWith('https://phantom.app/ul/browse') || 
    userAgent.includes('phantom');

  // Support for deeplinks on mobile devices not in Phantom
  const supportsDeeplinks = isMobile && !isPhantomBrowser;
  
  return Object.freeze({
    isMobile,
    isIOS,
    isAndroid,
    isBrowser: true,
    isPhantomBrowser,
    supportsDeeplinks,
  });
} 