import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function run() {
  console.log('Starting asset processing with sharp...');

  const stallsSrc = path.resolve('src/assets/images/pixel_market_stalls_1790010393098.jpg');
  const resourcesSrc = path.resolve('src/assets/images/pixel_trade_resources_1790010412468.jpg');
  const merchantsSrc = path.resolve('src/assets/images/pixel_npc_merchants_1790010426628.jpg');
  const caravanSrc = path.resolve('src/assets/images/pixel_caravan_travel_1790010447021.jpg');

  const stallsMeta = await sharp(stallsSrc).metadata();
  const resourcesMeta = await sharp(resourcesSrc).metadata();
  const merchantsMeta = await sharp(merchantsSrc).metadata();

  console.log('Stalls meta:', stallsMeta.width, stallsMeta.height);
  console.log('Resources meta:', resourcesMeta.width, resourcesMeta.height);
  console.log('Merchants meta:', merchantsMeta.width, merchantsMeta.height);

  // Ensure target directories exist
  const dirs = [
    path.resolve('public/assets/stalls'),
    path.resolve('public/assets/characters'),
    path.resolve('public/assets/items'),
    path.resolve('public/assets/environment')
  ];
  for (const d of dirs) {
    if (!fs.existsSync(d)) {
      fs.mkdirSync(d, { recursive: true });
    }
  }

  // Copy whole sheets as well
  fs.copyFileSync(stallsSrc, path.resolve('public/assets/stalls/stalls_sheet.jpg'));
  fs.copyFileSync(resourcesSrc, path.resolve('public/assets/items/resources_sheet.jpg'));
  fs.copyFileSync(merchantsSrc, path.resolve('public/assets/characters/merchants_sheet.jpg'));
  fs.copyFileSync(caravanSrc, path.resolve('public/assets/environment/caravan_travel.jpg'));

  // --- 1. EXTRACT STALLS ---
  // The stalls image is 16:9, e.g. 1344 x 768 or similar.
  // We can extract 6 distinct market stalls/booths:
  // 3 across, 2 rows
  const sW = Math.floor(stallsMeta.width! / 3);
  const sH = Math.floor(stallsMeta.height! / 2);

  const stallKeys = [
    ['stall_baker', 'stall_blacksmith', 'stall_herbalist'],
    ['stall_fishmonger', 'stall_spice', 'stall_farmer']
  ];

  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 3; c++) {
      const key = stallKeys[r][c];
      const left = c * sW;
      const top = r * sH;
      await sharp(stallsSrc)
        .extract({ left, top, width: sW, height: sH })
        .resize(160, 120, { fit: 'cover', kernel: 'nearest' })
        .toFile(path.resolve(`public/assets/stalls/${key}.png`));
      console.log(`Saved stall: ${key}.png`);
    }
  }

  // Extra specific stalls
  fs.copyFileSync(path.resolve('public/assets/stalls/stall_farmer.png'), path.resolve('public/assets/stalls/stall_tomas.png'));
  fs.copyFileSync(path.resolve('public/assets/stalls/stall_baker.png'), path.resolve('public/assets/stalls/stall_hilda.png'));
  fs.copyFileSync(path.resolve('public/assets/stalls/stall_blacksmith.png'), path.resolve('public/assets/stalls/stall_gunther.png'));
  fs.copyFileSync(path.resolve('public/assets/stalls/stall_herbalist.png'), path.resolve('public/assets/stalls/stall_althea.png'));
  fs.copyFileSync(path.resolve('public/assets/stalls/stall_fishmonger.png'), path.resolve('public/assets/stalls/stall_barnaby.png'));
  fs.copyFileSync(path.resolve('public/assets/stalls/stall_spice.png'), path.resolve('public/assets/stalls/stall_rashid.png'));

  // --- 2. EXTRACT CHARACTERS ---
  // The merchants image is 1:1, a 3x3 grid of 9 portraits
  const mW = Math.floor(merchantsMeta.width! / 3);
  const mH = Math.floor(merchantsMeta.height! / 3);

  const merchantNames = [
    ['tomas', 'hilda', 'gunther'],
    ['barnaby', 'althea', 'rashid'],
    ['vivienne', 'cedric', 'giles']
  ];

  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const name = merchantNames[r][c];
      const left = Math.floor(c * mW);
      const top = Math.floor(r * mH);
      await sharp(merchantsSrc)
        .extract({ left, top, width: mW, height: mH })
        .resize(128, 128, { fit: 'cover', kernel: 'nearest' })
        .toFile(path.resolve(`public/assets/characters/${name}.png`));
      console.log(`Saved merchant character: ${name}.png`);
    }
  }
  // Roderick copy
  fs.copyFileSync(path.resolve('public/assets/characters/cedric.png'), path.resolve('public/assets/characters/roderick.png'));

  // --- 3. EXTRACT RESOURCES (ITEMS) ---
  // The resources image is 1:1, a 5x5 grid or 4x5 grid
  const rW = Math.floor(resourcesMeta.width! / 5);
  const rH = Math.floor(resourcesMeta.height! / 5);

  const itemGrid = [
    ['grain', 'flour', 'bread', 'meat', 'fish'],
    ['apples', 'salt', 'wine', 'beer', 'wool'],
    ['leather', 'wood', 'stone', 'iron', 'cloth'],
    ['tools', 'swords', 'herbs', 'spices', 'silk'],
    ['jewelry', 'horses', 'coin', 'wood_bundle', 'lantern']
  ];

  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      const itemName = itemGrid[r][c];
      const left = Math.floor(c * rW);
      const top = Math.floor(r * rH);

      // Crop slightly inward to avoid edge artifacts from grid borders
      const padX = Math.floor(rW * 0.08);
      const padY = Math.floor(rH * 0.08);
      const cropW = rW - padX * 2;
      const cropH = rH - padY * 2;

      await sharp(resourcesSrc)
        .extract({ left: left + padX, top: top + padY, width: cropW, height: cropH })
        .resize(64, 64, { fit: 'cover', kernel: 'nearest' })
        .toFile(path.resolve(`public/assets/items/${itemName}.png`));
      console.log(`Saved item resource: ${itemName}.png`);
    }
  }

  console.log('All pixel art images generated and sliced successfully!');
}

run().catch(console.error);
