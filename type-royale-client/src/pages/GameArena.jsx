import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import {
  Heart,
  Crosshair,
  Shield,
  Flame,
  Target,
  LogOut,
  Crown,
  Swords,
  Castle,
  Sparkles,
} from "lucide-react";
import Card from "../components/Card";
import { useSoundEffect } from "../hooks/useAudio";
import jungleBg from "../assets/images/background/jungle_bg.png";
import towerPlayer from "../assets/images/towers/tower_player.png";
import towerEnemy from "../assets/images/towers/tower_enemy.png";

const GameArena = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const {
    playerData,
    enemyData,
    gameState,
    submitWord,
    selectCard,
    matchResult,
    rejoinRoom,
    quitGame,
    isBotMode,
    opponentDisconnected,
  } = useGame();

  const [typedWord, setTypedWord] = useState("");
  const [message, setMessage] = useState("");
  const [attackAnimation, setAttackAnimation] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [reconnectAttempted, setReconnectAttempted] = useState(false);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);

  // Visual effects
  const [screenShake, setScreenShake] = useState(false);
  const [damageFlash, setDamageFlash] = useState(false);
  const [prevPlayerHp, setPrevPlayerHp] = useState(playerData.hp);
  const [prevEnemyHp, setPrevEnemyHp] = useState(enemyData.hp);
  const [enemyDamageFlash, setEnemyDamageFlash] = useState(false);

  const { play: playAttackSound } = useSoundEffect("attack");

  useEffect(() => {
    if (playerData.hp < prevPlayerHp) {
      setDamageFlash(true);
      setTimeout(() => setDamageFlash(false), 500);
    }
    setPrevPlayerHp(playerData.hp);
  }, [playerData.hp, prevPlayerHp]);

  useEffect(() => {
    if (enemyData.hp < prevEnemyHp) {
      setEnemyDamageFlash(true);
      setTimeout(() => setEnemyDamageFlash(false), 400);
    }
    setPrevEnemyHp(enemyData.hp);
  }, [enemyData.hp, prevEnemyHp]);

  const isLowHp = playerData.hp <= 20;

  useEffect(() => {
    if (gameState.status === "finished" || matchResult) {
      navigate("/result");
      return;
    }
    if (gameState.status === "playing" && gameState.roomId === roomId) {
      setIsReconnecting(false);
      return;
    }
    if (
      gameState.status !== "playing" &&
      gameState.status !== "finished" &&
      roomId &&
      !reconnectAttempted
    ) {
      setIsReconnecting(true);
      setReconnectAttempted(true);
      const timer = setTimeout(() => {
        const success = rejoinRoom(roomId);
        if (!success) setIsReconnecting(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [
    gameState.status,
    gameState.roomId,
    roomId,
    reconnectAttempted,
    rejoinRoom,
    matchResult,
    navigate,
  ]);

  useEffect(() => {
    if (gameState.status === "playing") setIsReconnecting(false);
  }, [gameState.status]);

  const handleSubmit = () => {
    if (!typedWord.trim() || !gameState.selectedCard) return;
    const result = submitWord(typedWord);
    setMessage(result.message);

    if (result.success) {
      setTypedWord("");
      if (gameState.selectedCard !== "shield") {
        playAttackSound();
        setAttackAnimation(true);
        setTimeout(() => setAttackAnimation(false), 600);
      }
    } else {
      setScreenShake(true);
      setTimeout(() => setScreenShake(false), 500);
    }
    setTimeout(() => setMessage(""), 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  const cards = [
    { type: "easy", damage: 10, difficulty: "3-4 letters" },
    { type: "medium", damage: 15, difficulty: "5-7 letters" },
    { type: "hard", damage: 20, difficulty: "8+ letters" },
    { type: "shield", damage: 0, difficulty: "Defense" },
  ];

  if (isReconnecting) {
    return (
      <div className="min-h-screen font-royal selection:bg-amber-500/30 selection:text-amber-200 relative overflow-hidden">
        {/* Background */}
        <div className="fixed inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d0618] via-[#1a0a2e] to-[#0a0514]" />
          <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[120px] animate-float-slow" />
          <div className="absolute top-[30%] right-[5%] w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px] animate-float-medium" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.7)_100%)]" />
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-600/30 via-purple-600/30 to-amber-600/30 rounded-2xl blur opacity-60 animate-pulse" />
            <div className="relative bg-[#0f0a1f]/80 backdrop-blur-xl p-8 rounded-2xl border border-amber-500/20 max-w-md w-full text-center">
              <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <h1 className="font-royal text-2xl font-bold text-amber-200 mb-4">
                Reconnecting...
              </h1>
              <p className="font-royal text-amber-300/60">
                Rejoining battle {roomId}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState.status !== "playing" && !matchResult && reconnectAttempted) {
    return (
      <div className="min-h-screen font-royal selection:bg-amber-500/30 selection:text-amber-200 relative overflow-hidden">
        {/* Background */}
        <div className="fixed inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d0618] via-[#1a0a2e] to-[#0a0514]" />
          <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[120px] animate-float-slow" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.7)_100%)]" />
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 bg-red-500/30 rounded-full blur-2xl animate-pulse" />
              <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 p-5 rounded-full border border-red-500/30">
                <Castle className="w-12 h-12 text-red-400" />
              </div>
            </div>
            <div className="font-royal text-2xl text-red-300 mb-6">
              No active battle found
            </div>
            <button
              onClick={() => navigate("/lobby")}
              className="group/btn relative overflow-hidden rounded-xl p-[2px] focus:outline-none transition-all duration-300 hover:scale-[1.02]"
            >
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400 via-purple-600 to-purple-400 opacity-75 blur-sm animate-pulse" />
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400 via-purple-500 to-purple-400" />
              <span className="relative flex h-full w-full cursor-pointer items-center justify-center rounded-[10px] bg-gradient-to-r from-purple-500 via-purple-600 to-purple-500 px-8 py-4 text-lg font-royal font-bold text-white gap-3 uppercase tracking-wider">
                Return to Lobby
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState.status !== "playing" && !matchResult && !reconnectAttempted) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="fixed inset-0 bg-gradient-to-b from-[#0d0618] via-[#1a0a2e] to-[#0a0514]" />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen relative font-royal selection:bg-amber-500/30 selection:text-amber-200 ${
        screenShake ? "animate-shake" : ""
      }`}
    >
      {/* Background with overlay */}
      <div className="fixed inset-0 -z-10">
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: `url(${jungleBg})` }}
        />
        {/* Dark overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0618]/80 via-[#1a0a2e]/60 to-[#0a0514]/80" />
        {/* Subtle magical orbs */}
        <div className="absolute top-[5%] left-[5%] w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[100px] animate-float-slow" />
        <div className="absolute bottom-[10%] right-[5%] w-[250px] h-[250px] bg-amber-500/10 rounded-full blur-[80px] animate-float-medium" />
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]" />
      </div>

      {/* Low HP Vignette */}
      {isLowHp && (
        <div className="fixed inset-0 pointer-events-none z-30 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-red-900/60 via-transparent to-red-900/60" />
          <div className="absolute inset-0 bg-gradient-to-b from-red-900/40 via-transparent to-red-900/40" />
        </div>
      )}

      {/* Damage Flash */}
      {damageFlash && (
        <div className="fixed inset-0 pointer-events-none z-40 bg-red-500/30 animate-flash" />
      )}

      {/* Quit Modal */}
      {showQuitConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative max-w-md w-full group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600/30 via-red-400/20 to-red-600/30 rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-500" />
            <div className="relative bg-[#0f0a1f]/95 backdrop-blur-xl p-8 rounded-2xl border border-red-500/30 text-center">
              {/* Ornate Corners */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-red-500/30 rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-red-500/30 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-red-500/30 rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-red-500/30 rounded-br-lg" />

              <div className="relative inline-block mb-4">
                <div className="absolute inset-0 bg-red-500/30 rounded-full blur-xl animate-pulse" />
                <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 p-4 rounded-full border border-red-500/30">
                  <LogOut className="w-10 h-10 text-red-400" />
                </div>
              </div>

              <h2 className="font-royal text-2xl font-bold text-red-300 mb-4">
                Retreat?
              </h2>
              <p className="font-royal text-slate-400 mb-6">
                {isBotMode
                  ? "Your training will be lost."
                  : "You will forfeit this battle."}
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setShowQuitConfirm(false)}
                  className="px-6 py-3 bg-black/40 hover:bg-black/60 text-amber-200/70 hover:text-amber-200 font-royal font-bold rounded-xl transition-all border border-white/10 hover:border-amber-500/30"
                >
                  Stay
                </button>
                <button
                  onClick={() => {
                    setShowQuitConfirm(false);
                    quitGame();
                  }}
                  className="group/btn relative overflow-hidden rounded-xl p-[2px] focus:outline-none transition-all duration-300 hover:scale-[1.02]"
                >
                  <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-400 via-red-600 to-red-400 opacity-75 blur-sm animate-pulse" />
                  <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-400 via-red-500 to-red-400" />
                  <span className="relative flex h-full w-full cursor-pointer items-center justify-center rounded-[10px] bg-gradient-to-r from-red-600 via-red-700 to-red-600 px-6 py-3 font-royal font-bold text-white uppercase tracking-wider">
                    Retreat
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quit Button */}
      <button
        onClick={() => setShowQuitConfirm(true)}
        className="fixed top-4 left-4 z-40 flex items-center gap-2 px-4 py-2.5 bg-[#0f0a1f]/80 hover:bg-red-900/60 backdrop-blur-xl text-red-300 hover:text-red-200 font-royal font-bold rounded-xl transition-all border border-red-500/30 hover:border-red-500/50"
      >
        <LogOut className="w-5 h-5" />
        <span className="hidden sm:inline">Retreat</span>
      </button>

      {/* Main Content */}
      <div className="relative z-10 p-4 md:p-6 max-w-7xl mx-auto">
        {/* Enemy Section */}
        <div className="mb-4">
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600/20 via-red-400/10 to-red-600/20 rounded-2xl blur opacity-60" />

            <div className="relative bg-[#0f0a1f]/80 backdrop-blur-xl rounded-2xl p-4 md:p-5 border border-red-500/30">
              {/* Ornate Corners */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-red-500/30 rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-red-500/30 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-red-500/30 rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-red-500/30 rounded-br-lg" />

              {/* Opponent Disconnected Overlay */}
              {opponentDisconnected && (
                <div className="absolute inset-0 bg-yellow-900/40 backdrop-blur-sm rounded-2xl z-10 flex items-center justify-center">
                  <div className="flex items-center gap-2 bg-yellow-800/80 px-4 py-2 rounded-xl border border-yellow-500/50">
                    <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                    <span className="font-royal text-yellow-200 text-sm">Opponent reconnecting...</span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-red-500/20 rounded-full blur-lg" />
                    <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 p-2.5 rounded-full border border-red-500/30">
                      <Target className="w-6 h-6 text-red-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-royal text-xl md:text-2xl font-bold text-red-200">
                      {enemyData.username}
                    </h3>
                    <p className="font-royal text-red-400/60 text-xs uppercase tracking-wide">
                      Enemy Tower
                    </p>
                  </div>
                </div>

                {/* Enemy HP Bar - FIXED */}
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-4 h-4 text-red-400" />
                    <span className="font-royal text-red-200 font-bold text-sm">
                      {enemyData.hp} / {enemyData.maxHp}
                    </span>
                  </div>
                  <div
                    className={`relative w-full h-6 bg-black/60 rounded-full overflow-hidden border-2 border-red-500/40 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] ${
                      enemyDamageFlash ? "animate-damage-flash" : ""
                    }`}
                  >
                    {/* HP Fill */}
                    <div
                      className={`absolute inset-y-0 left-0 bg-gradient-to-r from-red-600 via-red-500 to-red-400 transition-all duration-500 rounded-full ${
                        enemyDamageFlash ? "brightness-150" : ""
                      }`}
                      style={{
                        width: `${Math.max(
                          0,
                          (enemyData.hp / enemyData.maxHp) * 100
                        )}%`,
                      }}
                    />
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-full" />
                  </div>
                </div>

                {enemyData.shield && (
                  <div className="animate-pulse">
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-lg" />
                      <Shield
                        className="w-10 h-10 text-blue-400 relative"
                        fill="currentColor"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Battle Arena */}
        <div className="relative rounded-2xl min-h-[400px] md:min-h-[480px] mb-4 overflow-hidden">
          {/* Towers */}
          <img
            src={towerEnemy}
            alt="Enemy tower"
            className={`pointer-events-none select-none absolute bottom-4 right-4 md:right-8 h-40 md:h-56 object-contain drop-shadow-2xl ${
              enemyDamageFlash ? "animate-tower-hit" : ""
            }`}
          />
          <img
            src={towerPlayer}
            alt="Player tower"
            className={`pointer-events-none select-none absolute bottom-4 left-4 md:left-8 h-40 md:h-56 object-contain drop-shadow-2xl ${
              damageFlash ? "animate-tower-hit" : ""
            }`}
          />

          {/* Center Content */}
          <div className="relative z-10 flex flex-col items-center justify-center w-full h-full min-h-[400px] md:min-h-[480px] pb-44 md:pb-48">
            {attackAnimation && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Flame className="w-24 h-24 md:w-32 md:h-32 text-orange-500 animate-ping" />
              </div>
            )}

            {gameState.selectedCard && gameState.currentWord ? (
              <div className="text-center px-4">
                <p className="font-royal text-amber-200/70 mb-2 text-sm">
                  Cast the spell:
                </p>
                <p className="font-royal text-amber-400/80 text-xs mb-4">
                  ⚠️ Case-sensitive typing
                </p>

                {/* Word Display Box */}
                <div className="relative inline-block mb-6 group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/30 via-yellow-500/20 to-amber-500/30 rounded-2xl blur-lg opacity-75" />
                  <div className="relative">
                    {/* Ornate corners */}
                    <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-amber-500/50 rounded-tl-lg" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-amber-500/50 rounded-tr-lg" />
                    <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-amber-500/50 rounded-bl-lg" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-amber-500/50 rounded-br-lg" />
                    <h2 className="font-mono text-4xl md:text-6xl font-bold text-white tracking-wider bg-[#0f0a1f]/80 backdrop-blur-sm px-8 py-4 rounded-xl border border-amber-500/30">
                      {gameState.currentWord}
                    </h2>
                  </div>
                </div>

                <div className="max-w-md mx-auto">
                  {/* Input Field */}
                  <div className="relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 via-amber-500/10 to-purple-500/20 rounded-xl blur opacity-50" />
                    <input
                      type="text"
                      value={typedWord}
                      onChange={(e) => setTypedWord(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="relative w-full px-6 py-4 text-xl md:text-2xl text-center bg-[#0f0a1f]/90 border border-amber-500/30 rounded-xl text-white font-mono focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/30 transition-all placeholder-slate-500"
                      placeholder="Type here..."
                      autoFocus
                    />
                  </div>

                  {/* Cast Spell Button with Glow Animation */}
                  <button
                    onClick={handleSubmit}
                    className="group/btn relative overflow-hidden rounded-xl p-[2px] mt-4 focus:outline-none transition-all duration-300 hover:scale-[1.02]"
                  >
                    <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 opacity-75 blur-sm animate-pulse" />
                    <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400" />
                    <span className="relative flex h-full w-full cursor-pointer items-center justify-center rounded-[10px] bg-gradient-to-r from-amber-500 via-yellow-600 to-amber-500 px-8 py-3 font-royal font-bold text-slate-900 uppercase tracking-wider text-lg">
                      ⚔️ Cast Spell
                    </span>
                  </button>
                </div>

                {message && (
                  <p
                    className={`mt-4 font-royal text-lg font-bold ${
                      message.includes("Incorrect")
                        ? "text-red-400"
                        : "text-emerald-400"
                    }`}
                  >
                    {message}
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-xl" />
                  <Crosshair className="relative w-16 h-16 md:w-20 md:h-20 text-amber-500/60 mx-auto mb-4" />
                </div>
                <p className="font-royal text-xl md:text-2xl text-amber-300/80">
                  Select a spell card!
                </p>
              </div>
            )}
          </div>

          {/* Card Deck */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2 md:gap-4 justify-center">
            {cards.map((card) => (
              <Card
                key={card.type}
                type={card.type}
                damage={card.damage}
                difficulty={card.difficulty}
                onClick={() => selectCard(card.type)}
                disabled={
                  gameState.selectedCard !== null || playerData.ammo <= 0
                }
                isSelected={gameState.selectedCard === card.type}
              />
            ))}
          </div>
        </div>

        {/* Player Section */}
        <div className="relative group">
          {/* Glow effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600/20 via-emerald-400/10 to-emerald-600/20 rounded-2xl blur opacity-60" />

          <div className="relative bg-[#0f0a1f]/80 backdrop-blur-xl rounded-2xl p-4 md:p-5 border border-emerald-500/30">
            {/* Ornate Corners */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-emerald-500/30 rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-emerald-500/30 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-emerald-500/30 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-emerald-500/30 rounded-br-lg" />

            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-lg" />
                  <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 p-2.5 rounded-full border border-yellow-500/30">
                    <Crown className="w-6 h-6 text-yellow-400" />
                  </div>
                </div>
                <div>
                  <h3 className="font-royal text-xl md:text-2xl font-bold text-emerald-200">
                    {playerData.username}
                  </h3>
                  <p className="font-royal text-emerald-400/60 text-xs uppercase tracking-wide">
                    Your Tower
                  </p>
                </div>
              </div>

              {/* Player HP Bar - FIXED */}
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <Heart
                    className={`w-4 h-4 ${
                      isLowHp ? "text-red-400" : "text-emerald-400"
                    }`}
                    fill="currentColor"
                  />
                  <span
                    className={`font-royal font-bold text-sm ${
                      isLowHp ? "text-red-400" : "text-emerald-200"
                    }`}
                  >
                    {playerData.hp} / {playerData.maxHp}
                  </span>
                  {isLowHp && (
                    <span className="text-red-400 text-xs animate-pulse font-royal">
                      ⚠️ CRITICAL
                    </span>
                  )}
                </div>
                <div
                  className={`relative w-full h-6 bg-black/60 rounded-full overflow-hidden border-2 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] ${
                    isLowHp ? "border-red-500/50" : "border-emerald-500/40"
                  } ${damageFlash ? "animate-damage-flash" : ""}`}
                >
                  {/* HP Fill */}
                  <div
                    className={`absolute inset-y-0 left-0 transition-all duration-500 rounded-full ${
                      isLowHp
                        ? "bg-gradient-to-r from-red-600 via-red-500 to-red-400"
                        : "bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400"
                    } ${damageFlash ? "brightness-150" : ""}`}
                    style={{
                      width: `${Math.max(
                        0,
                        (playerData.hp / playerData.maxHp) * 100
                      )}%`,
                    }}
                  />
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-full" />
                </div>
              </div>

              {/* Ammo Counter */}
              <div className="text-center bg-[#0a0514]/60 rounded-xl px-5 py-2.5 border border-yellow-600/30">
                <p className="font-royal text-yellow-400 text-xs tracking-wider uppercase">
                  Ammo
                </p>
                <p className="font-royal text-2xl md:text-3xl font-bold text-white">
                  {playerData.ammo}
                </p>
              </div>

              {playerData.shield && (
                <div className="animate-pulse">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-lg" />
                    <Shield
                      className="w-10 h-10 text-blue-400 relative"
                      fill="currentColor"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameArena;
