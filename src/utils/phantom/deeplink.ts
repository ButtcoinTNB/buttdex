import bs58 from "bs58";

const PHANTOM_BASE_URL = "https://phantom.app/ul/v1";

// Build Phantom deeplink URL with proper parameters
export const buildPhantomDeeplinkURL = (
  method: 'connect' | 'disconnect' | 'signAndSendTransaction',
  params: Record<string, string>
): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    searchParams.append(key, value);
  });
  
  return `${PHANTOM_BASE_URL}/${method}?${searchParams.toString()}`;
};

// Create connect URL with required parameters
export const createConnectURL = (
  dappPublicKey: Uint8Array,
  redirectLink: string
): string => {
  return buildPhantomDeeplinkURL("connect", {
    dapp_encryption_public_key: bs58.encode(dappPublicKey),
    redirect_link: redirectLink,
    app_url: "https://buttdex.com",
    cluster: "mainnet-beta" // Use appropriate network
  });
}; 