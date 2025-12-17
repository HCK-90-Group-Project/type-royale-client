import { useEffect, useState } from "react";

const HealthBar = ({
    current = 100,
    max = 100,
    label = "Tower",
    shakeTrigger,
}) => {
    const [displayHp, setDisplayHp] = useState(current);
    const percentage = Math.max(0, (displayHp / max) * 100);

    useEffect(() => {
        setDisplayHp(current);
    }, [current]);

    const getColor = () => {
        if (percentage > 60) return "bg-green-500";
        if (percentage > 30) return "bg-yellow-400";
        return "bg-red-500";
    };

    return (
        <div className="w-full max-w-sm">
            {/* Label */}
            <div className="mb-1 flex justify-between text-xs text-gray-300">
                <span>{label}</span>
                <span>
                    {current} / {max}
                </span>
            </div>

            {/* Bar Container */}
            <div
                className={`relative h-4 overflow-hidden rounded-full bg-gray-800 ${shakeTrigger ? "animate-tower-hit" : ""
                    }`}
            >
                {/* HP Fill */}
                <div
                    className={`h-full transition-all duration-500 ease-out ${getColor()}`}
                    style={{ width: `${percentage}%` }}
                />

                {/* Damage Overlay */}
                <div
                    className="absolute inset-0 bg-red-700/40"
                    style={{
                        width: `${percentage}%`,
                        opacity: 0,
                    }}
                />
            </div>
        </div>
    );
};

export default HealthBar;
