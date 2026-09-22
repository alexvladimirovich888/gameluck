import React, { useState } from 'react';
import { SoundEngine } from '../utils/sound';
import { formatWalletAddress, formatSolBalance } from '../utils/phantom';

interface WalletDetailsModalProps {
  address: string;
  balance: number | null;
  cluster?: string;
  isLoadingBalance?: boolean;
  onRefreshBalance: () => void;
  onDisconnect: () => void;
  onClose: () => void;
}

export const WalletDetailsModal: React.FC<WalletDetailsModalProps> = ({
  address,
  balance,
  cluster = 'Solana',
  isLoadingBalance = false,
  onRefreshBalance,
  onDisconnect,
  onClose
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      SoundEngine.playCoin();
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="pixel-box-wood relative w-full max-w-md p-6 text-[#eedcc0] shadow-2xl">
        {/* Close Button */}
        <button
          onClick={() => {
            SoundEngine.playWoodThud();
            onClose();
          }}
          className="pixel-btn absolute top-3 right-3 flex h-7 w-7 items-center justify-center bg-[#801b1b] text-xs font-bold text-white hover:bg-[#a82525]"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="border-b-2 border-[#5c371e] pb-3 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1a0f0a] border border-[#22c55e] text-[#86efac] text-xs uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse"></span>
            <span>Wallet Connected</span>
          </div>
          <h2 className="font-medieval text-2xl font-bold text-[#fde047]">
            Phantom Wallet
          </h2>
          <div className="text-xs text-[#a89279] font-sans">
            Solana Network ({cluster})
          </div>
        </div>

        {/* Wallet Details Body */}
        <div className="my-5 space-y-3.5 text-xs font-sans">
          {/* Status & Provider */}
          <div className="p-3 bg-[#170c07] border border-[#4a2e1c] flex items-center justify-between">
            <span className="text-[#a89279]">Provider:</span>
            <div className="flex items-center gap-1.5 font-bold text-[#facc15]">
              <span className="text-base">🟣</span>
              <span>Phantom (Solana)</span>
            </div>
          </div>

          {/* Balance Block */}
          <div className="p-3.5 bg-[#170c07] border-2 border-[#ca8a04] flex items-center justify-between">
            <div>
              <span className="text-[11px] text-[#ca8a04] uppercase font-bold tracking-wider block">
                Solana Balance
              </span>
              <div className="text-xl font-bold text-[#4ade80] flex items-baseline gap-1 mt-0.5">
                <span>{isLoadingBalance ? 'Fetching...' : formatSolBalance(balance)}</span>
              </div>
            </div>
            <button
              onClick={() => {
                SoundEngine.playCoin();
                onRefreshBalance();
              }}
              disabled={isLoadingBalance}
              className="px-2.5 py-1.5 bg-[#2d180d] hover:bg-[#452614] border border-[#ca8a04] text-[#fde047] text-xs font-bold flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
              title="Refresh SOL balance"
            >
              <span className={isLoadingBalance ? 'animate-spin' : ''}>🔄</span>
              <span>Refresh</span>
            </button>
          </div>

          {/* Address Block with Copy */}
          <div className="p-3 bg-[#170c07] border border-[#4a2e1c] space-y-1.5">
            <div className="flex items-center justify-between text-[#a89279]">
              <span>Public Key (Address):</span>
              <button
                onClick={handleCopy}
                className="text-[#facc15] hover:text-[#fef08a] font-bold text-[11px] flex items-center gap-1 cursor-pointer"
              >
                <span>{copied ? '✅' : '📋'}</span>
                <span>{copied ? 'Copied!' : 'Copy Address'}</span>
              </button>
            </div>
            <div className="p-2 bg-[#0d0907] border border-[#3d2414] font-mono text-[11px] text-[#fde047] break-all select-all">
              {address}
            </div>
          </div>

          {/* Explorer Link */}
          <div className="text-center pt-1">
            <a
              href={`https://solscan.io/account/${address}`}
              target="_blank"
              rel="noreferrer"
              className="text-[#93c5fd] hover:text-[#bfdbfe] text-xs underline flex items-center justify-center gap-1"
            >
              <span>🔍</span>
              <span>View account on Solscan</span>
            </a>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-[#5c371e] pt-4 flex gap-2">
          <button
            onClick={() => {
              SoundEngine.playWoodThud();
              onDisconnect();
              onClose();
            }}
            className="flex-1 py-2.5 bg-[#451010] hover:bg-[#6b1818] border border-[#ef4444] text-[#fca5a5] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <span>🚪</span>
            <span>Disconnect Wallet</span>
          </button>
          <button
            onClick={() => {
              SoundEngine.playWoodThud();
              onClose();
            }}
            className="flex-1 py-2.5 bg-[#2d180d] hover:bg-[#452614] border border-[#ca8a04] text-[#fde047] font-bold text-xs transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
