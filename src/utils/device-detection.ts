type DeviceInfo = {
  isMobile: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isBrowser: boolean;
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
      supportsDeeplinks: false
    };
  }

  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  
  // iOS detection
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
  
  // Android detection
  const isAndroid = /Android/.test(userAgent);
  
  // General mobile detection (includes tablets)
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent) ||
    (!!navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.platform));

  // Support for deeplinks is assumed on mobile devices
  // In a more robust implementation, we might test this capability
  const supportsDeeplinks = isMobile;
  
  return {
    isMobile,
    isIOS,
    isAndroid,
    isBrowser: true,
    supportsDeeplinks
  };
} 