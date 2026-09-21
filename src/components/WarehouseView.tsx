import React from 'react';
import { PlayerState } from '../types';
import { ITEMS_MAP } from '../data/items';
import { WAREHOUSE_UPGRADES, CART_UPGRADES } from '../data/ranks';
import { PixelIcon } from './PixelIcons';
import { SoundEngine } from '../utils/sound';

interface WarehouseViewProps {
  player: PlayerState;
  onUpgradeWarehouse: (cost: number, newCapacity: number, nextLevel: number) => void;
  onUpgradeCart: (cost: number, nextLevel: number) => void;
  onHireGuard: (cost: number) => void;
}

export const WarehouseView: React.FC<WarehouseViewProps> = ({
  player,
  onUpgradeWarehouse,
  onUpgradeCart,
  onHireGuard
}) => {
  // Calculate capacity
  const usedCapacity = Object.entries(player.inventory).reduce((total, [itemId, inv]) => {
    const item = ITEMS_MAP[itemId];
    return total + (item ? item.weight * inv.amount : inv.amount);
  }, 0);

  const maxCapacity = player.warehouseCapacity;
  const capacityPercent = Math.min(100, Math.round((usedCapacity / maxCapacity) * 100));

  // Next warehouse upgrade
  const currentWarehouseIdx = WAREHOUSE_UPGRADES.findIndex((u) => u.level === player.warehouseLevel);
  const nextWarehouseUpgrade = WAREHOUSE_UPGRADES[currentWarehouseIdx + 1];

  // Next cart upgrade
  const currentCartIdx = CART_UPGRADES.findIndex((c) => c.level === player.cartLevel);
  const nextCartUpgrade = CART_UPGRADES[currentCartIdx + 1];

  const handleWarehouseUpgrade = () => {
    if (!nextWarehouseUpgrade || player.gold < nextWarehouseUpgrade.cost) return;
    SoundEngine.playFanfare();
    SoundEngine.playWoodThud();
    onUpgradeWarehouse(nextWarehouseUpgrade.cost, nextWarehouseUpgrade.capacity, nextWarehouseUpgrade.level);
  };

  const handleCartUpgrade = () => {
    if (!nextCartUpgrade || player.gold < nextCartUpgrade.cost) return;
    SoundEngine.playFanfare();
    onUpgradeCart(nextCartUpgrade.cost, nextCartUpgrade.level);
  };

  const handleGuardHire = () => {
    const cost = 120;
    if (player.gold < cost) return;
    SoundEngine.playCoin();
    onHireGuard(cost);
  };

  // Stored items list
  const storedItems = Object.entries(player.inventory)
    .filter(([_, inv]) => inv.amount > 0)
    .map(([itemId, inv]) => {
      const item = ITEMS_MAP[itemId];
      const totalWeight = (item?.weight || 1) * inv.amount;
      const totalCost = inv.avgBuyPrice * inv.amount;
      return { item, amount: inv.amount, avgPrice: inv.avgBuyPrice, totalWeight, totalCost };
    });

  const totalInventoryValue = storedItems.reduce((sum, s) => sum + s.totalCost, 0);

  return (
    <div className="flex flex-col gap-5">
      {/* Top Warehouse Header & Capacity Bar */}
      <div className="pixel-box-wood p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#5c371e] pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center border-2 border-[#ca8a04] bg-[#1a0f0a]">
              <PixelIcon name="warehouse" size={32} />
            </div>
            <div>
              <h2 className="font-medieval text-xl font-bold text-[#fde047]">
                Merchant Packhouse (Level {player.warehouseLevel})
              </h2>
              <p className="text-xs text-[#d6b78d]">
                Total Stored Cargo Value: <span className="text-[#facc15] font-bold">{totalInventoryValue} gold</span>
              </p>
            </div>
          </div>

          {/* Current Capacity Display */}
          <div className="text-right">
            <div className="text-xs text-[#d6b78d]">Warehouse Capacity:</div>
            <div className="text-lg font-bold text-[#fde047]">
              {usedCapacity} <span className="text-xs text-[#9c8469]">/ {maxCapacity} slots</span>
            </div>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-[#9c8469] mb-1">
            <span>Available: {Math.max(0, maxCapacity - usedCapacity)} slots</span>
            <span className={capacityPercent > 85 ? 'text-[#f87171] font-bold' : 'text-[#86efac]'}>
              Filled to {capacityPercent}%
            </span>
          </div>
          <div className="h-4 w-full border-2 border-[#1c1109] bg-[#120a06] p-0.5">
            <div
              className={`h-full transition-all duration-300 ${
                capacityPercent > 85 ? 'bg-[#dc2626]' : capacityPercent > 60 ? 'bg-[#eab308]' : 'bg-[#16a34a]'
              }`}
              style={{ width: `${capacityPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grid of Stored Goods */}
      <div className="pixel-box-dark p-4 border-2 border-[#3d2719]">
        <h3 className="font-medieval text-base font-bold text-[#eedcc0] mb-3 flex items-center gap-2">
          <PixelIcon name="warehouse" size={18} />
          <span>Stored Goods</span>
          <span className="text-xs text-[#9c8469] font-normal">({storedItems.length} types)</span>
        </h3>

        {storedItems.length === 0 ? (
          <div className="py-8 text-center text-sm text-[#9c8469]">
            <p className="italic">Your warehouse is currently empty. Visit the market to buy provisions and materials!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {storedItems.map(({ item, amount, avgPrice, totalWeight, totalCost }) => {
              if (!item) return null;
              return (
                <div
                  key={item.id}
                  className="pixel-box-wood p-2.5 flex items-center justify-between border-2 border-[#452714]"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="pixel-slot-container flex h-11 w-11 shrink-0 items-center justify-center p-1.5">
                      <PixelIcon name={item.iconKey} size={26} />
                    </div>
                    <div>
                      <div className="font-medieval text-xs font-bold text-[#eedcc0]">{item.name}</div>
                      <div className="text-[10px] text-[#9c8469]">
                        Weight: {totalWeight} | Avg Buy: {avgPrice}g
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-bold text-[#facc15]">{amount} units</div>
                    <div className="text-[10px] text-[#86efac]">{totalCost}g</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upgrades & Facilities Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Expand Warehouse */}
        <div className="pixel-box-wood p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-[#fde047]">
              <PixelIcon name="wood" size={18} />
              <span>Warehouse Expansion</span>
            </div>
            <p className="mt-1 text-xs text-[#b89f82]">
              {nextWarehouseUpgrade
                ? `Expand total storage capacity from ${maxCapacity} to ${nextWarehouseUpgrade.capacity} units.`
                : 'Your warehouse is fully expanded to the royal customs grade!'}
            </p>
          </div>

          <div className="mt-3">
            {nextWarehouseUpgrade ? (
              <button
                onClick={handleWarehouseUpgrade}
                disabled={player.gold < nextWarehouseUpgrade.cost}
                className="pixel-btn w-full bg-[#b45309] py-2 px-2 text-xs font-bold text-[#fffbeb] hover:bg-[#d97706] disabled:opacity-40"
              >
                Upgrade ({nextWarehouseUpgrade.cost} gold)
              </button>
            ) : (
              <div className="text-center text-xs font-bold text-[#4ade80]">Max Grade Reached</div>
            )}
          </div>
        </div>

        {/* 2. Cart & Wagon Upgrades */}
        <div className="pixel-box-wood p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-[#fde047]">
              <PixelIcon name="horses" size={18} />
              <span>Caravan & Wagon Fleet</span>
            </div>
            <p className="mt-1 text-xs text-[#b89f82]">
              {nextCartUpgrade
                ? `Upgrade transport to "${nextCartUpgrade.name}". +${nextCartUpgrade.capacityBonus} caravan capacity!`
                : 'Your transport fleet is equipped with the finest armored wagons!'}
            </p>
          </div>

          <div className="mt-3">
            {nextCartUpgrade ? (
              <button
                onClick={handleCartUpgrade}
                disabled={player.gold < nextCartUpgrade.cost}
                className="pixel-btn w-full bg-[#15803d] py-2 px-2 text-xs font-bold text-[#fffbeb] hover:bg-[#16a34a] disabled:opacity-40"
              >
                Purchase ({nextCartUpgrade.cost} gold)
              </button>
            ) : (
              <div className="text-center text-xs font-bold text-[#4ade80]">Finest Wagon Fleet</div>
            )}
          </div>
        </div>

        {/* 3. Guards / Security for Caravans */}
        <div className="pixel-box-wood p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-[#fde047]">
              <PixelIcon name="swords" size={18} />
              <span>Caravan Escort</span>
            </div>
            <p className="mt-1 text-xs text-[#b89f82]">
              In your retinue: <span className="font-bold text-[#facc15]">{player.guardsCount} mercenary guards</span>.
              Reduces bandit ambush probability on trade highways by 25% per guard.
            </p>
          </div>

          <div className="mt-3">
            <button
              onClick={handleGuardHire}
              disabled={player.gold < 120}
              className="pixel-btn w-full bg-[#1e3a8a] py-2 px-2 text-xs font-bold text-[#fffbeb] hover:bg-[#2563eb] disabled:opacity-40"
            >
              Hire Guard (120 gold)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
