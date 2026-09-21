import React, { useState } from 'react';
import { Item, ItemCategory, LocationId, MarketItemData, PlayerState } from '../types';
import { ITEMS, ITEMS_MAP } from '../data/items';
import { LOCATIONS } from '../data/locations';
import { PixelIcon, WaxSealBadge } from './PixelIcons';
import { SoundEngine } from '../utils/sound';

interface MarketTradeViewProps {
  player: PlayerState;
  marketData: Record<string, MarketItemData>;
  currentLocationId: LocationId;
  specialtyFilter?: string[] | null;
  onBuy: (itemId: string, amount: number, pricePerUnit: number) => void;
  onSell: (itemId: string, amount: number, pricePerUnit: number) => void;
  onClearSpecialtyFilter: () => void;
}

export const MarketTradeView: React.FC<MarketTradeViewProps> = ({
  player,
  marketData,
  currentLocationId,
  specialtyFilter,
  onBuy,
  onSell,
  onClearSpecialtyFilter
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'all'>('all');
  const [selectedItemId, setSelectedItemId] = useState<string>('grain');
  const [tradeAmount, setTradeAmount] = useState<number>(1);
  const [sortBy, setSortBy] = useState<'name' | 'price_asc' | 'price_desc' | 'trend'>('trend');

  const currentLocation = LOCATIONS[currentLocationId];

  // Calculate used cart / warehouse capacity
  const usedCapacity = Object.entries(player.inventory).reduce((total, [itemId, inv]) => {
    const item = ITEMS_MAP[itemId];
    return total + (item ? item.weight * inv.amount : inv.amount);
  }, 0);
  const maxCapacity = player.warehouseCapacity;
  const freeCapacity = Math.max(0, maxCapacity - usedCapacity);

  // Filter items
  const filteredItems = ITEMS.filter((item) => {
    if (specialtyFilter && specialtyFilter.length > 0) {
      if (!specialtyFilter.includes(item.id)) return false;
    }
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    const dataA = marketData[a.id] || { currentPrice: a.basePrice, changePercent: 0 };
    const dataB = marketData[b.id] || { currentPrice: b.basePrice, changePercent: 0 };

    if (sortBy === 'price_asc') return dataA.currentPrice - dataB.currentPrice;
    if (sortBy === 'price_desc') return dataB.currentPrice - dataA.currentPrice;
    if (sortBy === 'trend') return Math.abs(dataB.changePercent) - Math.abs(dataA.changePercent);
    return a.name.localeCompare(b.name);
  });

  const activeItem = ITEMS_MAP[selectedItemId] || ITEMS[0];
  const activeMarket = marketData[activeItem.id] || {
    currentPrice: activeItem.basePrice,
    supply: 50,
    demand: 50,
    history: [activeItem.basePrice],
    lastChange: 'same' as const,
    changePercent: 0
  };

  // Player holding info
  const playerHoldings = player.inventory[activeItem.id] || { amount: 0, avgBuyPrice: 0 };

  // Calculate buy price (with reputation discount)
  const repDiscount = Math.min(15, Math.floor(player.reputation / 7));
  const effectiveBuyPrice = Math.max(1, Math.round(activeMarket.currentPrice * (1 - repDiscount / 100)));
  const effectiveSellPrice = Math.max(1, Math.round(activeMarket.currentPrice * 0.95)); // 5% spread

  // Max units player can buy based on gold and capacity
  const maxAffordable = Math.floor(player.gold / effectiveBuyPrice);
  const maxFittable = Math.floor(freeCapacity / activeItem.weight);
  const maxBuyable = Math.max(0, Math.min(maxAffordable, maxFittable, activeMarket.supply));
  const maxSellable = playerHoldings.amount;

  // Arbitrage analysis: best location to sell this item
  const bestLocation = Object.entries(LOCATIONS).reduce(
    (best, [locId, loc]) => {
      if (locId === currentLocationId) return best;
      const mod = loc.itemModifiers[activeItem.id] ?? loc.categoryModifiers[activeItem.category] ?? 1.0;
      const estimatedPrice = Math.round(activeItem.basePrice * mod);
      if (estimatedPrice > best.price) {
        return { locName: loc.name, price: estimatedPrice };
      }
      return best;
    },
    { locName: 'Foreign Lands', price: 0 }
  );

  const potentialProfitPerUnit = bestLocation.price - effectiveBuyPrice;

  // Handle Buy
  const handleBuy = () => {
    if (tradeAmount <= 0 || tradeAmount > maxBuyable) return;
    SoundEngine.playCoin();
    SoundEngine.playWoodThud();
    onBuy(activeItem.id, tradeAmount, effectiveBuyPrice);
    setTradeAmount(1);
  };

  // Handle Sell
  const handleSell = () => {
    if (tradeAmount <= 0 || tradeAmount > maxSellable) return;
    SoundEngine.playCoin();
    onSell(activeItem.id, tradeAmount, effectiveSellPrice);
    setTradeAmount(1);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Specialty Filter Banner if opened from a specific merchant */}
      {specialtyFilter && specialtyFilter.length > 0 && (
        <div className="pixel-box-dark flex items-center justify-between border-2 border-[#ca8a04] px-4 py-2 bg-[#2d1b0d]">
          <div className="flex items-center gap-2 text-xs text-[#fef08a]">
            <PixelIcon name="coin" size={16} />
            <span>Merchant Specialty Assortment (Personal discount applied!)</span>
          </div>
          <button
            onClick={onClearSpecialtyFilter}
            className="pixel-btn bg-[#7f1d1d] px-2.5 py-1 text-[11px] font-bold text-white"
          >
            Show All Goods
          </button>
        </div>
      )}

      {/* Categories Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#3d2719] pb-3">
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              { id: 'all', label: 'All Goods' },
              { id: 'food', label: 'Provisions' },
              { id: 'raw', label: 'Materials' },
              { id: 'crafted', label: 'Crafted' },
              { id: 'luxury', label: 'Luxuries' },
              { id: 'livestock', label: 'Livestock' }
            ] as const
          ).map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                SoundEngine.playParchment();
                setSelectedCategory(cat.id);
              }}
              className={`pixel-btn px-3 py-1.5 text-xs font-bold transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-[#b45309] text-[#fef08a] border-[#fde047]'
                  : 'bg-[#2b170c] text-[#d6b78d] hover:bg-[#3d2212]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#a89279]">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as unknown as typeof sortBy)}
            className="border-2 border-[#452714] bg-[#1a0f0a] px-2 py-1 text-xs text-[#fde047] outline-none"
          >
            <option value="trend">Price Trend</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Main Trading Area: Grid of Items (Left) & Active Inspector Card (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Goods Catalog List */}
        <div className="lg:col-span-7 flex flex-col gap-2 max-h-[480px] overflow-y-auto pr-1">
          {filteredItems.map((item) => {
            const data = marketData[item.id] || {
              currentPrice: item.basePrice,
              history: [item.basePrice],
              lastChange: 'same' as const,
              changePercent: 0,
              supply: 30
            };
            const isSelected = activeItem.id === item.id;
            const holding = player.inventory[item.id]?.amount || 0;

            const isRising = data.changePercent > 1;
            const isFalling = data.changePercent < -1;

            return (
              <div
                key={item.id}
                onClick={() => {
                  SoundEngine.playParchment();
                  setSelectedItemId(item.id);
                  setTradeAmount(1);
                }}
                className={`pixel-btn flex items-center justify-between p-2.5 cursor-pointer border-2 transition-all ${
                  isSelected
                    ? 'border-[#facc15] bg-[#422513] shadow-md'
                    : 'border-[#2d1b11] bg-[#22130b] hover:bg-[#311c10]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center p-1.5 ${
                    isSelected ? 'pixel-slot-container-active' : 'pixel-slot-container'
                  }`}>
                    <PixelIcon name={item.iconKey} size={26} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medieval text-sm font-bold text-[#eedcc0]">{item.name}</span>
                      {holding > 0 && (
                        <span className="bg-[#14532d] px-1.5 py-0.5 text-[10px] font-bold text-[#86efac]">
                          In Cart: {holding}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#9c8469]">
                      Weight: {item.weight} | Supply: {data.supply} units
                    </div>
                  </div>
                </div>

                {/* Price & Trend Badge */}
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1 font-bold text-sm text-[#facc15]">
                    <span>{data.currentPrice}</span>
                    <PixelIcon name="coin" size={14} />
                  </div>
                  <div className="flex items-center justify-end gap-1 text-[11px]">
                    {isRising && (
                      <span className="font-bold text-[#4ade80]">▲ +{Math.round(data.changePercent)}%</span>
                    )}
                    {isFalling && (
                      <span className="font-bold text-[#f87171]">▼ {Math.round(data.changePercent)}%</span>
                    )}
                    {!isRising && !isFalling && <span className="text-[#94a3b8]">― Stable</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Detailed Inspection & Trade Controls */}
        <div className="lg:col-span-5 pixel-box-wood p-4 flex flex-col justify-between">
          <div>
            {/* Top item title & icon */}
            <div className="flex items-start gap-3 border-b-2 border-[#5c371e] pb-3">
              <div className="pixel-slot-container-active flex h-14 w-14 shrink-0 items-center justify-center p-2 shadow-md">
                <PixelIcon name={activeItem.iconKey} size={34} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medieval text-lg font-bold text-[#fde047]">{activeItem.name}</h3>
                    {activeItem.category === 'luxury' && (
                      <span title="Royal Guild luxury ware">
                        <WaxSealBadge size={22} />
                      </span>
                    )}
                  </div>
                  <span className="border border-[#78350f] bg-[#2d180d] px-2 py-0.5 text-[10px] uppercase tracking-wider text-[#d6b78d]">
                    {activeItem.category}
                  </span>
                </div>
                <p className="mt-1 text-xs text-[#b89f82] leading-tight">{activeItem.description}</p>
              </div>
            </div>

            {/* Price & Trend Analysis */}
            <div className="my-3 grid grid-cols-2 gap-2 text-xs">
              <div className="pixel-box-dark p-2 border border-[#4a2e1c]">
                <div className="text-[10px] text-[#9c8469]">Buy Price:</div>
                <div className="flex items-center gap-1 text-base font-bold text-[#facc15]">
                  <span>{effectiveBuyPrice}</span>
                  <PixelIcon name="coin" size={14} />
                  {repDiscount > 0 && (
                    <span className="text-[10px] text-[#4ade80]">(-{repDiscount}%)</span>
                  )}
                </div>
                <div className="text-[10px] text-[#94a3b8]">
                  Base: {activeItem.basePrice}g
                </div>
              </div>

              <div className="pixel-box-dark p-2 border border-[#4a2e1c]">
                <div className="text-[10px] text-[#9c8469]">Sell Price:</div>
                <div className="flex items-center gap-1 text-base font-bold text-[#38bdf8]">
                  <span>{effectiveSellPrice}</span>
                  <PixelIcon name="coin" size={14} />
                </div>
                <div className="text-[10px] text-[#94a3b8]">
                  In Inventory: {playerHoldings.amount}
                </div>
              </div>
            </div>

            {/* Price History Sparkline Graph */}
            <div className="pixel-box-dark p-2.5 mb-3 border border-[#4a2e1c]">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#eedcc0] mb-1.5">
                <span>Price History (Past Days):</span>
                <span
                  className={
                    activeMarket.changePercent > 0
                      ? 'text-[#4ade80]'
                      : activeMarket.changePercent < 0
                      ? 'text-[#f87171]'
                      : 'text-[#cbd5e1]'
                  }
                >
                  {activeMarket.changePercent > 0 ? '▲ Rising' : activeMarket.changePercent < 0 ? '▼ Falling' : 'Stable'}
                </span>
              </div>

              {/* SVG Sparkline */}
              <div className="h-16 w-full bg-[#120a06] border border-[#2d1b11] relative p-1">
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 40">
                  {(() => {
                    const history = activeMarket.history && activeMarket.history.length > 0 ? activeMarket.history : [activeItem.basePrice];
                    const min = Math.min(...history, activeItem.minPrice);
                    const max = Math.max(...history, activeItem.maxPrice);
                    const range = Math.max(1, max - min);

                    const points = history.map((val, idx) => {
                      const x = history.length === 1 ? 50 : (idx / (history.length - 1)) * 100;
                      const y = 36 - ((val - min) / range) * 32;
                      return `${x},${y}`;
                    });

                    return (
                      <g>
                        {/* Grid lines */}
                        <line x1="0" y1="20" x2="100" y2="20" stroke="#2a160d" strokeDasharray="2,2" strokeWidth="0.8" />
                        {/* Trend path */}
                        <polyline
                          fill="none"
                          stroke={activeMarket.changePercent >= 0 ? '#22c55e' : '#ef4444'}
                          strokeWidth="2.2"
                          points={points.join(' ')}
                          style={{ shapeRendering: 'crispEdges' }}
                        />
                        {/* Data dots */}
                        {history.map((val, idx) => {
                          const x = history.length === 1 ? 50 : (idx / (history.length - 1)) * 100;
                          const y = 36 - ((val - min) / range) * 32;
                          return (
                            <circle
                              key={idx}
                              cx={x}
                              cy={y}
                              r={idx === history.length - 1 ? 2.5 : 1.5}
                              fill={idx === history.length - 1 ? '#facc15' : '#ffffff'}
                            />
                          );
                        })}
                      </g>
                    );
                  })()}
                </svg>
              </div>
              <div className="flex justify-between text-[9px] text-[#786350] mt-1">
                <span>Min: {activeItem.minPrice}g</span>
                <span>Current: {activeMarket.currentPrice}g</span>
                <span>Max: {activeItem.maxPrice}g</span>
              </div>
            </div>

            {/* Arbitrage Opportunity Insight */}
            {potentialProfitPerUnit > 2 && (
              <div className="pixel-box-dark mb-3 p-2 bg-[#1f1609] border border-[#ca8a04]">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#facc15]">
                  <PixelIcon name="map" size={14} />
                  <span>Guild Trade Intel:</span>
                </div>
                <p className="text-[10px] text-[#fef08a] mt-0.5">
                  In <b>{bestLocation.locName}</b>, merchants value this cargo at <b>{bestLocation.price}g</b>.
                  Potential profit: <b>+{potentialProfitPerUnit}g</b> per unit!
                </p>
              </div>
            )}

            {/* Player Inventory holding detail */}
            {playerHoldings.amount > 0 && (
              <div className="pixel-box-dark mb-3 p-2 text-xs border border-[#3d2719]">
                <div className="flex justify-between">
                  <span className="text-[#a89279]">In your cart:</span>
                  <span className="font-bold text-[#eedcc0]">{playerHoldings.amount} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#a89279]">Average buy price:</span>
                  <span className="text-[#facc15]">{playerHoldings.avgBuyPrice}g</span>
                </div>
                {effectiveSellPrice > playerHoldings.avgBuyPrice ? (
                  <div className="flex justify-between text-[#4ade80] font-bold">
                    <span>Current profit if sold:</span>
                    <span>
                      +{effectiveSellPrice - playerHoldings.avgBuyPrice}g (+
                      {Math.round(
                        ((effectiveSellPrice - playerHoldings.avgBuyPrice) / playerHoldings.avgBuyPrice) * 100
                      )}
                      %)
                    </span>
                  </div>
                ) : (
                  <div className="flex justify-between text-[#f87171]">
                    <span>Loss if sold now:</span>
                    <span>{effectiveSellPrice - playerHoldings.avgBuyPrice}g</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Trade Execution Controls */}
          <div className="border-t-2 border-[#5c371e] pt-3">
            {/* Quantity Selector */}
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-[#d6b78d]">Quantity to Trade:</span>
                <span className="font-bold text-[#facc15] text-sm">{tradeAmount} units</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTradeAmount(1)}
                  className="pixel-btn bg-[#2d180d] px-2 py-1 text-xs text-[#eedcc0]"
                >
                  1
                </button>
                <button
                  onClick={() => setTradeAmount(5)}
                  className="pixel-btn bg-[#2d180d] px-2 py-1 text-xs text-[#eedcc0]"
                >
                  5
                </button>
                <button
                  onClick={() => setTradeAmount(10)}
                  className="pixel-btn bg-[#2d180d] px-2 py-1 text-xs text-[#eedcc0]"
                >
                  10
                </button>
                <button
                  onClick={() => setTradeAmount(Math.max(1, maxBuyable))}
                  className="pixel-btn bg-[#2d180d] px-2 py-1 text-xs text-[#facc15]"
                >
                  Max Buy ({maxBuyable})
                </button>
                <button
                  onClick={() => setTradeAmount(Math.max(1, maxSellable))}
                  className="pixel-btn bg-[#2d180d] px-2 py-1 text-xs text-[#38bdf8]"
                >
                  Sell All ({maxSellable})
                </button>
              </div>

              {/* Range slider */}
              <input
                type="range"
                min={1}
                max={Math.max(1, Math.max(maxBuyable, maxSellable))}
                value={tradeAmount}
                onChange={(e) => setTradeAmount(parseInt(e.target.value) || 1)}
                className="mt-2 w-full accent-[#ca8a04]"
              />
            </div>

            {/* Buy / Sell buttons with pixel art textures */}
            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                onClick={handleBuy}
                disabled={tradeAmount <= 0 || tradeAmount > maxBuyable}
                className="pixel-btn-action-buy flex flex-col items-center justify-center py-2.5 px-2 text-xs font-bold text-[#fef08a] disabled:opacity-40 shadow-md"
              >
                <span className="drop-shadow-sm">BUY {tradeAmount} UNITS</span>
                <span className="text-[10px] text-[#dcfce7] font-normal drop-shadow-xs">
                  Cost: {tradeAmount * effectiveBuyPrice} gold
                </span>
              </button>

              <button
                onClick={handleSell}
                disabled={tradeAmount <= 0 || tradeAmount > maxSellable}
                className="pixel-btn-action-sell flex flex-col items-center justify-center py-2.5 px-2 text-xs font-bold text-[#fffbeb] disabled:opacity-40 shadow-md"
              >
                <span className="drop-shadow-sm">SELL {tradeAmount} UNITS</span>
                <span className="text-[10px] text-[#fef08a] font-normal drop-shadow-xs">
                  Proceeds: +{tradeAmount * effectiveSellPrice} gold
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
