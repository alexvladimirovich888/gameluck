import { MarketState, PlayerState } from '../types';
import { generateInitialMarket } from './economy';

const SAVE_KEY = 'marketburg_save_v2';

export function createInitialPlayer(): PlayerState {
  return {
    name: 'Alex the Merchant',
    gold: 150,
    reputation: 25,
    currentDay: 1,
    season: 'spring',
    weather: 'clear',
    currentLocationId: 'market_square',
    inventory: {
      grain: { amount: 10, avgBuyPrice: 10 },
      bread: { amount: 5, avgBuyPrice: 18 }
    },
    warehouseCapacity: 50,
    warehouseLevel: 1,
    cartLevel: 1,
    guardsCount: 1,
    activeCaravans: [],
    merchantTrust: {
      farmer_tomas: 50,
      baker_hilda: 60,
      blacksmith_gunther: 40,
      fishmonger_barnaby: 45,
      herbalist_althea: 55,
      spice_rashid: 30,
      clothier_vivienne: 40,
      monk_cedric: 50,
      jeweler_giles: 35,
      caravaneer_roderick: 50
    },
    stats: {
      totalTrades: 0,
      totalProfit: 0,
      highestSingleProfit: 0,
      caravansCompleted: 0
    },
    unlockedLocations: ['market_square', 'farm_village', 'harbor'],
    logs: [
      {
        id: 'start_1',
        day: 1,
        type: 'event',
        text: 'You arrived in Marketburg with a purse of coins and a sturdy handcart. Begin by bartering for staple grain or fresh bread!'
      }
    ]
  };
}

export function saveGame(player: PlayerState, market: MarketState) {
  try {
    const data = {
      player,
      market,
      savedAt: Date.now()
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save game to localStorage', e);
  }
}

export function loadGame(): { player: PlayerState; market: MarketState } | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.player && parsed.market) {
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load game from localStorage', e);
  }
  return null;
}

export function clearGameSave() {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch (e) {
    console.error('Failed to clear save', e);
  }
}
