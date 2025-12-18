import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import {
  Plus,
  LogIn,
  Bot,
  LogOut,
  User,
  Trophy,
  Crown,
  Swords,
  Shield,
  Castle,
  Users,
  Scroll,
  Sparkles,
  Flame,
} from "lucide-react";
import useAudio from "../hooks/useAudio";
import MusicControl from "../components/MusicControl";

const Lobby = () => {
  const navigate = useNavigate();
  const { createRoom, joinRoom, connectSocket, startBotGame } = useGame();
  const [roomId, setRoomId] = useState("");
  const [mode, setMode] = useState("menu");
  const [user, setUser] = useState(null);

  const { isMuted, toggleMute } = useAudio("battle", {
    volume: 0.25,
    loop: true,
    autoPlay: true,
    fadeIn: true,
    fadeInDuration: 2000,
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("typeRoyaleUser");
    const savedGameState = localStorage.getItem("typeRoyaleState");

    if (savedGameState) {
      try {
        const parsed = JSON.parse(savedGameState);
        if (parsed.gameState?.roomId && parsed.gameState?.status) {
          if (parsed.gameState.status === "playing") {
            navigate(`/game/${parsed.gameState.roomId}`);
            return;
          } else if (parsed.gameState.status === "lobby") {
            navigate(`/room/${parsed.gameState.roomId}`);
            return;
          }
        }
      } catch (e) {
        console.error("Failed to parse game state:", e);
      }
    }

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse user data:", e);
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, [navigate]);

  const username = user?.username || "";

  const handleLogout = () => {
    localStorage.removeItem("typeRoyaleToken");
    localStorage.removeItem("typeRoyaleUser");
    navigate("/");
  };

  const handleBotGame = () => {
    if (!username) {
      alert("User not logged in!");
      return;
    }
    startBotGame(username);
  };

  const handleCreateRoom = () => {
    if (!username) {
      alert("User not logged in!");
      return;
    }
    connectSocket();
    setTimeout(() => createRoom(username), 500);
  };

  const handleJoinRoom = () => {
    if (!roomId.trim()) {
      alert("Please enter room ID!");
      return;
    }
    if (!username) {
      alert("User not logged in!");
      return;
    }
    connectSocket();
    setTimeout(() => joinRoom(roomId, username), 500);
  };

  return (
    <div className="min-h-screen relative overflow-hidden font-royal selection:bg-amber-500/30 selection:text-amber-200">
      {/* --- EPIC MEDIEVAL BACKGROUND (Same as LoginPage) --- */}
      <div className="fixed inset-0">
        {/* Base: Deep royal gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0618] via-[#1a0a2e] to-[#0a0514]" />

        {/* Castle silhouette at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black/80 to-transparent" />

        {/* Mystical fog/mist layer */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-purple-900/20 to-transparent animate-pulse" />

        {/* Large floating magical orbs */}
        <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[120px] animate-float-slow" />
        <div className="absolute top-[30%] right-[5%] w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px] animate-float-medium" />
        <div className="absolute bottom-[20%] left-[20%] w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[80px] animate-float-slow" />

        {/* Subtle grid pattern for mystical feel */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />

        {/* Animated stars/particles */}
        <div className="absolute top-[15%] left-[20%] w-1 h-1 bg-amber-300 rounded-full animate-twinkle shadow-[0_0_6px_rgba(251,191,36,0.9)]" />
        <div className="absolute top-[25%] right-[25%] w-1.5 h-1.5 bg-amber-200 rounded-full animate-twinkle-delayed shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
        <div className="absolute top-[10%] right-[40%] w-1 h-1 bg-purple-300 rounded-full animate-twinkle shadow-[0_0_6px_rgba(192,132,252,0.9)]" />
        <div className="absolute top-[35%] left-[35%] w-0.5 h-0.5 bg-white rounded-full animate-twinkle-delayed shadow-[0_0_4px_rgba(255,255,255,0.9)]" />
        <div className="absolute top-[8%] left-[60%] w-1 h-1 bg-amber-400 rounded-full animate-twinkle shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
        <div className="absolute top-[20%] left-[75%] w-0.5 h-0.5 bg-purple-200 rounded-full animate-twinkle-delayed shadow-[0_0_4px_rgba(192,132,252,0.8)]" />
        <div className="absolute top-[45%] right-[15%] w-1 h-1 bg-amber-300 rounded-full animate-twinkle shadow-[0_0_5px_rgba(251,191,36,0.7)]" />
        <div className="absolute top-[5%] left-[45%] w-1.5 h-1.5 bg-white rounded-full animate-twinkle shadow-[0_0_8px_rgba(255,255,255,0.6)]" />

        {/* Diagonal light rays from top */}
        <div className="absolute top-0 left-1/4 w-1 h-[40vh] bg-gradient-to-b from-amber-500/10 to-transparent rotate-[15deg] blur-sm" />
        <div className="absolute top-0 right-1/3 w-0.5 h-[35vh] bg-gradient-to-b from-purple-400/10 to-transparent rotate-[-10deg] blur-sm" />

        {/* Vignette overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.7)_100%)]" />
      </div>

      {/* User Info Bar */}
      {user && (
        <div className="fixed top-0 left-0 right-0 bg-[#0f0a1f]/90 backdrop-blur-xl border-b border-amber-500/20 z-50">
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-amber-500/30 rounded-full blur-md animate-pulse" />
                <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 p-2.5 rounded-full border border-amber-500/30 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                  <Crown className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <div>
                <p className="text-amber-200 font-royal font-bold text-lg">
                  {user.username}
                </p>
                <p className="text-amber-300/50 text-xs font-royal">
                  Level {user.level || 1} Knight • {user.total_wins || 0}{" "}
                  Victories
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-[#0f0a1f]/60 px-4 py-2 rounded-xl border border-amber-500/20">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span className="font-royal font-semibold text-amber-200">
                  {user.win_rate || 0}%
                </span>
              </div>
              <MusicControl
                isMuted={isMuted}
                onToggleMute={toggleMute}
                variant="lobby"
              />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-950/40 hover:bg-red-900/50 border border-red-500/30 rounded-xl text-red-300 hover:text-red-200 transition-all font-royal"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-semibold">Leave</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6 pt-24">
        <div className="max-w-5xl w-full">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="relative inline-block mb-4">
              {/* Back Glow behind Castle */}
              <div className="absolute inset-0 bg-amber-500/30 rounded-full blur-2xl animate-pulse" />
              <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 p-5 rounded-full shadow-[0_0_30px_rgba(234,179,8,0.2)] border border-amber-500/20 ring-1 ring-amber-500/10">
                <Castle className="w-12 h-12 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
              </div>
            </div>
            <h1 className="font-royal text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-400 to-amber-600 mb-3 text-glow-gold tracking-tight">
              The Royal Arena
            </h1>
            <div className="flex items-center justify-center gap-3 text-amber-300/60 text-sm font-royal font-semibold tracking-[0.25em] uppercase">
              <span className="w-10 h-[2px] bg-gradient-to-r from-transparent via-amber-500/50 to-amber-500/30"></span>
              <span className="flex items-center gap-2">
                <Flame className="w-3 h-3 text-orange-400 animate-pulse" />
                Choose Your Path to Glory
                <Flame className="w-3 h-3 text-orange-400 animate-pulse" />
              </span>
              <span className="w-10 h-[2px] bg-gradient-to-l from-transparent via-amber-500/50 to-amber-500/30"></span>
            </div>
          </div>

          {/* Main Menu */}
          {mode === "menu" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {/* VS Bot */}
              <button
                onClick={() => setMode("bot")}
                className="group relative overflow-hidden bg-[#0f0a1f]/80 backdrop-blur-xl hover:bg-[#0f0a1f]/90 p-8 rounded-2xl border border-emerald-500/30 hover:border-emerald-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/10"
              >
                {/* Glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600/20 via-emerald-400/10 to-emerald-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                {/* Ornate Corners */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-emerald-500/30 rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-emerald-500/30 rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-emerald-500/30 rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-emerald-500/30 rounded-br-lg" />

                <div className="relative">
                  <Bot className="w-14 h-14 text-emerald-400 mx-auto mb-4 group-hover:scale-110 transition-transform drop-shadow-[0_0_10px_rgba(52,211,153,0.4)]" />
                  <h2 className="font-royal text-2xl font-bold text-emerald-200 mb-2">
                    VS Bot
                  </h2>
                  <p className="font-royal text-emerald-300/60 text-sm">
                    Train against AI
                  </p>
                </div>
              </button>

              {/* Create Room */}
              <button
                onClick={() => setMode("create")}
                className="group relative overflow-hidden bg-[#0f0a1f]/80 backdrop-blur-xl hover:bg-[#0f0a1f]/90 p-8 rounded-2xl border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10"
              >
                {/* Glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/20 via-purple-400/10 to-purple-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                {/* Ornate Corners */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-purple-500/30 rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-purple-500/30 rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-purple-500/30 rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-purple-500/30 rounded-br-lg" />

                <div className="relative">
                  <Scroll className="w-14 h-14 text-purple-400 mx-auto mb-4 group-hover:scale-110 transition-transform drop-shadow-[0_0_10px_rgba(192,132,252,0.4)]" />
                  <h2 className="font-royal text-2xl font-bold text-purple-200 mb-2">
                    Create Room
                  </h2>
                  <p className="font-royal text-purple-300/60 text-sm">
                    Host a new battle
                  </p>
                </div>
              </button>

              {/* Join Room */}
              <button
                onClick={() => setMode("join")}
                className="group relative overflow-hidden bg-[#0f0a1f]/80 backdrop-blur-xl hover:bg-[#0f0a1f]/90 p-8 rounded-2xl border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10"
              >
                {/* Glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/20 via-blue-400/10 to-blue-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                {/* Ornate Corners */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-blue-500/30 rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-blue-500/30 rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-blue-500/30 rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-blue-500/30 rounded-br-lg" />

                <div className="relative">
                  <Users className="w-14 h-14 text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform drop-shadow-[0_0_10px_rgba(96,165,250,0.4)]" />
                  <h2 className="font-royal text-2xl font-bold text-blue-200 mb-2">
                    Join Room
                  </h2>
                  <p className="font-royal text-blue-300/60 text-sm">
                    Enter existing arena
                  </p>
                </div>
              </button>
            </div>
          )}

          {/* Bot Game Form */}
          {mode === "bot" && (
            <div className="relative max-w-md mx-auto group">
              {/* Card Glow Border Effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600/30 via-emerald-400/20 to-emerald-600/30 rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-1000" />

              <div className="relative bg-[#0f0a1f]/80 backdrop-blur-xl p-8 rounded-2xl border border-emerald-500/20 shadow-2xl">
                {/* Ornate Corners */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-emerald-500/30 rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-emerald-500/30 rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-emerald-500/30 rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-emerald-500/30 rounded-br-lg" />

                <div className="relative inline-block mb-4 w-full text-center">
                  <div className="inline-block relative">
                    <div className="absolute inset-0 bg-emerald-500/30 rounded-full blur-xl animate-pulse" />
                    <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 p-4 rounded-full border border-emerald-500/30">
                      <Bot className="w-10 h-10 text-emerald-400" />
                    </div>
                  </div>
                </div>

                <h2 className="font-royal text-3xl font-bold text-emerald-200 mb-6 text-center">
                  Training Grounds
                </h2>

                <div className="bg-black/40 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3 mb-6">
                  <div className="bg-emerald-600/80 p-2.5 rounded-full">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-emerald-300/60 text-xs font-royal uppercase tracking-wide">
                      Playing as
                    </p>
                    <p className="text-emerald-100 font-royal font-bold text-lg">
                      {username}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleBotGame}
                  className="group/btn relative w-full overflow-hidden rounded-xl p-[2px] focus:outline-none transition-all duration-300 hover:scale-[1.02]"
                >
                  {/* Animated glow border */}
                  <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-400 via-emerald-600 to-emerald-400 opacity-75 blur-sm animate-pulse" />
                  <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-400" />
                  <span className="relative flex h-full w-full cursor-pointer items-center justify-center rounded-[10px] bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-500 px-8 py-4 text-lg font-royal font-bold text-white gap-3 uppercase tracking-wider">
                    <Swords className="w-5 h-5" />
                    Begin Training
                  </span>
                </button>

                <button
                  onClick={() => setMode("menu")}
                  className="w-full mt-4 py-3 bg-black/40 hover:bg-black/60 text-amber-200/70 hover:text-amber-200 font-royal font-semibold rounded-xl transition-all border border-white/10 hover:border-amber-500/30"
                >
                  Back to Menu
                </button>
              </div>
            </div>
          )}

          {/* Create Room Form */}
          {mode === "create" && (
            <div className="relative max-w-md mx-auto group">
              {/* Card Glow Border Effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/30 via-purple-400/20 to-purple-600/30 rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-1000" />

              <div className="relative bg-[#0f0a1f]/80 backdrop-blur-xl p-8 rounded-2xl border border-purple-500/20 shadow-2xl">
                {/* Ornate Corners */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-purple-500/30 rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-purple-500/30 rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-purple-500/30 rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-purple-500/30 rounded-br-lg" />

                <div className="relative inline-block mb-4 w-full text-center">
                  <div className="inline-block relative">
                    <div className="absolute inset-0 bg-purple-500/30 rounded-full blur-xl animate-pulse" />
                    <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 p-4 rounded-full border border-purple-500/30">
                      <Scroll className="w-10 h-10 text-purple-400" />
                    </div>
                  </div>
                </div>

                <h2 className="font-royal text-3xl font-bold text-purple-200 mb-6 text-center">
                  Create Battle Room
                </h2>

                <div className="bg-black/40 border border-purple-500/20 rounded-xl p-4 flex items-center gap-3 mb-6">
                  <div className="bg-purple-600/80 p-2.5 rounded-full">
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-purple-300/60 text-xs font-royal uppercase tracking-wide">
                      Host
                    </p>
                    <p className="text-purple-100 font-royal font-bold text-lg">
                      {username}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleCreateRoom}
                  className="group/btn relative w-full overflow-hidden rounded-xl p-[2px] focus:outline-none transition-all duration-300 hover:scale-[1.02]"
                >
                  {/* Animated glow border */}
                  <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400 via-purple-600 to-purple-400 opacity-75 blur-sm animate-pulse" />
                  <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400 via-purple-500 to-purple-400" />
                  <span className="relative flex h-full w-full cursor-pointer items-center justify-center rounded-[10px] bg-gradient-to-r from-purple-500 via-purple-600 to-purple-500 px-8 py-4 text-lg font-royal font-bold text-white gap-3 uppercase tracking-wider">
                    <Plus className="w-5 h-5" />
                    Create & Wait
                  </span>
                </button>

                <button
                  onClick={() => setMode("menu")}
                  className="w-full mt-4 py-3 bg-black/40 hover:bg-black/60 text-amber-200/70 hover:text-amber-200 font-royal font-semibold rounded-xl transition-all border border-white/10 hover:border-amber-500/30"
                >
                  Back to Menu
                </button>
              </div>
            </div>
          )}

          {/* Join Room Form */}
          {mode === "join" && (
            <div className="relative max-w-md mx-auto group">
              {/* Card Glow Border Effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/30 via-blue-400/20 to-blue-600/30 rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-1000" />

              <div className="relative bg-[#0f0a1f]/80 backdrop-blur-xl p-8 rounded-2xl border border-blue-500/20 shadow-2xl">
                {/* Ornate Corners */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-500/30 rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-blue-500/30 rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-blue-500/30 rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-500/30 rounded-br-lg" />

                <div className="relative inline-block mb-4 w-full text-center">
                  <div className="inline-block relative">
                    <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-xl animate-pulse" />
                    <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 p-4 rounded-full border border-blue-500/30">
                      <Users className="w-10 h-10 text-blue-400" />
                    </div>
                  </div>
                </div>

                <h2 className="font-royal text-3xl font-bold text-blue-200 mb-6 text-center">
                  Join Battle Room
                </h2>

                <div className="bg-black/40 border border-blue-500/20 rounded-xl p-4 flex items-center gap-3 mb-6">
                  <div className="bg-blue-600/80 p-2.5 rounded-full">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-blue-300/60 text-xs font-royal uppercase tracking-wide">
                      Challenger
                    </p>
                    <p className="text-blue-100 font-royal font-bold text-lg">
                      {username}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-blue-300/60 mb-2 font-royal text-xs uppercase tracking-wide ml-1">
                    Room Code
                  </label>
                  <input
                    type="text"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    className="w-full px-4 py-4 bg-black/50 border border-blue-500/30 rounded-xl text-blue-50 font-royal focus:outline-none focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder-slate-500 text-center text-lg tracking-widest uppercase"
                    placeholder="Enter code..."
                    autoFocus
                  />
                </div>

                <button
                  onClick={handleJoinRoom}
                  className="group/btn relative w-full overflow-hidden rounded-xl p-[2px] focus:outline-none transition-all duration-300 hover:scale-[1.02]"
                >
                  {/* Animated glow border */}
                  <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400 opacity-75 blur-sm animate-pulse" />
                  <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400" />
                  <span className="relative flex h-full w-full cursor-pointer items-center justify-center rounded-[10px] bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 px-8 py-4 text-lg font-royal font-bold text-white gap-3 uppercase tracking-wider">
                    <LogIn className="w-5 h-5" />
                    Enter Arena
                  </span>
                </button>

                <button
                  onClick={() => setMode("menu")}
                  className="w-full mt-4 py-3 bg-black/40 hover:bg-black/60 text-amber-200/70 hover:text-amber-200 font-royal font-semibold rounded-xl transition-all border border-white/10 hover:border-amber-500/30"
                >
                  Back to Menu
                </button>
              </div>
            </div>
          )}

          {/* Game Rules */}
          <div className="mt-12 relative max-w-3xl mx-auto group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-600/20 via-purple-600/20 to-amber-600/20 rounded-2xl blur opacity-40 group-hover:opacity-70 transition duration-500" />
            <div className="relative bg-[#0f0a1f]/60 backdrop-blur-xl rounded-2xl p-6 border border-amber-500/20">
              {/* Ornate Corners */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-amber-500/20 rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-amber-500/20 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-amber-500/20 rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-amber-500/20 rounded-br-lg" />

              <h3 className="font-royal text-lg font-bold text-amber-300 mb-5 text-center tracking-wider flex items-center justify-center gap-3">
                <Swords className="w-4 h-4 text-amber-400" />
                Rules of Combat
                <Swords className="w-4 h-4 text-amber-400" />
              </h3>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="group/item cursor-default">
                  <div className="text-3xl mb-2 group-hover/item:scale-110 transition-transform filter grayscale group-hover/item:grayscale-0">
                    ⚡
                  </div>
                  <p className="text-amber-200/60 text-xs font-royal">
                    Type to cast spells
                  </p>
                </div>
                <div className="group/item cursor-default">
                  <div className="text-3xl mb-2 group-hover/item:scale-110 transition-transform filter grayscale group-hover/item:grayscale-0">
                    🔥
                  </div>
                  <p className="text-amber-200/60 text-xs font-royal">
                    Choose your attack
                  </p>
                </div>
                <div className="group/item cursor-default">
                  <div className="text-3xl mb-2 group-hover/item:scale-110 transition-transform filter grayscale group-hover/item:grayscale-0">
                    🛡️
                  </div>
                  <p className="text-amber-200/60 text-xs font-royal">
                    Defend your tower
                  </p>
                </div>
                <div className="group/item cursor-default">
                  <div className="text-3xl mb-2 group-hover/item:scale-110 transition-transform filter grayscale group-hover/item:grayscale-0">
                    👑
                  </div>
                  <p className="text-amber-200/60 text-xs font-royal">
                    Claim victory!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-center gap-3 mt-8 text-amber-400/40">
            <Sparkles className="w-3 h-3" />
            <p className="text-[10px] tracking-[0.4em] font-royal font-bold uppercase">
              The Royal Arena v1.0
            </p>
            <Sparkles className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
