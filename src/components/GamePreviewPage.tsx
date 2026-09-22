import React, { useState, useEffect } from 'react';
import {
  CHARACTER_ASSETS,
  ENVIRONMENT_ASSETS,
  STALL_ASSETS,
  UI_ASSETS,
  getCharacterPortrait,
  getStallImage,
  getItemIcon
} from '../utils/assets';
import { MERCHANTS } from '../data/merchants';
import { LOCATIONS } from '../data/locations';
import { ITEMS } from '../data/items';
import { WAREHOUSE_UPGRADES, CART_UPGRADES } from '../data/ranks';
import { GoldCoinIcon, WaxSealBadge } from './PixelIcons';
import { SoundEngine } from '../utils/sound';
import {
  connectPhantom,
  disconnectPhantom,
  formatWalletAddress,
  fetchSolanaBalance,
  formatSolBalance
} from '../utils/phantom';
import { WalletDetailsModal } from './WalletDetailsModal';

interface GamePreviewPageProps {
  onStartGame: () => void;
  hasSavedGame?: boolean;
  walletConnected?: boolean;
  walletAddress?: string;
  walletBalance?: number | null;
  walletCluster?: string;
  isLoadingBalance?: boolean;
  onRefreshBalance?: () => void;
  onToggleWallet?: () => void;
  onConnectWallet?: () => void;
  onDisconnectWallet?: () => void;
}

export const GamePreviewPage: React.FC<GamePreviewPageProps> = ({
  onStartGame,
  hasSavedGame = false,
  walletConnected: externalWalletConnected,
  walletAddress: externalWalletAddress,
  walletBalance: externalWalletBalance,
  walletCluster: externalWalletCluster,
  isLoadingBalance: externalIsLoadingBalance,
  onRefreshBalance,
  onToggleWallet,
  onConnectWallet,
  onDisconnectWallet
}) => {
  const [selectedMerchantId, setSelectedMerchantId] = useState<string>('farmer_tomas');
  const [selectedLocationId, setSelectedLocationId] = useState<string>('market_square');
  const [itemCategoryFilter, setItemCategoryFilter] = useState<string>('all');
  const [localWalletConnected, setLocalWalletConnected] = useState<boolean>(false);
  const [localWalletAddress, setLocalWalletAddress] = useState<string>('');
  const [localWalletBalance, setLocalWalletBalance] = useState<number | null>(null);
  const [localIsLoadingBalance, setLocalIsLoadingBalance] = useState<boolean>(false);
  const [showWalletModal, setShowWalletModal] = useState<boolean>(false);

  const isWalletConnected =
    externalWalletConnected !== undefined ? externalWalletConnected : localWalletConnected;
  const currentWalletAddress =
    externalWalletAddress !== undefined ? externalWalletAddress : localWalletAddress;
  const currentBalance =
    externalWalletBalance !== undefined ? externalWalletBalance : localWalletBalance;
  const currentIsLoadingBalance =
    externalIsLoadingBalance !== undefined ? externalIsLoadingBalance : localIsLoadingBalance;

  const refreshLocalBalance = async (addr?: string) => {
    const target = addr || currentWalletAddress;
    if (!target) return;
    if (onRefreshBalance) {
      onRefreshBalance();
      return;
    }
    setLocalIsLoadingBalance(true);
    try {
      const res = await fetchSolanaBalance(target);
      if (res) {
        setLocalWalletBalance(res.balance);
      }
    } catch (err) {
      console.warn('Failed to load local balance', err);
    } finally {
      setLocalIsLoadingBalance(false);
    }
  };

  useEffect(() => {
    if (isWalletConnected && currentWalletAddress && externalWalletBalance === undefined) {
      refreshLocalBalance(currentWalletAddress);
    }
  }, [isWalletConnected, currentWalletAddress]);

  const selectedMerchant =
    MERCHANTS.find((m) => m.id === selectedMerchantId) || MERCHANTS[0];
  const selectedLocation =
    LOCATIONS[selectedLocationId as keyof typeof LOCATIONS] || LOCATIONS.market_square;

  const handleLaunch = () => {
    SoundEngine.playDawnBell();
    setTimeout(() => {
      SoundEngine.playCoin();
    }, 200);
    onStartGame();
  };

  const handleConnectWallet = async () => {
    SoundEngine.playCoin();
    if (onConnectWallet) {
      onConnectWallet();
      return;
    }
    if (onToggleWallet && !isWalletConnected) {
      onToggleWallet();
      return;
    }

    if (!isWalletConnected) {
      const res = await connectPhantom();
      if (res.success && res.address) {
        setLocalWalletAddress(res.address);
        setLocalWalletConnected(true);
        refreshLocalBalance(res.address);
      }
    } else {
      setShowWalletModal(true);
    }
  };

  // Filter items for showcase
  const filteredItems = ITEMS.filter((item) => {
    if (itemCategoryFilter === 'all') return true;
    return item.category === itemCategoryFilter;
  });

  return (
    <div className="min-h-screen bg-[#0d0907] text-[#eedcc0] font-medieval selection:bg-[#ca8a04] selection:text-[#1a0f0a]">
      {/* 1. TOP STICKY HEADER */}
      <header className="sticky top-0 z-50 pixel-box-wood px-4 py-2.5 bg-[#1a0f0a]/95 backdrop-blur-sm border-b-4 border-[#2b180d] shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 border-2 border-[#ca8a04] bg-[#1a0f0a] flex items-center justify-center shadow-lg overflow-hidden p-0.5">
              <img
                src={UI_ASSETS.gameLogo}
                alt="Goldbound Logo"
                className="w-full h-full object-contain pixelated"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-medieval text-lg sm:text-2xl font-bold text-[#fde047] tracking-wider leading-none">
                  GOLDBOUND
                </h1>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-[#991b1b] text-[#fef08a] border border-[#f59e0b] font-bold uppercase tracking-widest">
                  Merchant Tycoon
                </span>
              </div>
              <p className="text-[11px] text-[#ca8a04] tracking-wide font-sans">
                Medieval Market Trading & Economy Simulation
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-4 text-xs font-bold text-[#d4af37]">
            <a href="#overview" className="hover:text-[#fde047] transition-colors">
              Overview
            </a>
            <a href="#mechanics" className="hover:text-[#fde047] transition-colors">
              Mechanics
            </a>
            <a href="#characters" className="hover:text-[#fde047] transition-colors">
              Merchants
            </a>
            <a href="#shops" className="hover:text-[#fde047] transition-colors">
              Market Stalls
            </a>
            <a href="#buildings" className="hover:text-[#fde047] transition-colors">
              Buildings
            </a>
            <a href="#locations" className="hover:text-[#fde047] transition-colors">
              Districts
            </a>
            <a href="#commodities" className="hover:text-[#fde047] transition-colors">
              Wares
            </a>
          </nav>

          {/* Action Buttons: Connect Wallet & START GAME */}
          <div className="flex items-center gap-2.5">
            {isWalletConnected ? (
              <button
                onClick={() => {
                  SoundEngine.playWoodThud();
                  setShowWalletModal(true);
                }}
                id="top_connect_wallet_btn"
                className="px-3 py-1.5 text-xs font-bold font-sans border-2 border-[#22c55e] bg-[#14532d] hover:bg-[#166534] text-[#86efac] transition-all cursor-pointer flex items-center gap-2 shadow-[0_0_12px_rgba(34,197,94,0.4)]"
                title={`Phantom Connected: ${currentWalletAddress}. Click to view details and balance.`}
              >
                <span className="flex items-center gap-1.5 font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse"></span>
                  <span className="text-white">Phantom</span>
                </span>
                <span className="text-[#fde047] font-mono">
                  {formatWalletAddress(currentWalletAddress)}
                </span>
                <span className="bg-[#0f391f] border border-[#22c55e]/60 px-1.5 py-0.5 text-[11px] font-bold text-[#4ade80]">
                  {currentIsLoadingBalance ? '... SOL' : formatSolBalance(currentBalance)}
                </span>
              </button>
            ) : (
              <button
                onClick={handleConnectWallet}
                id="top_connect_wallet_btn"
                className="px-3 py-1.5 text-xs font-bold font-sans border-2 border-[#ca8a04] bg-[#2d180d] hover:bg-[#3d2414] text-[#fde047] transition-all cursor-pointer flex items-center gap-1.5"
                title="Connect Phantom Wallet"
              >
                <span>🟣</span>
                <span>Connect Phantom</span>
              </button>
            )}

            <button
              onClick={handleLaunch}
              id="header_start_game_btn"
              className="group relative flex items-center gap-2 px-4 py-2 bg-gradient-to-b from-[#ca8a04] via-[#a16207] to-[#713f12] text-[#fef08a] font-medieval font-bold text-sm sm:text-base border-2 border-[#fef08a] shadow-[0_0_15px_rgba(202,138,4,0.4)] hover:shadow-[0_0_25px_rgba(250,204,21,0.7)] hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer"
            >
              <span className="text-base group-hover:rotate-12 transition-transform">⚔️</span>
              <span className="tracking-wider">START GAME</span>
              <span className="hidden sm:inline text-xs text-[#fef9c3] font-sans">
                {hasSavedGame ? '(Continue)' : '(Play)'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO BANNER */}
      <section
        id="overview"
        className="relative min-h-[520px] flex items-center justify-center border-b-4 border-[#2b180d] overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(13,9,7,0.75), rgba(13,9,7,0.95)), url(${ENVIRONMENT_ASSETS.marketSquare})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-radial from-transparent via-[#0d0907]/50 to-[#0d0907]/90 pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 py-16 text-center flex flex-col items-center">
          {/* Royal Heraldic Badge */}
          <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-[#1a0f0a]/90 border-2 border-[#ca8a04] text-[#fde047] text-xs uppercase tracking-widest shadow-xl">
            <WaxSealBadge size={20} />
            <span>Medieval Merchant Tycoon & Economics</span>
            <WaxSealBadge size={20} />
          </div>

          <h1 className="font-medieval text-5xl sm:text-7xl md:text-8xl font-bold text-[#fde047] drop-shadow-[0_4px_14px_rgba(0,0,0,0.95)] tracking-wider mb-3">
            GOLDBOUND
          </h1>
          <p className="font-medieval text-xl sm:text-2xl text-[#fef08a] mb-5 tracking-wide max-w-2xl drop-shadow">
            Rise from an itinerant peddler to the Sovereign Merchant Magnate
          </p>

          <div className="max-w-2xl mb-8 bg-[#1a0f0a]/85 p-4 sm:p-5 border border-[#452614] shadow-2xl text-center space-y-3">
            <p className="text-[#d8c2a3] text-sm sm:text-base leading-relaxed font-sans">
              Begin your journey with an empty handcart and a handful of silver coins. Trade grain in
              pastoral villages, charter heavy overland caravans across bandit-infested ridges, negotiate
              with 10 guild merchants, build towering stone warehouses, and amass royal fortunes!
            </p>
            <div className="border-t border-[#3d2414] pt-2.5 flex items-center justify-center gap-2 text-xs font-sans text-[#a89279]">
              <span className="text-[#ca8a04]">✦</span>
              <span>
                <strong className="text-[#fde047]">Dual-Layer Concept:</strong> 100% playable as a classic offline medieval simulation with standard in-game gold, or connect a Phantom wallet to activate the optional on-chain merchant ledger and tokenized achievement registry.
              </span>
            </div>
          </div>

          {/* Primary CTA */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={handleLaunch}
              id="hero_start_game_btn"
              className="px-8 py-3.5 bg-gradient-to-b from-[#eab308] via-[#ca8a04] to-[#854d0e] text-[#1a0f0a] font-medieval font-bold text-xl sm:text-2xl border-4 border-[#fef08a] shadow-[0_0_30px_rgba(234,179,8,0.5)] hover:shadow-[0_0_40px_rgba(250,204,21,0.85)] hover:scale-105 active:scale-95 transition-all duration-150 flex items-center gap-3 cursor-pointer"
            >
              <span>⚔️</span>
              <span className="tracking-widest">START GAME NOW</span>
              <span>⚔️</span>
            </button>
            <a
              href="#mechanics"
              className="px-6 py-3.5 bg-[#1a0f0a]/90 text-[#eedcc0] font-medieval font-bold text-base border-2 border-[#5c371e] hover:border-[#ca8a04] hover:text-[#fde047] transition-all"
            >
              📜 Explore the Game
            </a>
          </div>

          {/* Key Feature Stats */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-3xl text-left">
            <div className="p-3 bg-[#1a0f0a]/90 border border-[#5c371e] flex items-center gap-3">
              <span className="text-2xl">💰</span>
              <div>
                <div className="text-[#fde047] font-bold text-sm">Living Economy</div>
                <div className="text-[11px] text-[#a89279] font-sans">Supply, Demand & Seasons</div>
              </div>
            </div>
            <div className="p-3 bg-[#1a0f0a]/90 border border-[#5c371e] flex items-center gap-3">
              <span className="text-2xl">🧔</span>
              <div>
                <div className="text-[#fde047] font-bold text-sm">10 Merchants</div>
                <div className="text-[11px] text-[#a89279] font-sans">Unique Personalities & Intel</div>
              </div>
            </div>
            <div className="p-3 bg-[#1a0f0a]/90 border border-[#5c371e] flex items-center gap-3">
              <span className="text-2xl">🐎</span>
              <div>
                <div className="text-[#fde047] font-bold text-sm">Trade Caravans</div>
                <div className="text-[11px] text-[#a89279] font-sans">Expeditions & Highwaymen</div>
              </div>
            </div>
            <div className="p-3 bg-[#1a0f0a]/90 border border-[#5c371e] flex items-center gap-3">
              <span className="text-2xl">🏰</span>
              <div>
                <div className="text-[#fde047] font-bold text-sm">5 Disticts</div>
                <div className="text-[11px] text-[#a89279] font-sans">From Harbor to Castle</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE HIGHLIGHTS & MECHANICS */}
      <section id="mechanics" className="max-w-7xl mx-auto px-4 py-14">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-widest text-[#ca8a04]">
            Core Gameplay Mechanics
          </span>
          <h2 className="font-medieval text-2xl sm:text-4xl font-bold text-[#fde047] mt-1">
            How Goldbound Works
          </h2>
          <div className="w-32 h-1 bg-[#ca8a04] mx-auto mt-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="pixel-box-wood p-5 border-2 border-[#5c371e] bg-[#1a0f0a] hover:border-[#ca8a04] transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#2d180d] border border-[#ca8a04] flex items-center justify-center text-xl">
                📈
              </div>
              <div>
                <h3 className="font-medieval text-base font-bold text-[#fde047]">
                  Dynamic Market Economy
                </h3>
                <span className="text-[10px] text-[#ca8a04] font-sans">Supply & Demand Equilibrium</span>
              </div>
            </div>
            <p className="text-xs text-[#d8c2a3] font-sans leading-relaxed">
              Commodity prices are not fixed. They fluctuate in response to player purchases, harvest
              surpluses, regional shortages, four rotating seasons, and sudden weather catastrophes.
              Buy low in provincial hamlets and sell high at the royal court!
            </p>
          </div>

          {/* Card 2 */}
          <div className="pixel-box-wood p-5 border-2 border-[#5c371e] bg-[#1a0f0a] hover:border-[#ca8a04] transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#2d180d] border border-[#ca8a04] flex items-center justify-center text-xl">
                🎨
              </div>
              <div>
                <h3 className="font-medieval text-base font-bold text-[#fde047]">
                  Interactive Pixel Art Square
                </h3>
                <span className="text-[10px] text-[#ca8a04] font-sans">Live Animated Canvas</span>
              </div>
            </div>
            <p className="text-xs text-[#d8c2a3] font-sans leading-relaxed">
              Step onto a bustling 16-bit market square featuring puffing chimneys, glowing anvil sparks,
              passing townsfolk with speech bubbles, and interactive vendor stalls. Clicking any stall
              instantly opens direct negotiations with the merchant.
            </p>
          </div>

          {/* Card 3 */}
          <div className="pixel-box-wood p-5 border-2 border-[#5c371e] bg-[#1a0f0a] hover:border-[#ca8a04] transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#2d180d] border border-[#ca8a04] flex items-center justify-center text-xl">
                🤝
              </div>
              <div>
                <h3 className="font-medieval text-base font-bold text-[#fde047]">
                  Merchant Trust & Alliances
                </h3>
                <span className="text-[10px] text-[#ca8a04] font-sans">Relationship & Reputation</span>
              </div>
            </div>
            <p className="text-xs text-[#d8c2a3] font-sans leading-relaxed">
              Each merchant has unique temperaments, favored goods, and mood states. Regularly trading
              and offering gifts increases their Trust rating, unlocking wholesale discounts up to 15%
              and exclusive rumors about impending commodity surges.
            </p>
          </div>

          {/* Card 4 */}
          <div className="pixel-box-wood p-5 border-2 border-[#5c371e] bg-[#1a0f0a] hover:border-[#ca8a04] transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#2d180d] border border-[#ca8a04] flex items-center justify-center text-xl">
                ⚔️
              </div>
              <div>
                <h3 className="font-medieval text-base font-bold text-[#fde047]">
                  Overland Caravans
                </h3>
                <span className="text-[10px] text-[#ca8a04] font-sans">Expeditions & Highway Brigands</span>
              </div>
            </div>
            <p className="text-xs text-[#d8c2a3] font-sans leading-relaxed">
              Dispatch freight wagons across the kingdom for massive trade arbitrage. Highways carry
              bandit ambush risks: protect your valuable cargo by hiring armed mercenaries and upgrading
              to armored transport wagons.
            </p>
          </div>

          {/* Card 5 */}
          <div className="pixel-box-wood p-5 border-2 border-[#5c371e] bg-[#1a0f0a] hover:border-[#ca8a04] transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#2d180d] border border-[#ca8a04] flex items-center justify-center text-xl">
                📦
              </div>
              <div>
                <h3 className="font-medieval text-base font-bold text-[#fde047]">
                  Warehouses & Logistics
                </h3>
                <span className="text-[10px] text-[#ca8a04] font-sans">Stockpiling & Seasonality</span>
              </div>
            </div>
            <p className="text-xs text-[#d8c2a3] font-sans leading-relaxed">
              Construct and expand fortified storage depots from a 50-unit shed to a 1,000-unit customs
              compound. Store cheap grain harvested in autumn, hold it through blizzards, and sell when
              winter famine strikes at triple value.
            </p>
          </div>

          {/* Card 6 */}
          <div className="pixel-box-wood p-5 border-2 border-[#5c371e] bg-[#1a0f0a] hover:border-[#ca8a04] transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#2d180d] border border-[#ca8a04] flex items-center justify-center text-xl">
                📜
              </div>
              <div>
                <h3 className="font-medieval text-base font-bold text-[#fde047]">
                  Kingdom Events & Decrees
                </h3>
                <span className="text-[10px] text-[#ca8a04] font-sans">Royal Fairs, Wars & Droughts</span>
              </div>
            </div>
            <p className="text-xs text-[#d8c2a3] font-sans leading-relaxed">
              Town criers announce royal decrees, tournaments, trade blockades, and festival fairs.
              Every historical bulletin triggers major price spikes in related goods such as swords,
              wine, salt, or silk.
            </p>
          </div>
        </div>

        {/* Concept: Traditional Gameplay with an Integrated Web3 Layer */}
        <div className="mt-8 pixel-box-wood p-5 sm:p-6 border-2 border-[#5c371e] bg-[#1a0f0a]/95">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="w-12 h-12 bg-[#2d180d] border border-[#ca8a04] flex items-center justify-center text-2xl shrink-0">
              {isWalletConnected ? '⚡' : '🪙'}
            </div>
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h3 className="font-medieval text-base sm:text-lg font-bold text-[#fde047]">
                  Traditional Gameplay with an Integrated Web3 Layer
                </h3>
                {isWalletConnected ? (
                  <span className="px-2 py-0.5 text-[10px] font-sans font-bold bg-[#14532d] text-[#86efac] border border-[#22c55e] uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_10px_rgba(34,197,94,0.3)]">
                    <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse"></span>
                    Web3 Active • {formatWalletAddress(currentWalletAddress)}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 text-[10px] font-sans font-bold bg-[#2d180d] text-[#fde047] border border-[#ca8a04] uppercase tracking-wider">
                    Optional Web3 • Connect Wallet to Activate
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-[#d8c2a3] font-sans leading-relaxed">
                Goldbound is designed and built first and foremost as a complete, traditional indie merchant simulation. The game operates entirely on its own normal in-game currency (gold coins) and organic progression tree. Players can freely play, explore districts, complete guild trades, gather resources, upgrade warehouses, dispatch caravans, and advance through commercial ranks without owning a cryptocurrency wallet or holding any digital tokens.
              </p>
              <p className="text-xs sm:text-sm text-[#d8c2a3] font-sans leading-relaxed">
                For merchants seeking an external digital dimension, <strong className="text-[#fde047]">the Web3 layer is active</strong>. Connecting your Phantom wallet instantly syncs your commercial ledger with the decentralized guild registry. Once connected, your high-tier milestones, guild rank advancements, and seasonal caravan triumphs are registered on-chain, unlocking verifiable digital credentials and tokenized achievements outside of the core game loop.
              </p>

              {/* Interactive Wallet Connection Banner */}
              <div className="pt-1">
                {isWalletConnected ? (
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-[#14532d]/60 border-2 border-[#22c55e] p-3 text-xs font-sans text-[#86efac] shadow-inner">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">🟣</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#fde047] text-sm">Phantom Wallet Connected</span>
                          <span className="px-1.5 py-0.5 bg-[#22c55e]/20 border border-[#22c55e] text-[#4ade80] text-[10px] uppercase font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse"></span>
                            Active
                          </span>
                        </div>
                        <div className="text-[11px] text-[#86efac] font-mono mt-0.5">
                          Address: {currentWalletAddress}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-[#0f391f] border border-[#22c55e]/70 px-3 py-1.5 text-center">
                        <div className="text-[10px] text-[#86efac] uppercase font-bold">SOL Balance</div>
                        <div className="text-sm font-bold text-[#fde047]">
                          {currentIsLoadingBalance ? 'Fetching...' : formatSolBalance(currentBalance)}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          SoundEngine.playParchment();
                          setShowWalletModal(true);
                        }}
                        className="px-3 py-2 bg-[#2d180d] hover:bg-[#452614] border border-[#ca8a04] text-[#fde047] text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                      >
                        <span>⚙️</span>
                        <span>Wallet Details</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-3 bg-[#2d180d]/80 border border-[#ca8a04]/50 p-2.5">
                    <button
                      onClick={handleConnectWallet}
                      className="px-3 py-1.5 bg-[#ca8a04] hover:bg-[#eab308] text-[#1a0f0a] font-sans font-bold text-xs flex items-center gap-1.5 transition-all shadow cursor-pointer"
                    >
                      <span>👛</span>
                      <span>Connect Phantom Wallet</span>
                    </button>
                    <span className="text-[11px] text-[#a89279] font-sans">
                      Connect your wallet to enable Web3 achievement registry, or continue playing traditionally without it.
                    </span>
                  </div>
                )}
              </div>

              <p className="text-xs sm:text-sm text-[#a89279] font-sans leading-relaxed border-t border-[#3d2414] pt-2">
                This optional component is designed strictly to celebrate meaningful in-game participation and player dedication rather than serving as the central purpose of the game. Players who are not interested in cryptocurrency can completely disregard this layer and enjoy the full, uninterrupted core game.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CHARACTERS & MERCHANTS */}
      <section id="characters" className="max-w-7xl mx-auto px-4 py-14 border-t-2 border-[#2b180d]">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-widest text-[#ca8a04]">
            Guild Masters & Vendors
          </span>
          <h2 className="font-medieval text-2xl sm:text-4xl font-bold text-[#fde047] mt-1">
            Guild Merchants of the Realm
          </h2>
          <p className="text-xs sm:text-sm text-[#a89279] font-sans max-w-xl mx-auto mt-2">
            Meet the 10 distinctive traders of the realm. Click on any merchant below to inspect their
            portrait, district stall, unique trade rumors, and specialty commodities:
          </p>
        </div>

        {/* Character selector pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {MERCHANTS.map((m) => {
            const isSelected = m.id === selectedMerchantId;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedMerchantId(m.id)}
                className={`flex items-center gap-2 px-3 py-1.5 border-2 text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#fde047] bg-[#452614] text-[#fde047] shadow-lg scale-105'
                    : 'border-[#3d2414] bg-[#1a0f0a] text-[#eedcc0] hover:border-[#ca8a04]'
                }`}
              >
                <img
                  src={getCharacterPortrait(m.portraitKey)}
                  alt={m.name}
                  className="w-6 h-6 pixelated border border-[#1a0f0a] bg-[#120a06]"
                />
                <span>{m.name}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Character Card */}
        <div className="pixel-box-wood p-6 bg-[#1a0f0a] border-4 border-[#452614] max-w-4xl mx-auto shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Left: Portrait & Stall */}
            <div className="flex flex-col items-center text-center border-b md:border-b-0 md:border-r-2 border-[#3d2414] pb-6 md:pb-0 md:pr-6">
              <div className="relative mb-3">
                <img
                  src={getCharacterPortrait(selectedMerchant.portraitKey)}
                  alt={selectedMerchant.name}
                  className="w-28 h-28 pixelated border-4 border-[#ca8a04] bg-[#2d180d] shadow-2xl"
                />
                <div className="absolute -bottom-2 -right-2 px-1.5 py-0.5 bg-[#ca8a04] text-[#1a0f0a] text-[10px] font-bold font-medieval border border-[#fef08a]">
                  Trust: {selectedMerchant.trust}%
                </div>
              </div>

              <h3 className="font-medieval text-xl font-bold text-[#fde047] leading-tight">
                {selectedMerchant.name}
              </h3>
              <p className="text-xs text-[#ca8a04] font-sans font-semibold mt-0.5">
                {selectedMerchant.profession}
              </p>
              <div className="mt-2 text-[11px] text-[#cbd5e1] font-sans px-2 py-0.5 bg-[#2d180d] border border-[#5c371e]">
                📍 District: <strong>{LOCATIONS[selectedMerchant.locationId]?.name || 'Market Square'}</strong>
              </div>

              {/* Stall Artwork */}
              <div className="mt-4 w-full">
                <div className="text-[10px] text-[#a89279] uppercase tracking-wider mb-1">
                  Vendor Stall on the Square
                </div>
                <div className="bg-[#120a06] p-2 border border-[#452614] flex justify-center">
                  <img
                    src={getStallImage(selectedMerchant.portraitKey)}
                    alt={`${selectedMerchant.name}'s stall`}
                    className="h-20 object-contain pixelated"
                  />
                </div>
              </div>
            </div>

            {/* Right: Dialogue, Rumors, Wares */}
            <div className="md:col-span-2 flex flex-col justify-between space-y-4">
              <div>
                <div className="text-xs uppercase tracking-widest text-[#ca8a04] mb-1">
                  Merchant Voice:
                </div>
                <blockquote className="p-3 bg-[#2d180d]/80 border-l-4 border-[#ca8a04] text-sm text-[#fef08a] italic font-serif leading-relaxed">
                  "{selectedMerchant.quote}"
                </blockquote>
              </div>

              <div>
                <div className="text-xs uppercase tracking-widest text-[#ca8a04] mb-1">
                  Market Intelligence & Whispers:
                </div>
                <div className="p-3 bg-[#170e09] border border-[#5c371e] text-xs text-[#eedcc0] font-sans leading-relaxed">
                  👂 <strong>Tavern Rumor:</strong> {selectedMerchant.rumor}
                </div>
              </div>

              <div>
                <div className="text-xs uppercase tracking-widest text-[#ca8a04] mb-2">
                  Specialty Commodities:
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedMerchant.specialtyItems.map((itemId) => (
                    <div
                      key={itemId}
                      className="flex items-center gap-1.5 px-2.5 py-1 bg-[#2d180d] border border-[#ca8a04] text-xs text-[#fde047]"
                    >
                      <img
                        src={getItemIcon(itemId)}
                        alt={itemId}
                        className="w-4 h-4 pixelated"
                      />
                      <span className="capitalize font-sans font-bold">{itemId}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-[#3d2414] text-[11px] text-[#a89279] font-sans">
                💡 <em>Trading Tip:</em> Nurture this merchant's trust to unlock bulk discounts and
                priority access during critical supply shortages.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SHOPS & STALLS */}
      <section id="shops" className="max-w-7xl mx-auto px-4 py-14 border-t-2 border-[#2b180d]">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-widest text-[#ca8a04]">
            Market Architecture
          </span>
          <h2 className="font-medieval text-2xl sm:text-4xl font-bold text-[#fde047] mt-1">
            Bustling Vendor Stalls & Boutiques
          </h2>
          <p className="text-xs sm:text-sm text-[#a89279] font-sans max-w-xl mx-auto mt-2">
            Each market stall is custom-crafted with wooden canopies, canvas awnings, hanging signs,
            and authentic regional commodities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Shop 1: Produce */}
          <div className="pixel-box-wood p-4 border-2 border-[#5c371e] bg-[#1a0f0a]">
            <div className="h-32 bg-[#120a06] border border-[#452614] flex items-center justify-center p-2 mb-3">
              <img
                src={STALL_ASSETS.farmer_tomas}
                alt="Tomas's Produce Stall"
                className="max-h-full object-contain pixelated"
              />
            </div>
            <h3 className="font-medieval text-base font-bold text-[#fde047]">
              Orchard & Harvest Stall (Old Tomas)
            </h3>
            <p className="text-xs text-[#a89279] font-sans mt-1">
              Wooden crates piled high with crisp apples, sacks of milled grain, and raw wool bundles.
              Town bakers and innkeepers buy their daily ingredients here.
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[#ca8a04] font-bold">
              <span>Specialties:</span>
              <span className="text-[#fef08a] font-sans">Grain, Flour, Apples, Wool</span>
            </div>
          </div>

          {/* Shop 2: Bakery */}
          <div className="pixel-box-wood p-4 border-2 border-[#5c371e] bg-[#1a0f0a]">
            <div className="h-32 bg-[#120a06] border border-[#452614] flex items-center justify-center p-2 mb-3">
              <img
                src={STALL_ASSETS.baker_hilda}
                alt="Hilda's Bakery"
                className="max-h-full object-contain pixelated"
              />
            </div>
            <h3 className="font-medieval text-base font-bold text-[#fde047]">
              Hearth Brick Bakery (Kind Hilda)
            </h3>
            <p className="text-xs text-[#a89279] font-sans mt-1">
              Fresh bread crusts fragrance the entire market. Hearth ovens churn out wholesome rustic
              loaves, requiring constant shipments of river-milled flour.
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[#ca8a04] font-bold">
              <span>Specialties:</span>
              <span className="text-[#fef08a] font-sans">Warm Bread, Pastries, Golden Flour</span>
            </div>
          </div>

          {/* Shop 3: Blacksmith */}
          <div className="pixel-box-wood p-4 border-2 border-[#5c371e] bg-[#1a0f0a]">
            <div className="h-32 bg-[#120a06] border border-[#452614] flex items-center justify-center p-2 mb-3">
              <img
                src={STALL_ASSETS.blacksmith_gunther}
                alt="Gunther's Forge"
                className="max-h-full object-contain pixelated"
              />
            </div>
            <h3 className="font-medieval text-base font-bold text-[#fde047]">
              Armory & Hammer Forge (Master Gunther)
            </h3>
            <p className="text-xs text-[#a89279] font-sans mt-1">
              Smoky forge with a resonant iron anvil. Raw smelted ingots are turned into tempered
              steel swords, horseshoes, and heavy crafting tools.
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[#ca8a04] font-bold">
              <span>Specialties:</span>
              <span className="text-[#fef08a] font-sans">Iron Ingots, Forged Tools, Broadswords</span>
            </div>
          </div>

          {/* Shop 4: Herbalist */}
          <div className="pixel-box-wood p-4 border-2 border-[#5c371e] bg-[#1a0f0a]">
            <div className="h-32 bg-[#120a06] border border-[#452614] flex items-center justify-center p-2 mb-3">
              <img
                src={STALL_ASSETS.herbalist_althea}
                alt="Althea's Apothecary Canopy"
                className="max-h-full object-contain pixelated"
              />
            </div>
            <h3 className="font-medieval text-base font-bold text-[#fde047]">
              Apothecary & Herbal Canopy (Mother Althea)
            </h3>
            <p className="text-xs text-[#a89279] font-sans mt-1">
              Bundles of dried mountain herbs, soothing salves, and restorative potions. Crucial for
              garrisons during winter epidemics and military deployments.
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[#ca8a04] font-bold">
              <span>Specialties:</span>
              <span className="text-[#fef08a] font-sans">Medicinal Herbs, Salves, Extracts</span>
            </div>
          </div>

          {/* Shop 5: Harbor Fish Quay */}
          <div className="pixel-box-wood p-4 border-2 border-[#5c371e] bg-[#1a0f0a]">
            <div className="h-32 bg-[#120a06] border border-[#452614] flex items-center justify-center p-2 mb-3">
              <img
                src={STALL_ASSETS.fishmonger_barnaby}
                alt="Barnaby's Fish Quay"
                className="max-h-full object-contain pixelated"
              />
            </div>
            <h3 className="font-medieval text-base font-bold text-[#fde047]">
              Harbor Fish Quay (Barnaby Sea-Dog)
            </h3>
            <p className="text-xs text-[#a89279] font-sans mt-1">
              Salt-encrusted oak barrels bristle with fresh herring and cod. Barnaby eagerly buys
              timber wood for shipyard repairs and rock salt for preservation.
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[#ca8a04] font-bold">
              <span>Specialties:</span>
              <span className="text-[#fef08a] font-sans">Salted Fish, Rock Salt, Pine Timber</span>
            </div>
          </div>

          {/* Shop 6: Silk & Spices Pavilion */}
          <div className="pixel-box-wood p-4 border-2 border-[#5c371e] bg-[#1a0f0a]">
            <div className="h-32 bg-[#120a06] border border-[#452614] flex items-center justify-center p-2 mb-3">
              <img
                src={STALL_ASSETS.spice_rashid}
                alt="Rashid's Silk Pavilion"
                className="max-h-full object-contain pixelated"
              />
            </div>
            <h3 className="font-medieval text-base font-bold text-[#fde047]">
              Silk & Spice Bazaar (Rashid Al-Mansur)
            </h3>
            <p className="text-xs text-[#a89279] font-sans mt-1">
              Embroidered carpets, exotic saffron, cinnamon jars, and rolls of shimmering silk.
              Reselling these goods to nobles at Castle Hill produces astronomical profits.
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[#ca8a04] font-bold">
              <span>Specialties:</span>
              <span className="text-[#fef08a] font-sans">Exotic Spices, Imperial Silk, Rarities</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BUILDINGS & UPGRADES */}
      <section id="buildings" className="max-w-7xl mx-auto px-4 py-14 border-t-2 border-[#2b180d]">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-widest text-[#ca8a04]">
            Infrastructure Progression
          </span>
          <h2 className="font-medieval text-2xl sm:text-4xl font-bold text-[#fde047] mt-1">
            Buildings, Warehouses & Transport
          </h2>
          <p className="text-xs sm:text-sm text-[#a89279] font-sans max-w-xl mx-auto mt-2">
            Reinvest gold into capital infrastructure: expand storage to hoard commodities through
            seasonal troughs, upgrade wagons to carry heavier freight, and enlist veteran bodyguards.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Warehouses */}
          <div className="pixel-box-wood p-5 border-2 border-[#5c371e] bg-[#1a0f0a]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#2d180d] border border-[#ca8a04] flex items-center justify-center text-xl">
                🏰
              </div>
              <div>
                <h3 className="font-medieval text-lg font-bold text-[#fde047]">
                  Storage Warehouses
                </h3>
                <span className="text-[11px] text-[#ca8a04] font-sans">Stockpile Capacity</span>
              </div>
            </div>
            <p className="text-xs text-[#a89279] font-sans mb-4">
              Store excess cargo safely during seasonal gluts to resell at peak prices during shortages.
            </p>

            <div className="space-y-2.5">
              {WAREHOUSE_UPGRADES.map((wh) => (
                <div
                  key={wh.level}
                  className="p-2.5 bg-[#140b07] border border-[#3d2414] flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-[#fef08a]">{wh.name}</div>
                    <div className="text-[11px] text-[#ca8a04] font-sans">
                      Capacity: <strong>{wh.capacity} units</strong>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#fde047] font-bold">
                      {wh.cost === 0 ? 'Starter' : `${wh.cost} 🪙`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carts & Wagons */}
          <div className="pixel-box-wood p-5 border-2 border-[#5c371e] bg-[#1a0f0a]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#2d180d] border border-[#ca8a04] flex items-center justify-center text-xl">
                🛒
              </div>
              <div>
                <h3 className="font-medieval text-lg font-bold text-[#fde047]">
                  Transport Fleet
                </h3>
                <span className="text-[11px] text-[#ca8a04] font-sans">Overland Cart Haulage</span>
              </div>
            </div>
            <p className="text-xs text-[#a89279] font-sans mb-4">
              Determines how many bundles of freight you can carry across regional travel routes.
            </p>

            <div className="space-y-2.5">
              {CART_UPGRADES.map((cart) => (
                <div
                  key={cart.level}
                  className="p-2.5 bg-[#140b07] border border-[#3d2414] flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-[#fef08a]">{cart.name}</div>
                    <div className="text-[11px] text-[#ca8a04] font-sans">
                      Capacity Bonus: <strong>+{cart.capacityBonus} units</strong>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#fde047] font-bold">
                      {cart.cost === 0 ? 'Starter' : `${cart.cost} 🪙`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mercenary Barracks */}
          <div className="pixel-box-wood p-5 border-2 border-[#5c371e] bg-[#1a0f0a]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#2d180d] border border-[#ca8a04] flex items-center justify-center text-xl">
                🛡️
              </div>
              <div>
                <h3 className="font-medieval text-lg font-bold text-[#fde047]">
                  Mercenary Barracks
                </h3>
                <span className="text-[11px] text-[#ca8a04] font-sans">Caravan Defense Force</span>
              </div>
            </div>
            <p className="text-xs text-[#a89279] font-sans mb-4">
              Caravan trails crawl with outlaws. Enlisting mercenaries reduces highway ambush risks.
            </p>

            <div className="p-3 bg-[#140b07] border border-[#3d2414] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#fef08a] font-bold">Militia Spearman</span>
                <span className="text-[#fde047]">75 🪙 / guard</span>
              </div>
              <p className="text-[11px] text-[#a89279] font-sans">
                Equipped with spear and buckler. Wards off petty highway thieves on rural roads.
              </p>
              <div className="pt-2 border-t border-[#3d2414] flex items-center justify-between text-xs">
                <span className="text-[#fef08a] font-bold">Veteran Crossbowman</span>
                <span className="text-[#fde047]">180 🪙 / guard</span>
              </div>
              <p className="text-[11px] text-[#a89279] font-sans">
                Deadly marksman. Protects overland gold wagons through perilous rocky ravines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. LOCATIONS & TRADE MAP */}
      <section id="locations" className="max-w-7xl mx-auto px-4 py-14 border-t-2 border-[#2b180d]">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-widest text-[#ca8a04]">
            Kingdom Geography
          </span>
          <h2 className="font-medieval text-2xl sm:text-4xl font-bold text-[#fde047] mt-1">
            Trading Districts & Provinces
          </h2>
          <p className="text-xs sm:text-sm text-[#a89279] font-sans max-w-xl mx-auto mt-2">
            Five major trading centers across the realm, each with localized supply, demand, and risk profiles.
          </p>
        </div>

        {/* Location selector tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {Object.values(LOCATIONS).map((loc) => {
            const isSelected = loc.id === selectedLocationId;
            return (
              <button
                key={loc.id}
                onClick={() => setSelectedLocationId(loc.id)}
                className={`px-4 py-2 border-2 text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#fde047] bg-[#452614] text-[#fde047] shadow-lg scale-105'
                    : 'border-[#3d2414] bg-[#1a0f0a] text-[#eedcc0] hover:border-[#ca8a04]'
                }`}
              >
                {loc.name}
              </button>
            );
          })}
        </div>

        {/* Selected Location Card */}
        <div className="pixel-box-wood p-6 bg-[#1a0f0a] border-4 border-[#452614] max-w-4xl mx-auto shadow-2xl">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/2">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: selectedLocation.color }}
                />
                <h3 className="font-medieval text-2xl font-bold text-[#fde047]">
                  {selectedLocation.name}
                </h3>
              </div>
              <p className="text-xs text-[#ca8a04] font-sans font-semibold mb-3">
                {selectedLocation.title}
              </p>
              <p className="text-xs text-[#d8c2a3] font-sans leading-relaxed mb-4">
                {selectedLocation.description}
              </p>

              <div className="p-3 bg-[#2d180d] border border-[#5c371e] text-xs space-y-1.5 font-sans">
                <div className="flex justify-between">
                  <span className="text-[#a89279]">Highway Danger:</span>
                  <span className="text-[#ef4444] font-bold">{selectedLocation.dangerLevel}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#a89279]">Travel Duration:</span>
                  <span className="text-[#fef08a] font-bold">
                    {selectedLocation.travelDays === 0 ? 'Instant' : `${selectedLocation.travelDays} day`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#a89279]">Toll & Provisions:</span>
                  <span className="text-[#fde047] font-bold">{selectedLocation.travelCost} 🪙</span>
                </div>
              </div>
            </div>

            <div className="md:w-1/2 flex flex-col justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest text-[#ca8a04] mb-2">
                  Market Dynamics & Trade Intel:
                </div>
                <div className="p-3.5 bg-[#170e09] border-2 border-[#ca8a04] text-xs text-[#fef08a] font-serif leading-relaxed mb-4">
                  ⭐ {selectedLocation.specialtyText}
                </div>
              </div>

              <div className="p-3 bg-[#140b07] border border-[#3d2414] text-[11px] text-[#cbd5e1] font-sans">
                💡 <em>Caravan Tip:</em> Compare prices between Marketburg and this destination to haul
                cargo with the highest regional demand multiplier!
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. COMMODITIES SHOWCASE */}
      <section id="commodities" className="max-w-7xl mx-auto px-4 py-14 border-t-2 border-[#2b180d]">
        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-widest text-[#ca8a04]">
            Commodity Exchange
          </span>
          <h2 className="font-medieval text-2xl sm:text-4xl font-bold text-[#fde047] mt-1">
            Goods of the Realm
          </h2>
          <p className="text-xs sm:text-sm text-[#a89279] font-sans max-w-xl mx-auto mt-2">
            22 distinctive commodities spanning agricultural produce, raw materials, forged crafts, and imperial luxury.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          {['all', 'food', 'raw', 'crafted', 'luxury', 'livestock'].map((cat) => (
            <button
              key={cat}
              onClick={() => setItemCategoryFilter(cat)}
              className={`px-3 py-1 text-xs font-bold uppercase transition-all cursor-pointer ${
                itemCategoryFilter === cat
                  ? 'bg-[#ca8a04] text-[#1a0f0a] border-2 border-[#fef08a]'
                  : 'bg-[#1a0f0a] text-[#eedcc0] border border-[#5c371e] hover:border-[#ca8a04]'
              }`}
            >
              {cat === 'all'
                ? 'All Wares'
                : cat === 'food'
                ? 'Provisions'
                : cat === 'raw'
                ? 'Raw Materials'
                : cat === 'crafted'
                ? 'Crafted Goods'
                : cat === 'luxury'
                ? 'Luxury & Gems'
                : 'Livestock'}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-3 bg-[#1a0f0a] border border-[#452614] hover:border-[#ca8a04] flex flex-col items-center text-center transition-all group"
            >
              <div className="w-12 h-12 bg-[#2d180d] border border-[#ca8a04] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <img
                  src={getItemIcon(item.id)}
                  alt={item.name}
                  className="w-8 h-8 pixelated"
                />
              </div>
              <h4 className="font-medieval text-xs font-bold text-[#fde047] leading-tight">
                {item.name}
              </h4>
              <span className="text-[10px] text-[#a89279] uppercase font-sans mt-0.5">
                {item.category}
              </span>
              <div className="mt-1.5 flex items-center gap-1 text-[11px] text-[#fef08a] font-bold font-sans">
                <span>{item.basePrice}</span>
                <GoldCoinIcon size={12} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. BOTTOM CALL TO ACTION */}
      <section className="relative py-20 border-t-4 border-[#ca8a04] bg-gradient-to-b from-[#1a0f0a] to-[#0d0907] text-center overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto px-4 flex flex-col items-center">
          <div className="w-16 h-16 bg-[#2d180d] border-2 border-[#fef08a] flex items-center justify-center mb-4 shadow-2xl">
            <GoldCoinIcon size={36} />
          </div>

          <h2 className="font-medieval text-3xl sm:text-5xl font-bold text-[#fde047] tracking-wider mb-3">
            Ready to Forge Your Trading Empire?
          </h2>
          <p className="text-sm sm:text-base text-[#d8c2a3] font-sans max-w-xl mb-8 leading-relaxed">
            Enter the living economy of Goldbound. Chart trading expeditions, earn the respect of guild
            masters, hoard grain through harsh winters, and claim your place among the merchant magnates!
          </p>

          <button
            onClick={handleLaunch}
            id="bottom_start_game_btn"
            className="px-10 py-4 bg-gradient-to-b from-[#facc15] via-[#ca8a04] to-[#713f12] text-[#1a0f0a] font-medieval font-bold text-2xl sm:text-3xl border-4 border-[#fef08a] shadow-[0_0_35px_rgba(250,204,21,0.6)] hover:shadow-[0_0_55px_rgba(250,204,21,0.9)] hover:scale-105 active:scale-95 transition-all duration-150 flex items-center gap-4 cursor-pointer"
          >
            <span>⚔️</span>
            <span className="tracking-widest">START GAME</span>
            <span>⚔️</span>
          </button>
        </div>
      </section>

      {/* Wallet Details Modal */}
      {showWalletModal && isWalletConnected && (
        <WalletDetailsModal
          address={currentWalletAddress}
          balance={currentBalance}
          cluster={externalWalletCluster || 'Solana'}
          isLoadingBalance={currentIsLoadingBalance}
          onRefreshBalance={() => {
            if (onRefreshBalance) {
              onRefreshBalance();
            } else {
              refreshLocalBalance(currentWalletAddress);
            }
          }}
          onDisconnect={async () => {
            if (onDisconnectWallet) {
              onDisconnectWallet();
            } else if (onToggleWallet) {
              onToggleWallet();
            } else {
              await disconnectPhantom();
              setLocalWalletAddress('');
              setLocalWalletConnected(false);
              setLocalWalletBalance(null);
            }
            setShowWalletModal(false);
          }}
          onClose={() => setShowWalletModal(false)}
        />
      )}
    </div>
  );
};
