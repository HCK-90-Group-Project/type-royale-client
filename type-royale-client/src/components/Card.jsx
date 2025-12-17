import React from 'react';
import { Flame, Shield, Zap } from 'lucide-react';

const Card = ({ type, damage, difficulty, onClick, disabled, isSelected }) => {
    const cardStyles = {
        easy: {
            bg: 'bg-gradient-to-br from-green-400 to-green-600',
            border: 'border-green-500',
            glow: 'shadow-green-500/50',
            icon: Zap,
            color: 'text-green-100'
        },
        medium: {
            bg: 'bg-gradient-to-br from-orange-400 to-orange-600',
            border: 'border-orange-500',
            glow: 'shadow-orange-500/50',
            icon: Flame,
            color: 'text-orange-100'
        },
        hard: {
            bg: 'bg-gradient-to-br from-red-500 to-red-700',
            border: 'border-red-600',
            glow: 'shadow-red-500/50',
            icon: Flame,
            color: 'text-red-100'
        },
        shield: {
            bg: 'bg-gradient-to-br from-blue-400 to-blue-600',
            border: 'border-blue-500',
            glow: 'shadow-blue-500/50',
            icon: Shield,
            color: 'text-blue-100'
        }
    };

    const style = cardStyles[type];
    const Icon = style.icon;

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
        relative w-32 h-44 rounded-xl p-4 transition-all duration-300
        ${style.bg} ${style.border} border-2
        ${isSelected ? `scale-110 shadow-2xl ${style.glow}` : 'shadow-lg hover:scale-105'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-xl'}
        flex flex-col items-center justify-between
      `}
        >
            {/* Card Header */}
            <div className="text-center">
                <h3 className={`font-bold text-lg uppercase ${style.color}`}>
                    {type}
                </h3>
                <p className="text-xs text-white/80 mt-1">{difficulty}</p>
            </div>

            {/* Icon */}
            <Icon className={`w-12 h-12 ${style.color}`} strokeWidth={2.5} />

            {/* Damage/Effect */}
            <div className="text-center">
                {type === 'shield' ? (
                    <p className="text-white font-bold text-sm">BLOCK</p>
                ) : (
                    <>
                        <p className="text-3xl font-bold text-white">{damage}</p>
                        <p className="text-xs text-white/80">DMG</p>
                    </>
                )}
            </div>

            {/* Selected Indicator */}
            {isSelected && (
                <div className="absolute inset-0 rounded-xl border-4 border-yellow-400 animate-pulse" />
            )}
        </button>
    );
};

export default Card;