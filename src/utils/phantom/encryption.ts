import nacl from "tweetnacl";
import bs58 from "bs58";

// Generate new keypair for the dapp
export const generateDappKeyPair = () => nacl.box.keyPair();

// Create shared secret from Phantom's public key and our private key
export const createSharedSecret = (
  phantomEncryptionPublicKey: string,
  dappSecretKey: Uint8Array
): Uint8Array => {
  return nacl.box.before(
    bs58.decode(phantomEncryptionPublicKey),
    dappSecretKey
  );
};

// Decrypt data coming from Phantom
export const decryptPayload = (
  data: string,
  nonce: string,
  sharedSecret: Uint8Array
): any => {
  try {
    const decryptedData = nacl.box.open.after(
      bs58.decode(data),
      bs58.decode(nonce),
      sharedSecret
    );
    
    if (!decryptedData) {
      throw new Error("Failed to decrypt data");
    }
    
    return JSON.parse(Buffer.from(decryptedData).toString("utf8"));
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error("Unable to decrypt response from Phantom");
  }
};

// Encrypt data to send to Phantom (for future use)
export const encryptPayload = (
  payload: any,
  sharedSecret: Uint8Array
): { nonce: Uint8Array; encryptedPayload: Uint8Array } => {
  const nonce = nacl.randomBytes(24);
  const encryptedPayload = nacl.box.after(
    Buffer.from(JSON.stringify(payload)),
    nonce,
    sharedSecret
  );
  
  return { nonce, encryptedPayload };
}; 