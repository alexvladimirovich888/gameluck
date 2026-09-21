import React from 'react';
import { Merchant } from '../types';
import { MerchantPortrait, PixelIcon, StallImage, WaxSealBadge } from './PixelIcons';
import { SoundEngine } from '../utils/sound';

interface MerchantDialogueModalProps {
  merchant: Merchant;
  currentTrust: number;
  playerGold: number;
  onClose: () => void;
  onGiftTrust: (merchantId: string, cost: number, trustGain: number) => void;
  onOpenTradeWithSpecialty: (specialtyIds: string[]) => void;
}

export const MerchantDialogueModal: React.FC<MerchantDialogueModalProps> = ({
  merchant,
  currentTrust,
  playerGold,
  onClose,
  onGiftTrust,
  onOpenTradeWithSpecialty
}) => {
  const trustDiscount = Math.floor((currentTrust / 100) * 12); // up to 12% discount

  const handleGift = () => {
    if (playerGold < 35) return;
    SoundEngine.playCoin();
    onGiftTrust(merchant.id, 35, 12);
  };

  const handleTradeSpecialty = () => {
    SoundEngine.playParchment();
    onOpenTradeWithSpecialty(merchant.specialtyItems);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs">
      <div className="pixel-box-wood relative w-full max-w-lg p-5 text-[#eedcc0] animate-in fade-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          onClick={() => {
            SoundEngine.playWoodThud();
            onClose();
          }}
          className="pixel-btn absolute top-3 right-3 flex h-8 w-8 items-center justify-center bg-[#801b1b] text-sm font-bold text-white hover:bg-[#a82424]"
        >
          ✕
        </button>

        {/* Header with portrait and stall */}
        <div className="flex items-start gap-3 border-b-2 border-[#5c371e] pb-4">
          <MerchantPortrait portraitKey={merchant.portraitKey} size={72} />
          <StallImage stallKey={merchant.portraitKey} width={100} height={72} className="hidden sm:inline-block rounded-none shrink-0" />

          <div className="flex-1 min-w-0">
            <h3 className="font-medieval text-xl font-bold text-[#fde047] truncate">{merchant.name}</h3>
            <p className="text-xs text-[#d6b78d]">{merchant.profession}</p>

            {/* Trust Meter */}
            <div className="mt-2">
              <div className="flex justify-between text-xs font-bold">
                <span>Merchant Trust:</span>
                <span className="text-[#facc15]">{currentTrust} / 100</span>
              </div>
              <div className="mt-1 h-3 w-full border border-[#1b0e07] bg-[#140b07] p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-[#ca8a04] to-[#22c55e] transition-all duration-300"
                  style={{ width: `${Math.min(100, currentTrust)}%` }}
                />
              </div>
              {trustDiscount > 0 && (
                <div className="mt-1 text-[11px] text-[#4ade80]">
                  ★ Special Guild Discount: -{trustDiscount}%
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dialogue Quote on Aged Parchment with Wax Seal */}
        <div className="pixel-box-parchment relative my-4 p-3.5 italic text-sm leading-relaxed shadow-inner pr-14">
          <p className="font-medium text-[#2b170c]">"{merchant.quote}"</p>
          <div className="absolute top-2 right-2 pointer-events-none">
            <WaxSealBadge size={38} />
          </div>
        </div>

        {/* Market Rumor / Insider Intel */}
        <div className="pixel-box-dark mb-4 p-3 border border-[#78350f]">
          <div className="flex items-center gap-2 text-xs font-bold text-[#fde047]">
            <PixelIcon name="events" size={16} />
            <span>Market Rumors & Intel:</span>
          </div>
          <p className="mt-1 text-xs text-[#e2d5c3] leading-normal">{merchant.rumor}</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={handleGift}
            disabled={playerGold < 35 || currentTrust >= 100}
            className="pixel-btn flex flex-col items-center justify-center bg-[#452714] py-2.5 px-3 text-xs font-bold text-[#fde047] disabled:opacity-50"
          >
            <div className="flex items-center gap-1.5">
              <PixelIcon name="beer" size={16} />
              <span>Buy Tavern Ale</span>
            </div>
            <span className="text-[10px] text-[#cbd5e1] font-normal">35 gold (+12 trust)</span>
          </button>

          <button
            onClick={handleTradeSpecialty}
            className="pixel-btn flex flex-col items-center justify-center bg-[#b45309] py-2.5 px-3 text-xs font-bold text-[#fffbeb] hover:bg-[#d97706]"
          >
            <div className="flex items-center gap-1.5">
              <PixelIcon name="market" size={16} />
              <span>Trade Commodities</span>
            </div>
            <span className="text-[10px] text-[#fef08a] font-normal">View Merchant Stall</span>
          </button>
        </div>
      </div>
    </div>
  );
};
