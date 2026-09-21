import fs from 'fs';
import path from 'path';

const PUBLIC_ASSETS = path.resolve(process.cwd(), 'public/assets');

// Helper to write SVG file
function writeSvg(relPath: string, content: string) {
  const fullPath = path.join(PUBLIC_ASSETS, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim());
}

// 1. ITEMS ASSETS (22 distinct items)
const items: Record<string, string> = {
  'grain.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" shape-rendering="crispEdges">
    <rect width="24" height="24" fill="none"/>
    <rect x="11" y="4" width="2" height="17" fill="#854d0e"/>
    <rect x="8" y="5" width="3" height="3" fill="#eab308"/>
    <rect x="13" y="5" width="3" height="3" fill="#facc15"/>
    <rect x="7" y="9" width="4" height="3" fill="#fef08a"/>
    <rect x="13" y="9" width="4" height="3" fill="#facc15"/>
    <rect x="8" y="13" width="3" height="3" fill="#eab308"/>
    <rect x="13" y="13" width="3" height="3" fill="#ca8a04"/>
    <rect x="9" y="16" width="6" height="3" fill="#a16207"/>
    <rect x="10" y="19" width="4" height="2" fill="#713f12"/>
  </svg>`,

  'flour.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" shape-rendering="crispEdges">
    <rect width="24" height="24" fill="none"/>
    <rect x="5" y="7" width="14" height="13" fill="#92400e"/>
    <rect x="6" y="8" width="12" height="11" fill="#b45309"/>
    <rect x="7" y="9" width="10" height="9" fill="#d97706"/>
    <rect x="8" y="4" width="8" height="3" fill="#78350f"/>
    <rect x="9" y="3" width="6" height="2" fill="#fef08a"/>
    <rect x="9" y="11" width="6" height="5" fill="#f8fafc"/>
    <rect x="8" y="12" width="8" height="3" fill="#f1f5f9"/>
    <rect x="10" y="10" width="4" height="1" fill="#ffffff"/>
  </svg>`,

  'bread.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" shape-rendering="crispEdges">
    <rect width="24" height="24" fill="none"/>
    <rect x="4" y="9" width="16" height="9" fill="#78350f"/>
    <rect x="5" y="8" width="14" height="9" fill="#b45309"/>
    <rect x="6" y="7" width="12" height="7" fill="#d97706"/>
    <rect x="7" y="6" width="10" height="3" fill="#f59e0b"/>
    <rect x="7" y="8" width="2" height="4" fill="#fef3c7"/>
    <rect x="11" y="8" width="2" height="4" fill="#fef3c7"/>
    <rect x="15" y="8" width="2" height="4" fill="#fef3c7"/>
    <rect x="5" y="16" width="14" height="2" fill="#451a03"/>
  </svg>`,

  'meat.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" shape-rendering="crispEdges">
    <rect width="24" height="24" fill="none"/>
    <rect x="3" y="10" width="17" height="10" rx="2" fill="#7f1d1d"/>
    <rect x="5" y="8" width="14" height="9" fill="#b91c1c"/>
    <rect x="6" y="9" width="11" height="7" fill="#dc2626"/>
    <rect x="8" y="11" width="3" height="3" fill="#fca5a5"/>
    <rect x="13" y="12" width="2" height="2" fill="#fca5a5"/>
    <rect x="17" y="6" width="4" height="4" fill="#f8fafc"/>
    <rect x="19" y="8" width="3" height="4" fill="#cbd5e1"/>
    <rect x="4" y="18" width="15" height="2" fill="#450a0a"/>
  </svg>`,

  'fish.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" shape-rendering="crispEdges">
    <rect width="24" height="24" fill="none"/>
    <rect x="4" y="9" width="14" height="6" fill="#0369a1"/>
    <rect x="5" y="8" width="11" height="7" fill="#0284c7"/>
    <rect x="7" y="10" width="8" height="4" fill="#38bdf8"/>
    <rect x="8" y="11" width="5" height="2" fill="#bae6fd"/>
    <rect x="5" y="11" width="2" height="2" fill="#0c4a6e"/>
    <rect x="17" y="7" width="4" height="4" fill="#0284c7"/>
    <rect x="17" y="13" width="4" height="4" fill="#0284c7"/>
    <rect x="19" y="9" width="3" height="6" fill="#0369a1"/>
  </svg>`,

  'apples.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" shape-rendering="crispEdges">
    <rect width="24" height="24" fill="none"/>
    <rect x="11" y="4" width="2" height="4" fill="#78350f"/>
    <rect x="13" y="4" width="3" height="2" fill="#15803d"/>
    <rect x="5" y="9" width="14" height="11" fill="#991b1b"/>
    <rect x="6" y="8" width="12" height="11" fill="#dc2626"/>
    <rect x="7" y="9" width="10" height="9" fill="#ef4444"/>
    <rect x="8" y="10" width="3" height="3" fill="#fca5a5"/>
    <rect x="8" y="19" width="8" height="2" fill="#7f1d1d"/>
  </svg>`,

  'salt.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" shape-rendering="crispEdges">
    <rect width="24" height="24" fill="none"/>
    <rect x="6" y="7" width="12" height="13" fill="#334155"/>
    <rect x="7" y="8" width="10" height="11" fill="#64748b"/>
    <rect x="8" y="9" width="8" height="9" fill="#94a3b8"/>
    <rect x="9" y="4" width="6" height="3" fill="#0f172a"/>
    <rect x="9" y="11" width="6" height="6" fill="#f8fafc"/>
    <rect x="10" y="12" width="4" height="4" fill="#ffffff"/>
  </svg>`,

  'wine.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" shape-rendering="crispEdges">
    <rect width="24" height="24" fill="none"/>
    <rect x="11" y="3" width="2" height="2" fill="#78350f"/>
    <rect x="10" y="5" width="4" height="4" fill="#0f172a"/>
    <rect x="7" y="9" width="10" height="12" fill="#4c0519"/>
    <rect x="8" y="10" width="8" height="10" fill="#881337"/>
    <rect x="9" y="11" width="6" height="8" fill="#be123c"/>
    <rect x="9" y="12" width="2" height="5" fill="#f43f5e"/>
    <rect x="10" y="14" width="4" height="4" fill="#fde047"/>
  </svg>`,

  'beer.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" shape-rendering="crispEdges">
    <rect width="24" height="24" fill="none"/>
    <rect x="6" y="8" width="10" height="13" fill="#78350f"/>
    <rect x="7" y="9" width="8" height="11" fill="#b45309"/>
    <rect x="8" y="10" width="6" height="9" fill="#d97706"/>
    <rect x="5" y="4" width="12" height="5" fill="#f8fafc"/>
    <rect x="6" y="5" width="10" height="4" fill="#ffffff"/>
    <rect x="16" y="10" width="3" height="7" fill="#78350f"/>
    <rect x="17" y="12" width="1" height="4" fill="none"/>
    <rect x="7" y="19" width="8" height="2" fill="#451a03"/>
  </svg>`,

  'wool.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" shape-rendering="crispEdges">
    <rect width="24" height="24" fill="none"/>
    <rect x="5" y="8" width="14" height="10" fill="#475569"/>
    <rect x="6" y="7" width="12" height="11" fill="#cbd5e1"/>
    <rect x="7" y="8" width="10" height="9" fill="#f1f5f9"/>
    <rect x="8" y="9" width="8" height="6" fill="#ffffff"/>
    <rect x="9" y="11" width="3" height="3" fill="#e2e8f0"/>
    <rect x="14" y="12" width="2" height="2" fill="#e2e8f0"/>
  </svg>`,

  'leather.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" shape-rendering="crispEdges">
    <rect width="24" height="24" fill="none"/>
    <rect x="5" y="7" width="14" height="12" fill="#451a03"/>
    <rect x="6" y="8" width="12" height="10" fill="#78350f"/>
    <rect x="7" y="9" width="10" height="8" fill="#92400e"/>
    <rect x="11" y="6" width="2" height="14" fill="#ca8a04"/>
    <rect x="10" y="11" width="4" height="3" fill="#eab308"/>
  </svg>`,

  'wood.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" shape-rendering="crispEdges">
    <rect width="24" height="24" fill="none"/>
    <rect x="4" y="7" width="16" height="5" fill="#451a03"/>
    <rect x="5" y="8" width="14" height="3" fill="#78350f"/>
    <rect x="4" y="13" width="16" height="5" fill="#451a03"/>
    <rect x="5" y="14" width="14" height="3" fill="#78350f"/>
    <rect x="4" y="7" width="3" height="5" fill="#d97706"/>
    <rect x="4" y="13" width="3" height="5" fill="#d97706"/>
  </svg>`,

  'stone.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" shape-rendering="crispEdges">
    <rect width="24" height="24" fill="none"/>
    <rect x="5" y="7" width="14" height="12" fill="#1e293b"/>
    <rect x="6" y="8" width="12" height="10" fill="#475569"/>
    <rect x="7" y="9" width="10" height="8" fill="#64748b"/>
    <rect x="8" y="9" width="4" height="3" fill="#94a3b8"/>
    <rect x="13" y="13" width="3" height="3" fill="#334155"/>
  </svg>`,

  'iron.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" shape-rendering="crispEdges">
    <rect width="24" height="24" fill="none"/>
    <rect x="4" y="9" width="16" height="8" fill="#0f172a"/>
    <rect x="6" y="8" width="12" height="8" fill="#334155"/>
    <rect x="7" y="9" width="10" height="5" fill="#64748b"/>
    <rect x="8" y="9" width="8" height="2" fill="#cbd5e1"/>
    <rect x="5" y="15" width="14" height="2" fill="#1e293b"/>
  </svg>`,

  'cloth.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" shape-rendering="crispEdges">
    <rect width="24" height="24" fill="none"/>
    <rect x="5" y="8" width="14" height="10" fill="#1e1b4b"/>
    <rect x="6" y="7" width="12" height="11" fill="#312e81"/>
    <rect x="7" y="8" width="10" height="9" fill="#4338ca"/>
    <rect x="8" y="9" width="7" height="6" fill="#6366f1"/>
    <rect x="16" y="7" width="2" height="11" fill="#facc15"/>
  </svg>`,

  'tools.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" shape-rendering="crispEdges">
    <rect width="24" height="24" fill="none"/>
    <rect x="7" y="5" width="10" height="5" fill="#0f172a"/>
    <rect x="8" y="6" width="8" height="3" fill="#475569"/>
    <rect x="9" y="7" width="5" height="1" fill="#cbd5e1"/>
    <rect x="11" y="10" width="2" height="10" fill="#78350f"/>
    <rect x="11" y="15" width="2" height="4" fill="#92400e"/>
  </svg>`,

  'swords.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" shape-rendering="crispEdges">
    <rect width="24" height="24" fill="none"/>
    <rect x="11" y="3" width="2" height="12" fill="#e2e8f0"/>
    <rect x="10" y="4" width="4" height="10" fill="#94a3b8"/>
    <rect x="11" y="3" width="1" height="12" fill="#ffffff"/>
    <rect x="7" y="14" width="10" height="2" fill="#eab308"/>
    <rect x="11" y="16" width="2" height="4" fill="#78350f"/>
    <rect x="10" y="20" width="4" height="2" fill="#ca8a04"/>
  </svg>`,

  'herbs.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" shape-rendering="crispEdges">
    <rect width="24" height="24" fill="none"/>
    <rect x="11" y="14" width="2" height="7" fill="#78350f"/>
    <rect x="7" y="7" width="5" height="5" fill="#14532d"/>
    <rect x="12" y="5" width="5" height="5" fill="#16a34a"/>
    <rect x="8" y="8" width="4" height="4" fill="#22c55e"/>
    <rect x="13" y="6" width="3" height="3" fill="#86efac"/>
    <rect x="6" y="12" width="4" height="4" fill="#15803d"/>
    <rect x="14" y="11" width="4" height="4" fill="#16a34a"/>
    <rect x="9" y="14" width="6" height="2" fill="#ca8a04"/>
  </svg>`,

  'spices.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" shape-rendering="crispEdges">
    <rect width="24" height="24" fill="none"/>
    <rect x="5" y="8" width="14" height="12" fill="#7c2d12"/>
    <rect x="6" y="9" width="12" height="10" fill="#c2410c"/>
    <rect x="7" y="10" width="10" height="8" fill="#ea580c"/>
    <rect x="8" y="11" width="8" height="6" fill="#f97316"/>
    <rect x="9" y="4" width="6" height="4" fill="#eab308"/>
    <rect x="10" y="3" width="4" height="2" fill="#ca8a04"/>
    <rect x="8" y="13" width="8" height="2" fill="#fde047"/>
  </svg>`,

  'silk.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" shape-rendering="crispEdges">
    <rect width="24" height="24" fill="none"/>
    <rect x="4" y="7" width="16" height="11" fill="#4a044e"/>
    <rect x="5" y="8" width="14" height="9" fill="#86198f"/>
    <rect x="6" y="9" width="12" height="7" fill="#c026d3"/>
    <rect x="7" y="10" width="10" height="5" fill="#e879f9"/>
    <rect x="8" y="11" width="7" height="3" fill="#f0abfc"/>
    <rect x="5" y="16" width="14" height="2" fill="#facc15"/>
  </svg>`,

  'jewelry.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" shape-rendering="crispEdges">
    <rect width="24" height="24" fill="none"/>
    <circle cx="12" cy="14" r="6" fill="none" stroke="#ca8a04" stroke-width="2"/>
    <circle cx="12" cy="14" r="5" fill="none" stroke="#facc15" stroke-width="1.5"/>
    <rect x="9" y="4" width="6" height="6" fill="#991b1b"/>
    <rect x="10" y="5" width="4" height="4" fill="#ef4444"/>
    <rect x="11" y="6" width="2" height="2" fill="#fecaca"/>
    <rect x="8" y="7" width="2" height="2" fill="#fde047"/>
    <rect x="14" y="7" width="2" height="2" fill="#fde047"/>
  </svg>`,

  'horses.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" shape-rendering="crispEdges">
    <rect width="24" height="24" fill="none"/>
    <rect x="7" y="6" width="10" height="12" fill="#451a03"/>
    <rect x="8" y="7" width="8" height="10" fill="#78350f"/>
    <rect x="9" y="8" width="6" height="8" fill="#92400e"/>
    <rect x="6" y="10" width="5" height="6" fill="#78350f"/>
    <rect x="5" y="13" width="4" height="4" fill="#451a03"/>
    <rect x="14" y="4" width="3" height="4" fill="#1c1917"/>
    <rect x="8" y="9" width="2" height="2" fill="#0f172a"/>
    <rect x="7" y="11" width="5" height="1" fill="#facc15"/>
  </svg>`
};

Object.entries(items).forEach(([filename, svg]) => {
  writeSvg(`items/${filename}`, svg);
});

// 2. UI ASSETS
const ui: Record<string, string> = {
  'wood_panel.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" shape-rendering="crispEdges">
    <rect width="48" height="48" fill="#1a0f0a"/>
    <rect x="2" y="2" width="44" height="44" fill="#3b2214"/>
    <rect x="4" y="4" width="40" height="40" fill="#452614"/>
    <rect x="4" y="4" width="40" height="2" fill="#693b1f"/>
    <rect x="4" y="4" width="2" height="40" fill="#693b1f"/>
    <rect x="42" y="4" width="2" height="40" fill="#24140a"/>
    <rect x="4" y="42" width="40" height="2" fill="#24140a"/>
    <!-- Iron corner rivets -->
    <rect x="5" y="5" width="2" height="2" fill="#94a3b8"/>
    <rect x="41" y="5" width="2" height="2" fill="#94a3b8"/>
    <rect x="5" y="41" width="2" height="2" fill="#94a3b8"/>
    <rect x="41" y="41" width="2" height="2" fill="#94a3b8"/>
  </svg>`,

  'parchment_scroll.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" shape-rendering="crispEdges">
    <rect width="48" height="48" fill="none"/>
    <rect x="3" y="3" width="42" height="42" fill="#78350f"/>
    <rect x="5" y="5" width="38" height="38" fill="#ebd7b2"/>
    <rect x="7" y="7" width="34" height="34" fill="#fef3c7"/>
    <rect x="7" y="7" width="34" height="2" fill="#ffffff"/>
    <rect x="7" y="39" width="34" height="2" fill="#d4b988"/>
  </svg>`,

  'inventory_slot.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <rect width="32" height="32" fill="#140b07"/>
    <rect x="2" y="2" width="28" height="28" fill="#26160e"/>
    <rect x="3" y="3" width="26" height="26" fill="#1a0f0a"/>
    <rect x="3" y="3" width="26" height="2" fill="#110906"/>
    <rect x="3" y="3" width="2" height="26" fill="#110906"/>
    <rect x="27" y="3" width="2" height="26" fill="#3b2214"/>
    <rect x="3" y="27" width="26" height="2" fill="#3b2214"/>
    <!-- Golden corners -->
    <rect x="3" y="3" width="3" height="3" fill="#ca8a04"/>
    <rect x="26" y="3" width="3" height="3" fill="#ca8a04"/>
    <rect x="3" y="26" width="3" height="3" fill="#ca8a04"/>
    <rect x="26" y="26" width="3" height="3" fill="#ca8a04"/>
  </svg>`,

  'inventory_slot_active.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <rect width="32" height="32" fill="#854d0e"/>
    <rect x="2" y="2" width="28" height="28" fill="#ca8a04"/>
    <rect x="3" y="3" width="26" height="26" fill="#facc15"/>
    <rect x="4" y="4" width="24" height="24" fill="#2d190f"/>
    <rect x="5" y="5" width="22" height="22" fill="#3b2214"/>
  </svg>`,

  'coin.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" shape-rendering="crispEdges">
    <rect width="20" height="20" fill="none"/>
    <circle cx="10" cy="10" r="8" fill="#713f12"/>
    <circle cx="10" cy="10" r="7" fill="#ca8a04"/>
    <circle cx="10" cy="10" r="6" fill="#facc15"/>
    <!-- Embossed crown -->
    <rect x="7" y="9" width="6" height="4" fill="#b45309"/>
    <rect x="7" y="8" width="1" height="2" fill="#854d0e"/>
    <rect x="12" y="8" width="1" height="2" fill="#854d0e"/>
    <rect x="9.5" y="7" width="1" height="2" fill="#854d0e"/>
    <rect x="6" y="6" width="3" height="2" fill="#fef08a"/>
  </svg>`,

  'button_wood.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 24" shape-rendering="crispEdges">
    <rect width="64" height="24" fill="#140b07"/>
    <rect x="2" y="2" width="60" height="20" fill="#5c371e"/>
    <rect x="3" y="3" width="58" height="18" fill="#452614"/>
    <rect x="3" y="3" width="58" height="2" fill="#784224"/>
    <rect x="3" y="19" width="58" height="2" fill="#24140a"/>
  </svg>`,

  'button_buy.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 24" shape-rendering="crispEdges">
    <rect width="64" height="24" fill="#052e16"/>
    <rect x="2" y="2" width="60" height="20" fill="#15803d"/>
    <rect x="3" y="3" width="58" height="18" fill="#166534"/>
    <rect x="3" y="3" width="58" height="2" fill="#4ade80"/>
    <rect x="3" y="19" width="58" height="2" fill="#14532d"/>
  </svg>`,

  'button_sell.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 24" shape-rendering="crispEdges">
    <rect width="64" height="24" fill="#450a0a"/>
    <rect x="2" y="2" width="60" height="20" fill="#b91c1c"/>
    <rect x="3" y="3" width="58" height="18" fill="#991b1b"/>
    <rect x="3" y="3" width="58" height="2" fill="#f87171"/>
    <rect x="3" y="19" width="58" height="2" fill="#7f1d1d"/>
  </svg>`
};

Object.entries(ui).forEach(([filename, svg]) => {
  writeSvg(`ui/${filename}`, svg);
});

// 3. ICONS
const icons: Record<string, string> = {
  'market.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" shape-rendering="crispEdges">
    <rect width="24" height="24" fill="none"/>
    <rect x="3" y="5" width="18" height="4" fill="#b45309"/>
    <rect x="3" y="5" width="3" height="4" fill="#dc2626"/>
    <rect x="9" y="5" width="3" height="4" fill="#dc2626"/>
    <rect x="15" y="5" width="3" height="4" fill="#dc2626"/>
    <rect x="5" y="9" width="14" height="11" fill="#78350f"/>
    <rect x="7" y="11" width="10" height="7" fill="#451a03"/>
    <rect x="9" y="13" width="6" height="5" fill="#ca8a04"/>
  </svg>`,

  'warehouse.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" shape-rendering="crispEdges">
    <rect width="24" height="24" fill="none"/>
    <rect x="3" y="8" width="18" height="13" fill="#1e293b"/>
    <rect x="4" y="9" width="16" height="11" fill="#475569"/>
    <polygon points="12,2 2,9 22,9" fill="#991b1b"/>
    <polygon points="12,4 4,9 20,9" fill="#dc2626"/>
    <rect x="8" y="12" width="8" height="8" fill="#78350f"/>
    <rect x="9" y="13" width="6" height="7" fill="#ca8a04"/>
  </svg>`,

  'map.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" shape-rendering="crispEdges">
    <rect width="24" height="24" fill="none"/>
    <polygon points="2,4 8,2 16,5 22,3 22,20 16,22 8,19 2,21" fill="#d4b988"/>
    <polygon points="3,5 8,3 15,6 21,4 21,19 15,21 8,18 3,20" fill="#fef3c7"/>
    <path d="M6,10 Q12,8 14,14 T18,12" fill="none" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="2,2"/>
    <rect x="17" y="11" width="3" height="3" fill="#dc2626"/>
  </svg>`,

  'merchants.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" shape-rendering="crispEdges">
    <rect width="24" height="24" fill="none"/>
    <!-- Two pixel busts -->
    <circle cx="8" cy="8" r="4" fill="#fbcfe8"/>
    <rect x="4" y="13" width="8" height="8" fill="#2563eb"/>
    <circle cx="16" cy="8" r="4" fill="#fed7aa"/>
    <rect x="12" y="13" width="8" height="8" fill="#16a34a"/>
    <rect x="9" y="15" width="6" height="3" fill="#ca8a04"/>
  </svg>`,

  'events.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" shape-rendering="crispEdges">
    <rect width="24" height="24" fill="none"/>
    <rect x="4" y="3" width="16" height="18" fill="#d4b988"/>
    <rect x="5" y="4" width="14" height="16" fill="#fef3c7"/>
    <rect x="7" y="7" width="10" height="2" fill="#78350f"/>
    <rect x="7" y="11" width="10" height="1.5" fill="#a16207"/>
    <rect x="7" y="14" width="7" height="1.5" fill="#a16207"/>
    <circle cx="15" cy="16" r="2.5" fill="#dc2626"/>
  </svg>`
};

Object.entries(icons).forEach(([filename, svg]) => {
  writeSvg(`icons/${filename}`, svg);
});

// 4. CHARACTERS PORTRAITS & SPRITES
const characters: Record<string, string> = {
  'tomas.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <rect width="32" height="32" fill="#1c1009"/>
    <!-- Straw Hat -->
    <rect x="6" y="6" width="20" height="3" fill="#ca8a04"/>
    <rect x="10" y="3" width="12" height="4" fill="#eab308"/>
    <!-- Face -->
    <rect x="10" y="9" width="12" height="10" fill="#fed7aa"/>
    <rect x="12" y="11" width="2" height="2" fill="#451a03"/>
    <rect x="18" y="11" width="2" height="2" fill="#451a03"/>
    <!-- Grey Beard -->
    <rect x="10" y="15" width="12" height="7" fill="#cbd5e1"/>
    <rect x="12" y="20" width="8" height="4" fill="#94a3b8"/>
    <!-- Green Tunic -->
    <rect x="6" y="22" width="20" height="10" fill="#15803d"/>
    <rect x="12" y="22" width="8" height="10" fill="#166534"/>
  </svg>`,

  'gunther.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <rect width="32" height="32" fill="#1c1009"/>
    <!-- Dark Hair -->
    <rect x="9" y="4" width="14" height="6" fill="#1c1917"/>
    <!-- Face -->
    <rect x="9" y="8" width="14" height="11" fill="#f5d0b0"/>
    <rect x="11" y="11" width="2" height="2" fill="#1c1917"/>
    <rect x="19" y="11" width="2" height="2" fill="#1c1917"/>
    <!-- Black Beard -->
    <rect x="8" y="15" width="16" height="8" fill="#1c1917"/>
    <!-- Leather Apron & Muscular Shoulders -->
    <rect x="5" y="22" width="22" height="10" fill="#451a03"/>
    <rect x="10" y="22" width="12" height="10" fill="#78350f"/>
    <!-- Iron Tongs/Hammer in background -->
    <rect x="25" y="12" width="3" height="16" fill="#64748b"/>
  </svg>`,

  'hilda.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <rect width="32" height="32" fill="#1c1009"/>
    <!-- Baker Bonnet -->
    <rect x="8" y="3" width="16" height="7" fill="#f8fafc"/>
    <rect x="6" y="7" width="20" height="3" fill="#e2e8f0"/>
    <!-- Blonde Strands & Face -->
    <rect x="9" y="10" width="14" height="10" fill="#fed7aa"/>
    <rect x="7" y="9" width="3" height="6" fill="#facc15"/>
    <rect x="22" y="9" width="3" height="6" fill="#facc15"/>
    <!-- Cheerful Eyes & Rosy Cheeks -->
    <rect x="11" y="12" width="2" height="2" fill="#1e3a8a"/>
    <rect x="19" y="12" width="2" height="2" fill="#1e3a8a"/>
    <rect x="9" y="14" width="3" height="2" fill="#fca5a5"/>
    <rect x="20" y="14" width="3" height="2" fill="#fca5a5"/>
    <!-- White Apron & Flour Dust -->
    <rect x="6" y="20" width="20" height="12" fill="#f8fafc"/>
    <rect x="10" y="20" width="12" height="12" fill="#ffffff"/>
  </svg>`,

  'barnaby.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <rect width="32" height="32" fill="#1c1009"/>
    <!-- Weathered Fisher Cap -->
    <rect x="8" y="5" width="16" height="5" fill="#0369a1"/>
    <rect x="6" y="8" width="20" height="3" fill="#0284c7"/>
    <!-- Face with Eyepatch -->
    <rect x="9" y="10" width="14" height="10" fill="#d97706"/>
    <rect x="11" y="12" width="3" height="3" fill="#0f172a"/>
    <rect x="18" y="12" width="2" height="2" fill="#0284c7"/>
    <!-- Grizzled Grey Beard -->
    <rect x="9" y="16" width="14" height="6" fill="#64748b"/>
    <!-- Oilskin Vest -->
    <rect x="6" y="22" width="20" height="10" fill="#eab308"/>
    <rect x="11" y="22" width="10" height="10" fill="#ca8a04"/>
  </svg>`,

  'althea.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <rect width="32" height="32" fill="#1c1009"/>
    <!-- Emerald Hood -->
    <rect x="7" y="4" width="18" height="16" fill="#065f46"/>
    <rect x="9" y="6" width="14" height="12" fill="#047857"/>
    <!-- Mysterious Face -->
    <rect x="11" y="9" width="10" height="9" fill="#fce7f3"/>
    <rect x="12" y="12" width="2" height="2" fill="#10b981"/>
    <rect x="18" y="12" width="2" height="2" fill="#10b981"/>
    <!-- Cloak & Herb Pouch -->
    <rect x="5" y="19" width="22" height="13" fill="#064e3b"/>
    <circle cx="16" cy="24" r="2.5" fill="#ca8a04"/>
  </svg>`,

  'rashid.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <rect width="32" height="32" fill="#1c1009"/>
    <!-- Turban with Jewel -->
    <rect x="7" y="3" width="18" height="9" fill="#f8fafc"/>
    <rect x="8" y="4" width="16" height="7" fill="#ffffff"/>
    <rect x="15" y="5" width="3" height="3" fill="#dc2626"/>
    <!-- Face & Trimmed Beard -->
    <rect x="10" y="11" width="12" height="10" fill="#b45309"/>
    <rect x="11" y="13" width="2" height="2" fill="#1c1917"/>
    <rect x="19" y="13" width="2" height="2" fill="#1c1917"/>
    <rect x="11" y="17" width="10" height="4" fill="#1c1917"/>
    <!-- Silk Robe with Gold Trim -->
    <rect x="6" y="21" width="20" height="11" fill="#7c2d12"/>
    <rect x="13" y="21" width="6" height="11" fill="#facc15"/>
  </svg>`,

  'vivienne.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <rect width="32" height="32" fill="#1c1009"/>
    <!-- Aristocratic Coiffure -->
    <rect x="9" y="3" width="14" height="7" fill="#78350f"/>
    <!-- Face -->
    <rect x="10" y="9" width="12" height="11" fill="#fed7aa"/>
    <rect x="12" y="12" width="2" height="2" fill="#4338ca"/>
    <rect x="18" y="12" width="2" height="2" fill="#4338ca"/>
    <rect x="14" y="16" width="4" height="2" fill="#be123c"/>
    <!-- Velvet Corset & Pearl Necklace -->
    <rect x="6" y="20" width="20" height="12" fill="#881337"/>
    <rect x="11" y="20" width="10" height="3" fill="#f8fafc"/>
  </svg>`,

  'cedric.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <rect width="32" height="32" fill="#1c1009"/>
    <!-- Tonsure Haircut -->
    <rect x="8" y="5" width="16" height="6" fill="#78350f"/>
    <rect x="11" y="4" width="10" height="4" fill="#fcd34d"/>
    <!-- Kind Face -->
    <rect x="10" y="9" width="12" height="11" fill="#fde68a"/>
    <rect x="12" y="12" width="2" height="2" fill="#451a03"/>
    <rect x="18" y="12" width="2" height="2" fill="#451a03"/>
    <!-- Brown Habit & Wooden Cross -->
    <rect x="6" y="20" width="20" height="12" fill="#78350f"/>
    <rect x="14" y="22" width="4" height="6" fill="#ca8a04"/>
  </svg>`,

  'giles.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <rect width="32" height="32" fill="#1c1009"/>
    <!-- Velvet Cap with Feather -->
    <rect x="8" y="5" width="16" height="5" fill="#581c87"/>
    <rect x="22" y="3" width="4" height="6" fill="#facc15"/>
    <!-- Face with Monocle -->
    <rect x="9" y="10" width="14" height="10" fill="#fef08a"/>
    <circle cx="12" cy="13" r="2.5" fill="none" stroke="#ca8a04" stroke-width="1.5"/>
    <rect x="18" y="12" width="2" height="2" fill="#1e1b4b"/>
    <!-- Fur Mantle & Gold Chains -->
    <rect x="6" y="20" width="20" height="12" fill="#4c1d95"/>
    <rect x="10" y="22" width="12" height="4" fill="#facc15"/>
  </svg>`,

  'roderick.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <rect width="32" height="32" fill="#1c1009"/>
    <!-- Leather Helm / Hat -->
    <rect x="8" y="4" width="16" height="6" fill="#451a03"/>
    <!-- Scarred Veteran Face -->
    <rect x="9" y="9" width="14" height="11" fill="#f59e0b"/>
    <rect x="11" y="12" width="2" height="2" fill="#1c1917"/>
    <rect x="18" y="12" width="2" height="2" fill="#1c1917"/>
    <path d="M10,11 L14,17" stroke="#991b1b" stroke-width="1"/>
    <!-- Chainmail & Cloak -->
    <rect x="6" y="20" width="20" height="12" fill="#64748b"/>
    <rect x="11" y="20" width="10" height="12" fill="#b91c1c"/>
  </svg>`
};

Object.entries(characters).forEach(([filename, svg]) => {
  writeSvg(`characters/${filename}`, svg);
});

console.log('Successfully generated all pixel art SVG assets!');
