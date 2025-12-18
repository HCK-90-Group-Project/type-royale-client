import React from "react";
import { Volume2, VolumeX, Music } from "lucide-react";

const MusicControl = ({ isMuted, onToggleMute, variant = "default" }) => {
  const baseClasses =
    "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300";

  const variantClasses = {
    default:
      "bg-slate-800/50 hover:bg-slate-700/50 border border-purple-500/30",
    lobby:
      "bg-purple-900/30 hover:bg-purple-800/30 border border-purple-500/50",
    battle: "bg-red-900/30 hover:bg-red-800/30 border border-red-500/50",
  };

  return (
    <button
      onClick={onToggleMute}
      className={`${baseClasses} ${variantClasses[variant]}`}
      title={isMuted ? "Unmute Music" : "Mute Music"}
    >
      <Music className="w-4 h-4 text-purple-400" />
      {isMuted ? (
        <VolumeX className="w-5 h-5 text-red-400" />
      ) : (
        <Volume2 className="w-5 h-5 text-green-400 animate-pulse" />
      )}
      <span className="text-xs text-gray-300 hidden sm:inline">
        {isMuted ? "Music Off" : "Music On"}
      </span>
    </button>
  );
};

export default MusicControl;
