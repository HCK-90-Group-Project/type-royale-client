import { useEffect } from "react";

const MatchResult = ({
    result,           // "win" | "lose" | "draw"
    duration,         // seconds
    onPlayAgain,
    onExit,
}) => {
    if (!result) return null;

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    const isWin = result === "win";
    const isLose = result === "lose";

    const title = isWin
        ? "Victory"
        : isLose
            ? "Defeat"
            : "Draw";

    const subtitle = isWin
        ? "Your typing reigns supreme!"
        : isLose
            ? "Your tower has fallen..."
            : "A battle without a winner.";

    const accentColor = isWin
        ? "from-green-400 to-emerald-600"
        : isLose
            ? "from-red-500 to-rose-700"
            : "from-gray-400 to-gray-600";

    const formatTime = (sec) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-gray-900 p-8 text-center shadow-2xl animate-fade-in">
                {/* Title */}
                <h1
                    className={`mb-2 bg-gradient-to-r ${accentColor} bg-clip-text text-4xl font-extrabold text-transparent`}
                >
                    {title}
                </h1>

                {/* Subtitle */}
                <p className="mb-6 text-gray-300">{subtitle}</p>

                {/* Stats */}
                <div className="mb-6 rounded-xl bg-gray-800 p-4 text-sm text-gray-300">
                    <div className="flex justify-between">
                        <span>Match Duration</span>
                        <span className="font-semibold text-white">
                            {formatTime(duration)}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    <button
                        onClick={onPlayAgain}
                        className={`flex-1 rounded-xl bg-gradient-to-r ${accentColor} px-4 py-2 font-semibold text-white transition hover:scale-105`}
                    >
                        Play Again
                    </button>

                    <button
                        onClick={onExit}
                        className="flex-1 rounded-xl bg-gray-700 px-4 py-2 font-semibold text-white transition hover:bg-gray-600"
                    >
                        Exit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MatchResult;
