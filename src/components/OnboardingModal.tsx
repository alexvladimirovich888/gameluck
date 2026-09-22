import React from 'react';
import { SoundEngine } from '../utils/sound';
import { WaxSealBadge } from './PixelIcons';

interface OnboardingModalProps {
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs">
      <div className="pixel-box-wood relative w-full max-w-lg p-6 text-[#eedcc0] shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="border-b-2 border-[#5c371e] pb-3 text-center flex flex-col items-center">
          <WaxSealBadge size={48} className="mb-1" />
          <div className="text-xs font-bold text-[#facc15] uppercase tracking-widest">
            Welcome to Goldbound
          </div>
          <h2 className="font-medieval text-2xl font-bold text-[#fde047] mt-1">
            THE WAY OF THE MEDIEVAL MERCHANT
          </h2>
        </div>

        <div className="my-5 flex flex-col gap-3 text-xs leading-relaxed">
          <div className="pixel-box-dark flex items-start gap-3 p-2.5 border border-[#4a2e1c]">
            <span className="text-lg">🌾</span>
            <div>
              <b className="text-[#fde047]">Buy Low:</b> Hunt for surplus commodities where produced cheap (e.g. wheat in Oakhaven village, fresh fish in the Port of Saltheim).
            </div>
          </div>

          <div className="pixel-box-dark flex items-start gap-3 p-2.5 border border-[#4a2e1c]">
            <span className="text-lg">📈</span>
            <div>
              <b className="text-[#fde047]">Track Events & Shifting Demand:</b> Drought doubles grain and flour prices, while royal weddings cause wine, spices, and fine silks to skyrocket!
            </div>
          </div>

          <div className="pixel-box-dark flex items-start gap-3 p-2.5 border border-[#4a2e1c]">
            <span className="text-lg">💰</span>
            <div>
              <b className="text-[#fde047]">Sell High:</b> Haul luxury jewelry and fine wines up to Castle Hill nobility, or ferry sturdy iron tools out to rural farmsteads.
            </div>
          </div>

          <div className="pixel-box-dark flex items-start gap-3 p-2.5 border border-[#4a2e1c]">
            <span className="text-lg">🚚</span>
            <div>
              <b className="text-[#fde047]">Build Your Trading Empire:</b> Expand your packhouse, hire seasoned guards, dispatch caravans across provincial highways, and ascend to Grand Guildmaster!
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            SoundEngine.playFanfare();
            onClose();
          }}
          className="pixel-btn w-full bg-[#b45309] py-3 text-sm font-bold text-[#fffbeb] hover:bg-[#d97706]"
        >
          Enter the Market and Commence Trading!
        </button>
      </div>
    </div>
  );
};
