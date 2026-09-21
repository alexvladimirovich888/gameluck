import { PlayerRank } from '../types';

export const PLAYER_RANKS: PlayerRank[] = [
  {
    title: 'Humble Peddler',
    requiredNetWorth: 0,
    perks: [
      'Modest start-up capital and a wooden handcart',
      'Trading access to Market Square and Oakhaven Hamlet',
      'Cart capacity: 25 weight units'
    ],
    maxCartCapacity: 25
  },
  {
    title: 'Traveling Hawker',
    requiredNetWorth: 400,
    perks: [
      'Trade access granted to Port Salt-Reach',
      'Merchant trust grows 15% faster',
      'Cart capacity: 45 weight units'
    ],
    maxCartCapacity: 45
  },
  {
    title: 'Guild Merchant',
    requiredNetWorth: 1500,
    perks: [
      'Full access to Castle Hill and the Gold Quarter',
      'Charter rights to dispatch regional trading caravans',
      '5% wholesale discount from local merchants',
      'Wagon capacity: 80 weight units'
    ],
    maxCartCapacity: 80
  },
  {
    title: 'Master of the Guild',
    requiredNetWorth: 5000,
    perks: [
      '10% prestige discount from all suppliers',
      'Ability to hire veteran armed guards for caravan routes',
      'Early rumor intel 1 day before market events break',
      'Caravan capacity: 140 weight units'
    ],
    maxCartCapacity: 140
  },
  {
    title: 'Grand Merchant Magnate',
    requiredNetWorth: 15000,
    perks: [
      'Privileged private trading fleet and grand caravan yard',
      '15% sovereign wholesale discount everywhere',
      'Highest protection against highway brigands',
      'Caravan capacity: 250 weight units'
    ],
    maxCartCapacity: 250
  }
];

export const WAREHOUSE_UPGRADES = [
  { level: 1, capacity: 50, cost: 0, name: 'Timber Shed' },
  { level: 2, capacity: 100, cost: 250, name: 'Log Granary' },
  { level: 3, capacity: 200, cost: 750, name: 'Stone Cellar Warehouse' },
  { level: 4, capacity: 450, cost: 2000, name: 'Fortified Guild Packhouse' },
  { level: 5, capacity: 1000, cost: 6000, name: 'Royal Customs Compound' }
];

export const CART_UPGRADES = [
  { level: 1, capacityBonus: 0, cost: 0, name: 'Two-Wheeled Pushcart' },
  { level: 2, capacityBonus: 20, cost: 200, name: 'Donkey-Drawn Cart' },
  { level: 3, capacityBonus: 50, cost: 650, name: 'Covered Dray with Draft Horses' },
  { level: 4, capacityBonus: 100, cost: 1800, name: 'Armored Merchant Wagon' }
];
