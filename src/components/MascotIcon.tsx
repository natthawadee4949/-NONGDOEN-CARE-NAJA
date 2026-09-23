import React from 'react';
import thaiSchoolboyImg from '../assets/images/thai_boy_notie_1790164317485.jpg';

interface MascotIconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'mascot' | 'logo' | 'app_profile';
}

export const MascotIcon: React.FC<MascotIconProps> = ({
  className = '',
  size = 'md',
  variant = 'mascot',
}) => {
  const sizeMap = {
    sm: 'w-8 h-8 text-[9px]',
    md: 'w-12 h-12 text-[11px]',
    lg: 'w-20 h-20 text-[14px]',
    xl: 'w-32 h-32 text-[20px]',
  };

  // 1. App Profile Badge: "NONGDOEN CARE" with Pink Border, White Background, Soft Black Text
  if (variant === 'logo' || variant === 'app_profile') {
    return (
      <div
        className={`relative shrink-0 flex items-center justify-center font-black rounded-2xl bg-white border-2 border-pink-400 shadow-xs select-none px-2 py-1 transition-all ${className}`}
        style={{ minWidth: size === 'sm' ? '80px' : size === 'md' ? '125px' : size === 'lg' ? '170px' : '220px' }}
      >
        <div className="flex flex-col items-center justify-center leading-none text-center">
          <span
            className={`font-black tracking-tight text-slate-700 ${
              size === 'sm' ? 'text-[10px]' : size === 'md' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-xl'
            }`}
          >
            NONGDOEN <span className="text-pink-600">CARE</span>
          </span>
          {size !== 'sm' && (
            <span className="text-[8px] text-slate-500 font-semibold mt-0.5 tracking-wider uppercase">
              หนองเดิ่นศรีเจริญวิทยา
            </span>
          )}
        </div>
      </div>
    );
  }

  // 2. Thai Schoolboy Mascot: White shirt, black shoes, adorable oversized head (หัวโตๆ)
  return (
    <div
      className={`relative shrink-0 flex items-center justify-center rounded-2xl overflow-hidden bg-gradient-to-b from-pink-50 to-rose-50 border-2 border-pink-300 shadow-md ${sizeMap[size]} ${className}`}
    >
      <img
        src={thaiSchoolboyImg}
        alt="มาสคอตเด็กนักเรียนไทย โรงเรียนหนองเดิ่นศรีเจริญวิทยา"
        className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
        loading="eager"
      />
    </div>
  );
};
