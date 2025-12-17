import { Shield, Wifi, WifiOff } from "lucide-react";

const PlayerInfo = ({
    username,
    isYou = false,
    shieldActive = false,
    isConnected = true,
}) => {
    return (
        <div
            className={`flex items-center gap-3 rounded-xl px-4 py-3 shadow-md
        ${isYou
                    ? "bg-gradient-to-r from-blue-600 to-indigo-700"
                    : "bg-gray-800"
                }
      `}
        >
            {/* Avatar */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-lg font-bold text-white">
                {username?.[0]?.toUpperCase() || "?"}
            </div>

            {/* Info */}
            <div className="flex flex-col">
                <span className="text-sm font-semibold text-white">
                    {username}
                    {isYou && <span className="ml-1 text-xs text-blue-200">(You)</span>}
                </span>

                <div className="flex items-center gap-2 text-xs text-gray-200">
                    {/* Connection */}
                    {isConnected ? (
                        <span className="flex items-center gap-1 text-green-300">
                            <Wifi size={14} /> Online
                        </span>
                    ) : (
                        <span className="flex items-center gap-1 text-red-400">
                            <WifiOff size={14} /> Disconnected
                        </span>
                    )}

                    {/* Shield */}
                    {shieldActive && (
                        <span className="flex items-center gap-1 text-cyan-300">
                            <Shield size={14} /> Shielded
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlayerInfo;
