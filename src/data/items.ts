import { Item } from '../types';

export const ITEMS: Item[] = [
  // 1. FOOD & AGRICULTURE
  {
    id: 'grain',
    name: 'Golden Grain',
    nameEn: 'Golden Grain',
    iconKey: 'grain',
    category: 'food',
    weight: 1,
    basePrice: 10,
    minPrice: 5,
    maxPrice: 28,
    rarity: 'common',
    description: 'The foundation of medieval life. Heavy sacks of golden wheat and rye needed to feed the populace.'
  },
  {
    id: 'flour',
    name: 'Milled Flour',
    nameEn: 'Milled Flour',
    iconKey: 'flour',
    category: 'food',
    weight: 1,
    basePrice: 16,
    minPrice: 9,
    maxPrice: 40,
    rarity: 'common',
    description: 'Fine flour ground at the river mill. Bakers buy it by the wagonload for city ovens.'
  },
  {
    id: 'bread',
    name: 'Crusty Bread',
    nameEn: 'Crusty Bread',
    iconKey: 'bread',
    category: 'food',
    weight: 1,
    basePrice: 22,
    minPrice: 12,
    maxPrice: 52,
    rarity: 'common',
    description: 'Warm, oven-baked rustic loaves with a golden crust. During harsh winters, it is valued above silver.'
  },
  {
    id: 'meat',
    name: 'Smoked Meat',
    nameEn: 'Smoked Meat',
    iconKey: 'meat',
    category: 'food',
    weight: 2,
    basePrice: 38,
    minPrice: 20,
    maxPrice: 85,
    rarity: 'uncommon',
    description: 'Cured hams and smoked sausages preserved in salt. Indispensable for garrisons and distant caravans.'
  },
  {
    id: 'fish',
    name: 'Salted Fish',
    nameEn: 'Salted Fish',
    iconKey: 'fish',
    category: 'food',
    weight: 1,
    basePrice: 24,
    minPrice: 11,
    maxPrice: 58,
    rarity: 'common',
    description: 'Herring and cod packed tightly in oak barrels from the port bay. High demand during fasts.'
  },
  {
    id: 'apples',
    name: 'Orchard Apples',
    nameEn: 'Orchard Apples',
    iconKey: 'apples',
    category: 'food',
    weight: 1,
    basePrice: 14,
    minPrice: 7,
    maxPrice: 36,
    rarity: 'common',
    description: 'Sweet, crisp red apples picked from village and monastery orchards. Abundant in harvest autumn.'
  },
  {
    id: 'salt',
    name: 'Rock Salt',
    nameEn: 'Rock Salt',
    iconKey: 'salt',
    category: 'food',
    weight: 1,
    basePrice: 32,
    minPrice: 18,
    maxPrice: 75,
    rarity: 'uncommon',
    description: 'The white gold of the realm. Essential for preserving meats and cheeses through the long winter.'
  },
  {
    id: 'wine',
    name: 'Vintage Wine',
    nameEn: 'Vintage Wine',
    iconKey: 'wine',
    category: 'luxury',
    weight: 2,
    basePrice: 65,
    minPrice: 35,
    maxPrice: 150,
    rarity: 'rare',
    description: 'Aged ruby red wine from hillside monastery cellars. The preferred beverage of nobility and clergy.'
  },
  {
    id: 'beer',
    name: 'Dark Ale',
    nameEn: 'Dark Ale',
    iconKey: 'beer',
    category: 'food',
    weight: 2,
    basePrice: 28,
    minPrice: 15,
    maxPrice: 62,
    rarity: 'common',
    description: 'Rich, hoppy malt brew poured by the flagon in local taverns. Consumed in vast quantities year-round.'
  },

  // 2. RAW MATERIALS
  {
    id: 'wool',
    name: 'Raw Wool',
    nameEn: 'Raw Wool',
    iconKey: 'wool',
    category: 'raw',
    weight: 2,
    basePrice: 35,
    minPrice: 18,
    maxPrice: 80,
    rarity: 'common',
    description: 'Bales of clean, unspun fleece from foothill pastures. Demand spikes sharply with winter frost.'
  },
  {
    id: 'leather',
    name: 'Tanned Leather',
    nameEn: 'Tanned Leather',
    iconKey: 'leather',
    category: 'raw',
    weight: 2,
    basePrice: 46,
    minPrice: 26,
    maxPrice: 98,
    rarity: 'uncommon',
    description: 'Sturdy cured hides prepared for cobblers, saddle-makers, and armorers.'
  },
  {
    id: 'wood',
    name: 'Timber Wood',
    nameEn: 'Timber Wood',
    iconKey: 'wood',
    category: 'raw',
    weight: 3,
    basePrice: 25,
    minPrice: 12,
    maxPrice: 60,
    rarity: 'common',
    description: 'Hewn oak and pine logs required for building townhouses, fortified gates, and merchant cogs.'
  },
  {
    id: 'stone',
    name: 'Quarry Stone',
    nameEn: 'Quarry Stone',
    iconKey: 'stone',
    category: 'raw',
    weight: 4,
    basePrice: 30,
    minPrice: 14,
    maxPrice: 70,
    rarity: 'common',
    description: 'Heavy granite blocks chiseled from bedrock. Vital for repairing castle bastions and city walls.'
  },
  {
    id: 'iron',
    name: 'Iron Ingots',
    nameEn: 'Iron Ingots',
    iconKey: 'iron',
    category: 'raw',
    weight: 3,
    basePrice: 55,
    minPrice: 28,
    maxPrice: 130,
    rarity: 'uncommon',
    description: 'Solid smelted bars of malleable iron straight from the forge furnace. Backbone of all smithing.'
  },

  // 3. CRAFTED GOODS
  {
    id: 'cloth',
    name: 'Linen Cloth',
    nameEn: 'Linen Cloth',
    iconKey: 'cloth',
    category: 'crafted',
    weight: 1,
    basePrice: 42,
    minPrice: 22,
    maxPrice: 92,
    rarity: 'common',
    description: 'Finely woven bleached cloth crafted on town looms. Used for garments, ship sails, and market awnings.'
  },
  {
    id: 'tools',
    name: 'Forged Tools',
    nameEn: 'Forged Tools',
    iconKey: 'tools',
    category: 'crafted',
    weight: 2,
    basePrice: 70,
    minPrice: 38,
    maxPrice: 155,
    rarity: 'uncommon',
    description: 'Tempered steel hammers, tongs, axes, and scythes. Farmers and builders are constantly in need.'
  },
  {
    id: 'swords',
    name: 'Steel Swords',
    nameEn: 'Steel Swords',
    iconKey: 'swords',
    category: 'crafted',
    weight: 2,
    basePrice: 120,
    minPrice: 65,
    maxPrice: 290,
    rarity: 'rare',
    description: 'Double-edged garrison arming swords. When war drums beat, their value triples overnight.'
  },

  // 4. LUXURIES & SPECIAL
  {
    id: 'herbs',
    name: 'Medicinal Herbs',
    nameEn: 'Medicinal Herbs',
    iconKey: 'herbs',
    category: 'crafted',
    weight: 1,
    basePrice: 50,
    minPrice: 25,
    maxPrice: 125,
    rarity: 'uncommon',
    description: 'Dried sage, thyme, and mandrake roots. Apothecaries and healers brew precious remedies from them.'
  },
  {
    id: 'spices',
    name: 'Exotic Spices',
    nameEn: 'Exotic Spices',
    iconKey: 'spices',
    category: 'luxury',
    weight: 1,
    basePrice: 160,
    minPrice: 80,
    maxPrice: 390,
    rarity: 'exotic',
    description: 'Pouches of cinnamon, saffron, and cloves brought from southern seas. Worth their weight in gold.'
  },
  {
    id: 'silk',
    name: 'Imperial Silk',
    nameEn: 'Imperial Silk',
    iconKey: 'silk',
    category: 'luxury',
    weight: 1,
    basePrice: 210,
    minPrice: 110,
    maxPrice: 480,
    rarity: 'exotic',
    description: 'Weightless shimmering fabric in royal dyes. Wearing real silk is a privilege reserved for high court.'
  },
  {
    id: 'jewelry',
    name: 'Jeweled Rings',
    nameEn: 'Jeweled Rings',
    iconKey: 'jewelry',
    category: 'luxury',
    weight: 1,
    basePrice: 340,
    minPrice: 180,
    maxPrice: 850,
    rarity: 'exotic',
    description: 'Gold filigree rings set with brilliant emeralds and rubies. The hallmark of true wealth and prestige.'
  },
  {
    id: 'horses',
    name: 'Pack Horses',
    nameEn: 'Pack Horses',
    iconKey: 'horses',
    category: 'livestock',
    weight: 5,
    basePrice: 260,
    minPrice: 140,
    maxPrice: 580,
    rarity: 'rare',
    description: 'Hardy bay draft steeds. Dramatically expands caravan capacity and travel security.'
  }
];

export const ITEMS_MAP = ITEMS.reduce((acc, item) => {
  acc[item.id] = item;
  return acc;
}, {} as Record<string, Item>);
