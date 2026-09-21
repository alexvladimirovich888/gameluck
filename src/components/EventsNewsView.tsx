import React from 'react';
import { TownEvent, GameLog } from '../types';
import { ITEMS_MAP } from '../data/items';
import { PixelIcon } from './PixelIcons';

interface EventsNewsViewProps {
  activeEvents: TownEvent[];
  logs: GameLog[];
  currentDay: number;
}

export const EventsNewsView: React.FC<EventsNewsViewProps> = ({
  activeEvents,
  logs,
  currentDay
}) => {
  return (
    <div className="flex flex-col gap-5">
      {/* Header Gazette */}
      <div className="pixel-box-parchment p-5 shadow-lg">
        <div className="border-b-2 border-[#78350f] pb-3 text-center">
          <div className="text-[10px] tracking-widest text-[#78350f] uppercase">
            Royal Gazette • Marketburg Town Herald • Day {currentDay}
          </div>
          <h2 className="font-medieval text-2xl font-bold text-[#3b1d0c] mt-0.5">
            PROVINCIAL NEWS & MARKET HAPPENINGS
          </h2>
          <p className="text-xs text-[#6b472e] italic mt-1">
            "Heed the whispers, forecast the markets, and multiply the Guild's wealth!"
          </p>
        </div>

        {/* Active Events List */}
        <div className="mt-4 flex flex-col gap-3">
          <div className="text-xs font-bold text-[#451a03] uppercase tracking-wider">
            Current Provincial Events ({activeEvents.length}):
          </div>

          {activeEvents.length === 0 ? (
            <p className="text-xs italic text-[#78350f] py-3">
              Peace and steady commerce reign across the province. No extraordinary occurrences reported.
            </p>
          ) : (
            activeEvents.map((evt) => {
              const badgeColors: Record<string, string> = {
                harvest: 'bg-[#15803d] text-[#fef08a]',
                disaster: 'bg-[#991b1b] text-[#fee2e2]',
                war: 'bg-[#7f1d1d] text-[#fca5a5]',
                caravan: 'bg-[#b45309] text-[#fef08a]',
                festival: 'bg-[#7c3aed] text-[#f3e8ff]',
                tax: 'bg-[#334155] text-[#e2e8f0]'
              };

              return (
                <div
                  key={evt.id}
                  className="pixel-box-wood p-3.5 border-2 border-[#2b160b] text-[#eedcc0]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          badgeColors[evt.type] || 'bg-[#78350f] text-white'
                        }`}
                      >
                        {evt.type === 'caravan'
                          ? 'CARAVAN'
                          : evt.type === 'war'
                          ? 'WAR'
                          : evt.type === 'harvest'
                          ? 'HARVEST'
                          : evt.type === 'festival'
                          ? 'FESTIVAL'
                          : evt.type === 'disaster'
                          ? 'DISASTER'
                          : 'TAX LEVY'}
                      </span>
                      <h4 className="font-medieval text-base font-bold text-[#fde047]">{evt.title}</h4>
                    </div>

                    <span className="text-xs font-bold text-[#facc15]">
                      Remaining: {evt.remainingDays} {evt.remainingDays === 1 ? 'day' : 'days'}
                    </span>
                  </div>

                  <p className="mt-1.5 text-xs text-[#e2d5c3]">{evt.description}</p>
                  <p className="mt-1 text-xs italic text-[#fef08a]">{evt.flavor}</p>

                  {/* Impact Badges */}
                  <div className="mt-2.5 flex flex-wrap gap-1.5 pt-2 border-t border-[#4a2e1c]">
                    <span className="text-[10px] text-[#a89279] mr-1">Market Price Shifts:</span>
                    {Object.entries(evt.priceModifiers).map(([itemId, mult]) => {
                      const item = ITEMS_MAP[itemId];
                      if (!item) return null;
                      const deltaPct = Math.round((mult - 1) * 100);
                      const isUp = deltaPct > 0;

                      return (
                        <span
                          key={itemId}
                          className={`flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold ${
                            isUp ? 'bg-[#450a0a] text-[#f87171]' : 'bg-[#052e16] text-[#4ade80]'
                          }`}
                        >
                          <PixelIcon name={item.iconKey} size={12} />
                          <span>{item.name}:</span>
                          <span>{isUp ? `+${deltaPct}%` : `${deltaPct}%`}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Chronicle / Event Logs */}
      <div className="pixel-box-dark p-4 border-2 border-[#3d2719]">
        <h3 className="font-medieval text-base font-bold text-[#eedcc0] mb-3 flex items-center gap-2">
          <span>📜</span>
          <span>Merchant Chronicle & Transaction Ledger</span>
        </h3>

        <div className="flex flex-col gap-1.5 max-h-64 overflow-y-auto pr-1">
          {logs.length === 0 ? (
            <p className="text-xs italic text-[#9c8469]">No chronicle entries recorded yet.</p>
          ) : (
            logs.slice(0, 30).map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between border-b border-[#2d1b11] py-1 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-[#ca8a04]">Day {log.day}:</span>
                  <span className="text-[#e2d5c3]">{log.text}</span>
                </div>
                {log.goldChange !== undefined && (
                  <span
                    className={`font-bold ${
                      log.goldChange >= 0 ? 'text-[#4ade80]' : 'text-[#f87171]'
                    }`}
                  >
                    {log.goldChange >= 0 ? `+${log.goldChange}g` : `${log.goldChange}g`}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
