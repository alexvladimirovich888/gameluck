// Phantom Wallet Solana Provider Utility

export interface PhantomProvider {
  isPhantom?: boolean;
  publicKey?: { toString(): string };
  connect(opts?: { onlyIfTrusted?: boolean }): Promise<{ publicKey: { toString(): string } }>;
  disconnect(): Promise<void>;
  on(event: string, callback: (...args: any[]) => void): void;
  removeListener(event: string, callback: (...args: any[]) => void): void;
}

export function getPhantomProvider(): PhantomProvider | null {
  if (typeof window === 'undefined') return null;
  const anyWindow = window as any;
  if (anyWindow.phantom?.solana?.isPhantom) {
    return anyWindow.phantom.solana;
  }
  if (anyWindow.solana?.isPhantom) {
    return anyWindow.solana;
  }
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
    const address = resp.publicKey ? resp.publicKey.toString() : '';
    return { success: true, address };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Connection request was closed or rejected.'
    };
  }
}

export async function disconnectPhantom(): Promise<void> {
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
  const provider = getPhantomProvider();
  if (!provider) return null;
  try {
    const resp = await provider.connect({ onlyIfTrusted: true });
    return resp.publicKey ? resp.publicKey.toString() : null;
  } catch {
    return null;
  }
}

export function formatWalletAddress(address: string): string {
  if (!address) return '';
  if (address.length <= 10) return address;
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export async function fetchSolanaBalance(publicKeyStr: string): Promise<{ balance: number; cluster: string } | null> {
  if (!publicKeyStr) return null;

  // List of public Solana RPC endpoints to query
  const endpoints = [
    { url: 'https://api.mainnet-beta.solana.com', cluster: 'Mainnet' },
    { url: 'https://solana.publicnode.com', cluster: 'Mainnet' },
    { url: 'https://rpc.ankr.com/solana', cluster: 'Mainnet' },
    { url: 'https://api.devnet.solana.com', cluster: 'Devnet' }
  ];

  for (const { url, cluster } of endpoints) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 3500);

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

  return null;
}

export function formatSolBalance(balance: number | null): string {
  if (balance === null || balance === undefined) return '... SOL';
  if (balance === 0) return '0.00 SOL';
  if (balance < 0.001) return '<0.001 SOL';
  if (balance < 1) return `${balance.toFixed(4)} SOL`;
  return `${balance.toFixed(3)} SOL`;
}

