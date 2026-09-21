export type ItemCategory = 'food' | 'raw' | 'crafted' | 'luxury' | 'livestock';

export type Rarity = 'common' | 'uncommon' | 'rare' | 'exotic';

export interface Item {
  id: string;
  name: string;
  nameEn: string;
  iconKey: string;
  category: ItemCategory;
  weight: number; // slots taken per unit
  basePrice: number;
  minPrice: number;
  maxPrice: number;
  rarity: Rarity;
  description: string;
}

export type LocationId = 'market_square' | 'farm_village' | 'harbor' | 'castle_district' | 'merchant_quarter';

export interface LocationInfo {
  id: LocationId;
  name: string;
  title: string;
  description: string;
  travelDays: number;
  travelCost: number;
  dangerLevel: number; // 0 to 100%
  color: string;
  // Multipliers for base price at this location (e.g., grain is 0.6x at farm, 1.6x at harbor)
  categoryModifiers: Partial<Record<ItemCategory, number>>;
  itemModifiers: Partial<Record<string, number>>;
  specialtyText: string;
}

export interface Merchant {
  id: string;
  name: string;
  profession: string;
  portraitKey: string;
  locationId: LocationId;
  trust: number; // 0 - 100
  mood: 'cheerful' | 'shrewd' | 'grumpy' | 'eager';
  quote: string;
  rumor: string;
  specialtyItems: string[];
}

export interface TownEvent {
  id: string;
  title: string;
  durationDays: number;
  remainingDays: number;
  description: string;
  flavor: string;
  type: 'harvest' | 'war' | 'caravan' | 'disaster' | 'festival' | 'tax';
  priceModifiers: Record<string, number>; // item_id -> multiplier e.g. 1.7 (+70%)
  supplyModifiers?: Record<string, number>;
  demandModifiers?: Record<string, number>;
  isCaravan?: boolean;
}

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export type Weather = 'clear' | 'sunny' | 'rainy' | 'foggy' | 'snowy' | 'stormy';

export interface MarketItemData {
  currentPrice: number;
  supply: number;
  demand: number;
  history: number[]; // last 10 days
  lastChange: 'up' | 'down' | 'same';
  changePercent: number;
}

export interface ActiveCaravan {
  id: string;
  fromLocation: LocationId;
  toLocation: LocationId;
  departureDay: number;
  arrivalDay: number;
  items: Record<string, number>;
  totalInvested: number;
  guards: number;
  riskPercent: number;
}

export interface GameLog {
  id: string;
  day: number;
  type: 'trade' | 'event' | 'caravan' | 'rank' | 'travel';
  text: string;
  goldChange?: number;
}

export interface PlayerRank {
  title: string;
  requiredNetWorth: number;
  perks: string[];
  maxCartCapacity: number;
}

export interface PlayerState {
  name: string;
  gold: number;
  reputation: number; // 0 - 100
  currentDay: number;
  season: Season;
  weather: Weather;
  currentLocationId: LocationId;
  inventory: Record<string, { amount: number; avgBuyPrice: number }>;
  warehouseCapacity: number;
  warehouseLevel: number;
  cartLevel: number;
  guardsCount: number;
  activeCaravans: ActiveCaravan[];
  merchantTrust: Record<string, number>;
  stats: {
    totalTrades: number;
    totalProfit: number;
    highestSingleProfit: number;
    caravansCompleted: number;
  };
  unlockedLocations: LocationId[];
  logs: GameLog[];
}

export interface MarketState {
  // locationId -> itemId -> MarketItemData
  locations: Record<LocationId, Record<string, MarketItemData>>;
  activeEvents: TownEvent[];
}
