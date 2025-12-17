import { useEffect, useState } from "react";

const GameTimer = ({
    initialTime = 180, // seconds (3 minutes)
    onTimeUp,
    isRunning = true,
}) => {
    const [timeLeft, setTimeLeft] = useState(initialTime);

    useEffect(() => {
        if (!isRunning || timeLeft <= 0) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning, timeLeft]);

    useEffect(() => {
        if (timeLeft === 0 && onTimeUp) {
            onTimeUp();
        }
    }, [timeLeft, onTimeUp]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const isUrgent = timeLeft <= 15;

    return (
        <div
            className={`flex items-center justify-center rounded-xl px-6 py-3 shadow-lg
        ${isUrgent
                    ? "animate-pulse bg-red-600 text-white"
                    : "bg-gray-900 text-white"
                }
      `}
        >
            <span className="text-sm font-semibold tracking-widest">
                {minutes}:{seconds.toString().padStart(2, "0")}
            </span>
        </div>
    );
};

export default GameTimer;
