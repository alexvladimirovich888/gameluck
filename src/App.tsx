import React, { useState, useEffect } from 'react';
import {
  ItemCategory,
  LocationId,
  MarketItemData,
  MarketState,
  Merchant,
  PlayerState,
  Season
} from './types';
import { generateInitialMarket, advanceMarketDay } from './utils/economy';
import { createInitialPlayer, loadGame, saveGame, clearGameSave } from './utils/storage';
import { SoundEngine } from './utils/sound';
import { MERCHANTS } from './data/merchants';
import { LOCATIONS } from './data/locations';
import { ITEMS_MAP } from './data/items';
import { PLAYER_RANKS } from './data/ranks';
import { PixelIcon, GoldPouchIcon, GoldCoinIcon, CompassRoseIcon, WaxSealBadge } from './components/PixelIcons';
import { PixelCanvasMarket } from './components/PixelCanvasMarket';
import { MarketTradeView } from './components/MarketTradeView';
import { WarehouseView } from './components/WarehouseView';
import { CaravanMapView } from './components/CaravanMapView';
import { MerchantsDirectoryView } from './components/MerchantsDirectoryView';
import { EventsNewsView } from './components/EventsNewsView';
import { MerchantDialogueModal } from './components/MerchantDialogueModal';
import { OnboardingModal } from './components/OnboardingModal';
import { ProgressionModal } from './components/ProgressionModal';

type ActiveTab = 'market' | 'warehouse' | 'map' | 'merchants' | 'events';

export default function App() {
  const [player, setPlayer] = useState<PlayerState>(() => {
    const saved = loadGame();
    return saved ? saved.player : createInitialPlayer();
  });

  const [market, setMarket] = useState<MarketState>(() => {
    const saved = loadGame();
    return saved ? saved.market : generateInitialMarket();
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('market');
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [specialtyFilter, setSpecialtyFilter] = useState<string[] | null>(null);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [showProgression, setShowProgression] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(SoundEngine.isMuted());
  const [floatingNotice, setFloatingNotice] = useState<{ text: string; isPositive: boolean } | null>(null);
  const [dayTransitioning, setDayTransitioning] = useState<boolean>(false);

  // Auto-save on state change
  useEffect(() => {
    saveGame(player, market);
  }, [player, market]);

  // First-time onboarding check
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const shown = localStorage.getItem('marketburg_onboarded_v1');
      if (!shown) {
        setShowOnboarding(true);
        localStorage.setItem('marketburg_onboarded_v1', 'true');
      }
    }
  }, []);

  // Show floating trade toast
  const triggerToast = (text: string, isPositive: boolean) => {
    setFloatingNotice({ text, isPositive });
    setTimeout(() => {
      setFloatingNotice(null);
    }, 2200);
  };

  // 1. ADVANCE DAY
  const handleNextDay = () => {
    setDayTransitioning(true);
    SoundEngine.playDawnBell();

    setTimeout(() => {
      const { newMarket, newPlayer, dayLogs } = advanceMarketDay(market, player);
      setMarket(newMarket);
      setPlayer(newPlayer);
      setDayTransitioning(false);
      triggerToast(`Day ${newPlayer.currentDay} has arrived! Market prices have shifted.`, true);
    }, 400);
  };

  // 2. BUY ACTION
  const handleBuy = (itemId: string, amount: number, pricePerUnit: number) => {
    const totalCost = amount * pricePerUnit;
    if (player.gold < totalCost) return;

    const existing = player.inventory[itemId] || { amount: 0, avgBuyPrice: 0 };
    const newAmount = existing.amount + amount;
    const newAvgBuyPrice = Math.round(
      (existing.amount * existing.avgBuyPrice + totalCost) / newAmount
    );

    const item = ITEMS_MAP[itemId];
    const newLog = {
      id: `trade_buy_${Date.now()}`,
      day: player.currentDay,
      type: 'trade' as const,
      goldChange: -totalCost,
      text: `Purchased ${amount}x "${item?.name || itemId}" for ${totalCost}g (${pricePerUnit}g each).`
    };

    setPlayer((prev) => ({
      ...prev,
      gold: prev.gold - totalCost,
      inventory: {
        ...prev.inventory,
        [itemId]: {
          amount: newAmount,
          avgBuyPrice: newAvgBuyPrice
        }
      },
      stats: {
        ...prev.stats,
        totalTrades: prev.stats.totalTrades + 1
      },
      logs: [newLog, ...prev.logs].slice(0, 60)
    }));

    // Impact local market supply (depleted slightly)
    setMarket((prev) => {
      const locData = { ...prev.locations[player.currentLocationId] };
      if (locData[itemId]) {
        locData[itemId] = {
          ...locData[itemId],
          supply: Math.max(5, locData[itemId].supply - amount)
        };
      }
      return {
        ...prev,
        locations: {
          ...prev.locations,
          [player.currentLocationId]: locData
        }
      };
    });

    triggerToast(`-${totalCost} gold (+${amount} ${item?.name})`, false);
  };

  // 3. SELL ACTION
  const handleSell = (itemId: string, amount: number, pricePerUnit: number) => {
    const existing = player.inventory[itemId] || { amount: 0, avgBuyPrice: 0 };
    if (existing.amount < amount) return;

    const totalRevenue = amount * pricePerUnit;
    const itemCost = existing.avgBuyPrice * amount;
    const profit = totalRevenue - itemCost;

    const newAmount = existing.amount - amount;
    const item = ITEMS_MAP[itemId];

    const newLog = {
      id: `trade_sell_${Date.now()}`,
      day: player.currentDay,
      type: 'trade' as const,
      goldChange: totalRevenue,
      text: `Sold ${amount}x "${item?.name || itemId}" for +${totalRevenue}g (profit: ${profit >= 0 ? '+' : ''}${profit}g).`
    };

    const newInventory = { ...player.inventory };
    if (newAmount <= 0) {
      delete newInventory[itemId];
    } else {
      newInventory[itemId] = {
        ...existing,
        amount: newAmount
      };
    }

    setPlayer((prev) => ({
      ...prev,
      gold: prev.gold + totalRevenue,
      reputation: Math.min(100, prev.reputation + (profit > 0 ? 1 : 0)),
      inventory: newInventory,
      stats: {
        ...prev.stats,
        totalTrades: prev.stats.totalTrades + 1,
        totalProfit: prev.stats.totalProfit + Math.max(0, profit),
        highestSingleProfit: Math.max(prev.stats.highestSingleProfit, profit)
      },
      logs: [newLog, ...prev.logs].slice(0, 60)
    }));

    // Impact local market supply (glut of goods)
    setMarket((prev) => {
      const locData = { ...prev.locations[player.currentLocationId] };
      if (locData[itemId]) {
        locData[itemId] = {
          ...locData[itemId],
          supply: Math.min(100, locData[itemId].supply + amount)
        };
      }
      return {
        ...prev,
        locations: {
          ...prev.locations,
          [player.currentLocationId]: locData
        }
      };
    });

    triggerToast(`+${totalRevenue} gold (profit: ${profit >= 0 ? '+' : ''}${profit}g)`, true);
  };

  // 4. TRAVEL TO LOCATION
  const handleTravelToLocation = (locationId: LocationId, cost: number, days: number) => {
    if (player.gold < cost) return;

    const loc = LOCATIONS[locationId];
    const newLog = {
      id: `travel_${Date.now()}`,
      day: player.currentDay + days,
      type: 'travel' as const,
      goldChange: -cost,
      text: `You arrived at "${loc.name}". Road expenses: -${cost}g.`
    };

    setPlayer((prev) => ({
      ...prev,
      gold: prev.gold - cost,
      currentLocationId: locationId,
      currentDay: prev.currentDay + days,
      logs: [newLog, ...prev.logs].slice(0, 60)
    }));

    setActiveTab('market');
    triggerToast(`You arrived at ${loc.name}!`, true);
  };

  // 5. DISPATCH CARAVAN
  const handleDispatchCaravan = (
    toLocation: LocationId,
    items: Record<string, number>,
    totalEstimatedValue: number,
    guards: number,
    risk: number,
    durationDays: number
  ) => {
    // Deduct items from player inventory
    const newInventory = { ...player.inventory };
    Object.entries(items).forEach(([itemId, qty]) => {
      if (newInventory[itemId]) {
        const remaining = newInventory[itemId].amount - qty;
        if (remaining <= 0) {
          delete newInventory[itemId];
        } else {
          newInventory[itemId] = { ...newInventory[itemId], amount: remaining };
        }
      }
    });

    const newCaravan = {
      id: `caravan_${Date.now()}`,
      fromLocation: player.currentLocationId,
      toLocation,
      departureDay: player.currentDay,
      arrivalDay: player.currentDay + durationDays,
      items,
      totalInvested: totalEstimatedValue,
      guards,
      riskPercent: risk
    };

    const toLoc = LOCATIONS[toLocation];
    const newLog = {
      id: `dispatch_${Date.now()}`,
      day: player.currentDay,
      type: 'caravan' as const,
      text: `Equipped and dispatched caravan to ${toLoc.name}. Estimated revenue: ~${totalEstimatedValue}g.`
    };

    setPlayer((prev) => ({
      ...prev,
      inventory: newInventory,
      activeCaravans: [...prev.activeCaravans, newCaravan],
      logs: [newLog, ...prev.logs].slice(0, 60)
    }));

    triggerToast(`Caravan dispatched to ${toLoc.name}!`, true);
  };

  // 6. UPGRADE WAREHOUSE
  const handleUpgradeWarehouse = (cost: number, newCapacity: number, nextLevel: number) => {
    if (player.gold < cost) return;
    setPlayer((prev) => ({
      ...prev,
      gold: prev.gold - cost,
      warehouseCapacity: newCapacity,
      warehouseLevel: nextLevel,
      logs: [
        {
          id: `upg_wh_${Date.now()}`,
          day: prev.currentDay,
          type: 'event',
          text: `Warehouse expanded to Level ${nextLevel}! Capacity increased to ${newCapacity} slots.`
        },
        ...prev.logs
      ]
    }));
    triggerToast(`Warehouse expanded to ${newCapacity} slots!`, true);
  };

  // 7. UPGRADE CART
  const handleUpgradeCart = (cost: number, nextLevel: number) => {
    if (player.gold < cost) return;
    setPlayer((prev) => ({
      ...prev,
      gold: prev.gold - cost,
      cartLevel: nextLevel,
      logs: [
        {
          id: `upg_cart_${Date.now()}`,
          day: prev.currentDay,
          type: 'event',
          text: `Caravan wagons upgraded to Level ${nextLevel}!`
        },
        ...prev.logs
      ]
    }));
    triggerToast(`Caravan wagons upgraded!`, true);
  };

  // 8. HIRE GUARD
  const handleHireGuard = (cost: number) => {
    if (player.gold < cost) return;
    setPlayer((prev) => ({
      ...prev,
      gold: prev.gold - cost,
      guardsCount: prev.guardsCount + 1,
      logs: [
        {
          id: `hire_guard_${Date.now()}`,
          day: prev.currentDay,
          type: 'event',
          text: `Enlisted a mercenary guard into your retinue. Caravan protection increased!`
        },
        ...prev.logs
      ]
    }));
    triggerToast(`Guard enlisted into service!`, true);
  };

  // 9. GIFT TRUST TO MERCHANT
  const handleGiftTrust = (merchantId: string, cost: number, trustGain: number) => {
    if (player.gold < cost) return;
    const current = player.merchantTrust[merchantId] || 40;
    const nextTrust = Math.min(100, current + trustGain);

    setPlayer((prev) => ({
      ...prev,
      gold: prev.gold - cost,
      merchantTrust: {
        ...prev.merchantTrust,
        [merchantId]: nextTrust
      }
    }));
    triggerToast(`Merchant trust increased to ${nextTrust}!`, true);
  };

  // 10. RESET GAME
  const handleResetGame = () => {
    if (window.confirm('Start a new game? All current trade progress will be reset.')) {
      clearGameSave();
      const freshP = createInitialPlayer();
      const freshM = generateInitialMarket();
      setPlayer(freshP);
      setMarket(freshM);
      setSelectedMerchant(null);
      setSpecialtyFilter(null);
      setActiveTab('market');
      triggerToast('New game begun!', true);
    }
  };

  // Get current rank title
  const inventoryWorth = Object.entries(player.inventory).reduce((sum, [itemId, inv]) => {
    const item = ITEMS_MAP[itemId];
    return sum + (item ? item.basePrice * inv.amount : inv.amount * 10);
  }, 0);
  const totalNetWorth = player.gold + inventoryWorth;

  let currentRankIdx = 0;
  for (let i = PLAYER_RANKS.length - 1; i >= 0; i--) {
    if (totalNetWorth >= PLAYER_RANKS[i].requiredNetWorth) {
      currentRankIdx = i;
      break;
    }
  }
  const playerRankTitle = PLAYER_RANKS[currentRankIdx].title;

  const seasonNames: Record<Season, string> = {
    spring: 'Spring',
    summer: 'Summer',
    autumn: 'Autumn',
    winter: 'Winter'
  };

  const weatherNames: Record<string, string> = {
    clear: '☀️ Clear',
    sunny: '☀️ Sunny',
    rainy: '🌧️ Rainy',
    foggy: '🌫️ Foggy',
    snowy: '❄️ Snowy',
    stormy: '⛈️ Stormy'
  };

  return (
    <div className="min-h-screen bg-[#0d0907] text-[#eedcc0] flex flex-col font-medieval select-none">
      {/* 1. TOP STATUS BAR (WOOD & IRON) */}
      <header className="pixel-box-wood sticky top-0 z-40 px-3 py-2 sm:px-5 sm:py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
          {/* Brand & Crest */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center border-2 border-[#facc15] bg-[#1a0f0a] shadow-inner">
              <PixelIcon name="swords" size={22} />
            </div>
            <div>
              <h1 className="font-medieval text-base sm:text-lg font-bold text-[#fde047] tracking-wider leading-none">
                MARKETBURG
              </h1>
              <span className="text-[10px] text-[#ca8a04] uppercase tracking-widest leading-none">
                {LOCATIONS[player.currentLocationId].name}
              </span>
            </div>
          </div>

          {/* Core Player Metrics: Gold, Day, Season, Reputation, Rank */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
            {/* Gold with gold coin & pouch icon */}
            <div className="flex items-center gap-2 bg-[#170c07] border-2 border-[#5c371e] px-2.5 py-1 shadow-inner">
              <GoldCoinIcon size={20} />
              <div className="flex items-baseline gap-1">
                <span className="font-bold text-sm text-[#facc15]">{player.gold}</span>
                <span className="text-[10px] text-[#ca8a04]">gold</span>
              </div>
            </div>

            {/* Calendar & Season */}
            <div className="flex items-center gap-1.5 bg-[#170c07] border-2 border-[#5c371e] px-2.5 py-1">
              <span className="font-bold text-[#eedcc0]">Day {player.currentDay}</span>
              <span className="text-[#a89279]">|</span>
              <span className="text-[#fde047]">{seasonNames[player.season]}</span>
              <span className="text-[11px] text-[#93c5fd] hidden sm:inline">
                {weatherNames[player.weather] || player.weather}
              </span>
            </div>

            {/* Reputation */}
            <div className="hidden md:flex items-center gap-1.5 bg-[#170c07] border-2 border-[#5c371e] px-2.5 py-1">
              <span className="text-[#a89279]">Reputation:</span>
              <span className="font-bold text-[#86efac]">{player.reputation} / 100</span>
            </div>

            {/* Rank Badge with Wax Seal (Clickable) */}
            <button
              onClick={() => {
                SoundEngine.playParchment();
                setShowProgression(true);
              }}
              className="pixel-btn flex items-center gap-1.5 bg-[#3b2214] border-2 border-[#ca8a04] px-2 py-1 text-xs font-bold text-[#fde047] hover:bg-[#4a2e1c]"
            >
              <WaxSealBadge size={20} />
              <span>{playerRankTitle}</span>
            </button>
          </div>

          {/* Action Buttons: Next Day, Audio, Help, Reset */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleNextDay}
              className="pixel-btn bg-[#b45309] hover:bg-[#d97706] px-3.5 py-1.5 text-xs font-bold text-[#fffbeb] flex items-center gap-1.5 animate-pulse"
            >
              <span>Next Day</span>
              <span>➔</span>
            </button>

            <button
              onClick={() => {
                const nextMute = SoundEngine.toggleMute();
                setIsMuted(nextMute);
              }}
              className="pixel-btn bg-[#2d180d] px-2 py-1 text-xs font-bold text-[#eedcc0]"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? 'Sound: Off' : 'Sound: On'}
            </button>

            <button
              onClick={() => {
                SoundEngine.playParchment();
                setShowOnboarding(true);
              }}
              className="pixel-btn bg-[#2d180d] px-2.5 py-1 text-xs font-bold text-[#fde047]"
              title="Merchant Guide & Help"
            >
              ?
            </button>

            <button
              onClick={handleResetGame}
              className="pixel-btn bg-[#2d180d] px-2 py-1 text-[11px] text-[#9c8469] hover:text-[#f87171]"
              title="Reset Game Save"
            >
              Reset
            </button>
          </div>
        </div>
      </header>

      {/* Floating Action / Transaction Toast */}
      {floatingNotice && (
        <div
          className={`fixed top-16 left-1/2 -translate-x-1/2 z-50 pixel-btn px-4 py-1.5 text-xs font-bold shadow-2xl transition-all duration-200 ${
            floatingNotice.isPositive
              ? 'bg-[#14532d] text-[#86efac] border-[#22c55e]'
              : 'bg-[#7f1d1d] text-[#fca5a5] border-[#ef4444]'
          }`}
        >
          {floatingNotice.text}
        </div>
      )}

      {/* Day Transition Overlay */}
      {dayTransitioning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="text-center">
            <div className="text-3xl animate-bounce">🌅</div>
            <h2 className="font-medieval text-2xl font-bold text-[#fde047] mt-2">
              Day {player.currentDay + 1} approaches...
            </h2>
            <p className="text-xs text-[#a89279] mt-1">
              Merchants prepare their wares, and merchant trains roll along the trade highways.
            </p>
          </div>
        </div>
      )}

      {/* 2. MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto w-full flex-1 p-3 sm:p-5 flex flex-col gap-4">
        {/* Animated Pixel Canvas Scene (Market Square) */}
        {activeTab === 'market' && (
          <PixelCanvasMarket
            currentLocationId={player.currentLocationId}
            season={player.season}
            weather={player.weather}
            currentDay={player.currentDay}
            onSelectMerchant={(merchantId) => {
              const m = MERCHANTS.find((item) => item.id === merchantId);
              if (m) {
                SoundEngine.playParchment();
                setSelectedMerchant(m);
              }
            }}
          />
        )}

        {/* Tab Views */}
        {activeTab === 'market' && (
          <MarketTradeView
            player={player}
            marketData={market.locations[player.currentLocationId]}
            currentLocationId={player.currentLocationId}
            specialtyFilter={specialtyFilter}
            onBuy={handleBuy}
            onSell={handleSell}
            onClearSpecialtyFilter={() => setSpecialtyFilter(null)}
          />
        )}

        {activeTab === 'warehouse' && (
          <WarehouseView
            player={player}
            onUpgradeWarehouse={handleUpgradeWarehouse}
            onUpgradeCart={handleUpgradeCart}
            onHireGuard={handleHireGuard}
          />
        )}

        {activeTab === 'map' && (
          <CaravanMapView
            player={player}
            onTravelToLocation={handleTravelToLocation}
            onDispatchCaravan={handleDispatchCaravan}
          />
        )}

        {activeTab === 'merchants' && (
          <MerchantsDirectoryView
            player={player}
            onOpenMerchantDialogue={(m) => setSelectedMerchant(m)}
          />
        )}

        {activeTab === 'events' && (
          <EventsNewsView
            activeEvents={market.activeEvents}
            logs={player.logs}
            currentDay={player.currentDay}
          />
        )}
      </main>

      {/* 3. BOTTOM NAVIGATION DOCK (PIXEL MEDIEVAL BUTTONS) */}
      <nav className="pixel-box-wood sticky bottom-0 z-40 border-t-4 border-[#1a0f0a] px-2 py-2 bg-[#2d180d]">
        <div className="max-w-4xl mx-auto grid grid-cols-5 gap-1.5 sm:gap-3">
          <button
            onClick={() => {
              SoundEngine.playParchment();
              setActiveTab('market');
            }}
            className={`pixel-btn flex flex-col items-center justify-center py-2 px-1 text-center transition-all ${
              activeTab === 'market'
                ? 'bg-[#b45309] text-[#fef08a] border-[#fde047]'
                : 'bg-[#1c0f08] text-[#d6b78d] hover:bg-[#2d180d]'
            }`}
          >
            <PixelIcon name="market" size={24} />
            <span className="font-medieval text-[11px] sm:text-xs font-bold leading-none mt-1">
              MARKET
            </span>
          </button>

          <button
            onClick={() => {
              SoundEngine.playWoodThud();
              setActiveTab('warehouse');
            }}
            className={`pixel-btn flex flex-col items-center justify-center py-2 px-1 text-center transition-all ${
              activeTab === 'warehouse'
                ? 'bg-[#b45309] text-[#fef08a] border-[#fde047]'
                : 'bg-[#1c0f08] text-[#d6b78d] hover:bg-[#2d180d]'
            }`}
          >
            <PixelIcon name="warehouse" size={24} />
            <span className="font-medieval text-[11px] sm:text-xs font-bold leading-none mt-1">
              PACKHOUSE
            </span>
          </button>

          <button
            onClick={() => {
              SoundEngine.playParchment();
              setActiveTab('map');
            }}
            className={`pixel-btn flex flex-col items-center justify-center py-2 px-1 text-center transition-all ${
              activeTab === 'map'
                ? 'bg-[#b45309] text-[#fef08a] border-[#fde047]'
                : 'bg-[#1c0f08] text-[#d6b78d] hover:bg-[#2d180d]'
            }`}
          >
            <CompassRoseIcon size={24} />
            <span className="font-medieval text-[11px] sm:text-xs font-bold leading-none mt-1">
              HIGHWAYS
            </span>
          </button>

          <button
            onClick={() => {
              SoundEngine.playParchment();
              setActiveTab('merchants');
            }}
            className={`pixel-btn flex flex-col items-center justify-center py-2 px-1 text-center transition-all ${
              activeTab === 'merchants'
                ? 'bg-[#b45309] text-[#fef08a] border-[#fde047]'
                : 'bg-[#1c0f08] text-[#d6b78d] hover:bg-[#2d180d]'
            }`}
          >
            <PixelIcon name="merchants" size={24} />
            <span className="font-medieval text-[11px] sm:text-xs font-bold leading-none mt-1">
              GUILDSMEN
            </span>
          </button>

          <button
            onClick={() => {
              SoundEngine.playParchment();
              setActiveTab('events');
            }}
            className={`pixel-btn flex flex-col items-center justify-center py-2 px-1 text-center transition-all ${
              activeTab === 'events'
                ? 'bg-[#b45309] text-[#fef08a] border-[#fde047]'
                : 'bg-[#1c0f08] text-[#d6b78d] hover:bg-[#2d180d]'
            }`}
          >
            <PixelIcon name="events" size={24} />
            <span className="font-medieval text-[11px] sm:text-xs font-bold leading-none mt-1">
              HERALD
            </span>
          </button>
        </div>
      </nav>

      {/* 4. MODALS */}
      {/* Merchant Conversation Modal */}
      {selectedMerchant && (
        <MerchantDialogueModal
          merchant={selectedMerchant}
          currentTrust={player.merchantTrust[selectedMerchant.id] ?? selectedMerchant.trust}
          playerGold={player.gold}
          onClose={() => setSelectedMerchant(null)}
          onGiftTrust={handleGiftTrust}
          onOpenTradeWithSpecialty={(specs) => {
            setSpecialtyFilter(specs);
            setActiveTab('market');
          }}
        />
      )}

      {/* Onboarding Guide */}
      {showOnboarding && <OnboardingModal onClose={() => setShowOnboarding(false)} />}

      {/* Progression & Career Ladder Modal */}
      {showProgression && <ProgressionModal player={player} onClose={() => setShowProgression(false)} />}
    </div>
  );
}
