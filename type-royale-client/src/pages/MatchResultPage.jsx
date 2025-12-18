import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import {
  Trophy,
  Skull,
  Heart,
  Zap,
  Swords,
  Target,
  Home,
  RotateCcw,
  Crown,
  Castle,
  Shield,
} from "lucide-react";
import useAudio from "../hooks/useAudio";
import MusicControl from "../components/MusicControl";
import Confetti from "../components/Confetti";

const MatchResultPage = () => {
  const navigate = useNavigate();
  const { matchResult, playerData, enemyData, gameState, resetGame, isBotMode } =
    useGame();
  const [showStats, setShowStats] = useState(false);

  // Determine if current player is the winner using multiple methods for robustness
  // 1. Use isVictory flag set during match_result event (most reliable)
  // 2. Compare playerId with winnerPlayerId
  // 3. Compare username with winner name
  const storedPlayerId = localStorage.getItem("typeRoyalePlayerId");
  const isWinner = 
    matchResult?.isVictory === true ||
    matchResult?.winnerPlayerId === gameState.playerId ||
    matchResult?.winnerPlayerId === storedPlayerId ||
    matchResult?.winner === playerData.username;

  const { isMuted, toggleMute } = useAudio(isWinner ? "victory" : "defeat", {
    volume: 0.4,
    loop: false,
    autoPlay: true,
    fadeIn: true,
    fadeInDuration: 500,
  });

  useEffect(() => {
    const timer = setTimeout(() => setShowStats(true), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!matchResult) navigate("/lobby");
  }, [matchResult, navigate]);

  if (!matchResult) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0d0618] via-[#1a0a2e] to-[#0a0514] flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-xl animate-pulse" />
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const handlePlayAgain = () => {
    resetGame();
    // Note: resetGame() already navigates to /lobby, no need to navigate again
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Epic Background - Matching Theme */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#0d0618] via-[#1a0a2e] to-[#0a0514]">
        {/* Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl animate-float-medium" />
        {isWinner && (
          <div className="absolute top-1/3 right-1/3 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl animate-float-slow" />
        )}
        {!isWinner && (
          <div className="absolute top-1/3 right-1/3 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-float-slow" />
        )}

        {/* Stars */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 bg-white rounded-full ${
              i % 2 === 0 ? "animate-twinkle" : "animate-twinkle-delayed"
            }`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.2,
            }}
          />
        ))}

        {/* Winner sparkles */}
        {isWinner && (
          <>
            <div
              className="absolute top-10 left-1/4 w-3 h-3 bg-yellow-400 rounded-full animate-bounce"
              style={{ animationDelay: "0s" }}
            />
            <div
              className="absolute top-20 left-1/3 w-2 h-2 bg-orange-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.3s" }}
            />
            <div
              className="absolute top-5 right-1/4 w-3 h-3 bg-yellow-300 rounded-full animate-bounce"
              style={{ animationDelay: "0.6s" }}
            />
          </>
        )}
        {!isWinner && (
          <div className="absolute inset-0 bg-gradient-to-b from-red-950/20 via-transparent to-red-950/10" />
        )}

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
      </div>

      {/* Confetti */}
      <Confetti isActive={isWinner} duration={6000} />

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
        <div className="max-w-4xl w-full">
          {/* Result Card */}
          <div className="relative animate-fade-in">
            {/* Glow effect */}
            <div
              className={`absolute -inset-1 rounded-3xl blur-xl ${
                isWinner
                  ? "bg-gradient-to-r from-amber-500/30 via-yellow-500/20 to-amber-500/30"
                  : "bg-gradient-to-r from-red-500/20 via-red-600/15 to-red-500/20"
              }`}
            />

            <div
              className={`relative bg-[#0f0a1f]/90 backdrop-blur-xl rounded-3xl border-2 ${
                isWinner ? "border-amber-500/40" : "border-red-500/30"
              } p-8 md:p-12`}
            >
              {/* Ornate Corner decorations */}
              <div
                className={`absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 rounded-tl-2xl ${
                  isWinner ? "border-amber-500/50" : "border-red-500/40"
                }`}
              />
              <div
                className={`absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 rounded-tr-2xl ${
                  isWinner ? "border-amber-500/50" : "border-red-500/40"
                }`}
              />
              <div
                className={`absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 rounded-bl-2xl ${
                  isWinner ? "border-amber-500/50" : "border-red-500/40"
                }`}
              />
              <div
                className={`absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 rounded-br-2xl ${
                  isWinner ? "border-amber-500/50" : "border-red-500/40"
                }`}
              />

              {/* Icon */}
              <div className="text-center mb-8">
                <div className={`relative inline-block`}>
                  <div
                    className={`absolute -inset-4 rounded-full blur-xl animate-pulse ${
                      isWinner ? "bg-yellow-500/40" : "bg-red-500/30"
                    }`}
                  />
                  <div
                    className={`relative w-28 h-28 md:w-36 md:h-36 rounded-full flex items-center justify-center ${
                      isWinner
                        ? "bg-gradient-to-br from-yellow-500 via-yellow-400 to-orange-500 shadow-2xl shadow-yellow-500/50"
                        : "bg-gradient-to-br from-red-700 via-red-600 to-red-800 shadow-2xl shadow-red-500/30"
                    }`}
                  >
                    {isWinner ? (
                      <Trophy className="w-14 h-14 md:w-18 md:h-18 text-white drop-shadow-lg" />
                    ) : (
                      <Skull className="w-14 h-14 md:w-18 md:h-18 text-white drop-shadow-lg" />
                    )}
                  </div>
                </div>

                {/* Result Title */}
                <h1
                  className={`font-royal text-5xl md:text-7xl font-bold mt-6 mb-4 ${
                    isWinner
                      ? "text-yellow-400 text-glow-gold"
                      : "text-red-400 text-glow-red"
                  }`}
                >
                  {isWinner ? "VICTORY!" : "DEFEAT"}
                </h1>

                {/* Winner Info */}
                <div className="flex items-center justify-center gap-3">
                  <Crown
                    className={`w-6 h-6 ${
                      isWinner ? "text-yellow-400" : "text-red-400"
                    }`}
                  />
                  <p className="font-royal text-xl text-slate-300">
                    Champion:{" "}
                    <span className="font-bold text-white">
                      {matchResult.winner}
                    </span>
                  </p>
                </div>

                {matchResult.reason && (
                  <p className="font-royal text-slate-500 mt-2">
                    {matchResult.reason}
                  </p>
                )}
              </div>

              {/* Stats Comparison */}
              {showStats && (
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {/* Player Stats */}
                  <div className="relative group">
                    <div
                      className={`absolute -inset-0.5 rounded-2xl blur opacity-50 ${
                        isWinner ? "bg-emerald-500/20" : "bg-red-500/20"
                      }`}
                    />
                    <div
                      className={`relative bg-[#0a0514]/80 rounded-2xl p-6 border ${
                        isWinner ? "border-emerald-500/30" : "border-red-500/20"
                      }`}
                    >
                      {/* Ornate corners */}
                      <div
                        className={`absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 rounded-tl-lg ${
                          isWinner
                            ? "border-emerald-500/40"
                            : "border-red-500/30"
                        }`}
                      />
                      <div
                        className={`absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 rounded-tr-lg ${
                          isWinner
                            ? "border-emerald-500/40"
                            : "border-red-500/30"
                        }`}
                      />
                      <div
                        className={`absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 rounded-bl-lg ${
                          isWinner
                            ? "border-emerald-500/40"
                            : "border-red-500/30"
                        }`}
                      />
                      <div
                        className={`absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 rounded-br-lg ${
                          isWinner
                            ? "border-emerald-500/40"
                            : "border-red-500/30"
                        }`}
                      />

                      <div className="flex items-center justify-center gap-2 mb-5">
                        <div className="relative">
                          <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-lg" />
                          <Castle className="relative w-6 h-6 text-emerald-400" />
                        </div>
                        <h3 className="font-royal text-xl font-bold text-white">
                          {playerData.username}
                        </h3>
                        {isWinner && (
                          <Crown className="w-5 h-5 text-yellow-400" />
                        )}
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="font-royal text-slate-400 flex items-center gap-2">
                            <Heart
                              className="w-4 h-4 text-red-400"
                              fill="currentColor"
                            />{" "}
                            HP
                          </span>
                          <span
                            className={`font-royal font-bold ${
                              playerData.hp > 0
                                ? "text-emerald-400"
                                : "text-red-400"
                            }`}
                          >
                            {playerData.hp} / {playerData.maxHp}
                          </span>
                        </div>

                        {/* Fixed HP Bar */}
                        <div className="relative w-full h-4 bg-black/60 rounded-full overflow-hidden border border-emerald-500/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
                          <div
                            className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
                              playerData.hp > 0
                                ? "bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400"
                                : "bg-red-600"
                            }`}
                            style={{
                              width: `${Math.max(
                                0,
                                (playerData.hp / playerData.maxHp) * 100
                              )}%`,
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-white/15 to-transparent rounded-full" />
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <span className="font-royal text-slate-400 flex items-center gap-2">
                            <Zap className="w-4 h-4 text-amber-400" /> Spells
                            Cast
                          </span>
                          <span className="font-royal font-bold text-amber-400">
                            {playerData.maxAmmo - playerData.ammo}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enemy Stats */}
                  <div className="relative group">
                    <div
                      className={`absolute -inset-0.5 rounded-2xl blur opacity-50 ${
                        !isWinner ? "bg-emerald-500/20" : "bg-red-500/20"
                      }`}
                    />
                    <div
                      className={`relative bg-[#0a0514]/80 rounded-2xl p-6 border ${
                        !isWinner
                          ? "border-emerald-500/30"
                          : "border-red-500/20"
                      }`}
                    >
                      {/* Ornate corners */}
                      <div
                        className={`absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 rounded-tl-lg ${
                          !isWinner
                            ? "border-emerald-500/40"
                            : "border-red-500/30"
                        }`}
                      />
                      <div
                        className={`absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 rounded-tr-lg ${
                          !isWinner
                            ? "border-emerald-500/40"
                            : "border-red-500/30"
                        }`}
                      />
                      <div
                        className={`absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 rounded-bl-lg ${
                          !isWinner
                            ? "border-emerald-500/40"
                            : "border-red-500/30"
                        }`}
                      />
                      <div
                        className={`absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 rounded-br-lg ${
                          !isWinner
                            ? "border-emerald-500/40"
                            : "border-red-500/30"
                        }`}
                      />

                      <div className="flex items-center justify-center gap-2 mb-5">
                        <div className="relative">
                          <div className="absolute inset-0 bg-red-500/20 rounded-full blur-lg" />
                          <Target className="relative w-6 h-6 text-red-400" />
                        </div>
                        <h3 className="font-royal text-xl font-bold text-white">
                          {enemyData.username}
                        </h3>
                        {!isWinner && (
                          <Crown className="w-5 h-5 text-yellow-400" />
                        )}
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="font-royal text-slate-400 flex items-center gap-2">
                            <Heart
                              className="w-4 h-4 text-red-400"
                              fill="currentColor"
                            />{" "}
                            HP
                          </span>
                          <span
                            className={`font-royal font-bold ${
                              enemyData.hp > 0
                                ? "text-emerald-400"
                                : "text-red-400"
                            }`}
                          >
                            {enemyData.hp} / {enemyData.maxHp}
                          </span>
                        </div>

                        {/* Fixed HP Bar */}
                        <div className="relative w-full h-4 bg-black/60 rounded-full overflow-hidden border border-red-500/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
                          <div
                            className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
                              enemyData.hp > 0
                                ? "bg-gradient-to-r from-red-600 via-red-500 to-red-400"
                                : "bg-slate-600"
                            }`}
                            style={{
                              width: `${Math.max(
                                0,
                                (enemyData.hp / enemyData.maxHp) * 100
                              )}%`,
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-white/15 to-transparent rounded-full" />
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <span className="font-royal text-slate-400 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-blue-400" /> Type
                          </span>
                          <span className="font-royal font-bold text-blue-400">
                            {isBotMode ? "AI Bot" : "Player"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {/* Battle Again - Primary Button with Glow */}
                <button
                  onClick={handlePlayAgain}
                  className="group/btn relative overflow-hidden rounded-xl p-[2px] focus:outline-none transition-all duration-300 hover:scale-[1.02]"
                >
                  <span
                    className={`absolute inset-0 rounded-xl blur-sm animate-pulse ${
                      isWinner
                        ? "bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 opacity-75"
                        : "bg-gradient-to-r from-purple-400 via-purple-500 to-purple-400 opacity-60"
                    }`}
                  />
                  <span
                    className={`absolute inset-0 rounded-xl ${
                      isWinner
                        ? "bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400"
                        : "bg-gradient-to-r from-purple-500 via-purple-600 to-purple-500"
                    }`}
                  />
                  <span
                    className={`relative flex h-full w-full cursor-pointer items-center justify-center gap-2 rounded-[10px] px-8 py-4 font-royal font-bold text-lg uppercase tracking-wider ${
                      isWinner
                        ? "bg-gradient-to-r from-amber-500 via-yellow-600 to-amber-500 text-slate-900"
                        : "bg-gradient-to-r from-purple-600 via-purple-700 to-purple-600 text-white"
                    }`}
                  >
                    <RotateCcw className="w-5 h-5" />
                    Battle Again
                  </span>
                </button>

                {/* Return to Lobby - Secondary Button */}
                <button
                  onClick={handlePlayAgain}
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-[#0a0514]/80 hover:bg-[#1a0a2e] text-slate-300 hover:text-white font-royal font-bold text-lg rounded-xl transition-all duration-300 hover:scale-[1.02] border border-purple-500/30 hover:border-purple-500/50"
                >
                  <Home className="w-5 h-5" />
                  Return to Lobby
                </button>
              </div>
            </div>
          </div>

          {/* Match ID */}
          {matchResult.matchId && (
            <p className="text-center font-royal text-purple-400/50 text-sm mt-6">
              Battle Record: {matchResult.matchId}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchResultPage;
