import { TownEvent } from '../types';

export const EVENTS_POOL: Omit<TownEvent, 'id' | 'remainingDays'>[] = [
  {
    title: 'Bountiful Harvest',
    durationDays: 4,
    description: 'Barns groan under heavy sacks of wheat and rye. Watermills turn day and night without pause.',
    flavor: 'Farmers flood the square with loaded carts. Grain, flour, and bread prices plunged by up to 45%!',
    type: 'harvest',
    priceModifiers: {
      grain: 0.55,
      flour: 0.65,
      bread: 0.75,
      apples: 0.6
    }
  },
  {
    title: 'The Great Drought',
    durationDays: 5,
    description: 'A merciless sun scorches the furrows. Wells run shallow and crops wither on the stalk.',
    flavor: 'Bread supplies dwindle across the province. Grain has surged by 85%, with beer and flour in grave shortage!',
    type: 'disaster',
    priceModifiers: {
      grain: 1.85,
      flour: 1.7,
      bread: 1.6,
      beer: 1.45
    }
  },
  {
    title: 'Arrival of Eastern Caravan',
    durationDays: 3,
    description: 'A grand caravan of seventy pack beasts and heavily laden wagons enters the lower gates.',
    flavor: 'The bazaar is brimming with eastern spices and gleaming silk. Luxury goods prices dropped by 35%!',
    type: 'caravan',
    isCaravan: true,
    priceModifiers: {
      spices: 0.65,
      silk: 0.7,
      jewelry: 0.8
    }
  },
  {
    title: 'Royal Wedding Feast',
    durationDays: 4,
    description: 'The Crown Prince weds a foreign duchess. The fortress ballrooms ring with revelry and music!',
    flavor: 'Demand for vintage wine, jeweled rings, silk, and cured meat reaches fever pitch! Prices have nearly doubled.',
    type: 'festival',
    priceModifiers: {
      wine: 1.9,
      meat: 1.6,
      jewelry: 1.8,
      silk: 1.7,
      bread: 1.3
    }
  },
  {
    title: 'Border Skirmish',
    durationDays: 6,
    description: 'A rival baron breached the peace treaty. Emergency levies are mustered and the city garrison is mobilized.',
    flavor: 'Blacksmiths pound anvils night and day. Steel swords, smelted iron, warhorses, and leather spiked by 75-100%!',
    type: 'war',
    priceModifiers: {
      swords: 2.1,
      iron: 1.75,
      leather: 1.6,
      horses: 1.8,
      meat: 1.4
    }
  },
  {
    title: 'Highway Bandit Ambush',
    durationDays: 4,
    description: 'The ruthless Black Wolf brigade ambushed trade wagons along the mountain gorge.',
    flavor: 'Caravans of timber and building stone are stranded. Stone, wood, and forged tools prices jumped.',
    type: 'disaster',
    priceModifiers: {
      wood: 1.6,
      stone: 1.5,
      tools: 1.4,
      leather: 1.35
    }
  },
  {
    title: 'Abundant Bay Catch',
    durationDays: 3,
    description: 'Vast shoals of herring and silver cod fill coastal shallows. Fishing nets groan with bounty!',
    flavor: 'The harbor docks overflow with fresh seafood. Fish plummeted by 50%, while preserving salt surged!',
    type: 'harvest',
    priceModifiers: {
      fish: 0.48,
      salt: 1.6
    }
  },
  {
    title: 'Abbey Grape Festival',
    durationDays: 3,
    description: 'The monks opened ancient cellars for the feast day of Saint Martin.',
    flavor: 'Vintage wine and dark ale flow like mountain brooks! Wine dipped by 35%, while smoked meat and bread rose.',
    type: 'festival',
    priceModifiers: {
      wine: 0.65,
      beer: 0.75,
      meat: 1.3,
      bread: 1.2
    }
  },
  {
    title: 'Threat of Swamp Ague',
    durationDays: 4,
    description: 'Grave news of fever along the low river border. Citizens frantically stockpile drying herbs and remedies.',
    flavor: 'Demand for medicinal herbs and salt more than doubled! Apothecaries report brisk fortunes.',
    type: 'disaster',
    priceModifiers: {
      herbs: 2.3,
      salt: 1.7,
      apples: 1.35
    }
  },
  {
    title: 'Mine Tunnel Cave-in',
    durationDays: 4,
    description: 'A shaft collapse in the iron hills halted smelting operations for days.',
    flavor: 'Smelted iron stockpiles are frozen. Iron ingots and blacksmith tools escalated by 65%!',
    type: 'disaster',
    priceModifiers: {
      iron: 1.7,
      tools: 1.5,
      swords: 1.45
    }
  },
  {
    title: 'Fierce Blizzard',
    durationDays: 4,
    description: 'Bitter frost locks the town in ice. Huge drifts cut off outlying hamlets and mountain trails.',
    flavor: 'Fireplaces roar and townsfolk bundle in thick cloaks. Timber wood, raw wool, and hot rations soared by 60%!',
    type: 'disaster',
    priceModifiers: {
      wood: 1.8,
      wool: 1.75,
      bread: 1.4,
      meat: 1.35
    }
  },
  {
    title: 'Crown Tax Tithe',
    durationDays: 3,
    description: 'The High Tax Collector arrives with armed halberdiers to levy royal tolls.',
    flavor: 'Pockets are lighter throughout the wards. Luxury goods and imported wine dropped by 25%.',
    type: 'tax',
    priceModifiers: {
      jewelry: 0.75,
      wine: 0.8,
      silk: 0.8,
      spices: 0.85
    }
  },
  {
    title: 'Grand Jousting Tournament',
    durationDays: 4,
    description: 'Hundreds of valiant knights, squires, and retinues arrive to contend for chivalric glory.',
    flavor: 'Armorers and ostlers rejoice: swords, horses, leather gear, and ale are sold with grand markups!',
    type: 'festival',
    priceModifiers: {
      swords: 1.85,
      horses: 1.7,
      leather: 1.5,
      beer: 1.55,
      meat: 1.4
    }
  },
  {
    title: 'Town Mill Fire',
    durationDays: 3,
    description: 'A stray ember ignited the sails of the high mill by the river.',
    flavor: 'Milling halted until timber repairs finish. Flour jumped by 75%, and baked bread by 50%!',
    type: 'disaster',
    priceModifiers: {
      flour: 1.75,
      bread: 1.5,
      grain: 0.85
    }
  },
  {
    title: 'Galleon from Overseas',
    durationDays: 3,
    description: 'A towering galleon dropped anchor laden with silken crates and aromatic barrels from southern caliphates.',
    flavor: 'The wharves buzz with trade: silk and spices fill warehouses. Their prices have tumbled sharply!',
    type: 'caravan',
    isCaravan: true,
    priceModifiers: {
      spices: 0.58,
      silk: 0.62,
      salt: 0.7
    }
  },
  {
    title: 'Saltpan Workers Strike',
    durationDays: 3,
    description: 'Laborers at the coastal saltpans put down picks and rakes over docked wages.',
    flavor: 'Salt deliveries ceased immediately. Rock salt prices skyrocketed past double normal rates!',
    type: 'disaster',
    priceModifiers: {
      salt: 2.2,
      fish: 0.8,
      meat: 0.85
    }
  },
  {
    title: 'Fortress Barbican Expansion',
    durationDays: 5,
    description: 'The Lord of Marketburg commissioned a formidable new gate tower and reinforced stone ramparts.',
    flavor: 'Masons and carpenters purchase all dressed stone, timber, and forged tools at premium wages!',
    type: 'harvest',
    priceModifiers: {
      stone: 1.9,
      wood: 1.65,
      tools: 1.55,
      iron: 1.4
    }
  },
  {
    title: 'Murrain on the Pastures',
    durationDays: 4,
    description: 'A foul murrain struck sheep and cattle herds in the lower river pastures.',
    flavor: 'Raw wool, tanned leather, and smoked meat are in acute deficit. Prices surged by 70%!',
    type: 'disaster',
    priceModifiers: {
      meat: 1.8,
      wool: 1.7,
      leather: 1.75
    }
  },
  {
    title: 'Festival of Saint Arnulf',
    durationDays: 3,
    description: 'The annual civic holiday honoring the patron saint of brewers and innkeepers.',
    flavor: 'Tavern barrels are rolled straight into the cobbled lanes! High thirst drives ale and meat demand skyward.',
    type: 'festival',
    priceModifiers: {
      beer: 1.85,
      bread: 1.35,
      meat: 1.45
    }
  },
  {
    title: 'Discovery of Silver Lode',
    durationDays: 4,
    description: 'Prospectors struck a glittering vein of native silver along the foothill crags.',
    flavor: 'Goldsmiths flooded the market with fresh ornaments. Jewelry prices dipped by 30%!',
    type: 'harvest',
    priceModifiers: {
      jewelry: 0.7,
      iron: 1.25,
      tools: 1.35
    }
  }
];
