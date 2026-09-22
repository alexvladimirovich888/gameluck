// Central Asset Registry for Medieval Market (Marketburg)
// All assets follow the /assets/... public folder structure
// Sliced from high-detail 16-bit AI-generated pixel art sheets

export const ENVIRONMENT_ASSETS = {
  marketSquare: '/assets/environment/market_square.jpg',
  harbor: '/assets/environment/harbor.jpg',
  caravanTravel: '/assets/environment/caravan_travel.jpg'
};

export const UI_ASSETS = {
  woodPanel: '/assets/ui/wood_panel.png',
  parchmentScroll: '/assets/ui/parchment_scroll.png',
  parchmentScrollPanel: '/assets/ui/parchment_scroll_panel.png',
  inventorySlot: '/assets/ui/inventory_slot.png',
  inventorySlotActive: '/assets/ui/inventory_slot_active.png',
  buttonWood: '/assets/ui/button_wood.png',
  buttonWoodPressed: '/assets/ui/button_wood_pressed.png',
  buttonBuy: '/assets/ui/button_buy.png',
  buttonSell: '/assets/ui/button_sell.png',
  hudHeaderFrame: '/assets/ui/hud_header_frame.png',
  hudBannerBg: '/assets/ui/hud_banner_bg.jpg',
  royalBanner: '/assets/ui/royal_header_banner.png',
  waxSeal: '/assets/ui/wax_seal.png',
  goldPouch: '/assets/ui/gold_pouch.png',
  compassRose: '/assets/ui/compass_rose.png',
  coin: '/assets/items/coin.png',
  sheet: '/assets/ui/medieval_ui_sheet.jpg',
  gameLogo: 'https://i.postimg.cc/W1rGTZxt/867ad2e7-8acf-4c6a-b004-ee84fd13ff16.png'
};

export const ICON_ASSETS = {
  market: '/assets/icons/market.svg',
  warehouse: '/assets/icons/warehouse.svg',
  map: '/assets/icons/map.svg',
  merchants: '/assets/icons/merchants.svg',
  events: '/assets/icons/events.svg'
};

export const CHARACTER_ASSETS: Record<string, string> = {
  tomas: '/assets/characters/tomas.png',
  gunther: '/assets/characters/gunther.png',
  hilda: '/assets/characters/hilda.png',
  barnaby: '/assets/characters/barnaby.png',
  althea: '/assets/characters/althea.png',
  rashid: '/assets/characters/rashid.png',
  vivienne: '/assets/characters/vivienne.png',
  cedric: '/assets/characters/cedric.png',
  giles: '/assets/characters/giles.png',
  roderick: '/assets/characters/roderick.png'
};

export const STALL_ASSETS: Record<string, string> = {
  tomas: '/assets/stalls/stall_tomas.png',
  farmer_tomas: '/assets/stalls/stall_tomas.png',
  stall_tomas: '/assets/stalls/stall_tomas.png',
  hilda: '/assets/stalls/stall_hilda.png',
  baker_hilda: '/assets/stalls/stall_hilda.png',
  stall_hilda: '/assets/stalls/stall_hilda.png',
  gunther: '/assets/stalls/stall_gunther.png',
  blacksmith_gunther: '/assets/stalls/stall_gunther.png',
  stall_gunther: '/assets/stalls/stall_gunther.png',
  althea: '/assets/stalls/stall_althea.png',
  herbalist_althea: '/assets/stalls/stall_althea.png',
  stall_althea: '/assets/stalls/stall_althea.png',
  barnaby: '/assets/stalls/stall_barnaby.png',
  fishmonger_barnaby: '/assets/stalls/stall_barnaby.png',
  stall_barnaby: '/assets/stalls/stall_barnaby.png',
  rashid: '/assets/stalls/stall_rashid.png',
  spice_rashid: '/assets/stalls/stall_rashid.png',
  stall_rashid: '/assets/stalls/stall_rashid.png'
};

export const ITEM_ASSETS: Record<string, string> = {
  grain: '/assets/items/grain.png',
  flour: '/assets/items/flour.png',
  bread: '/assets/items/bread.png',
  meat: '/assets/items/meat.png',
  fish: '/assets/items/fish.png',
  apples: '/assets/items/apples.png',
  salt: '/assets/items/salt.png',
  wine: '/assets/items/wine.png',
  beer: '/assets/items/beer.png',
  wool: '/assets/items/wool.png',
  leather: '/assets/items/leather.png',
  wood: '/assets/items/wood.png',
  stone: '/assets/items/stone.png',
  iron: '/assets/items/iron.png',
  cloth: '/assets/items/cloth.png',
  tools: '/assets/items/tools.png',
  swords: '/assets/items/swords.png',
  herbs: '/assets/items/herbs.png',
  spices: '/assets/items/spices.png',
  silk: '/assets/items/silk.png',
  jewelry: '/assets/items/jewelry.png',
  horses: '/assets/items/horses.png',
  coin: '/assets/items/coin.png'
};

export function getItemIcon(itemId: string): string {
  return ITEM_ASSETS[itemId] || `/assets/items/${itemId}.png` || '/assets/items/grain.png';
}

export function getCharacterPortrait(portraitKey: string): string {
  return CHARACTER_ASSETS[portraitKey] || `/assets/characters/${portraitKey}.png` || '/assets/characters/tomas.png';
}

export function getStallImage(stallKey: string): string {
  return STALL_ASSETS[stallKey] || '/assets/stalls/stall_farmer.png';
}

export function getLocationBackground(locationId: string): string {
  if (locationId === 'harbor') {
    return ENVIRONMENT_ASSETS.harbor;
  }
  return ENVIRONMENT_ASSETS.marketSquare;
}
