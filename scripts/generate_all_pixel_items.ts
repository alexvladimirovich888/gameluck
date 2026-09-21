import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Helper to create an SVG with crisp pixel art rects on a 32x32 grid
function createPixelSvg(pixels: { x: number; y: number; w?: number; h?: number; c: string }[]): string {
  let rects = '';
  for (const p of pixels) {
    const w = p.w ?? 1;
    const h = p.h ?? 1;
    rects += `<rect x="${p.x}" y="${p.y}" width="${w}" height="${h}" fill="${p.c}" />`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="64" height="64" shape-rendering="crispEdges">
    <rect width="32" height="32" fill="#140a05" rx="3" />
    <rect x="1" y="1" width="30" height="30" fill="none" stroke="#3d2212" stroke-width="1" />
    <rect x="2" y="2" width="28" height="28" fill="#1e1008" />
    ${rects}
  </svg>`;
}

// 1. SWORD - Diagonal or vertical medieval steel broadsword with gold hilt
function getSwordPixels() {
  const p: { x: number; y: number; w?: number; h?: number; c: string }[] = [];
  // Blade tip (vertical centered around x=15-16, y=5 to 19)
  // Blade outline & body
  // Tip
  p.push({ x: 15, y: 4, w: 2, h: 2, c: '#ffffff' });
  // Blade spine and flats
  for (let y = 6; y <= 18; y++) {
    // Left edge (highlight)
    p.push({ x: 14, y, w: 1, h: 1, c: '#94a3b8' });
    // Left flat
    p.push({ x: 15, y, w: 1, h: 1, c: '#f8fafc' });
    // Right flat / spine
    p.push({ x: 16, y, w: 1, h: 1, c: '#cbd5e1' });
    // Right edge (shadow)
    p.push({ x: 17, y, w: 1, h: 1, c: '#475569' });
  }
  // Fuller blood groove
  for (let y = 8; y <= 16; y++) {
    p.push({ x: 15, y, w: 1, h: 1, c: '#64748b' });
  }
  // Crossguard (golden ornate)
  p.push({ x: 9, y: 19, w: 14, h: 2, c: '#f59e0b' });
  p.push({ x: 8, y: 18, w: 2, h: 2, c: '#d97706' });
  p.push({ x: 22, y: 18, w: 2, h: 2, c: '#d97706' });
  p.push({ x: 10, y: 19, w: 12, h: 1, c: '#fef08a' }); // highlight
  p.push({ x: 9, y: 20, w: 14, h: 1, c: '#b45309' }); // shadow
  // Grip (leather wrapped)
  for (let y = 21; y <= 25; y++) {
    p.push({ x: 15, y, w: 2, h: 1, c: y % 2 === 0 ? '#78350f' : '#451a03' });
  }
  // Pommel (golden sphere with gem)
  p.push({ x: 14, y: 26, w: 4, h: 3, c: '#d97706' });
  p.push({ x: 15, y: 26, w: 2, h: 2, c: '#fde047' });
  p.push({ x: 15, y: 27, w: 2, h: 1, c: '#dc2626' }); // ruby in pommel
  return p;
}

// 2. GRAIN - Golden sheaf of wheat stalks tied with rope
function getGrainPixels() {
  const p: { x: number; y: number; w?: number; h?: number; c: string }[] = [];
  // Ears of wheat spread at top
  const ears = [
    { x: 11, y: 5 }, { x: 15, y: 4 }, { x: 19, y: 5 },
    { x: 9, y: 9 }, { x: 13, y: 8 }, { x: 17, y: 8 }, { x: 21, y: 9 }
  ];
  for (const ear of ears) {
    p.push({ x: ear.x, y: ear.y, w: 3, h: 4, c: '#facc15' });
    p.push({ x: ear.x + 1, y: ear.y, w: 1, h: 3, c: '#fef08a' });
    p.push({ x: ear.x, y: ear.y + 3, w: 3, h: 1, c: '#ca8a04' });
    p.push({ x: ear.x + 1, y: ear.y - 2, w: 1, h: 2, c: '#ca8a04' }); // awn whiskers
  }
  // Bundle stalks
  for (let y = 13; y <= 20; y++) {
    const w = y < 16 ? 8 : 6;
    const sx = y < 16 ? 12 : 13;
    p.push({ x: sx, y, w, h: 1, c: '#eab308' });
    p.push({ x: sx + 1, y, w: w - 2, h: 1, c: '#fef08a' });
    p.push({ x: sx + w - 1, y, w: 1, h: 1, c: '#a16207' });
  }
  // Rope tie around middle
  p.push({ x: 12, y: 18, w: 8, h: 2, c: '#78350f' });
  p.push({ x: 13, y: 18, w: 6, h: 1, c: '#b45309' });
  // Spread bottom stalks
  p.push({ x: 10, y: 22, w: 12, h: 4, c: '#ca8a04' });
  p.push({ x: 11, y: 22, w: 10, h: 3, c: '#eab308' });
  p.push({ x: 9, y: 26, w: 14, h: 2, c: '#854d0e' });
  return p;
}

// 3. FLOUR - Burlap sack filled with white powdery flour
function getFlourPixels() {
  const p: { x: number; y: number; w?: number; h?: number; c: string }[] = [];
  // Tied top ears of sack
  p.push({ x: 12, y: 7, w: 3, h: 3, c: '#d97706' });
  p.push({ x: 17, y: 7, w: 3, h: 3, c: '#d97706' });
  // String tie
  p.push({ x: 13, y: 10, w: 6, h: 2, c: '#78350f' });
  p.push({ x: 14, y: 10, w: 4, h: 1, c: '#ca8a04' });
  // Sack body
  for (let y = 12; y <= 26; y++) {
    const w = y < 18 ? 14 : 16;
    const sx = y < 18 ? 9 : 8;
    p.push({ x: sx, y, w, h: 1, c: '#b45309' });
    p.push({ x: sx + 1, y, w: w - 2, h: 1, c: '#d97706' });
    p.push({ x: sx + 2, y, w: 3, h: 1, c: '#fde68a' }); // burlap highlight
  }
  // White flour spill / stamp on sack
  p.push({ x: 12, y: 15, w: 8, h: 7, c: '#f8fafc' });
  p.push({ x: 13, y: 16, w: 6, h: 5, c: '#ffffff' });
  p.push({ x: 14, y: 17, w: 4, h: 3, c: '#e2e8f0' });
  // Grain ear stamp on sack
  p.push({ x: 15, y: 17, w: 2, h: 3, c: '#ca8a04' });
  return p;
}

// 4. BREAD - Round golden crusty peasant bread loaf
function getBreadPixels() {
  const p: { x: number; y: number; w?: number; h?: number; c: string }[] = [];
  // Loaf mound
  p.push({ x: 11, y: 9, w: 10, h: 2, c: '#9a3412' });
  p.push({ x: 8, y: 11, w: 16, h: 3, c: '#c2410c' });
  p.push({ x: 6, y: 14, w: 20, h: 7, c: '#ea580c' });
  p.push({ x: 5, y: 17, w: 22, h: 6, c: '#d97706' });
  p.push({ x: 6, y: 23, w: 20, h: 3, c: '#9a3412' });
  // Golden crispy crust highlights
  p.push({ x: 10, y: 12, w: 12, h: 3, c: '#fde047' });
  p.push({ x: 9, y: 15, w: 14, h: 3, c: '#fbbf24' });
  // Scored cuts on crust (baker's knife slash)
  p.push({ x: 10, y: 13, w: 3, h: 6, c: '#7c2d12' });
  p.push({ x: 15, y: 12, w: 3, h: 7, c: '#7c2d12' });
  p.push({ x: 20, y: 14, w: 2, h: 6, c: '#7c2d12' });
  // Flour dusting on top
  p.push({ x: 13, y: 10, w: 6, h: 1, c: '#fef3c7' });
  return p;
}

// 5. MEAT - Smoked ham shank on bone
function getMeatPixels() {
  const p: { x: number; y: number; w?: number; h?: number; c: string }[] = [];
  // White bone stick
  p.push({ x: 6, y: 8, w: 5, h: 4, c: '#f8fafc' });
  p.push({ x: 7, y: 9, w: 3, h: 2, c: '#e2e8f0' });
  p.push({ x: 9, y: 11, w: 4, h: 4, c: '#cbd5e1' });
  // Ham meat body
  p.push({ x: 11, y: 10, w: 10, h: 4, c: '#881337' });
  p.push({ x: 11, y: 14, w: 15, h: 8, c: '#be123c' });
  p.push({ x: 13, y: 15, w: 11, h: 5, c: '#e11d48' }); // red meat
  p.push({ x: 15, y: 16, w: 7, h: 3, c: '#fb7185' }); // tender center
  // Outer smoked brown rind / crackling
  p.push({ x: 21, y: 13, w: 5, h: 10, c: '#7c2d12' });
  p.push({ x: 12, y: 22, w: 13, h: 4, c: '#9a3412' });
  // White fat layer
  p.push({ x: 21, y: 14, w: 2, h: 7, c: '#fff1f2' });
  p.push({ x: 14, y: 21, w: 8, h: 1, c: '#fff1f2' });
  return p;
}

// 6. FISH - Whole fresh blue & silver caught fish
function getFishPixels() {
  const p: { x: number; y: number; w?: number; h?: number; c: string }[] = [];
  // Tail fin
  p.push({ x: 5, y: 11, w: 3, h: 3, c: '#0284c7' });
  p.push({ x: 4, y: 12, w: 2, h: 7, c: '#0369a1' });
  p.push({ x: 5, y: 17, w: 3, h: 3, c: '#0284c7' });
  p.push({ x: 7, y: 14, w: 3, h: 3, c: '#38bdf8' });
  // Fish body
  for (let x = 9; x <= 22; x++) {
    const h = x < 15 ? (x - 7) * 1.5 : (25 - x) * 1.4;
    const top = Math.floor(15 - h / 2);
    p.push({ x, y: top, w: 1, h: Math.floor(h), c: '#0284c7' });
    // Dorsal dark blue
    p.push({ x, y: top, w: 1, h: 2, c: '#075985' });
    // Belly silver white
    p.push({ x, y: Math.floor(top + h - 2), w: 1, h: 2, c: '#f0f9ff' });
    // Midbody light blue scales
    p.push({ x, y: Math.floor(top + 2), w: 1, h: Math.max(1, Math.floor(h - 4)), c: '#38bdf8' });
  }
  // Dorsal fin
  p.push({ x: 14, y: 8, w: 4, h: 3, c: '#0369a1' });
  // Pectoral fin
  p.push({ x: 17, y: 16, w: 3, h: 2, c: '#7dd3fc' });
  // Fish head and mouth
  p.push({ x: 23, y: 13, w: 4, h: 5, c: '#0284c7' });
  p.push({ x: 26, y: 15, w: 2, h: 2, c: '#0369a1' });
  // Eye
  p.push({ x: 24, y: 13, w: 2, h: 2, c: '#ffffff' });
  p.push({ x: 25, y: 14, w: 1, h: 1, c: '#000000' });
  return p;
}

// 7. APPLES - Glossy red ripe apples with green leaf
function getApplesPixels() {
  const p: { x: number; y: number; w?: number; h?: number; c: string }[] = [];
  // Stem
  p.push({ x: 15, y: 6, w: 2, h: 4, c: '#78350f' });
  // Green leaf
  p.push({ x: 17, y: 6, w: 4, h: 2, c: '#16a34a' });
  p.push({ x: 18, y: 7, w: 4, h: 2, c: '#22c55e' });
  p.push({ x: 20, y: 8, w: 2, h: 1, c: '#4ade80' });
  // Big main red apple
  for (let y = 10; y <= 24; y++) {
    const w = y < 14 ? 14 : (y > 20 ? 12 : 16);
    const sx = y < 14 ? 9 : (y > 20 ? 10 : 8);
    p.push({ x: sx, y, w, h: 1, c: '#991b1b' });
    p.push({ x: sx + 1, y, w: w - 2, h: 1, c: '#dc2626' });
  }
  // Apple gloss highlight
  p.push({ x: 10, y: 12, w: 3, h: 5, c: '#fca5a5' });
  p.push({ x: 11, y: 13, w: 2, h: 3, c: '#ffffff' });
  // Yellow blush
  p.push({ x: 18, y: 17, w: 4, h: 5, c: '#facc15' });
  // Apple bottom indent
  p.push({ x: 14, y: 24, w: 4, h: 1, c: '#450a0a' });
  return p;
}

// 8. SALT - Wooden bowl with mound of sparkling white crystals
function getSaltPixels() {
  const p: { x: number; y: number; w?: number; h?: number; c: string }[] = [];
  // Pile of crystal white salt
  p.push({ x: 14, y: 7, w: 4, h: 3, c: '#ffffff' });
  p.push({ x: 11, y: 10, w: 10, h: 4, c: '#f8fafc' });
  p.push({ x: 8, y: 14, w: 16, h: 5, c: '#ffffff' });
  // Sparkles
  p.push({ x: 13, y: 9, w: 2, h: 2, c: '#e0f2fe' });
  p.push({ x: 18, y: 12, w: 2, h: 2, c: '#38bdf8' });
  p.push({ x: 10, y: 15, w: 2, h: 2, c: '#e0f2fe' });
  // Wooden bowl
  p.push({ x: 6, y: 18, w: 20, h: 3, c: '#78350f' });
  p.push({ x: 7, y: 19, w: 18, h: 2, c: '#9a3412' });
  p.push({ x: 8, y: 21, w: 16, h: 4, c: '#78350f' });
  p.push({ x: 10, y: 25, w: 12, h: 2, c: '#451a03' });
  return p;
}

// 9. WINE - Monastery glass bottle and full chalice of ruby red wine
function getWinePixels() {
  const p: { x: number; y: number; w?: number; h?: number; c: string }[] = [];
  // Bottle neck
  p.push({ x: 10, y: 6, w: 3, h: 2, c: '#ca8a04' }); // wax cork
  p.push({ x: 10, y: 8, w: 3, h: 5, c: '#14532d' }); // dark green glass
  p.push({ x: 9, y: 13, w: 6, h: 12, c: '#166534' }); // bottle body
  p.push({ x: 10, y: 14, w: 1, h: 10, c: '#86efac' }); // glass glare
  // Wine bottle label
  p.push({ x: 10, y: 17, w: 4, h: 5, c: '#fef3c7' });
  p.push({ x: 11, y: 18, w: 2, h: 3, c: '#7f1d1d' }); // cross
  // Chalice cup
  p.push({ x: 17, y: 14, w: 8, h: 5, c: '#ca8a04' });
  p.push({ x: 18, y: 14, w: 6, h: 4, c: '#991b1b' }); // red wine
  p.push({ x: 19, y: 14, w: 4, h: 2, c: '#dc2626' }); // wine surface
  p.push({ x: 20, y: 19, w: 2, h: 4, c: '#ca8a04' }); // chalice stem
  p.push({ x: 18, y: 23, w: 6, h: 2, c: '#eab308' }); // chalice base
  return p;
}

// 10. BEER - Foaming wooden stein mug
function getBeerPixels() {
  const p: { x: number; y: number; w?: number; h?: number; c: string }[] = [];
  // Overflowing foam top
  p.push({ x: 10, y: 6, w: 12, h: 4, c: '#ffffff' });
  p.push({ x: 9, y: 8, w: 14, h: 3, c: '#fef3c7' });
  p.push({ x: 8, y: 11, w: 3, h: 4, c: '#ffffff' }); // drip down
  // Mug body (amber wood + beer)
  for (let y = 10; y <= 24; y++) {
    p.push({ x: 9, y, w: 14, h: 1, c: '#78350f' });
    p.push({ x: 10, y, w: 12, h: 1, c: '#d97706' }); // golden amber
    p.push({ x: 11, y, w: 8, h: 1, c: '#f59e0b' });
  }
  // Iron bands around mug
  p.push({ x: 8, y: 13, w: 16, h: 2, c: '#475569' });
  p.push({ x: 8, y: 21, w: 16, h: 2, c: '#475569' });
  p.push({ x: 9, y: 13, w: 14, h: 1, c: '#94a3b8' });
  // Big handle
  p.push({ x: 23, y: 12, w: 3, h: 2, c: '#475569' });
  p.push({ x: 24, y: 14, w: 2, h: 7, c: '#475569' });
  p.push({ x: 23, y: 20, w: 3, h: 2, c: '#475569' });
  return p;
}

// 11. WOOL - Soft fleece cloud of spun wool
function getWoolPixels() {
  const p: { x: number; y: number; w?: number; h?: number; c: string }[] = [];
  // Cloud-like bundle of wool
  const circles = [
    { x: 12, y: 8, r: 4 }, { x: 18, y: 8, r: 4 },
    { x: 8, y: 13, r: 4 }, { x: 15, y: 12, r: 5 }, { x: 22, y: 13, r: 4 },
    { x: 9, y: 18, r: 4 }, { x: 16, y: 18, r: 5 }, { x: 22, y: 18, r: 4 },
    { x: 12, y: 22, r: 4 }, { x: 18, y: 22, r: 4 }
  ];
  for (const c of circles) {
    p.push({ x: c.x - 2, y: c.y - 2, w: 5, h: 5, c: '#e2e8f0' });
    p.push({ x: c.x - 1, y: c.y - 1, w: 3, h: 3, c: '#ffffff' });
  }
  // Blue binding ribbon
  p.push({ x: 14, y: 7, w: 4, h: 18, c: '#2563eb' });
  p.push({ x: 15, y: 7, w: 2, h: 18, c: '#60a5fa' });
  p.push({ x: 7, y: 15, w: 18, h: 3, c: '#1d4ed8' });
  p.push({ x: 8, y: 16, w: 16, h: 1, c: '#93c5fd' });
  return p;
}

// 12. LEATHER - Tanned brown animal pelt hide
function getLeatherPixels() {
  const p: { x: number; y: number; w?: number; h?: number; c: string }[] = [];
  // Stretched animal pelt shape
  p.push({ x: 12, y: 6, w: 8, h: 3, c: '#78350f' }); // neck
  // Left leg
  p.push({ x: 6, y: 8, w: 6, h: 4, c: '#78350f' });
  p.push({ x: 5, y: 10, w: 4, h: 3, c: '#9a3412' });
  // Right leg
  p.push({ x: 20, y: 8, w: 6, h: 4, c: '#78350f' });
  p.push({ x: 23, y: 10, w: 4, h: 3, c: '#9a3412' });
  // Main hide body
  for (let y = 11; y <= 21; y++) {
    const w = y < 16 ? 18 : 16;
    const sx = y < 16 ? 7 : 8;
    p.push({ x: sx, y, w, h: 1, c: '#78350f' });
    p.push({ x: sx + 1, y, w: w - 2, h: 1, c: '#b45309' });
    p.push({ x: sx + 3, y, w: w - 6, h: 1, c: '#d97706' });
  }
  // Bottom hind legs
  p.push({ x: 5, y: 22, w: 6, h: 4, c: '#78350f' });
  p.push({ x: 21, y: 22, w: 6, h: 4, c: '#78350f' });
  p.push({ x: 13, y: 22, w: 6, h: 2, c: '#78350f' });
  // Stitched border marks
  p.push({ x: 10, y: 14, w: 2, h: 2, c: '#451a03' });
  p.push({ x: 16, y: 13, w: 3, h: 2, c: '#fde68a' });
  return p;
}

// 13. WOOD - Stack of cut round timber logs with tree rings
function getWoodPixels() {
  const p: { x: number; y: number; w?: number; h?: number; c: string }[] = [];
  // Bottom log 1 (left)
  p.push({ x: 5, y: 17, w: 10, h: 8, c: '#451a03' });
  p.push({ x: 6, y: 18, w: 8, h: 6, c: '#d97706' });
  p.push({ x: 8, y: 20, w: 4, h: 2, c: '#78350f' });
  // Bottom log 2 (right)
  p.push({ x: 17, y: 17, w: 10, h: 8, c: '#451a03' });
  p.push({ x: 18, y: 18, w: 8, h: 6, c: '#d97706' });
  p.push({ x: 20, y: 20, w: 4, h: 2, c: '#78350f' });
  // Top log (centered on top)
  p.push({ x: 11, y: 9, w: 10, h: 9, c: '#451a03' });
  p.push({ x: 12, y: 10, w: 8, h: 7, c: '#d97706' });
  p.push({ x: 14, y: 12, w: 4, h: 3, c: '#fde68a' }); // heartwood ring
  p.push({ x: 15, y: 13, w: 2, h: 1, c: '#78350f' });
  // Log bark sides
  p.push({ x: 5, y: 25, w: 22, h: 2, c: '#291103' });
  return p;
}

// 14. STONE - Chiseled granite masonry ashlar blocks
function getStonePixels() {
  const p: { x: number; y: number; w?: number; h?: number; c: string }[] = [];
  // Bottom block 1
  p.push({ x: 5, y: 17, w: 10, h: 9, c: '#334155' });
  p.push({ x: 6, y: 18, w: 8, h: 7, c: '#64748b' });
  p.push({ x: 6, y: 18, w: 7, h: 2, c: '#94a3b8' });
  // Bottom block 2
  p.push({ x: 16, y: 17, w: 11, h: 9, c: '#334155' });
  p.push({ x: 17, y: 18, w: 9, h: 7, c: '#64748b' });
  p.push({ x: 17, y: 18, w: 8, h: 2, c: '#94a3b8' });
  // Top center block
  p.push({ x: 9, y: 8, w: 14, h: 9, c: '#1e293b' });
  p.push({ x: 10, y: 9, w: 12, h: 7, c: '#64748b' });
  p.push({ x: 10, y: 9, w: 11, h: 2, c: '#cbd5e1' });
  p.push({ x: 12, y: 13, w: 3, h: 1, c: '#475569' }); // chisel marks
  p.push({ x: 17, y: 12, w: 2, h: 2, c: '#475569' });
  return p;
}

// 15. IRON - Stack of heavy iron metallic ingots
function getIronPixels() {
  const p: { x: number; y: number; w?: number; h?: number; c: string }[] = [];
  // Bottom ingot
  p.push({ x: 6, y: 18, w: 20, h: 7, c: '#0f172a' });
  p.push({ x: 7, y: 19, w: 18, h: 5, c: '#334155' });
  p.push({ x: 8, y: 19, w: 16, h: 2, c: '#94a3b8' });
  p.push({ x: 9, y: 19, w: 10, h: 1, c: '#f1f5f9' }); // metallic shine
  // Top ingot
  p.push({ x: 9, y: 11, w: 14, h: 7, c: '#0f172a' });
  p.push({ x: 10, y: 12, w: 12, h: 5, c: '#475569' });
  p.push({ x: 11, y: 12, w: 10, h: 2, c: '#cbd5e1' });
  p.push({ x: 12, y: 12, w: 6, h: 1, c: '#ffffff' }); // white glare
  p.push({ x: 14, y: 14, w: 4, h: 2, c: '#1e293b' }); // forge stamp mark
  return p;
}

// 16. CLOTH - Folded bolt of fine woven linen fabric
function getClothPixels() {
  const p: { x: number; y: number; w?: number; h?: number; c: string }[] = [];
  // Roll top ellipse
  p.push({ x: 8, y: 9, w: 16, h: 4, c: '#1e3a8a' });
  p.push({ x: 9, y: 10, w: 14, h: 2, c: '#3b82f6' });
  p.push({ x: 10, y: 10, w: 8, h: 1, c: '#93c5fd' });
  // Draped folded cloth body
  for (let y = 13; y <= 24; y++) {
    p.push({ x: 8, y, w: 16, h: 1, c: '#1d4ed8' });
    p.push({ x: 10, y, w: 12, h: 1, c: '#2563eb' });
    p.push({ x: 12, y, w: 6, h: 1, c: '#60a5fa' });
  }
  // Bottom fold drape
  p.push({ x: 6, y: 22, w: 20, h: 3, c: '#1e40af' });
  p.push({ x: 5, y: 25, w: 22, h: 2, c: '#172554' });
  return p;
}

// 17. TOOLS - Blacksmith heavy steel hammer and tongs
function getToolsPixels() {
  const p: { x: number; y: number; w?: number; h?: number; c: string }[] = [];
  // Hammer head (horizontal at top)
  p.push({ x: 8, y: 8, w: 12, h: 6, c: '#0f172a' });
  p.push({ x: 9, y: 9, w: 10, h: 4, c: '#475569' });
  p.push({ x: 9, y: 9, w: 9, h: 1, c: '#e2e8f0' }); // shine
  // Hammer handle (diagonal down to right)
  for (let i = 0; i < 14; i++) {
    p.push({ x: 13 + Math.floor(i * 0.7), y: 13 + i, w: 2, h: 2, c: '#78350f' });
    p.push({ x: 14 + Math.floor(i * 0.7), y: 13 + i, w: 1, h: 1, c: '#d97706' });
  }
  // Crossed tongs (steel pincers)
  p.push({ x: 20, y: 7, w: 4, h: 3, c: '#334155' });
  p.push({ x: 21, y: 10, w: 2, h: 2, c: '#94a3b8' }); // hinge
  for (let i = 0; i < 13; i++) {
    p.push({ x: 20 - Math.floor(i * 0.8), y: 12 + i, w: 2, h: 1, c: '#64748b' });
  }
  return p;
}

// 18. HERBS - Tied bouquet of green medicinal herbs with purple flowers
function getHerbsPixels() {
  const p: { x: number; y: number; w?: number; h?: number; c: string }[] = [];
  // Tied stems at top (hanging upside down)
  p.push({ x: 15, y: 5, w: 3, h: 4, c: '#451a03' });
  p.push({ x: 14, y: 8, w: 5, h: 2, c: '#d97706' }); // cord
  // Spreading green leaves
  const leaves = [
    { x: 11, y: 10, w: 4, h: 6, c: '#15803d' },
    { x: 17, y: 10, w: 4, h: 6, c: '#16a34a' },
    { x: 8, y: 15, w: 5, h: 7, c: '#15803d' },
    { x: 14, y: 14, w: 5, h: 8, c: '#22c55e' },
    { x: 20, y: 15, w: 5, h: 7, c: '#16a34a' },
    { x: 11, y: 21, w: 4, h: 5, c: '#166534' },
    { x: 17, y: 21, w: 4, h: 5, c: '#15803d' }
  ];
  for (const l of leaves) {
    p.push(l);
    p.push({ x: l.x + 1, y: l.y + 1, w: Math.max(1, l.w - 2), h: Math.max(1, l.h - 2), c: '#4ade80' });
  }
  // Purple flowers/buds
  p.push({ x: 10, y: 14, w: 2, h: 2, c: '#c084fc' });
  p.push({ x: 21, y: 16, w: 2, h: 2, c: '#a855f7' });
  p.push({ x: 15, y: 23, w: 3, h: 2, c: '#c084fc' });
  return p;
}

// 19. SPICES - Sack spilling red saffron and cinnamon sticks
function getSpicesPixels() {
  const p: { x: number; y: number; w?: number; h?: number; c: string }[] = [];
  // Cinnamon sticks (diagonal)
  p.push({ x: 8, y: 6, w: 3, h: 10, c: '#7c2d12' });
  p.push({ x: 9, y: 7, w: 1, h: 8, c: '#b45309' });
  p.push({ x: 12, y: 5, w: 3, h: 11, c: '#7c2d12' });
  p.push({ x: 13, y: 6, w: 1, h: 9, c: '#d97706' });
  // Spices bowl / pouch
  p.push({ x: 10, y: 14, w: 14, h: 11, c: '#b45309' });
  p.push({ x: 11, y: 15, w: 12, h: 9, c: '#d97706' });
  // Bright orange-red spice powder mound (curry / saffron / paprika)
  p.push({ x: 12, y: 13, w: 10, h: 5, c: '#ea580c' });
  p.push({ x: 13, y: 13, w: 8, h: 3, c: '#f97316' });
  p.push({ x: 15, y: 12, w: 4, h: 2, c: '#fde047' }); // glowing yellow saffron
  // Star anise
  p.push({ x: 19, y: 20, w: 3, h: 3, c: '#451a03' });
  p.push({ x: 20, y: 21, w: 1, h: 1, c: '#78350f' });
  return p;
}

// 20. SILK - Opulent roll of purple shimmering silk with gold trim
function getSilkPixels() {
  const p: { x: number; y: number; w?: number; h?: number; c: string }[] = [];
  // Roll top cylinder
  p.push({ x: 7, y: 8, w: 18, h: 4, c: '#581c87' });
  p.push({ x: 8, y: 9, w: 16, h: 2, c: '#7e22ce' });
  p.push({ x: 9, y: 9, w: 12, h: 1, c: '#c084fc' });
  // Flowing purple fabric
  for (let y = 12; y <= 24; y++) {
    p.push({ x: 7, y, w: 18, h: 1, c: '#6b21a8' });
    p.push({ x: 9, y, w: 14, h: 1, c: '#9333ea' });
    p.push({ x: 12, y, w: 6, h: 1, c: '#e9d5ff' }); // silk shine
  }
  // Gold embroidery fringes along hem
  p.push({ x: 6, y: 23, w: 20, h: 2, c: '#eab308' });
  p.push({ x: 6, y: 24, w: 20, h: 1, c: '#fef08a' });
  p.push({ x: 7, y: 25, w: 18, h: 2, c: '#ca8a04' });
  return p;
}

// 21. JEWELRY - Gold signet ring with glittering ruby gemstone
function getJewelryPixels() {
  const p: { x: number; y: number; w?: number; h?: number; c: string }[] = [];
  // Ring band (golden circle)
  p.push({ x: 9, y: 13, w: 14, h: 13, c: '#ca8a04' });
  p.push({ x: 10, y: 14, w: 12, h: 11, c: '#eab308' });
  p.push({ x: 12, y: 16, w: 8, h: 7, c: '#1e1008' }); // hole through ring
  // Ring band highlights
  p.push({ x: 10, y: 15, w: 2, h: 8, c: '#fef08a' });
  // Crown setting holding the gem
  p.push({ x: 11, y: 9, w: 10, h: 4, c: '#eab308' });
  p.push({ x: 10, y: 10, w: 2, h: 3, c: '#ca8a04' });
  p.push({ x: 20, y: 10, w: 2, h: 3, c: '#ca8a04' });
  // Faceted Red Ruby Gemstone
  p.push({ x: 12, y: 6, w: 8, h: 6, c: '#991b1b' });
  p.push({ x: 13, y: 6, w: 6, h: 5, c: '#dc2626' });
  p.push({ x: 14, y: 7, w: 3, h: 3, c: '#f87171' });
  p.push({ x: 14, y: 7, w: 1, h: 1, c: '#ffffff' }); // brilliant diamond sparkle
  return p;
}

// 22. HORSES - Proud chestnut warhorse / packhorse
function getHorsesPixels() {
  const p: { x: number; y: number; w?: number; h?: number; c: string }[] = [];
  // Horse ears
  p.push({ x: 19, y: 5, w: 3, h: 4, c: '#7c2d12' });
  p.push({ x: 16, y: 6, w: 2, h: 3, c: '#9a3412' });
  // Mane (dark brown/black hair)
  for (let y = 8; y <= 21; y++) {
    p.push({ x: 19, y, w: 4, h: 1, c: '#1c1917' });
    p.push({ x: 20, y, w: 3, h: 1, c: '#44403c' });
  }
  // Head and neck
  p.push({ x: 13, y: 9, w: 7, h: 6, c: '#9a3412' });
  p.push({ x: 14, y: 10, w: 5, h: 4, c: '#c2410c' });
  // Snout & muzzle
  p.push({ x: 7, y: 14, w: 8, h: 6, c: '#9a3412' });
  p.push({ x: 6, y: 16, w: 5, h: 4, c: '#7c2d12' });
  p.push({ x: 6, y: 18, w: 2, h: 1, c: '#1c1917' }); // nostril
  // Eye
  p.push({ x: 13, y: 11, w: 2, h: 2, c: '#1c1917' });
  p.push({ x: 14, y: 11, w: 1, h: 1, c: '#ffffff' });
  // Neck
  for (let y = 15; y <= 24; y++) {
    p.push({ x: 12, y, w: 9, h: 1, c: '#9a3412' });
    p.push({ x: 13, y, w: 7, h: 1, c: '#c2410c' });
  }
  // Bridle and leather harness straps
  p.push({ x: 8, y: 16, w: 2, h: 4, c: '#ca8a04' });
  p.push({ x: 8, y: 17, w: 6, h: 1, c: '#ca8a04' });
  p.push({ x: 13, y: 12, w: 2, h: 8, c: '#ca8a04' });
  p.push({ x: 13, y: 16, w: 3, h: 3, c: '#facc15' }); // brass buckle
  return p;
}

// 23. COIN - Stamped gold florins
function getCoinPixels() {
  const p: { x: number; y: number; w?: number; h?: number; c: string }[] = [];
  // Bottom coin in stack
  p.push({ x: 7, y: 18, w: 18, h: 6, c: '#854d0e' });
  p.push({ x: 8, y: 19, w: 16, h: 4, c: '#ca8a04' });
  p.push({ x: 9, y: 19, w: 14, h: 2, c: '#eab308' });
  // Middle coin
  p.push({ x: 7, y: 14, w: 18, h: 6, c: '#854d0e' });
  p.push({ x: 8, y: 15, w: 16, h: 4, c: '#ca8a04' });
  p.push({ x: 9, y: 15, w: 14, h: 2, c: '#eab308' });
  // Top coin
  p.push({ x: 7, y: 9, w: 18, h: 7, c: '#854d0e' });
  p.push({ x: 8, y: 10, w: 16, h: 5, c: '#ca8a04' });
  p.push({ x: 9, y: 10, w: 14, h: 4, c: '#eab308' });
  p.push({ x: 10, y: 10, w: 12, h: 3, c: '#fde047' });
  p.push({ x: 11, y: 11, w: 4, h: 2, c: '#fef08a' }); // golden gleam
  // Royal crest crown stamped on top coin
  p.push({ x: 14, y: 11, w: 4, h: 2, c: '#a16207' });
  p.push({ x: 15, y: 12, w: 2, h: 1, c: '#713f12' });
  return p;
}

async function run() {
  console.log('Generating pixel-perfect, 100% matched items for all 22 resources...');

  const itemsMap: Record<string, () => { x: number; y: number; w?: number; h?: number; c: string }[]> = {
    grain: getGrainPixels,
    flour: getFlourPixels,
    bread: getBreadPixels,
    meat: getMeatPixels,
    fish: getFishPixels,
    apples: getApplesPixels,
    salt: getSaltPixels,
    wine: getWinePixels,
    beer: getBeerPixels,
    wool: getWoolPixels,
    leather: getLeatherPixels,
    wood: getWoodPixels,
    stone: getStonePixels,
    iron: getIronPixels,
    cloth: getClothPixels,
    tools: getToolsPixels,
    swords: getSwordPixels,
    herbs: getHerbsPixels,
    spices: getSpicesPixels,
    silk: getSilkPixels,
    jewelry: getJewelryPixels,
    horses: getHorsesPixels,
    coin: getCoinPixels
  };

  const outputDir = path.resolve('public/assets/items');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const [key, getPixels] of Object.entries(itemsMap)) {
    const pixels = getPixels();
    const svgContent = createPixelSvg(pixels);

    // Write SVG
    const svgPath = path.join(outputDir, `${key}.svg`);
    fs.writeFileSync(svgPath, svgContent);

    // Convert SVG directly to crisp 64x64 PNG using sharp
    const pngPath = path.join(outputDir, `${key}.png`);
    await sharp(Buffer.from(svgContent), { density: 300 })
      .resize(64, 64, { kernel: 'nearest' })
      .png()
      .toFile(pngPath);

    console.log(`Rendered 100% accurate pixel item: ${key}.png & ${key}.svg`);
  }

  // Also copy coin to ui/coin.png and ui/coin.svg
  fs.copyFileSync(path.join(outputDir, 'coin.png'), path.resolve('public/assets/ui/coin.png'));
  fs.copyFileSync(path.join(outputDir, 'coin.svg'), path.resolve('public/assets/ui/coin.svg'));

  console.log('All 22 resources + coins generated with authentic, high-quality pixel art!');
}

run().catch(console.error);
