import bs58 from "bs58";

type PhantomSession = {
  publicKey: string;
  session: string;
  sharedSecret: string; // Base58 encoded for storage
  timestamp: number;
};

const SESSION_STORAGE_KEY = 'phantom_connection_session';

// Save connection session to localStorage
export const saveSession = (
  publicKey: string,
  session: string,
  sharedSecret: Uint8Array
): void => {
  if (typeof window === 'undefined') return;
  
  const sessionData: PhantomSession = {
    publicKey,
    session,
    sharedSecret: bs58.encode(sharedSecret),
    timestamp: Date.now()
  };
  
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
};

// Retrieve saved session from localStorage
export const getSession = (): PhantomSession | null => {
  if (typeof window === 'undefined') return null;
  
  const sessionData = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!sessionData) return null;
  
  try {
    return JSON.parse(sessionData) as PhantomSession;
  } catch (error) {
    console.error("Failed to parse session data:", error);
    return null;
  }
};

// Clear saved session
export const clearSession = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_STORAGE_KEY);
};

// Convert stored shared secret back to Uint8Array
export const getSharedSecretFromSession = (): Uint8Array | null => {
  const session = getSession();
  if (!session?.sharedSecret) return null;
  
  try {
    return bs58.decode(session.sharedSecret);
  } catch (error) {
    console.error("Failed to decode shared secret:", error);
    return null;
  }
}; 