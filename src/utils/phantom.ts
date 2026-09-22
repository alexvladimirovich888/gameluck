// Phantom Wallet Solana Provider Utility

export const WALLET_STORAGE_KEY = 'goldbound_solana_wallet_address';

export interface PhantomProvider {
  isPhantom?: boolean;
  isConnected?: boolean;
  publicKey?: { toString(): string; toBase58?(): string };
  account?: { address?: string };
  accounts?: Array<{ address?: string }>;
  connect(opts?: { onlyIfTrusted?: boolean }): Promise<any>;
  disconnect(): Promise<void>;
  on?(event: string, callback: (...args: any[]) => void): void;
  removeListener?(event: string, callback: (...args: any[]) => void): void;
}

export function getStoredWalletAddress(): string {
  if (typeof window === 'undefined') return '';
  try {
    return localStorage.getItem(WALLET_STORAGE_KEY) || '';
  } catch {
    return '';
  }
}

export function setStoredWalletAddress(addr: string): void {
  if (typeof window === 'undefined') return;
  try {
    if (addr) {
      localStorage.setItem(WALLET_STORAGE_KEY, addr);
    } else {
      localStorage.removeItem(WALLET_STORAGE_KEY);
    }
  } catch {}
}

export function clearStoredWalletAddress(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(WALLET_STORAGE_KEY);
  } catch {}
}

export function extractSolanaAddress(obj: any): string {
  if (!obj) return '';
  if (typeof obj === 'string') {
    const trimmed = obj.trim();
    if (trimmed.length >= 28 && trimmed.length <= 48) return trimmed;
    if (trimmed.length > 0 && trimmed !== '[object Object]') return trimmed;
  }
  // Try toBase58
  if (typeof obj.toBase58 === 'function') {
    try {
      const b58 = obj.toBase58();
      if (b58 && typeof b58 === 'string') return b58;
    } catch {}
  }
  // Try toString
  if (typeof obj.toString === 'function') {
    try {
      const str = obj.toString();
      if (str && typeof str === 'string' && str !== '[object Object]') return str;
    } catch {}
  }
  // Try publicKey property
  if (obj.publicKey) {
    const fromPk = extractSolanaAddress(obj.publicKey);
    if (fromPk) return fromPk;
  }
  // Try address property (Solana Standard)
  if (obj.address) {
    const fromAddr = extractSolanaAddress(obj.address);
    if (fromAddr) return fromAddr;
  }
  // Try accounts
  if (Array.isArray(obj.accounts) && obj.accounts.length > 0) {
    const fromAcc = extractSolanaAddress(obj.accounts[0]);
    if (fromAcc) return fromAcc;
  }
  return '';
}

export function getPhantomProvider(): PhantomProvider | null {
  if (typeof window === 'undefined') return null;
  const anyWindow = window as any;

  // 1. Standard modern phantom solana injection
  if (anyWindow.phantom?.solana) {
    return anyWindow.phantom.solana;
  }
  // 2. Legacy solana injection with isPhantom
  if (anyWindow.solana?.isPhantom) {
    return anyWindow.solana;
  }
  // 3. Fallback solana provider
  if (anyWindow.solana) {
    return anyWindow.solana;
  }

  // 4. In case the app is embedded in an iframe on the same origin
  try {
    if (anyWindow.parent && anyWindow.parent !== anyWindow) {
      if (anyWindow.parent.phantom?.solana) return anyWindow.parent.phantom.solana;
      if (anyWindow.parent.solana) return anyWindow.parent.solana;
    }
  } catch {}

  return null;
}

export async function connectPhantom(): Promise<{
  success: boolean;
  address?: string;
  error?: string;
  notInstalled?: boolean;
}> {
  const provider = getPhantomProvider();
  if (!provider) {
    if (typeof window !== 'undefined') {
      window.open('https://phantom.app/', '_blank');
    }
    return {
      success: false,
      notInstalled: true,
      error: 'Phantom wallet extension not detected. Opening phantom.app in a new tab...'
    };
  }

  try {
    const resp = await provider.connect();

    // 1. Try immediate extraction from resp and provider
    let address =
      extractSolanaAddress(resp) ||
      extractSolanaAddress(resp?.publicKey) ||
      extractSolanaAddress(provider.publicKey) ||
      extractSolanaAddress(provider.account?.address) ||
      extractSolanaAddress((window as any).solana?.publicKey) ||
      extractSolanaAddress((window as any).phantom?.solana?.publicKey);

    // 2. If empty, poll briefly (up to 1.5 seconds) for provider to populate as extension popup closes
    if (!address) {
      for (let i = 0; i < 15; i++) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        address =
          extractSolanaAddress(provider.publicKey) ||
          extractSolanaAddress(provider.account?.address) ||
          extractSolanaAddress((window as any).solana?.publicKey) ||
          extractSolanaAddress((window as any).phantom?.solana?.publicKey);
        if (address) break;
      }
    }

    if (address) {
      setStoredWalletAddress(address);
      return { success: true, address };
    }

    // Check if provider is connected even if address extraction was delayed
    if (provider.isConnected && provider.publicKey) {
      const fallbackAddr = extractSolanaAddress(provider.publicKey);
      if (fallbackAddr) {
        setStoredWalletAddress(fallbackAddr);
        return { success: true, address: fallbackAddr };
      }
    }

    return {
      success: false,
      error: 'Connected, but could not retrieve account address. Please try again.'
    };
  } catch (err: any) {
    console.error('Phantom connect error:', err);
    return {
      success: false,
      error: err?.message || 'Connection request was closed or rejected.'
    };
  }
}

export async function disconnectPhantom(): Promise<void> {
  clearStoredWalletAddress();
  const provider = getPhantomProvider();
  if (provider) {
    try {
      await provider.disconnect();
    } catch (err) {
      console.warn('Phantom disconnect warning:', err);
    }
  }
}

export async function autoConnectPhantom(): Promise<string | null> {
  const savedAddress = getStoredWalletAddress();

  const provider = getPhantomProvider();
  if (provider) {
    // If provider already has public key
    const currentPk = extractSolanaAddress(provider.publicKey);
    if (currentPk) {
      setStoredWalletAddress(currentPk);
      return currentPk;
    }

    // Try silent connect
    try {
      const resp = await provider.connect({ onlyIfTrusted: true });
      const addr =
        extractSolanaAddress(resp) ||
        extractSolanaAddress(resp?.publicKey) ||
        extractSolanaAddress(provider.publicKey);
      if (addr) {
        setStoredWalletAddress(addr);
        return addr;
      }
    } catch {}
  }

  // Restore from persistent storage if available
  if (savedAddress) {
    return savedAddress;
  }

  return null;
}

export function formatWalletAddress(address: string): string {
  if (!address) return '';
  const clean = address.trim();
  if (clean.length <= 10) return clean;
  return `${clean.slice(0, 4)}...${clean.slice(-4)}`;
}

export async function fetchSolanaBalance(
  publicKeyStr: string
): Promise<{ balance: number; cluster: string }> {
  if (!publicKeyStr) return { balance: 0, cluster: 'Solana' };

  // List of public Solana RPC endpoints to query
  const endpoints = [
    { url: 'https://solana-mainnet.rpc.extrnode.com', cluster: 'Mainnet' },
    { url: 'https://api.mainnet-beta.solana.com', cluster: 'Mainnet' },
    { url: 'https://solana.publicnode.com', cluster: 'Mainnet' },
    { url: 'https://rpc.ankr.com/solana', cluster: 'Mainnet' },
    { url: 'https://api.devnet.solana.com', cluster: 'Devnet' }
  ];

  for (const { url, cluster } of endpoints) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 3000);

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getBalance',
          params: [publicKeyStr]
        }),
        signal: controller.signal
      });

      clearTimeout(timer);

      if (!res.ok) continue;

      const data = await res.json();
      if (data && data.result && typeof data.result.value === 'number') {
        const sol = data.result.value / 1_000_000_000;
        return { balance: sol, cluster };
      }
    } catch {
      // Continue to next endpoint if this one fails or times out
    }
  }

  // Fallback to 0 if all RPC queries fail
  return { balance: 0, cluster: 'Solana' };
}

export function formatSolBalance(balance: number | null | undefined): string {
  if (balance === null || balance === undefined) return '0.00 SOL';
  if (balance === 0) return '0.00 SOL';
  if (balance < 0.001) return '<0.001 SOL';
  if (balance < 1) return `${balance.toFixed(4)} SOL`;
  return `${balance.toFixed(3)} SOL`;
}

