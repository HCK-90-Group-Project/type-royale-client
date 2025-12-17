import { useEffect, useState } from "react";
import HealthBar from "./HealthBar";

const Tower = ({
    hp,
    maxHp,
    label,
    shieldActive = false,
    hitTrigger,
    flipped = false, // for enemy side
}) => {
    const [isHit, setIsHit] = useState(false);

    useEffect(() => {
        if (!hitTrigger) return;

        setIsHit(true);
        const t = setTimeout(() => setIsHit(false), 300);

        return () => clearTimeout(t);
    }, [hitTrigger]);

    return (
        <div
            className={`flex flex-col items-center gap-3 ${flipped ? "scale-x-[-1]" : ""
                }`}
        >
            {/* Health Bar */}
            <HealthBar
                label={label}
                current={hp}
                max={maxHp}
                shakeTrigger={isHit}
            />

            {/* Tower Visual */}
            <div className="relative">
                {/* Shield Overlay */}
                {shieldActive && (
                    <div className="absolute inset-0 rounded-xl bg-cyan-400/20 ring-4 ring-cyan-400 animate-pulse z-10" />
                )}

                {/* Tower Body */}
                <div
                    className={`relative z-0 h-40 w-32 rounded-xl bg-gradient-to-b from-gray-600 to-gray-900 shadow-2xl
            ${isHit ? "animate-tower-hit" : ""}
          `}
                >
                    {/* Windows */}
                    <div className="absolute bottom-6 left-6 h-4 w-4 rounded-sm bg-yellow-300" />
                    <div className="absolute bottom-6 right-6 h-4 w-4 rounded-sm bg-yellow-300" />

                    {/* Roof */}
                    <div className="absolute -top-4 left-1/2 h-6 w-20 -translate-x-1/2 rounded-t-xl bg-gray-700" />
                </div>
            </div>
        </div>
    );
};

export default Tower;
