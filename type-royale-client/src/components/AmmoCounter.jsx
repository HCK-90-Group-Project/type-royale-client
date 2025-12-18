import { useContext } from "react";
import { GameContext } from "../context/GameContext";

const AmmoCounter = () => {
    const { ammo } = useContext(GameContext);
    // ammo = number of words left (max 50)

    const isLowAmmo = ammo <= 10;

    return (
        <div className="flex items-center gap-3 rounded-xl bg-gray-900 px-5 py-3 shadow-lg">
            {/* Icon */}
            <div
                className={`text-xl ${isLowAmmo ? "animate-pulse text-red-500" : "text-yellow-400"
                    }`}
            >
                ✦
            </div>

            {/* Text */}
            <div className="flex flex-col">
                <span className="text-xs uppercase tracking-wider text-gray-400">
                    Ammo
                </span>
                <span
                    className={`text-lg font-bold ${isLowAmmo ? "text-red-500" : "text-white"
                        }`}
                >
                    {ammo} words
                </span>
            </div>

            {/* Progress Bar */}
            <div className="ml-4 h-2 w-24 rounded-full bg-gray-700 overflow-hidden">
                <div
                    className={`h-full transition-all duration-300 ${isLowAmmo ? "bg-red-500" : "bg-green-500"
                        }`}
                    style={{ width: `${(ammo / 50) * 100}%` }}
                />
            </div>
        </div>
    );
};

export default AmmoCounter;
