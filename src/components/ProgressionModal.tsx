import React from 'react';
import { PlayerState } from '../types';
import { PLAYER_RANKS } from '../data/ranks';
import { ITEMS_MAP } from '../data/items';
import { SoundEngine } from '../utils/sound';
import { PixelIcon, WaxSealBadge } from './PixelIcons';

interface ProgressionModalProps {
  player: PlayerState;
  onClose: () => void;
}

export const ProgressionModal: React.FC<ProgressionModalProps> = ({ player, onClose }) => {
  // Calculate total net worth (gold + value of inventory in warehouse)
  const inventoryWorth = Object.entries(player.inventory).reduce((sum, [itemId, inv]) => {
    const item = ITEMS_MAP[itemId];
    return sum + (item ? item.basePrice * inv.amount : inv.amount * 10);
  }, 0);

  const totalNetWorth = player.gold + inventoryWorth;

  // Determine current rank index
  let currentRankIdx = 0;
  for (let i = PLAYER_RANKS.length - 1; i >= 0; i--) {
    if (totalNetWorth >= PLAYER_RANKS[i].requiredNetWorth) {
      currentRankIdx = i;
      break;
    }
  }

  const currentRank = PLAYER_RANKS[currentRankIdx];
  const nextRank = PLAYER_RANKS[currentRankIdx + 1];

  const progressToNext = nextRank
    ? Math.min(
        100,
        Math.round(
          ((totalNetWorth - currentRank.requiredNetWorth) /
            (nextRank.requiredNetWorth - currentRank.requiredNetWorth)) *
            100
        )
      )
    : 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs">
      <div className="pixel-box-wood relative w-full max-w-xl p-5 text-[#eedcc0] shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={() => {
            SoundEngine.playWoodThud();
            onClose();
          }}
          className="pixel-btn absolute top-3 right-3 flex h-7 w-7 items-center justify-center bg-[#801b1b] text-xs font-bold text-white"
        >
          ✕
        </button>

        <div className="border-b-2 border-[#5c371e] pb-3 text-center flex flex-col items-center">
          <WaxSealBadge size={44} className="mb-1" />
          <div className="text-xs font-bold text-[#facc15] uppercase tracking-wider">
            Guild Table of Merchant Ranks
          </div>
          <h2 className="font-medieval text-xl font-bold text-[#fde047] mt-0.5">
            {currentRank.title}
          </h2>
          <div className="mt-1 text-xs text-[#a89279]">
            Total Estimated Net Worth: <span className="font-bold text-[#facc15]">{totalNetWorth} gold</span>{' '}
            (Coin: {player.gold} + Commodities: {inventoryWorth})
          </div>
        </div>

        {/* Progress to Next Rank */}
        {nextRank && (
          <div className="my-4 pixel-box-dark p-3 border border-[#4a2e1c]">
            <div className="flex justify-between text-xs text-[#d6b78d] mb-1">
              <span>Next Guild Rank: <b>{nextRank.title}</b></span>
              <span className="text-[#facc15] font-bold">
                {totalNetWorth} / {nextRank.requiredNetWorth}g ({progressToNext}%)
              </span>
            </div>
            <div className="h-3 w-full bg-[#120a06] border border-[#2d1b11]">
              <div
                className="h-full bg-gradient-to-r from-[#ca8a04] to-[#eab308]"
                style={{ width: `${progressToNext}%` }}
              />
            </div>
          </div>
        )}

        {/* Ranks Ladder */}
        <div className="my-3 flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
          {PLAYER_RANKS.map((rank, idx) => {
            const isUnlocked = idx <= currentRankIdx;
            const isCurrent = idx === currentRankIdx;

            return (
              <div
                key={rank.title}
                className={`p-2.5 border-2 text-xs flex flex-col gap-1 ${
                  isCurrent
                    ? 'border-[#facc15] bg-[#3b2214]'
                    : isUnlocked
                    ? 'border-[#22c55e] bg-[#142616] opacity-85'
                    : 'border-[#332219] bg-[#1a0f0a] opacity-50'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span className={isCurrent ? 'text-[#fde047]' : isUnlocked ? 'text-[#86efac]' : 'text-[#786350]'}>
                    {idx + 1}. {rank.title} {isCurrent && '★ (Current Title)'}
                  </span>
                  <span className="text-[#ca8a04]">{rank.requiredNetWorth} gold required</span>
                </div>

                <ul className="text-[11px] text-[#d6c7b2] list-disc list-inside">
                  {rank.perks.map((perk, pIdx) => (
                    <li key={pIdx}>{perk}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Career Stats */}
        <div className="border-t border-[#5c371e] pt-3 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="pixel-box-dark p-2">
            <div className="text-[10px] text-[#9c8469]">Total Deals:</div>
            <div className="font-bold text-[#eedcc0]">{player.stats.totalTrades}</div>
          </div>
          <div className="pixel-box-dark p-2">
            <div className="text-[10px] text-[#9c8469]">Net Trading Profit:</div>
            <div className="font-bold text-[#4ade80]">+{player.stats.totalProfit}g</div>
          </div>
          <div className="pixel-box-dark p-2">
            <div className="text-[10px] text-[#9c8469]">Record Single Trade:</div>
            <div className="font-bold text-[#facc15]">+{player.stats.highestSingleProfit}g</div>
          </div>
        </div>
      </div>
    </div>
  );
};
