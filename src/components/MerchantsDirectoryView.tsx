import React from 'react';
import { Merchant, PlayerState } from '../types';
import { MERCHANTS } from '../data/merchants';
import { LOCATIONS } from '../data/locations';
import { ITEMS_MAP } from '../data/items';
import { MerchantPortrait, PixelIcon, StallImage } from './PixelIcons';
import { SoundEngine } from '../utils/sound';

interface MerchantsDirectoryViewProps {
  player: PlayerState;
  onOpenMerchantDialogue: (merchant: Merchant) => void;
}

export const MerchantsDirectoryView: React.FC<MerchantsDirectoryViewProps> = ({
  player,
  onOpenMerchantDialogue
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="pixel-box-wood p-4">
        <h2 className="font-medieval text-xl font-bold text-[#fde047]">
          Provincial Merchant Guild & Guildsmen Directory
        </h2>
        <p className="mt-1 text-xs text-[#d6b78d]">
          Build trust and rapport with local tradespeople to unlock exclusive discounts and valuable insider rumors on future price swings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MERCHANTS.map((m) => {
          const trust = player.merchantTrust[m.id] ?? m.trust;
          const loc = LOCATIONS[m.locationId];
          const discount = Math.floor((trust / 100) * 12);

          return (
            <div
              key={m.id}
              className="pixel-box-wood p-3.5 flex flex-col justify-between border-2 border-[#452714] hover:border-[#ca8a04] transition-all"
            >
              <div>
                <div className="flex items-start gap-3 border-b border-[#4a2e1c] pb-3">
                  <MerchantPortrait portraitKey={m.portraitKey} size={56} />
                  <StallImage stallKey={m.portraitKey} width={72} height={56} className="hidden sm:inline-block shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medieval text-base font-bold text-[#fde047] truncate">{m.name}</h3>
                      <span className="text-[10px] text-[#ca8a04]">{loc.name}</span>
                    </div>
                    <p className="text-xs text-[#b89f82]">{m.profession}</p>

                    {/* Trust progress */}
                    <div className="mt-1.5 flex items-center justify-between text-[11px]">
                      <span className="text-[#a89279]">Trust Level:</span>
                      <span className="font-bold text-[#facc15]">{trust} / 100</span>
                    </div>
                    <div className="mt-0.5 h-2 w-full bg-[#140a05] border border-[#2d1b11]">
                      <div
                        className="h-full bg-gradient-to-r from-[#ca8a04] to-[#22c55e]"
                        style={{ width: `${trust}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Specialties */}
                <div className="my-2.5">
                  <div className="text-[10px] text-[#9c8469] mb-1">Trade Specialty:</div>
                  <div className="flex flex-wrap gap-1">
                    {m.specialtyItems.map((itemId) => {
                      const item = ITEMS_MAP[itemId];
                      if (!item) return null;
                      return (
                        <span
                          key={itemId}
                          className="flex items-center gap-1 bg-[#1a0f0a] border border-[#3d2212] px-1.5 py-0.5 text-[10px] text-[#eedcc0]"
                        >
                          <PixelIcon name={item.iconKey} size={12} />
                          <span>{item.name}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>

                <p className="italic text-xs text-[#d6c7b2] line-clamp-2">"{m.quote}"</p>
              </div>

              <div className="mt-3 pt-2 border-t border-[#4a2e1c] flex items-center justify-between">
                <span className="text-[11px] text-[#86efac]">
                  {discount > 0 ? `★ Standing Discount: -${discount}%` : 'Standard Guild Rates'}
                </span>

                <button
                  onClick={() => {
                    SoundEngine.playParchment();
                    onOpenMerchantDialogue(m);
                  }}
                  className="pixel-btn bg-[#b45309] px-3 py-1.5 text-xs font-bold text-[#fffbeb] hover:bg-[#d97706]"
                >
                  Converse & Trade
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
