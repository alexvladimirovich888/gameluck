import {
  ActiveCaravan,
  GameLog,
  ItemCategory,
  LocationId,
  MarketItemData,
  MarketState,
  PlayerState,
  Season,
  TownEvent,
  Weather
} from '../types';
import { ITEMS, ITEMS_MAP } from '../data/items';
import { LOCATIONS } from '../data/locations';
import { EVENTS_POOL } from '../data/events';

// Generate initial market state
export function generateInitialMarket(): MarketState {
  const locationsData: Record<LocationId, Record<string, MarketItemData>> = {
    market_square: {},
    farm_village: {},
    harbor: {},
    castle_district: {},
    merchant_quarter: {}
  };

  (Object.keys(LOCATIONS) as LocationId[]).forEach((locId) => {
    const loc = LOCATIONS[locId];
    locationsData[locId] = {};

    ITEMS.forEach((item) => {
      const locMod = loc.itemModifiers[item.id] ?? loc.categoryModifiers[item.category] ?? 1.0;
      const initialPrice = Math.max(item.minPrice, Math.min(item.maxPrice, Math.round(item.basePrice * locMod)));

      locationsData[locId][item.id] = {
        currentPrice: initialPrice,
        supply: 40 + Math.floor(Math.random() * 30),
        demand: 40 + Math.floor(Math.random() * 30),
        history: [
          Math.max(item.minPrice, initialPrice - 2),
          Math.max(item.minPrice, initialPrice - 1),
          initialPrice
        ],
        lastChange: 'same',
        changePercent: 0
      };
    });
  });

  // Start with 1 initial flavorful event
  const initialEvent: TownEvent = {
    id: 'evt_initial',
    title: 'Spring Trade Fair',
    durationDays: 4,
    remainingDays: 4,
    description: 'Merchants have gathered in Marketburg from outlying provinces. Demand for grain, bread, and forged tools is surging.',
    flavor: 'The cobblestones teem with travelers, banners, and lively bartering!',
    type: 'festival',
    priceModifiers: {
      grain: 1.15,
      tools: 1.25,
      bread: 1.1
    }
  };

  return {
    locations: locationsData,
    activeEvents: [initialEvent]
  };
}

// Season modifiers
export function getSeasonModifier(category: ItemCategory, itemId: string, season: Season): number {
  if (season === 'spring') {
    if (itemId === 'tools' || itemId === 'grain') return 1.25;
    if (category === 'raw') return 1.1;
    return 1.0;
  }
  if (season === 'summer') {
    if (itemId === 'fish' || itemId === 'apples') return 1.18;
    if (category === 'luxury') return 1.1;
    return 1.0;
  }
  if (season === 'autumn') {
    if (itemId === 'grain' || itemId === 'apples' || itemId === 'flour') return 0.75; // abundant harvest
    if (itemId === 'wine') return 0.85;
    return 1.0;
  }
  if (season === 'winter') {
    if (itemId === 'wood' || itemId === 'wool' || itemId === 'meat') return 1.45; // heating & food scarce
    if (category === 'food') return 1.3;
    return 1.0;
  }
  return 1.0;
}

// Advance market by one day
export function advanceMarketDay(
  currentMarket: MarketState,
  player: PlayerState
): {
  newMarket: MarketState;
  newPlayer: PlayerState;
  dayLogs: GameLog[];
} {
  const nextDay = player.currentDay + 1;
  const dayLogs: GameLog[] = [];

  // Determine season (every 14 days is a new season)
  const seasonIndex = Math.floor((nextDay - 1) / 14) % 4;
  const seasons: Season[] = ['spring', 'summer', 'autumn', 'winter'];
  const newSeason = seasons[seasonIndex];

  // Random weather
  const weathers: Weather[] = ['clear', 'sunny', 'rainy', 'foggy', 'snowy'];
  let newWeather: Weather = 'clear';
  if (newSeason === 'winter') {
    newWeather = Math.random() < 0.4 ? 'snowy' : 'clear';
  } else if (newSeason === 'autumn') {
    newWeather = Math.random() < 0.45 ? 'rainy' : 'foggy';
  } else {
    newWeather = Math.random() < 0.35 ? 'sunny' : Math.random() < 0.25 ? 'rainy' : 'clear';
  }

  // Update active events: decrement days
  const updatedEvents: TownEvent[] = [];
  currentMarket.activeEvents.forEach((evt) => {
    const rem = evt.remainingDays - 1;
    if (rem > 0) {
      updatedEvents.push({ ...evt, remainingDays: rem });
    } else {
      dayLogs.push({
        id: `log_evt_end_${Math.random()}`,
        day: nextDay,
        type: 'event',
        text: `Event "${evt.title}" has concluded. Market prices are returning to equilibrium.`
      });
    }
  });

  // Roll for new event if less than 2 active (40% chance per day)
  if (updatedEvents.length < 2 && Math.random() < 0.4) {
    const template = EVENTS_POOL[Math.floor(Math.random() * EVENTS_POOL.length)];
    // check if already active
    if (!updatedEvents.some((e) => e.title === template.title)) {
      const newEvt: TownEvent = {
        ...template,
        id: `evt_${nextDay}_${Math.random()}`,
        remainingDays: template.durationDays
      };
      updatedEvents.push(newEvt);
      dayLogs.push({
        id: `log_evt_start_${Math.random()}`,
        day: nextDay,
        type: 'event',
        text: `The Town Herald proclaims: "${newEvt.title}"! ${newEvt.flavor}`
      });
    }
  }

  // Calculate new market prices for all locations & goods
  const newLocations: Record<LocationId, Record<string, MarketItemData>> = {
    market_square: {},
    farm_village: {},
    harbor: {},
    castle_district: {},
    merchant_quarter: {}
  };

  (Object.keys(LOCATIONS) as LocationId[]).forEach((locId) => {
    const loc = LOCATIONS[locId];
    newLocations[locId] = {};

    ITEMS.forEach((item) => {
      const oldData = currentMarket.locations[locId][item.id] || {
        currentPrice: item.basePrice,
        supply: 40,
        demand: 40,
        history: [item.basePrice],
        lastChange: 'same',
        changePercent: 0
      };

      // 1. Location modifier
      const locMod = loc.itemModifiers[item.id] ?? loc.categoryModifiers[item.category] ?? 1.0;

      // 2. Season modifier
      const seasonMod = getSeasonModifier(item.category, item.id, newSeason);

      // 3. Events modifier
      let eventMod = 1.0;
      updatedEvents.forEach((evt) => {
        if (evt.priceModifiers[item.id]) {
          eventMod *= evt.priceModifiers[item.id];
        }
      });

      // 4. Supply and demand organic drift (+/- 10%)
      const supplyDrift = (Math.random() - 0.5) * 8;
      const demandDrift = (Math.random() - 0.5) * 8;
      const newSupply = Math.max(10, Math.min(100, Math.round(oldData.supply + supplyDrift)));
      const newDemand = Math.max(10, Math.min(100, Math.round(oldData.demand + demandDrift)));

      // Economic equilibrium price formula
      const elasticityFactor = (newDemand - newSupply) / (newSupply + 30) * 0.35;
      const noise = 0.94 + Math.random() * 0.12; // 6% random volatility

      const rawPrice = item.basePrice * locMod * seasonMod * eventMod * (1 + elasticityFactor) * noise;
      const newPrice = Math.max(item.minPrice, Math.min(item.maxPrice, Math.round(rawPrice)));

      // History update
      const newHistory = [...oldData.history.slice(-8), newPrice];
      const delta = newPrice - oldData.currentPrice;
      const changePct = oldData.currentPrice > 0 ? (delta / oldData.currentPrice) * 100 : 0;

      newLocations[locId][item.id] = {
        currentPrice: newPrice,
        supply: newSupply,
        demand: newDemand,
        history: newHistory,
        lastChange: delta > 0 ? 'up' : delta < 0 ? 'down' : 'same',
        changePercent: changePct
      };
    });
  });

  // Resolve Caravans arriving today
  let updatedGold = player.gold;
  let updatedTotalProfit = player.stats.totalProfit;
  let updatedHighestProfit = player.stats.highestSingleProfit;
  let updatedCaravansCompleted = player.stats.caravansCompleted;
  const remainingCaravans: ActiveCaravan[] = [];

  player.activeCaravans.forEach((caravan) => {
    if (nextDay >= caravan.arrivalDay) {
      // Roll for bandit raid
      const roll = Math.random() * 100;
      const toLoc = LOCATIONS[caravan.toLocation];

      if (roll < caravan.riskPercent) {
        // Caravan intercepted by bandits!
        dayLogs.push({
          id: `log_caravan_raided_${Math.random()}`,
          day: nextDay,
          type: 'caravan',
          text: `Alarm! The caravan en route to ${toLoc.name} was ambushed by highway brigands! Some cargo was plundered.`
        });
        // Player recovers 30% salvaged goods
        const salvageValue = Math.round(caravan.totalInvested * 0.3);
        updatedGold += salvageValue;
      } else {
        // Caravan arrived successfully with high profit!
        const profit = Math.max(1, caravan.totalInvested);
        updatedGold += profit;
        updatedTotalProfit += profit;
        updatedCaravansCompleted += 1;
        if (profit > updatedHighestProfit) {
          updatedHighestProfit = profit;
        }

        dayLogs.push({
          id: `log_caravan_success_${Math.random()}`,
          day: nextDay,
          type: 'caravan',
          goldChange: profit,
          text: `Merchant caravan arrived safely in ${toLoc.name}! Total proceeds amounted to +${profit} gold.`
        });
      }
    } else {
      remainingCaravans.push(caravan);
    }
  });

  const newPlayer: PlayerState = {
    ...player,
    currentDay: nextDay,
    season: newSeason,
    weather: newWeather,
    gold: updatedGold,
    activeCaravans: remainingCaravans,
    stats: {
      ...player.stats,
      totalProfit: updatedTotalProfit,
      highestSingleProfit: updatedHighestProfit,
      caravansCompleted: updatedCaravansCompleted
    },
    logs: [...dayLogs, ...player.logs].slice(0, 60)
  };

  return {
    newMarket: {
      locations: newLocations,
      activeEvents: updatedEvents
    },
    newPlayer,
    dayLogs
  };
}
