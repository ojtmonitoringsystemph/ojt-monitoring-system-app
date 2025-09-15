const encoder = new TextEncoder();
const decoder = new TextDecoder();

const IV_LENGTH = 16; // AES-CBC IV size in bytes

const getKey = async (secret: string): Promise<CryptoKey> => {
  const keyData = encoder.encode(secret.padEnd(32).slice(0, 32)); // AES-256 requires 32 bytes
  return crypto.subtle.importKey("raw", keyData, { name: "AES-CBC" }, false, [
    "encrypt",
    "decrypt",
  ]);
};

// Base64URL encode a Uint8Array
const base64urlEncode = (data: Uint8Array): string => {
  return btoa(String.fromCharCode(...data))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

// Base64URL decode a string to Uint8Array
const base64urlDecode = (base64url: string): Uint8Array => {
  const padded = base64url
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(base64url.length + ((4 - (base64url.length % 4)) % 4), "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
};

export async function createEncryptedToken(
  payload: Record<string, any>,
  secret: string,
  expiresInMs: number = 60 * 60 * 1000 // 1 hour default
): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const exp = Date.now() + expiresInMs;
  const json = JSON.stringify({ ...payload, exp });

  const key = await getKey(secret);
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-CBC", iv },
    key,
    encoder.encode(json)
  );

  const encryptedBytes = new Uint8Array(encrypted);
  return `${base64urlEncode(iv)}.${base64urlEncode(encryptedBytes)}`;
}

export async function decodeEncryptedToken(
  token: string,
  secret: string
): Promise<Record<string, any>> {
  if (!token || typeof token !== "string" || !token.includes(".")) {
    throw new Error("Invalid or missing token");
  }

  const [ivStr, encryptedStr] = token.split(".");
  if (!ivStr || !encryptedStr) {
    throw new Error("Invalid token format");
  }

  const iv = base64urlDecode(ivStr);
  const encrypted = base64urlDecode(encryptedStr);
  const key = await getKey(secret);

  let decryptedBuffer;
  try {
    decryptedBuffer = await crypto.subtle.decrypt(
      { name: "AES-CBC", iv },
      key,
      encrypted
    );
  } catch (err) {
    throw new Error("Failed to decrypt token");
  }

  let json: string;
  try {
    json = decoder.decode(decryptedBuffer);
  } catch (e) {
    throw new Error("Unable to decode decrypted data");
  }

  let payload: any;
  try {
    payload = JSON.parse(json);
  } catch (e) {
    throw new Error("Invalid token payload JSON");
  }

  if (typeof payload.exp !== "number" || Date.now() > payload.exp) {
    throw new Error("Token has expired");
  }

  delete payload.exp;
  return payload;
}
