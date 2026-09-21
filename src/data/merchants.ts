import { Merchant } from '../types';

export const MERCHANTS: Merchant[] = [
  {
    id: 'farmer_tomas',
    name: 'Old Tomas',
    profession: 'Veteran Plowman',
    portraitKey: 'tomas',
    locationId: 'farm_village',
    trust: 50,
    mood: 'cheerful',
    quote: 'The soil feeds those who rise before the cockerel crows! Taste my orchard apples, peddler.',
    rumor: 'I heard from the miller: if rains pour for another three days, the city grain price will soar to the heavens.',
    specialtyItems: ['grain', 'flour', 'apples', 'wool']
  },
  {
    id: 'blacksmith_gunther',
    name: 'Master Gunther',
    profession: 'Guildmaster of the Hammer',
    portraitKey: 'gunther',
    locationId: 'market_square',
    trust: 40,
    mood: 'grumpy',
    quote: 'Iron has no patience for clumsy hands. Bring me smelted ingots, not idle tavern chatter!',
    rumor: 'The Duke whispers of a muster to the northern march. Once militia gathers, steel swords will be worth their weight in coin.',
    specialtyItems: ['iron', 'tools', 'swords']
  },
  {
    id: 'baker_hilda',
    name: 'Kind Hilda',
    profession: 'Head Baker of Marketburg',
    portraitKey: 'hilda',
    locationId: 'market_square',
    trust: 60,
    mood: 'cheerful',
    quote: 'Warm bread fresh from brick ovens! You can smell the crust all the way to the town portcullis.',
    rumor: 'My flour sacks are running low. Bring me thirty bushels of milled grain and I shall pay handsomely!',
    specialtyItems: ['grain', 'flour', 'bread']
  },
  {
    id: 'fishmonger_barnaby',
    name: 'Barnaby Sea-Dog',
    profession: 'Seasoned Skipper & Fisher',
    portraitKey: 'barnaby',
    locationId: 'harbor',
    trust: 45,
    mood: 'shrewd',
    quote: 'The deep sea giveth and taketh away. Today my barrels bristle with silver cod and herring!',
    rumor: 'A three-masted sloop anchored last twilight from southern straits. The captain hid silk and rare spices beneath his deck.',
    specialtyItems: ['fish', 'salt', 'wood']
  },
  {
    id: 'herbalist_althea',
    name: 'Mother Althea',
    profession: 'Apothecary & Herbalist',
    portraitKey: 'althea',
    locationId: 'market_square',
    trust: 55,
    mood: 'eager',
    quote: 'Every wild blade has healing grace. One must merely know in which moon phase to pluck it.',
    rumor: 'There is talk of a swamp ague spreading along the outer river watchtowers. Restorative herbs will soon be in frantic demand.',
    specialtyItems: ['herbs', 'apples']
  },
  {
    id: 'spice_rashid',
    name: 'Rashid Al-Mansur',
    profession: 'Overseas Merchant Prince',
    portraitKey: 'rashid',
    locationId: 'harbor',
    trust: 30,
    mood: 'shrewd',
    quote: 'The world is wide, my friend. Spread upon my carpets are treasures the northern court has never beheld.',
    rumor: 'The eastern caravan was delayed in the rocky passes by grit storms. Spices in the market are scarce—keep a keen eye on your prices.',
    specialtyItems: ['spices', 'silk']
  },
  {
    id: 'clothier_vivienne',
    name: 'Madame Vivienne',
    profession: 'Court Modiste & Weaver',
    portraitKey: 'vivienne',
    locationId: 'castle_district',
    trust: 40,
    mood: 'shrewd',
    quote: 'Noble ladies demand radiance. The weave must feel softer than swansdown beneath the fingertips.',
    rumor: 'The palace prepares an extravagant coronation gala. Fine linen and dyed silk will fetch gold without bargaining.',
    specialtyItems: ['cloth', 'wool', 'silk', 'leather']
  },
  {
    id: 'monk_cedric',
    name: 'Brother Cedric',
    profession: 'Cellarer of St. Jude Abbey',
    portraitKey: 'cedric',
    locationId: 'castle_district',
    trust: 50,
    mood: 'cheerful',
    quote: 'Our vineyard vintage maketh glad the heart of man, and righteous prayer cleanseth the mortal soul.',
    rumor: 'The monastery grape harvest surpassed all tithes this autumn. The cellar casks are full to overflowing with finest vintage!',
    specialtyItems: ['wine', 'beer', 'bread']
  },
  {
    id: 'jeweler_giles',
    name: 'Giles the Goldsmith',
    profession: 'Master of the Jewelers Guild',
    portraitKey: 'giles',
    locationId: 'merchant_quarter',
    trust: 35,
    mood: 'shrewd',
    quote: 'Pure gold never tarnishes before mortal envy. Every gem in my velvet case was faceted by my own chisel.',
    rumor: 'The royal castellan is quietly hoarding uncut gems and rings before the Crown Inquisitor arrives.',
    specialtyItems: ['jewelry', 'iron']
  },
  {
    id: 'caravaneer_roderick',
    name: 'Captain Roderick',
    profession: 'Master of Caravans',
    portraitKey: 'roderick',
    locationId: 'merchant_quarter',
    trust: 50,
    mood: 'eager',
    quote: 'The highway crawls with cutthroats, but my mercenaries know how to guard a cargo wagon. Chart your trail wisely!',
    rumor: 'Bandits have fortified the northern ridge trail. Never dispatch an unescorted wagon without veteran spearmen.',
    specialtyItems: ['horses', 'leather', 'wood']
  }
];
