/**
 * Utility functions for device detection
 */

import { detectDevice } from './device-detection';

/**
 * Check if the current device is a mobile device
 */
export function isMobile(): boolean {
  return detectDevice().isMobile;
} 