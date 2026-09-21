import React, { useEffect, useRef, useState, useMemo } from 'react';
import { LocationId, Season, Weather } from '../types';
import { getLocationBackground, getCharacterPortrait, getStallImage, UI_ASSETS } from '../utils/assets';
import { MERCHANTS } from '../data/merchants';

interface PixelCanvasMarketProps {
  currentLocationId: LocationId;
  season: Season;
  weather: Weather;
  currentDay: number;
  onSelectMerchant: (merchantId: string) => void;
}

interface Stall {
  id: string;
  name: string;
  owner: string;
  merchantId: string;
  portraitKey: string;
  x: number; // percentage coordinates (0 - 1000)
  y: number;
  width: number;
  height: number;
  specialties: string;
  colorTheme: string;
}

interface Walker {
  x: number;
  y: number;
  speed: number;
  direction: 1 | -1;
  portraitKey: string;
  frame: number;
  pauseTimer: number;
  bubbleText?: string;
  bubbleTimer: number;
  clothingColor: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  type: 'smoke' | 'spark' | 'rain' | 'snow';
  color: string;
  size: number;
}

export const PixelCanvasMarket: React.FC<PixelCanvasMarketProps> = ({
  currentLocationId,
  season,
  weather,
  currentDay,
  onSelectMerchant
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hoveredStall, setHoveredStall] = useState<Stall | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Background image ref
  const bgImageRef = useRef<HTMLImageElement | null>(null);
  const portraitsCache = useRef<Record<string, HTMLImageElement>>({});
  const stallsCache = useRef<Record<string, HTMLImageElement>>({});

  // Market Stalls positions laid out across the cobblestone square
  const stalls: Stall[] = useMemo(() => {
    if (currentLocationId === 'harbor') {
      return [
        {
          id: 'stall_barnaby',
          name: 'Fish Quay',
          owner: 'Barnaby',
          merchantId: 'fishmonger_barnaby',
          portraitKey: 'barnaby',
          x: 140,
          y: 330,
          width: 140,
          height: 110,
          specialties: 'Fish, Salt, Timber',
          colorTheme: '#0284c7'
        },
        {
          id: 'stall_rashid',
          name: 'Overseas Pavilion',
          owner: 'Rashid Al-Mansur',
          merchantId: 'spice_rashid',
          portraitKey: 'rashid',
          x: 480,
          y: 320,
          width: 150,
          height: 115,
          specialties: 'Spices, Silk',
          colorTheme: '#ea580c'
        },
        {
          id: 'stall_tomas_harbor',
          name: 'Grain Wagons',
          owner: 'Old Tomas',
          merchantId: 'farmer_tomas',
          portraitKey: 'tomas',
          x: 760,
          y: 340,
          width: 130,
          height: 105,
          specialties: 'Grain, Apples',
          colorTheme: '#15803d'
        }
      ];
    }

    // Default: Market Square
    return [
      {
        id: 'stall_tomas',
        name: "Tomas's Produce",
        owner: 'Old Tomas',
        merchantId: 'farmer_tomas',
        portraitKey: 'tomas',
        x: 80,
        y: 280,
        width: 135,
        height: 110,
        specialties: 'Grain, Flour, Apples',
        colorTheme: '#15803d'
      },
      {
        id: 'stall_hilda',
        name: "Hilda's Bakery",
        owner: 'Hilda the Baker',
        merchantId: 'baker_hilda',
        portraitKey: 'hilda',
        x: 270,
        y: 260,
        width: 135,
        height: 110,
        specialties: 'Fresh Bread, Flour',
        colorTheme: '#ea580c'
      },
      {
        id: 'stall_gunther',
        name: "Gunther's Forge",
        owner: 'Master Gunther',
        merchantId: 'blacksmith_gunther',
        portraitKey: 'gunther',
        x: 480,
        y: 245,
        width: 145,
        height: 120,
        specialties: 'Iron, Swords, Tools',
        colorTheme: '#991b1b'
      },
      {
        id: 'stall_althea',
        name: "Althea's Herbs",
        owner: 'Mother Althea',
        merchantId: 'herbalist_althea',
        portraitKey: 'althea',
        x: 690,
        y: 270,
        width: 135,
        height: 110,
        specialties: 'Medicinal Herbs, Remedies',
        colorTheme: '#047857'
      },
      {
        id: 'stall_barnaby_market',
        name: "Barnaby's Stalls",
        owner: 'Barnaby',
        merchantId: 'fishmonger_barnaby',
        portraitKey: 'barnaby',
        x: 870,
        y: 300,
        width: 130,
        height: 105,
        specialties: 'Salted Fish, Rock Salt',
        colorTheme: '#0369a1'
      }
    ];
  }, [currentLocationId]);

  // Preload background image
  useEffect(() => {
    const bg = new Image();
    bg.src = getLocationBackground(currentLocationId);
    bg.onload = () => {
      bgImageRef.current = bg;
    };
  }, [currentLocationId]);

  // Preload merchant portraits and stalls
  useEffect(() => {
    MERCHANTS.forEach((m) => {
      if (!portraitsCache.current[m.portraitKey]) {
        const img = new Image();
        img.src = getCharacterPortrait(m.portraitKey);
        portraitsCache.current[m.portraitKey] = img;
      }
      if (!stallsCache.current[m.portraitKey]) {
        const stallImg = new Image();
        stallImg.src = getStallImage(m.portraitKey);
        stallsCache.current[m.portraitKey] = stallImg;
      }
    });
  }, []);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Virtual Coordinate Space: 1080 x 500 pixels
    const VW = 1080;
    const VH = 500;
    canvas.width = VW;
    canvas.height = VH;

    let animId: number;
    let tick = 0;

    // Townfolk Walking around the square
    const bubbles = [
      'Fresh loaves of bread!',
      'Grain prices are climbing...',
      'A trade sloop docked in harbor!',
      'The smith hammers cold steel!',
      'A fine day for bartering.',
      'Where to buy cheap salt?',
      'Winter draws near, guard your oats.',
      'Royal decree regarding tariffs!'
    ];

    const walkers: Walker[] = [
      { x: 150, y: 410, speed: 0.8, direction: 1, portraitKey: 'tomas', frame: 0, pauseTimer: 0, bubbleTimer: 180, bubbleText: 'Fresh harvest!', clothingColor: '#16a34a' },
      { x: 380, y: 440, speed: 0.6, direction: -1, portraitKey: 'hilda', frame: 0, pauseTimer: 0, bubbleTimer: 0, clothingColor: '#dc2626' },
      { x: 620, y: 420, speed: 0.75, direction: 1, portraitKey: 'althea', frame: 0, pauseTimer: 0, bubbleTimer: 280, bubbleText: 'Grain prices are climbing...', clothingColor: '#059669' },
      { x: 840, y: 450, speed: 0.5, direction: -1, portraitKey: 'barnaby', frame: 0, pauseTimer: 0, bubbleTimer: 0, clothingColor: '#2563eb' },
      { x: 260, y: 465, speed: 0.65, direction: 1, portraitKey: 'rashid', frame: 0, pauseTimer: 0, bubbleTimer: 90, bubbleText: 'Exotic spices!', clothingColor: '#7c2d12' }
    ];

    // Atmospheric Particles
    const particles: Particle[] = [];

    const render = () => {
      tick++;

      // Crisp pixel rendering without blurring
      ctx.imageSmoothingEnabled = false;

      // Clear Canvas
      ctx.clearRect(0, 0, VW, VH);

      // 1. DRAW SCENE BACKGROUND
      if (bgImageRef.current && bgImageRef.current.complete) {
        ctx.drawImage(bgImageRef.current, 0, 0, VW, VH);
      } else {
        // Fallback cobblestone backdrop
        ctx.fillStyle = '#261a14';
        ctx.fillRect(0, 0, VW, VH);
      }

      // 2. AMBIENT PARTICLES SPAWNING (Chimney smoke, sparks, weather)
      if (tick % 6 === 0 && particles.length < 120) {
        // Blacksmith smoke / sparks
        particles.push({
          x: 540 + (Math.random() * 20 - 10),
          y: 240,
          vx: (Math.random() - 0.5) * 0.8,
          vy: -0.9 - Math.random() * 0.8,
          life: 0,
          maxLife: 60 + Math.random() * 40,
          type: 'smoke',
          color: 'rgba(100, 116, 139, 0.45)',
          size: 4 + Math.random() * 4
        });

        // Bakery oven smoke
        particles.push({
          x: 330 + (Math.random() * 15 - 7),
          y: 250,
          vx: (Math.random() - 0.5) * 0.6,
          vy: -0.8 - Math.random() * 0.6,
          life: 0,
          maxLife: 50 + Math.random() * 30,
          type: 'smoke',
          color: 'rgba(226, 232, 240, 0.4)',
          size: 3 + Math.random() * 3
        });

        // Forge sparks
        if (Math.random() > 0.4) {
          particles.push({
            x: 525 + (Math.random() * 16 - 8),
            y: 310,
            vx: (Math.random() - 0.5) * 2.2,
            vy: -1.5 - Math.random() * 1.5,
            life: 0,
            maxLife: 20 + Math.random() * 15,
            type: 'spark',
            color: '#facc15',
            size: 2
          });
        }
      }

      // Weather Particles (Rain / Snow)
      if (weather === 'rainy' || weather === 'stormy') {
        if (particles.length < 180) {
          for (let i = 0; i < 4; i++) {
            particles.push({
              x: Math.random() * VW,
              y: 0,
              vx: -1.5,
              vy: 7 + Math.random() * 4,
              life: 0,
              maxLife: 70,
              type: 'rain',
              color: '#93c5fd',
              size: 2
            });
          }
        }
      } else if (season === 'winter' || weather === 'snowy') {
        if (particles.length < 150 && tick % 3 === 0) {
          particles.push({
            x: Math.random() * VW,
            y: 0,
            vx: (Math.random() - 0.5) * 1.2,
            vy: 1.2 + Math.random() * 1.5,
            life: 0,
            maxLife: 160,
            type: 'snow',
            color: '#ffffff',
            size: 2 + Math.random() * 2
          });
        }
      }

      // 3. DRAW INTERACTIVE STALLS & MERCHANTS
      stalls.forEach((stall) => {
        const isHovered = hoveredStall?.id === stall.id;

        // Stall highlight aura on hover
        if (isHovered) {
          ctx.strokeStyle = '#fde047';
          ctx.lineWidth = 3;
          ctx.strokeRect(stall.x - 4, stall.y - 4, stall.width + 8, stall.height + 8);

          // Golden corner pins
          ctx.fillStyle = '#facc15';
          ctx.fillRect(stall.x - 6, stall.y - 6, 6, 6);
          ctx.fillRect(stall.x + stall.width, stall.y - 6, 6, 6);
          ctx.fillRect(stall.x - 6, stall.y + stall.height, 6, 6);
          ctx.fillRect(stall.x + stall.width, stall.y + stall.height, 6, 6);
        }

        // Draw Stall Booth (Using generated pixel art image)
        const stallImg = stallsCache.current[stall.portraitKey];
        if (stallImg && stallImg.complete) {
          // Ground shadow
          ctx.fillStyle = 'rgba(12, 7, 4, 0.45)';
          ctx.beginPath();
          ctx.ellipse(stall.x + stall.width / 2, stall.y + stall.height - 4, stall.width * 0.46, 7, 0, 0, Math.PI * 2);
          ctx.fill();

          // Generated Stall graphic
          ctx.drawImage(stallImg, stall.x, stall.y, stall.width, stall.height);
        } else {
          // Wooden base fallback
          ctx.fillStyle = '#2b180d';
          ctx.fillRect(stall.x, stall.y + 40, stall.width, stall.height - 40);
          ctx.fillStyle = '#3d2414';
          ctx.fillRect(stall.x + 2, stall.y + 42, stall.width - 4, stall.height - 44);

          // Countertop plank
          ctx.fillStyle = '#5c371e';
          ctx.fillRect(stall.x - 4, stall.y + 40, stall.width + 8, 8);
          ctx.fillStyle = '#854d0e';
          ctx.fillRect(stall.x - 4, stall.y + 40, stall.width + 8, 2);

          // Canopy Awning (Striped cloth)
          const awningH = 28;
          ctx.fillStyle = stall.colorTheme;
          ctx.fillRect(stall.x, stall.y, stall.width, awningH);

          // Striped pattern on canopy
          ctx.fillStyle = '#fffbeb';
          const stripes = 5;
          const stripeW = stall.width / (stripes * 2);
          for (let s = 0; s < stripes; s++) {
            ctx.fillRect(stall.x + s * stripeW * 2, stall.y, stripeW, awningH);
          }

          // Canopy valance scalloped edge
          ctx.fillStyle = stall.colorTheme;
          for (let sx = 0; sx < stall.width; sx += 12) {
            ctx.fillRect(stall.x + sx, stall.y + awningH, 10, 4);
          }

          // Stall Poles
          ctx.fillStyle = '#1c0f08';
          ctx.fillRect(stall.x + 4, stall.y + awningH, 4, stall.height - awningH);
          ctx.fillRect(stall.x + stall.width - 8, stall.y + awningH, 4, stall.height - awningH);
        }

        // Merchant Portrait behind counter / at stall
        const portraitImg = portraitsCache.current[stall.portraitKey];
        if (portraitImg && portraitImg.complete) {
          // Bobbing animation
          const bob = Math.sin((tick + stall.x) * 0.08) * 2;
          const pw = 34;
          const ph = 34;
          const px = stall.x + stall.width - pw - 6;
          const py = stall.y + 6 + bob;

          // Portrait border frame
          ctx.fillStyle = '#1a0f0a';
          ctx.fillRect(px - 2, py - 2, pw + 4, ph + 4);
          ctx.drawImage(portraitImg, px, py, pw, ph);

          // Golden border
          ctx.strokeStyle = '#ca8a04';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(px - 1, py - 1, pw + 2, ph + 2);
        }

        // Hanging Trade Sign
        ctx.fillStyle = '#1a0f0a';
        ctx.fillRect(stall.x + 8, stall.y + stall.height - 18, stall.width - 16, 16);
        ctx.fillStyle = '#ebd7b2';
        ctx.fillRect(stall.x + 9, stall.y + stall.height - 17, stall.width - 18, 14);
        ctx.fillStyle = '#2b180d';
        ctx.font = 'bold 9px MedievalSharp, serif';
        ctx.textAlign = 'center';
        ctx.fillText(stall.owner, stall.x + stall.width / 2, stall.y + stall.height - 6);

        // Floating Indicator Arrow when hovered or clicked
        if (isHovered) {
          const bounce = Math.sin(tick * 0.15) * 4;
          ctx.fillStyle = '#fde047';
          ctx.beginPath();
          ctx.moveTo(stall.x + stall.width / 2, stall.y - 12 + bounce);
          ctx.lineTo(stall.x + stall.width / 2 - 8, stall.y - 24 + bounce);
          ctx.lineTo(stall.x + stall.width / 2 + 8, stall.y - 24 + bounce);
          ctx.closePath();
          ctx.fill();

          // Click prompt badge
          ctx.fillStyle = '#1a0f0a';
          ctx.fillRect(stall.x + stall.width / 2 - 45, stall.y - 44 + bounce, 90, 18);
          ctx.fillStyle = '#fef08a';
          ctx.font = 'bold 10px MedievalSharp, serif';
          ctx.fillText('Trade [Click]', stall.x + stall.width / 2, stall.y - 31 + bounce);
        }
      });

      // 4. UPDATE & DRAW WALKING CITIZENS (NPCs)
      walkers.forEach((w) => {
        if (w.pauseTimer > 0) {
          w.pauseTimer--;
        } else {
          w.x += w.speed * w.direction;
          w.frame += 0.12;

          // Screen bounds turnaround
          if (w.x > VW - 60) {
            w.direction = -1;
            w.pauseTimer = 30 + Math.random() * 40;
          } else if (w.x < 40) {
            w.direction = 1;
            w.pauseTimer = 30 + Math.random() * 40;
          }
        }

        // Draw Pixel Character Sprite
        const walkCycle = Math.sin(w.frame * 2);
        const legOffset = walkCycle * 3;
        const cy = w.y;
        const cx = w.x;

        // Shadow under feet
        ctx.fillStyle = 'rgba(15, 10, 8, 0.4)';
        ctx.beginPath();
        ctx.ellipse(cx, cy + 18, 10, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Legs & Boots
        ctx.fillStyle = '#451a03';
        ctx.fillRect(cx - 4 + legOffset, cy + 9, 3, 9);
        ctx.fillRect(cx + 2 - legOffset, cy + 9, 3, 9);

        // Body / Tunic
        ctx.fillStyle = w.clothingColor;
        ctx.fillRect(cx - 6, cy - 2, 12, 12);

        // Belt with pouch
        ctx.fillStyle = '#ca8a04';
        ctx.fillRect(cx - 6, cy + 6, 12, 2);
        ctx.fillRect(cx + 2, cy + 7, 3, 3);

        // Head / Hat
        ctx.fillStyle = '#fed7aa';
        ctx.fillRect(cx - 4, cy - 12, 8, 8);
        ctx.fillStyle = '#78350f';
        ctx.fillRect(cx - 5, cy - 14, 10, 3); // cap

        // Eyes (direction facing)
        ctx.fillStyle = '#1c1917';
        if (w.direction === 1) {
          ctx.fillRect(cx + 1, cy - 8, 2, 2);
        } else {
          ctx.fillRect(cx - 3, cy - 8, 2, 2);
        }

        // Speech Bubble
        if (w.bubbleTimer > 0) {
          w.bubbleTimer--;
          if (w.bubbleText) {
            const tw = ctx.measureText(w.bubbleText).width;
            const bw = Math.max(tw + 16, 60);
            const bh = 22;
            const bx = cx - bw / 2;
            const by = cy - 38;

            // Parchment Bubble Box
            ctx.fillStyle = '#1a0f0a';
            ctx.fillRect(bx - 1, by - 1, bw + 2, bh + 2);
            ctx.fillStyle = '#fef3c7';
            ctx.fillRect(bx, by, bw, bh);

            // Bubble Tail
            ctx.fillStyle = '#1a0f0a';
            ctx.fillRect(cx - 2, by + bh, 4, 4);
            ctx.fillStyle = '#fef3c7';
            ctx.fillRect(cx - 1, by + bh - 1, 2, 3);

            // Bubble Text
            ctx.fillStyle = '#2b180d';
            ctx.font = 'bold 10px MedievalSharp, serif';
            ctx.textAlign = 'center';
            ctx.fillText(w.bubbleText, cx, by + 15);
          }
        } else if (Math.random() < 0.003) {
          // Trigger random new speech bubble
          w.bubbleText = bubbles[Math.floor(Math.random() * bubbles.length)];
          w.bubbleTimer = 160;
        }
      });

      // 5. UPDATE & DRAW PARTICLES
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;

        if (p.life >= p.maxLife || p.y > VH) {
          particles.splice(i, 1);
          continue;
        }

        const alpha = 1 - p.life / p.maxLife;
        ctx.fillStyle = p.color;

        if (p.type === 'smoke') {
          ctx.globalAlpha = alpha * 0.6;
          ctx.fillRect(p.x, p.y, p.size * (1 + p.life / 30), p.size * (1 + p.life / 30));
          ctx.globalAlpha = 1;
        } else if (p.type === 'spark') {
          ctx.globalAlpha = alpha;
          ctx.fillRect(p.x, p.y, p.size, p.size);
          ctx.globalAlpha = 1;
        } else if (p.type === 'rain') {
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - 2, p.y + 6);
          ctx.stroke();
        } else if (p.type === 'snow') {
          ctx.fillStyle = p.color;
          ctx.fillRect(p.x, p.y, p.size, p.size);
        }
      }

      // 6. ATMOSPHERIC LIGHTING & WEATHER OVERLAYS
      if (weather === 'rainy' || weather === 'stormy') {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.25)';
        ctx.fillRect(0, 0, VW, VH);
      } else if (season === 'autumn') {
        ctx.fillStyle = 'rgba(180, 83, 9, 0.08)';
        ctx.fillRect(0, 0, VW, VH);
      } else if (season === 'winter') {
        ctx.fillStyle = 'rgba(148, 163, 184, 0.12)';
        ctx.fillRect(0, 0, VW, VH);
      }

      // Vignette / Wood Frame edge
      const grad = ctx.createRadialGradient(VW / 2, VH / 2, VW * 0.3, VW / 2, VH / 2, VW * 0.65);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(1, 'rgba(15, 8, 5, 0.55)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, VW, VH);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [stalls, weather, season, hoveredStall]);

  // Handle Mouse Hover & Click on Canvas
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = 1080 / rect.width;
    const scaleY = 500 / rect.height;

    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    // Check hit against stalls
    const hit = stalls.find(
      (s) =>
        mouseX >= s.x &&
        mouseX <= s.x + s.width &&
        mouseY >= s.y - 15 &&
        mouseY <= s.y + s.height
    );

    setHoveredStall(hit || null);
  };

  const handleMouseLeave = () => {
    setHoveredStall(null);
  };

  const handleClick = () => {
    if (hoveredStall) {
      onSelectMerchant(hoveredStall.merchantId);
    }
  };

  return (
    <section className="relative w-full rounded-xs overflow-hidden border-4 border-[#1a0f0a] bg-[#1a0f0a] shadow-2xl">
      {/* 1. SCENE HEADER BAR */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#2d180d] border-b-2 border-[#452614] text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#22c55e] rounded-full animate-ping"></span>
          <span className="font-medieval font-bold text-[#fde047] tracking-wider">
            {currentLocationId === 'harbor' ? 'HARBOR DOCKS & CARGO WHARF' : 'MARKETBURG TOWN SQUARE'}
          </span>
          <span className="text-[11px] text-[#ca8a04] hidden sm:inline">
            (Click on any stall to initiate trading)
          </span>
        </div>

        {/* Quick Zoom / Stall Jumper */}
        <div className="flex items-center gap-1">
          {stalls.map((s) => (
            <button
              key={s.id}
              onClick={() => onSelectMerchant(s.merchantId)}
              className="px-2 py-0.5 text-[10px] font-bold border border-[#5c371e] bg-[#1a0f0a] text-[#eedcc0] hover:border-[#ca8a04] hover:text-[#fde047] transition-all"
              title={`Approach: ${s.name}`}
            >
              {s.owner}
            </button>
          ))}
        </div>
      </div>

      {/* 2. INTERACTIVE CANVAS STAGE */}
      <div
        ref={containerRef}
        className="relative w-full aspect-[2.16/1] max-h-[480px] bg-black cursor-pointer overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          className="w-full h-full object-cover pixelated select-none"
        />

        {/* Dynamic Tooltip for Hovered Stall */}
        {hoveredStall && (
          <div
            className="absolute bottom-3 left-3 z-30 pointer-events-none flex items-center gap-3 p-2 bg-[#2d180d]/95 border-2 border-[#ca8a04] shadow-2xl animate-in fade-in duration-100"
            style={{ maxWidth: '340px' }}
          >
            <img
              src={getCharacterPortrait(hoveredStall.portraitKey)}
              alt={hoveredStall.owner}
              className="w-12 h-12 pixelated border-2 border-[#1a0f0a] bg-[#170c07]"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-medieval text-xs font-bold text-[#fde047] leading-none">
                  {hoveredStall.name}
                </h4>
                <span className="text-[10px] px-1 py-0.2 bg-[#15803d] text-[#f0fdf4] font-bold">
                  Open
                </span>
              </div>
              <p className="text-[11px] text-[#cbd5e1] mt-0.5 font-sans">
                Proprietor: <strong className="text-[#fde047]">{hoveredStall.owner}</strong>
              </p>
              <p className="text-[10px] text-[#fcd34d] truncate font-sans">
                Wares: {hoveredStall.specialties}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 3. SCENE BOTTOM DETAIL STRIP */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1 bg-[#1a0f0a] border-t-2 border-[#2b180d] text-[11px] text-[#a89279]">
        <div className="flex items-center gap-3">
          <span>
            📍 District: <strong className="text-[#eedcc0]">{currentLocationId}</strong>
          </span>
          <span>
            🌤️ Weather: <strong className="text-[#93c5fd]">{weather}</strong>
          </span>
          <span>
            🍂 Season: <strong className="text-[#fde047]">{season}</strong>
          </span>
        </div>
        <div className="text-[10px] text-[#ca8a04]">
          💡 Tip: Merchant prices fluctuate with seasons, kingdom affairs, and warehouse supplies!
        </div>
      </div>
    </section>
  );
};
