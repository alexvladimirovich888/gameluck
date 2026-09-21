import React from 'react';
import { getItemIcon, getCharacterPortrait, getStallImage, UI_ASSETS, ICON_ASSETS } from '../utils/assets';

interface PixelIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const PixelIcon: React.FC<PixelIconProps> = ({ name, className = '', size = 24 }) => {
  // Coin or gold currency
  if (name === 'coin' || name === 'gold') {
    return (
      <img
        src={UI_ASSETS.coin}
        alt="Gold"
        width={size}
        height={size}
        className={`inline-block pixelated select-none ${className}`}
        style={{ width: size, height: size, imageRendering: 'pixelated' }}
        draggable={false}
      />
    );
  }

  // Navigation tab icons
  if (name === 'market' || name === 'trade') {
    return (
      <img
        src={ICON_ASSETS.market}
        alt="Market"
        width={size}
        height={size}
        className={`inline-block pixelated select-none ${className}`}
        style={{ width: size, height: size, imageRendering: 'pixelated' }}
        draggable={false}
      />
    );
  }

  if (name === 'warehouse' || name === 'storage') {
    return (
      <img
        src={ICON_ASSETS.warehouse}
        alt="Warehouse"
        width={size}
        height={size}
        className={`inline-block pixelated select-none ${className}`}
        style={{ width: size, height: size, imageRendering: 'pixelated' }}
        draggable={false}
      />
    );
  }

  if (name === 'map' || name === 'compass') {
    return (
      <img
        src={ICON_ASSETS.map}
        alt="Map"
        width={size}
        height={size}
        className={`inline-block pixelated select-none ${className}`}
        style={{ width: size, height: size, imageRendering: 'pixelated' }}
        draggable={false}
      />
    );
  }

  if (name === 'merchants' || name === 'guild') {
    return (
      <img
        src={ICON_ASSETS.merchants}
        alt="Merchants"
        width={size}
        height={size}
        className={`inline-block pixelated select-none ${className}`}
        style={{ width: size, height: size, imageRendering: 'pixelated' }}
        draggable={false}
      />
    );
  }

  if (name === 'events' || name === 'news' || name === 'scroll') {
    return (
      <img
        src={ICON_ASSETS.events}
        alt="Events"
        width={size}
        height={size}
        className={`inline-block pixelated select-none ${className}`}
        style={{ width: size, height: size, imageRendering: 'pixelated' }}
        draggable={false}
      />
    );
  }

  // Otherwise, check items list
  const iconSrc = getItemIcon(name);

  return (
    <img
      src={iconSrc}
      alt={name}
      width={size}
      height={size}
      className={`inline-block pixelated select-none ${className}`}
      style={{ width: size, height: size, imageRendering: 'pixelated' }}
      draggable={false}
      onError={(e) => {
        const target = e.currentTarget;
        if (target.src.includes('.png')) {
          target.src = `/assets/items/${name}.svg`;
        }
      }}
    />
  );
};

export const MerchantPortrait: React.FC<{ portraitKey: string; size?: number; className?: string }> = ({
  portraitKey,
  size = 64,
  className = ''
}) => {
  const src = getCharacterPortrait(portraitKey);

  return (
    <div
      className={`relative inline-block border-2 border-[#5c371e] bg-[#140a05] shadow-md ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src={src}
        alt={portraitKey}
        width={size}
        height={size}
        className="w-full h-full object-cover pixelated select-none"
        style={{ imageRendering: 'pixelated' }}
        draggable={false}
        onError={(e) => {
          const target = e.currentTarget;
          if (target.src.includes('.png')) {
            target.src = `/assets/characters/${portraitKey}.svg`;
          }
        }}
      />
      <div className="absolute inset-0 border border-[#ca8a04]/40 pointer-events-none" />
    </div>
  );
};

export const StallImage: React.FC<{ stallKey: string; width?: number | string; height?: number | string; className?: string }> = ({
  stallKey,
  width = 120,
  height = 90,
  className = ''
}) => {
  const src = getStallImage(stallKey);

  return (
    <div
      className={`relative inline-block border-2 border-[#5c371e] bg-[#140a05] overflow-hidden shadow-md ${className}`}
      style={{ width, height }}
    >
      <img
        src={src}
        alt={stallKey}
        className="w-full h-full object-cover pixelated select-none"
        style={{ imageRendering: 'pixelated' }}
        draggable={false}
      />
      <div className="absolute inset-0 border border-[#ca8a04]/30 pointer-events-none" />
    </div>
  );
};

export const WaxSealBadge: React.FC<{ size?: number; className?: string }> = ({ size = 36, className = '' }) => (
  <img
    src={UI_ASSETS.waxSeal}
    alt="Royal Wax Seal"
    width={size}
    height={size}
    className={`inline-block pixelated select-none filter drop-shadow-md ${className}`}
    style={{ width: size, height: size, imageRendering: 'pixelated' }}
    draggable={false}
  />
);

export const CompassRoseIcon: React.FC<{ size?: number; className?: string }> = ({ size = 36, className = '' }) => (
  <img
    src={UI_ASSETS.compassRose}
    alt="Compass Rose"
    width={size}
    height={size}
    className={`inline-block pixelated select-none filter drop-shadow-md ${className}`}
    style={{ width: size, height: size, imageRendering: 'pixelated' }}
    draggable={false}
  />
);

export const GoldPouchIcon: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = '' }) => (
  <img
    src={UI_ASSETS.goldPouch}
    alt="Gold Pouch"
    width={size}
    height={size}
    className={`inline-block pixelated select-none ${className}`}
    style={{ width: size, height: size, imageRendering: 'pixelated' }}
    draggable={false}
  />
);

export const GoldCoinIcon: React.FC<{ size?: number; className?: string }> = ({ size = 18, className = '' }) => (
  <img
    src={UI_ASSETS.coin}
    alt="Gold Sovereign"
    width={size}
    height={size}
    className={`inline-block pixelated select-none filter drop-shadow-xs ${className}`}
    style={{ width: size, height: size, imageRendering: 'pixelated' }}
    draggable={false}
  />
);



