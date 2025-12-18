import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import {
  Users,
  Loader2,
  Crown,
  Swords,
  Shield,
  Copy,
  Check,
  Castle,
} from "lucide-react";
import useAudio from "../hooks/useAudio";
import MusicControl from "../components/MusicControl";

const WaitingRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { gameState, playerReady, resetGame, rejoinRoom, opponentDisconnected } = useGame();
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [reconnectAttempted, setReconnectAttempted] = useState(false);
  const [copied, setCopied] = useState(false);

  const { isMuted, toggleMute } = useAudio("battle", {
    volume: 0.25,
    loop: true,
    autoPlay: true,
    fadeIn: true,
    fadeInDuration: 1000,
  });

  useEffect(() => {
    if (!gameState.roomId && roomId && !reconnectAttempted) {
      setIsReconnecting(true);
      setReconnectAttempted(true);
      const timer = setTimeout(() => {
        const success = rejoinRoom(roomId);
        if (!success) setIsReconnecting(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [gameState.roomId, roomId, reconnectAttempted, rejoinRoom]);

  useEffect(() => {
    if (gameState.roomId) setIsReconnecting(false);
  }, [gameState.roomId]);

  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(gameState.roomId || roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const players = gameState.players || [];
  const isFull = players.length === 2;
  const isHost = gameState.isHost;

  if (isReconnecting) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="fixed inset-0 bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950" />
        <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
          <div className="relative">
            <div className="absolute -inset-1 bg-purple-500/20 rounded-2xl blur-lg" />
            <div className="relative bg-slate-900/90 backdrop-blur-xl p-8 rounded-2xl border-2 border-purple-500/40 max-w-md w-full text-center">
              <Loader2 className="w-16 h-16 text-purple-400 mx-auto mb-4 animate-spin" />
              <h1 className="font-royal text-2xl font-bold text-purple-200 mb-4">
                Reconnecting...
              </h1>
              <p className="text-purple-300/70 font-royal">
                Rejoining room {roomId}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!gameState.roomId && reconnectAttempted) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="fixed inset-0 bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950" />
        <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
          <div className="relative">
            <div className="absolute -inset-1 bg-red-500/20 rounded-2xl blur-lg" />
            <div className="relative bg-slate-900/90 backdrop-blur-xl p-8 rounded-2xl border-2 border-red-500/40 max-w-md w-full text-center">
              <Castle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h1 className="font-royal text-2xl font-bold text-red-200 mb-4">
                Room Not Found
              </h1>
              <p className="text-red-300/70 font-royal mb-6">
                The arena doesn't exist or has expired.
              </p>
              <button
                onClick={() => navigate("/lobby")}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-royal font-bold rounded-xl transition-all"
              >
                Return to Lobby
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleLeaveRoom = () => {
    resetGame();
    navigate("/lobby");
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9InJnYmEoMjU1LDIxNSwwLDAuMDMpIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCBmaWxsPSJ1cmwoI3BhdHRlcm4pIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIi8+PC9zdmc+')] opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
      </div>

      {/* Music Control */}
      <div className="fixed top-4 right-4 z-50">
        <MusicControl
          isMuted={isMuted}
          onToggleMute={toggleMute}
          variant="lobby"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="relative max-w-lg w-full">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 via-yellow-500/10 to-purple-600/20 rounded-2xl blur-lg" />

          <div className="relative bg-slate-900/90 backdrop-blur-xl p-8 rounded-2xl border-2 border-yellow-600/30">
            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-yellow-500/50 rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-yellow-500/50 rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-yellow-500/50 rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-yellow-500/50 rounded-br-2xl" />

            {/* Header */}
            <div className="text-center mb-6">
              <Swords className="w-14 h-14 text-yellow-500 mx-auto mb-4" />
              <h1 className="font-royal text-3xl font-bold text-yellow-300 mb-2">
                Battle Arena
              </h1>
              <p className="font-royal text-yellow-200/60">
                Awaiting Challenger
              </p>
            </div>

            {/* Room ID */}
            <div className="bg-slate-800/60 rounded-xl p-4 mb-6 border border-yellow-600/20">
              <p className="text-yellow-200/60 text-xs font-royal mb-2 text-center">
                ROOM CODE
              </p>
              <div className="flex items-center justify-center gap-3">
                <span className="font-royal text-2xl text-yellow-400 tracking-widest">
                  {gameState.roomId}
                </span>
                <button
                  onClick={handleCopyRoomId}
                  className="p-2 bg-yellow-600/20 hover:bg-yellow-600/30 rounded-lg transition-colors border border-yellow-600/30"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-yellow-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Players */}
            <div className="bg-slate-800/40 rounded-xl p-5 mb-6 border border-slate-700/50">
              <div className="flex items-center justify-between mb-4">
                <span className="font-royal text-slate-400 text-sm">
                  Warriors
                </span>
                <span className="font-royal text-yellow-400 text-sm">
                  {players.length}/2
                </span>
              </div>

              <div className="space-y-3">
                {players.map((player, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 bg-gradient-to-r from-emerald-900/40 to-emerald-900/20 p-4 rounded-xl border border-emerald-500/30"
                  >
                    <div className="relative">
                      <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
                      <div className="absolute inset-0 w-3 h-3 bg-emerald-400 rounded-full animate-ping opacity-50" />
                    </div>
                    <div className="flex-1">
                      <span className="font-royal text-white text-lg">
                        {player.username}
                      </span>
                    </div>
                    {index === 0 && (
                      <div className="flex items-center gap-1.5 bg-yellow-600/20 px-3 py-1 rounded-full border border-yellow-500/30">
                        <Crown className="w-4 h-4 text-yellow-400" />
                        <span className="font-royal text-yellow-400 text-xs">
                          Host
                        </span>
                      </div>
                    )}
                  </div>
                ))}

                {!isFull && (
                  <div className="flex items-center gap-4 bg-slate-800/40 p-4 rounded-xl border border-slate-600/30 border-dashed">
                    <div className="w-3 h-3 bg-slate-600 rounded-full" />
                    <span className="font-royal text-slate-500 italic">
                      Waiting for opponent...
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Area */}
            {isFull ? (
              isHost ? (
                <button
                  onClick={playerReady}
                  className="w-full py-4 bg-gradient-to-r from-yellow-600 via-yellow-500 to-orange-500 hover:from-yellow-500 hover:via-yellow-400 hover:to-orange-400 text-slate-900 font-royal font-bold text-lg rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/30 flex items-center justify-center gap-2 uppercase tracking-wider mb-4"
                >
                  <Swords className="w-5 h-5" />
                  Begin Battle!
                </button>
              ) : (
                <div className="bg-blue-900/30 border border-blue-500/40 rounded-xl p-4 mb-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-blue-300">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="font-royal">
                      Waiting for host to start...
                    </span>
                  </div>
                </div>
              )
            ) : (
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4 mb-4 text-center">
                <p className="font-royal text-yellow-300/80 text-sm">
                  📜 Share the room code with your ally to begin the battle!
                </p>
              </div>
            )}

            <button
              onClick={handleLeaveRoom}
              className="w-full py-3 bg-slate-800/80 hover:bg-red-900/50 text-slate-300 hover:text-red-300 font-royal font-semibold rounded-xl transition-all border border-slate-700 hover:border-red-500/50"
            >
              Leave Arena
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingRoom;
