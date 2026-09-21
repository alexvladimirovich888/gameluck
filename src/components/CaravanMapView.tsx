import React, { useState } from 'react';
import { ActiveCaravan, LocationId, PlayerState } from '../types';
import { LOCATIONS } from '../data/locations';
import { ITEMS_MAP } from '../data/items';
import { SoundEngine } from '../utils/sound';
import { PixelIcon, CompassRoseIcon, WaxSealBadge } from './PixelIcons';
import { ENVIRONMENT_ASSETS } from '../utils/assets';

interface CaravanMapViewProps {
  player: PlayerState;
  onTravelToLocation: (locationId: LocationId, cost: number, days: number) => void;
  onDispatchCaravan: (
    toLocation: LocationId,
    items: Record<string, number>,
    totalValue: number,
    guards: number,
    risk: number,
    durationDays: number
  ) => void;
}

export const CaravanMapView: React.FC<CaravanMapViewProps> = ({
  player,
  onTravelToLocation,
  onDispatchCaravan
}) => {
  const [selectedTargetLoc, setSelectedTargetLoc] = useState<LocationId>('farm_village');
  const [caravanGoods, setCaravanGoods] = useState<Record<string, number>>({});
  const [assignedGuards, setAssignedGuards] = useState<number>(Math.min(player.guardsCount, 1));
  const [showDispatchModal, setShowDispatchModal] = useState<boolean>(false);

  const currentLocation = LOCATIONS[player.currentLocationId];
  const targetLocation = LOCATIONS[selectedTargetLoc];

  // Calculate caravan capacity based on player rank & cart upgrades
  const baseCaravanCapacity = 30 + player.cartLevel * 25;
  const caravanUsedWeight = Object.entries(caravanGoods).reduce((sum, [itemId, qty]) => {
    const item = ITEMS_MAP[itemId];
    return sum + (item ? item.weight * qty : qty);
  }, 0);

  // Calculate risk % based on target location danger and assigned guards
  const baseRisk = targetLocation.dangerLevel;
  const guardProtection = assignedGuards * 8; // 8% risk reduction per guard
  const finalRisk = Math.max(2, baseRisk - guardProtection);

  // Calculate estimated value of caravan goods at destination
  const estimatedArrivalValue = Object.entries(caravanGoods).reduce((sum, [itemId, qty]) => {
    const item = ITEMS_MAP[itemId];
    if (!item) return sum;
    const mod = targetLocation.itemModifiers[item.id] ?? targetLocation.categoryModifiers[item.category] ?? 1.0;
    return sum + Math.round(item.basePrice * mod * 1.05) * qty;
  }, 0);

  // Travel directly
  const handleTravel = (locId: LocationId) => {
    const loc = LOCATIONS[locId];
    if (locId === player.currentLocationId) return;
    if (player.gold < loc.travelCost) return;

    SoundEngine.playWoodThud();
    onTravelToLocation(locId, loc.travelCost, loc.travelDays);
  };

  // Dispatch Caravan
  const handleConfirmDispatch = () => {
    if (caravanUsedWeight <= 0) return;
    SoundEngine.playFanfare();
    SoundEngine.playWoodThud();
    onDispatchCaravan(
      selectedTargetLoc,
      caravanGoods,
      estimatedArrivalValue,
      assignedGuards,
      finalRisk,
      targetLocation.travelDays || 1
    );
    setCaravanGoods({});
    setShowDispatchModal(false);
  };

  // Add/remove item to caravan
  const adjustCaravanItem = (itemId: string, delta: number) => {
    const current = caravanGoods[itemId] || 0;
    const available = player.inventory[itemId]?.amount || 0;
    const item = ITEMS_MAP[itemId];
    if (!item) return;

    const next = Math.max(0, Math.min(available, current + delta));
    if (delta > 0 && caravanUsedWeight + item.weight > baseCaravanCapacity) {
      return; // exceed capacity
    }

    setCaravanGoods((prev) => {
      const copy = { ...prev };
      if (next === 0) {
        delete copy[itemId];
      } else {
        copy[itemId] = next;
      }
      return copy;
    });
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Map Header */}
      <div className="pixel-box-wood p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#5c371e] pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center border-2 border-[#ca8a04] bg-[#1a0f0a]">
              <PixelIcon name="map" size={32} />
            </div>
            <div>
              <h2 className="font-medieval text-xl font-bold text-[#fde047]">
                Trade Highways of Marketburg Province
              </h2>
              <p className="text-xs text-[#d6b78d]">
                Current Encampment: <span className="font-bold text-[#facc15]">{currentLocation.name}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              SoundEngine.playParchment();
              setShowDispatchModal(true);
            }}
            className="pixel-btn bg-[#b45309] px-4 py-2 text-xs font-bold text-[#fffbeb] hover:bg-[#d97706] flex items-center gap-2"
          >
            <PixelIcon name="horses" size={18} />
            <span>Dispatch Caravan ({baseCaravanCapacity} capacity)</span>
          </button>
        </div>

        {/* Visual Caravan Traveling Banner */}
        <div className="relative mt-3 h-28 sm:h-36 w-full overflow-hidden border-2 border-[#5c371e] bg-[#1a0f0a]">
          <img
            src={ENVIRONMENT_ASSETS.caravanTravel}
            alt="Caravan Travel"
            className="w-full h-full object-cover pixelated"
            style={{ imageRendering: 'pixelated' }}
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex items-end p-2.5">
            <span className="text-[11px] font-bold text-[#fef08a] bg-[#1a0f0a]/80 px-2 py-0.5 border border-[#ca8a04]/50">
              Provincial Highways of Marketburg • Wagons & Merchant Trains En Route
            </span>
          </div>
        </div>

        {/* Visual Medieval Map Layout */}
        <div className="relative mt-4 h-64 sm:h-72 w-full overflow-hidden border-2 border-[#452714] bg-[#2d1b11] p-3 shadow-inner">
          {/* Authentic Nautical/Cartographic Compass Rose */}
          <div className="absolute top-2 right-2 pointer-events-none z-10 opacity-85 hover:opacity-100 transition-opacity">
            <CompassRoseIcon size={52} />
          </div>

          {/* Parchment terrain background with drawn roads */}
          <svg className="absolute inset-0 h-full w-full pointer-events-none" viewBox="0 0 500 240">
            {/* Roads */}
            <path
              d="M 250 120 L 90 60 M 250 120 L 410 60 M 250 120 L 110 190 M 250 120 L 390 190"
              stroke="#5c371e"
              strokeWidth="4"
              strokeDasharray="6,4"
              fill="none"
            />
            {/* Mountain and river accents */}
            <path d="M 40 20 L 70 5 M 65 25 L 90 10" stroke="#452714" strokeWidth="2" fill="none" />
            <path d="M 430 180 Q 460 200 480 230" stroke="#0369a1" strokeWidth="6" fill="none" opacity="0.6" />
          </svg>

          {/* Location Nodes */}
          {Object.entries(LOCATIONS).map(([locId, loc]) => {
            const isCurrent = player.currentLocationId === locId;
            const isTarget = selectedTargetLoc === locId;

            // Map layout coordinates in %
            const coords: Record<LocationId, { top: string; left: string }> = {
              market_square: { top: '50%', left: '50%' },
              farm_village: { top: '24%', left: '18%' },
              castle_district: { top: '24%', left: '82%' },
              harbor: { top: '78%', left: '22%' },
              merchant_quarter: { top: '78%', left: '78%' }
            };

            const pos = coords[locId as LocationId];

            return (
              <div
                key={locId}
                style={{ top: pos.top, left: pos.left }}
                onClick={() => {
                  SoundEngine.playParchment();
                  setSelectedTargetLoc(locId as LocationId);
                }}
                className={`pixel-btn absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer p-2 text-center transition-all ${
                  isCurrent
                    ? 'border-2 border-[#22c55e] bg-[#14532d] shadow-lg'
                    : isTarget
                    ? 'border-2 border-[#facc15] bg-[#5c371e] shadow-md scale-105'
                    : 'border border-[#78350f] bg-[#1c0f08] hover:bg-[#381e10]'
                }`}
              >
                <div className="font-medieval text-xs font-bold text-[#eedcc0] whitespace-nowrap">
                  {loc.name}
                </div>
                <div className="text-[10px] text-[#facc15]">
                  {isCurrent ? '★ YOU ARE HERE' : `${loc.travelCost}g • ${loc.travelDays} d.`}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Location Details & Travel Button */}
        <div className="pixel-box-dark mt-4 p-4 border border-[#5c371e]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medieval text-lg font-bold text-[#fde047]">{targetLocation.name}</h3>
                <span className="text-xs text-[#a89279]">({targetLocation.title})</span>
              </div>
              <p className="mt-1 text-xs text-[#e2d5c3]">{targetLocation.description}</p>
              <div className="mt-2 text-xs text-[#86efac]">
                Price Traits: {targetLocation.specialtyText}
              </div>
            </div>

            {/* Travel Action Button */}
            {player.currentLocationId !== selectedTargetLoc ? (
              <button
                onClick={() => handleTravel(selectedTargetLoc)}
                disabled={player.gold < targetLocation.travelCost}
                className="pixel-btn bg-[#15803d] px-5 py-2.5 text-xs font-bold text-[#fef08a] hover:bg-[#16a34a] disabled:opacity-40 flex items-center gap-2"
              >
                <PixelIcon name="horses" size={16} />
                <span>Travel to {targetLocation.name} ({targetLocation.travelCost} gold, {targetLocation.travelDays} day)</span>
              </button>
            ) : (
              <div className="bg-[#14532d] px-4 py-2 text-xs font-bold text-[#86efac] border border-[#22c55e]">
                ✓ You are currently in this settlement
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active Caravans List */}
      <div className="pixel-box-dark p-4 border-2 border-[#3d2719]">
        <h3 className="font-medieval text-base font-bold text-[#eedcc0] mb-3 flex items-center gap-2">
          <PixelIcon name="horses" size={18} />
          <span>Active Caravans En Route</span>
          <span className="text-xs text-[#9c8469]">({player.activeCaravans.length})</span>
        </h3>

        {player.activeCaravans.length === 0 ? (
          <p className="py-4 text-center text-xs italic text-[#9c8469]">
            No caravans are currently on the road. Dispatch an expedition loaded with goods to reap substantial profits!
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {player.activeCaravans.map((caravan) => {
              const fromLoc = LOCATIONS[caravan.fromLocation];
              const toLoc = LOCATIONS[caravan.toLocation];
              const daysTotal = Math.max(1, caravan.arrivalDay - caravan.departureDay);
              const daysElapsed = Math.max(0, player.currentDay - caravan.departureDay);
              const progressPct = Math.min(100, Math.round((daysElapsed / daysTotal) * 100));

              return (
                <div
                  key={caravan.id}
                  className="pixel-box-wood p-3 flex flex-wrap items-center justify-between gap-3 border border-[#5c371e]"
                >
                  <div>
                    <div className="flex items-center gap-2 font-medieval text-sm font-bold text-[#fde047]">
                      <span>{fromLoc.name}</span>
                      <span>➔</span>
                      <span>{toLoc.name}</span>
                    </div>
                    <div className="text-[11px] text-[#9c8469] mt-0.5">
                      Escort: {caravan.guards} guards | Ambush Risk: {caravan.riskPercent}% | Arrival on Day {caravan.arrivalDay}
                    </div>
                  </div>

                  <div className="w-full sm:w-48">
                    <div className="flex justify-between text-[10px] text-[#d6b78d] mb-1">
                      <span>Traveling...</span>
                      <span>{progressPct}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-[#140a05] border border-[#3d2212]">
                      <div className="h-full bg-[#eab308]" style={{ width: `${progressPct}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Dispatch Caravan Modal */}
      {showDispatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs">
          <div className="pixel-box-wood relative w-full max-w-xl p-5 text-[#eedcc0] animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setShowDispatchModal(false)}
              className="pixel-btn absolute top-3 right-3 flex h-7 w-7 items-center justify-center bg-[#801b1b] text-xs font-bold text-white"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-2">
              <WaxSealBadge size={36} />
              <div>
                <h3 className="font-medieval text-lg font-bold text-[#fde047] leading-none">
                  Trade Charter for Caravan Expedition
                </h3>
                <span className="text-[10px] text-[#ca8a04]">Sealed by the Merchant Guild Registry</span>
              </div>
            </div>
            <p className="text-xs text-[#b89f82] mb-4">
              Choose your destination settlement and load provisions from your packhouse onto wagons.
            </p>

            {/* Target selector */}
            <div className="mb-4">
              <label className="text-xs text-[#d6b78d] font-bold block mb-1">Expedition Destination:</label>
              <select
                value={selectedTargetLoc}
                onChange={(e) => setSelectedTargetLoc(e.target.value as LocationId)}
                className="w-full border-2 border-[#5c371e] bg-[#1a0f0a] px-3 py-1.5 text-xs text-[#fde047] outline-none"
              >
                {Object.entries(LOCATIONS).map(([id, loc]) => (
                  <option key={id} value={id} disabled={id === player.currentLocationId}>
                    {loc.name} ({loc.travelDays} d. journey, risk {loc.dangerLevel}%)
                  </option>
                ))}
              </select>
            </div>

            {/* Goods selection list from warehouse */}
            <div className="pixel-box-dark mb-4 p-3 border border-[#4a2e1c] max-h-48 overflow-y-auto">
              <div className="text-xs font-bold text-[#fde047] mb-2">Cargo available in your packhouse:</div>
              {Object.entries(player.inventory).filter(([_, inv]) => inv.amount > 0).length === 0 ? (
                <p className="text-xs italic text-[#9c8469]">No commodities stored in the packhouse to load.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {Object.entries(player.inventory)
                    .filter(([_, inv]) => inv.amount > 0)
                    .map(([itemId, inv]) => {
                      const item = ITEMS_MAP[itemId];
                      const inCaravan = caravanGoods[itemId] || 0;
                      if (!item) return null;

                      return (
                        <div
                          key={itemId}
                          className="flex items-center justify-between border-b border-[#2d1b11] pb-1.5 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <PixelIcon name={item.iconKey} size={20} />
                            <span>{item.name}</span>
                            <span className="text-[10px] text-[#9c8469]">
                              (available: {inv.amount - inCaravan})
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => adjustCaravanItem(itemId, -5)}
                              className="pixel-btn bg-[#2d180d] px-2 py-0.5 text-xs text-[#eedcc0]"
                            >
                              -5
                            </button>
                            <span className="font-bold text-[#facc15] w-8 text-center">{inCaravan}</span>
                            <button
                              onClick={() => adjustCaravanItem(itemId, 5)}
                              className="pixel-btn bg-[#2d180d] px-2 py-0.5 text-xs text-[#eedcc0]"
                            >
                              +5
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Caravan Summary & Guards */}
            <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
              <div className="pixel-box-dark p-2 border border-[#3d2719]">
                <div className="text-[#a89279]">Wagon Load:</div>
                <div className="font-bold text-[#fde047]">
                  {caravanUsedWeight} / {baseCaravanCapacity} capacity
                </div>
              </div>
              <div className="pixel-box-dark p-2 border border-[#3d2719]">
                <div className="text-[#a89279]">Highway Brigand Risk:</div>
                <div className={`font-bold ${finalRisk > 20 ? 'text-[#f87171]' : 'text-[#86efac]'}`}>
                  {finalRisk}%
                </div>
              </div>
            </div>

            {/* Guards Assignment */}
            <div className="mb-4 flex items-center justify-between text-xs">
              <span className="text-[#d6b78d]">Assign mercenary guards from retinue:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAssignedGuards((g) => Math.max(0, g - 1))}
                  className="pixel-btn bg-[#2d180d] px-2 py-0.5"
                >
                  -
                </button>
                <span className="font-bold text-[#facc15]">{assignedGuards} of {player.guardsCount}</span>
                <button
                  onClick={() => setAssignedGuards((g) => Math.min(player.guardsCount, g + 1))}
                  className="pixel-btn bg-[#2d180d] px-2 py-0.5"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleConfirmDispatch}
              disabled={caravanUsedWeight <= 0}
              className="pixel-btn w-full bg-[#15803d] py-3 text-xs font-bold text-[#fffbeb] hover:bg-[#16a34a] disabled:opacity-40"
            >
              Dispatch Caravan on the Highway!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
