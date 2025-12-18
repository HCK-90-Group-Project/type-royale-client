import React from "react";
import { Flame, Shield, Zap, Sparkles } from "lucide-react";

const Card = ({ type, damage, difficulty, onClick, disabled, isSelected }) => {
  const cardStyles = {
    easy: {
      bg: "from-emerald-700 via-emerald-600 to-emerald-800",
      border: "border-emerald-400",
      glow: "shadow-emerald-500/50",
      icon: Zap,
      iconBg: "bg-emerald-500/30",
      accentColor: "text-emerald-300",
      damageColor: "text-emerald-100",
    },
    medium: {
      bg: "from-orange-600 via-orange-500 to-orange-700",
      border: "border-orange-400",
      glow: "shadow-orange-500/50",
      icon: Flame,
      iconBg: "bg-orange-500/30",
      accentColor: "text-orange-200",
      damageColor: "text-orange-100",
    },
    hard: {
      bg: "from-red-700 via-red-600 to-red-800",
      border: "border-red-400",
      glow: "shadow-red-500/50",
      icon: Sparkles,
      iconBg: "bg-red-500/30",
      accentColor: "text-red-200",
      damageColor: "text-red-100",
    },
    shield: {
      bg: "from-blue-700 via-blue-600 to-blue-800",
      border: "border-blue-400",
      glow: "shadow-blue-500/50",
      icon: Shield,
      iconBg: "bg-blue-500/30",
      accentColor: "text-blue-200",
      damageColor: "text-blue-100",
    },
  };

  const style = cardStyles[type];
  const Icon = style.icon;

  const typeLabels = {
    easy: "Quick",
    medium: "Power",
    hard: "Inferno",
    shield: "Shield",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative group w-20 h-28 md:w-28 md:h-40 rounded-xl transition-all duration-300
        bg-gradient-to-b ${style.bg}
        border-2 ${style.border}
        ${
          isSelected
            ? `scale-110 shadow-2xl ${style.glow} -translate-y-2 z-10`
            : "shadow-lg hover:scale-105 hover:-translate-y-1 hover:shadow-xl"
        }
        ${
          disabled
            ? "opacity-40 cursor-not-allowed grayscale"
            : "cursor-pointer"
        }
        overflow-hidden
      `}
    >
      {/* Top decoration line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent" />

      {/* Inner card frame */}
      <div className="absolute inset-1 rounded-lg border border-white/10" />

      {/* Card content */}
      <div className="relative h-full flex flex-col items-center justify-between p-2 md:p-3">
        {/* Card Title */}
        <div className="text-center">
          <h3
            className={`font-royal font-bold text-xs md:text-sm uppercase tracking-wide ${style.accentColor}`}
          >
            {typeLabels[type]}
          </h3>
          <p className="text-[8px] md:text-[10px] text-white/60 font-royal mt-0.5 hidden md:block">
            {difficulty}
          </p>
        </div>

        {/* Icon */}
        <div
          className={`${style.iconBg} p-2 md:p-3 rounded-full backdrop-blur-sm border border-white/20`}
        >
          <Icon
            className={`w-5 h-5 md:w-8 md:h-8 ${style.damageColor} drop-shadow-lg`}
            strokeWidth={2}
          />
        </div>

        {/* Damage/Effect */}
        <div className="text-center">
          {type === "shield" ? (
            <p
              className={`font-royal font-bold text-xs md:text-sm ${style.damageColor}`}
            >
              BLOCK
            </p>
          ) : (
            <>
              <p
                className={`font-royal text-xl md:text-3xl font-bold ${style.damageColor} drop-shadow-md`}
              >
                {damage}
              </p>
              <p className="text-[8px] md:text-[10px] text-white/50 font-royal -mt-1">
                DMG
              </p>
            </>
          )}
        </div>
      </div>

      {/* Selected glow effect */}
      {isSelected && (
        <>
          <div className="absolute inset-0 rounded-xl border-2 border-yellow-400 animate-pulse" />
          <div className="absolute -inset-1 rounded-xl bg-yellow-400/20 blur-md -z-10" />
        </>
      )}

      {/* Hover shine effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />

      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-black/30 to-transparent" />
    </button>
  );
};

export default Card;
