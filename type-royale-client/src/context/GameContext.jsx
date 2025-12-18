import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import {
  saveSessionData,
  getSessionData,
  clearSessionData,
  hasActiveSession,
} from "../utils/socketClient";

const DEV_AUTO_START = false;

const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within GameProvider");
  }
  return context;
};

export const GameProvider = ({ children }) => {
  const navigate = useNavigate();

  // Socket connection
  const [socket, setSocket] = useState(null);

  // Player state
  const [playerData, setPlayerData] = useState({
    username: "",
    hp: 100,
    maxHp: 100,
    ammo: 50,
    maxAmmo: 50,
    shield: false,
    userId: null,
  });

  // Enemy state
  const [enemyData, setEnemyData] = useState({
    username: "",
    hp: 100,
    maxHp: 100,
    shield: false,
  });

  // Game state
  const [gameState, setGameState] = useState({
    status: DEV_AUTO_START ? "playing" : "idle",
    roomId: DEV_AUTO_START ? "dev-room" : null,
    playerId: null,
    isHost: false,
    players: [],
    words: DEV_AUTO_START
      ? {
          easy: ["fire", "mage", "orb"],
          medium: ["fireball", "wizard"],
          hard: ["conflagration"],
          shield: ["barrier", "aegis"],
        }
      : {
          easy: [],
          medium: [],
          hard: [],
          shield: [],
        },
    currentWord: "",
    selectedCard: null,
    duration: 0,
  });

  // Match result
  const [matchResult, setMatchResult] = useState(null);

  // Bot mode
  const [isBotMode, setIsBotMode] = useState(false);
  const [botInterval, setBotInterval] = useState(null);

  // Track if initial state restoration has been done
  const [isInitialized, setIsInitialized] = useState(false);

  // Track temporary disconnection of opponent
  const [opponentDisconnected, setOpponentDisconnected] = useState(false);

  // Load state from localStorage on mount (only once)
  useEffect(() => {
    if (isInitialized) return;

    const savedState = localStorage.getItem("typeRoyaleState");
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        if (parsed.playerData) setPlayerData(parsed.playerData);
        if (parsed.enemyData) setEnemyData(parsed.enemyData);
        if (parsed.matchResult) setMatchResult(parsed.matchResult);
        if (parsed.gameState) setGameState(parsed.gameState);
        console.log("State restored from localStorage");
      } catch (e) {
        console.error("Failed to restore state:", e);
      }
    }
    setIsInitialized(true);
  }, [isInitialized]);

  // Handle socket reconnection when socket is ready and there's an active session
  useEffect(() => {
    if (!socket || !isInitialized) return;

    const savedState = localStorage.getItem("typeRoyaleState");
    if (!savedState) return;

    try {
      const parsed = JSON.parse(savedState);

      // Check if we need to reconnect to an active game/lobby
      if (
        (parsed.gameState?.status === "lobby" ||
          parsed.gameState?.status === "playing") &&
        parsed.gameState?.roomId &&
        !socket.connected
      ) {
        console.log(
          "Attempting to reconnect to room:",
          parsed.gameState.roomId
        );
        socket.connect();

        socket.once("connect", () => {
          console.log(
            "Socket connected! Rejoining room:",
            parsed.gameState.roomId
          );
          const userId =
            parsed.playerData?.userId ||
            localStorage.getItem("typeRoyaleUserId");
          socket.emit("rejoin_room", {
            roomId: parsed.gameState.roomId,
            username: parsed.playerData?.username,
            userId: userId,
            gameStatus: parsed.gameState.status,
          });
        });
      }
    } catch (e) {
      console.error("Failed to reconnect:", e);
    }
  }, [socket, isInitialized]);

  // Save state to localStorage whenever it changes
  // Don't save if game is finished - we want a clean slate after match ends
  useEffect(() => {
    if (gameState.status === "finished" || gameState.status === "idle") {
      // Don't save finished or idle states to prevent unwanted redirects
      return;
    }
    const stateToSave = {
      playerData,
      enemyData,
      gameState,
      matchResult,
    };
    localStorage.setItem("typeRoyaleState", JSON.stringify(stateToSave));
  }, [playerData, enemyData, gameState, matchResult]);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io("http://localhost:3000", {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 500,
      reconnectionDelayMax: 2000,
      reconnectionAttempts: 10,
      timeout: 10000,
      autoConnect: true,
    });

    // Handle reconnection with session data
    newSocket.on("connect", () => {
      console.log("✅ Socket connected:", newSocket.id);

      // Check if there's an active session to rejoin
      // Don't rejoin if the game is finished
      const session = getSessionData();
      if (hasActiveSession() && session.gameStatus !== "finished") {
        console.log("🔄 Attempting to rejoin room:", session.roomId);
        newSocket.emit("rejoin_room", {
          roomId: session.roomId,
          userId: session.userId,
          username: session.username,
          gameStatus: session.gameStatus,
        });
      }
    });

    newSocket.on("reconnect", (attemptNumber) => {
      console.log(`🔄 Reconnected after ${attemptNumber} attempts`);
    });

    newSocket.on("reconnect_attempt", (attemptNumber) => {
      console.log(`🔄 Reconnection attempt ${attemptNumber}`);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    socket.on("room_created", (data) => {
      console.log("Room created:", data);
      setGameState((prev) => ({
        ...prev,
        roomId: data.roomId,
        status: "lobby",
        isHost: true,
        players: [{ username: playerData.username }],
      }));
      // Save session data for reconnection
      saveSessionData({
        roomId: data.roomId,
        username: playerData.username,
        userId: playerData.userId,
        gameStatus: "lobby",
      });
      // Navigate to waiting room
      navigate(`/room/${data.roomId}`);
    });

    socket.on("room_update", (data) => {
      console.log("Room update:", data);
      if (data.players && data.players.length > 0) {
        setGameState((prev) => ({
          ...prev,
          players: data.players,
        }));

        if (data.players.length === 2) {
          const enemy = data.players.find(
            (p) => p.username !== playerData.username
          );
          if (enemy) {
            setEnemyData((prev) => ({ ...prev, username: enemy.username }));
          }
        }
      }
    });

    socket.on("join_room_error", (data) => {
      console.error("Join room error:", data.message);
      alert(data.message);
      setGameState((prev) => ({ ...prev, status: "idle" }));
      navigate("/lobby");
    });

    socket.on("game_start", (data) => {
      console.log("Game starting:", data);

      // Convert word array to categorized object
      const categorizedWords = {
        easy: [],
        medium: [],
        hard: [],
        shield: [],
      };

      if (data.words && Array.isArray(data.words)) {
        data.words.forEach((wordObj) => {
          const word = typeof wordObj === "string" ? wordObj : wordObj.word;
          const wordLength = word.length;

          // Categorize by word length
          if (wordLength <= 4) {
            categorizedWords.easy.push(word);
          } else if (wordLength <= 7) {
            categorizedWords.medium.push(word);
          } else {
            categorizedWords.hard.push(word);
          }

          // Also add shorter words to shield pool
          if (wordLength <= 6) {
            categorizedWords.shield.push(word);
          }
        });
      }

      console.log("Categorized words:", categorizedWords);

      // Store playerId and roomId in localStorage for persistence
      localStorage.setItem("typeRoyalePlayerId", data.yourPlayerId);
      const currentRoomId = data.gameState?.roomId || gameState.roomId;

      setGameState((prev) => ({
        ...prev,
        status: "playing",
        playerId: data.yourPlayerId,
        words: categorizedWords,
      }));

      // Update session data with game status
      saveSessionData({
        roomId: currentRoomId,
        username: playerData.username,
        userId: playerData.userId,
        gameStatus: "playing",
      });

      // Navigate to game arena
      navigate(`/game/${currentRoomId}`);
    });

    socket.on("receive_attack", (data) => {
      console.log("Received attack:", data);

      // Use server's authoritative HP value
      setPlayerData((prev) => {
        if (data.blocked) {
          // Shield blocked the attack
          return { ...prev, shield: false };
        }

        // Use targetHp from server (authoritative)
        const newHp = data.targetHp;

        // Check if player HP reaches zero (player loses)
        if (newHp <= 0) {
          setTimeout(() => {
            setMatchResult({
              winner: enemyData.username,
              reason: "Your tower destroyed",
            });
            setGameState((prev) => ({ ...prev, status: "finished" }));
            // Navigate to result page
            navigate("/result");
          }, 500);
        }

        return { ...prev, hp: newHp };
      });
    });

    socket.on("attack_launched", (data) => {
      console.log("Attack launched:", data);
      // Update ammo count if it's our attack
      if (data.from === "player1" || data.from === "player2") {
        // Visual feedback could go here
      }
    });

    socket.on("attack_impact", (data) => {
      console.log("Attack impact:", data, "My playerId:", gameState.playerId);

      // Only update enemy HP if the target is NOT us
      // We check both gameState.playerId and compare with stored playerId
      const myPlayerId =
        gameState.playerId || localStorage.getItem("typeRoyalePlayerId");

      if (data.targetPlayerId !== myPlayerId) {
        setEnemyData((prev) => ({
          ...prev,
          hp: data.targetHp,
        }));
      }
    });

    socket.on("enemy_shield_active", () => {
      console.log("Enemy activated shield");
      setEnemyData((prev) => ({ ...prev, shield: true }));

      // Remove shield visual after duration
      setTimeout(() => {
        setEnemyData((prev) => ({ ...prev, shield: false }));
      }, 5000);
    });

    socket.on("shield_activated", (data) => {
      console.log("Shield activated:", data);
    });

    socket.on("match_result", (data) => {
      console.log("Match result:", data);

      // Get current player ID from state or localStorage
      const myPlayerId = gameState.playerId || localStorage.getItem("typeRoyalePlayerId");

      // Map player1/player2 to actual usernames
      let winnerName = data.winner;
      if (data.finalState) {
        if (data.winner === "player1") {
          winnerName = data.finalState.player1?.username || "Player 1";
        } else if (data.winner === "player2") {
          winnerName = data.finalState.player2?.username || "Player 2";
        }
      }

      // Determine if current player won
      const didIWin = data.winner === myPlayerId;

      setMatchResult({
        ...data,
        winner: winnerName,
        winnerPlayerId: data.winner,
        isVictory: didIWin,
      });
      setGameState((prev) => ({ ...prev, status: "finished" }));

      // Clear all session and storage data since game is over
      clearSessionData();
      localStorage.removeItem("typeRoyaleState");
      localStorage.removeItem("typeRoyalePlayerId");

      // Navigate to result page
      navigate("/result");
    });

    socket.on("player_disconnected", (data) => {
      console.log("Player disconnected:", data);
      setOpponentDisconnected(false);
      // Clear session data since the game is over
      clearSessionData();
      alert(data.message);
      setGameState((prev) => ({ ...prev, status: "idle" }));
      navigate("/lobby");
    });

    // Handle temporary disconnection (opponent might reconnect)
    socket.on("player_temporarily_disconnected", (data) => {
      console.log("Player temporarily disconnected:", data);
      setOpponentDisconnected(true);
    });

    // Handle opponent reconnection
    socket.on("player_reconnected", (data) => {
      console.log("Player reconnected:", data);
      setOpponentDisconnected(false);
    });

    // Handle successful rejoin
    socket.on("rejoin_success", (data) => {
      console.log("Rejoin successful:", data);

      // Don't restore state if game is already finished - user should stay in lobby
      if (gameState.status === "finished" || matchResult) {
        console.log("Game already finished, ignoring rejoin success");
        return;
      }

      if (data.gameState) {
        // Update game state with server's authoritative state
        setGameState((prev) => ({
          ...prev,
          status: data.gameState.status,
          players: data.gameState.players || prev.players,
          roomId: data.roomId,
          playerId: data.playerId,
        }));

        // Update player HP if provided
        if (data.playerState) {
          setPlayerData((prev) => ({
            ...prev,
            hp: data.playerState.hp ?? prev.hp,
            ammo: data.playerState.ammo ?? prev.ammo,
            shield: data.playerState.shield?.active ?? prev.shield,
          }));
        }

        // Update enemy HP if provided
        if (data.enemyState) {
          setEnemyData((prev) => ({
            ...prev,
            hp: data.enemyState.hp ?? prev.hp,
            shield: data.enemyState.shield?.active ?? prev.shield,
            username: data.enemyState.username ?? prev.username,
          }));
        }

        // Update session data only if game is still active
        if (data.gameState.status !== "finished") {
          saveSessionData({
            roomId: data.roomId,
            username: playerData.username,
            userId: playerData.userId,
            gameStatus: data.gameState.status,
          });
        }
      }
    });

    // Handle rejoin failure
    socket.on("rejoin_failed", (data) => {
      console.log("Rejoin failed:", data.message);
      // Clear stored state and redirect to lobby
      clearSessionData();
      localStorage.removeItem("typeRoyaleState");
      localStorage.removeItem("typeRoyalePlayerId");
      setGameState((prev) => ({ ...prev, status: "idle", roomId: null }));
      navigate("/lobby");
    });

    return () => {
      socket.off("room_created");
      socket.off("room_update");
      socket.off("join_room_error");
      socket.off("game_start");
      socket.off("receive_attack");
      socket.off("attack_launched");
      socket.off("attack_impact");
      socket.off("enemy_shield_active");
      socket.off("shield_activated");
      socket.off("match_result");
      socket.off("player_disconnected");
      socket.off("player_temporarily_disconnected");
      socket.off("player_reconnected");
      socket.off("rejoin_success");
      socket.off("rejoin_failed");
    };
  }, [
    socket,
    playerData.username,
    playerData.userId,
    enemyData.username,
    gameState.roomId,
    navigate,
  ]);

  // Actions
  const connectSocket = () => {
    if (socket && !socket.connected) {
      socket.connect();
    }
  };

  // Generate or get persistent userId
  const getOrCreateUserId = () => {
    let userId = localStorage.getItem("typeRoyaleUserId");
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("typeRoyaleUserId", userId);
    }
    return userId;
  };

  const createRoom = (username) => {
    if (socket && socket.connected) {
      const userId = getOrCreateUserId();
      socket.emit("create_room", { username, userId });
      setPlayerData((prev) => ({ ...prev, username, userId }));
      // Session data will be saved when room_created event is received
    }
  };

  const joinRoom = (roomId, username) => {
    if (socket && socket.connected) {
      const userId = getOrCreateUserId();
      socket.emit("join_room", { roomId, username, userId });
      setPlayerData((prev) => ({ ...prev, username, userId }));
      setGameState((prev) => ({
        ...prev,
        roomId,
        status: "lobby",
        isHost: false,
      }));
      // Save session data for reconnection
      saveSessionData({
        roomId,
        username,
        userId,
        gameStatus: "lobby",
      });
      // Navigate to waiting room
      navigate(`/room/${roomId}`);
    }
  };

  // Rejoin a room (for page refresh scenarios)
  const rejoinRoom = (roomId) => {
    // Try to get data from session storage first, then localStorage
    let session = getSessionData();
    const savedState = localStorage.getItem("typeRoyaleState");

    // If no session data, try to restore from localStorage
    if (!session.username || !session.userId) {
      if (savedState) {
        try {
          const parsed = JSON.parse(savedState);
          session = {
            roomId: roomId,
            username: parsed.playerData?.username,
            userId: parsed.playerData?.userId || localStorage.getItem("typeRoyaleUserId"),
            gameStatus: parsed.gameState?.status,
          };
        } catch (e) {
          console.error("Failed to parse saved state:", e);
        }
      }
    }

    if (!session.username || !session.userId) {
      console.log("No username or userId found for rejoin");
      return false;
    }

    // Restore player data immediately from localStorage
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        if (parsed.playerData) setPlayerData(parsed.playerData);
        if (parsed.enemyData) setEnemyData(parsed.enemyData);
        if (parsed.gameState) setGameState(parsed.gameState);
      } catch (e) {
        console.error("Failed to restore state:", e);
      }
    }

    // Connect socket and rejoin using rejoin_room event
    if (socket && !socket.connected) {
      socket.connect();

      socket.once("connect", () => {
        console.log("Socket connected, sending rejoin_room for:", roomId);
        socket.emit("rejoin_room", {
          roomId,
          username: session.username,
          userId: session.userId,
          gameStatus: session.gameStatus,
        });
      });
    } else if (socket && socket.connected) {
      console.log("Already connected, sending rejoin_room for:", roomId);
      socket.emit("rejoin_room", {
        roomId,
        username: session.username,
        userId: session.userId,
        gameStatus: session.gameStatus,
      });
    } else {
      console.log("Socket not available for rejoin");
      return false;
    }

    return true;
  };

  const playerReady = () => {
    if (socket && socket.connected && gameState.roomId) {
      socket.emit("player_ready", { roomId: gameState.roomId });
    }
  };

  const startBotGame = (username) => {
    setIsBotMode(true);
    setPlayerData((prev) => ({ ...prev, username }));
    setEnemyData({
      username: "Bot",
      hp: 100,
      maxHp: 100,
      shield: false,
    });
    setGameState({
      status: "playing",
      roomId: "bot-game",
      words: {
        easy: ["Cat", "DOG", "Run", "JUMP", "Fire", "ICE", "Wind", "ROCK"],
        medium: ["Magic", "SPELL", "WizarD", "DRAGON", "Phoenix"],
        hard: ["MetamorphosiS", "ExtraordinARY", "CatastrophE"],
        shield: ["ProtecT", "DEFEND", "BarrieR", "SHIELD"],
      },
      currentWord: "",
      selectedCard: null,
      duration: 0,
    });

    // Navigate to game arena
    navigate("/game/bot-game");

    // Start bot AI
    startBotAI();
  };

  const startBotAI = () => {
    const interval = setInterval(() => {
      // Bot randomly attacks every 3-5 seconds
      const botDamages = [10, 10, 15, 15, 20]; // Bot prefers easy/medium
      const randomDamage =
        botDamages[Math.floor(Math.random() * botDamages.length)];

      setPlayerData((prev) => {
        if (prev.hp <= 0) return prev;

        const newHp = prev.shield
          ? prev.hp
          : Math.max(0, prev.hp - randomDamage);

        if (newHp <= 0) {
          setMatchResult({ winner: "Bot", reason: "Your tower destroyed" });
          setGameState((prev) => ({ ...prev, status: "finished" }));
          clearInterval(interval);
          // Navigate to result page
          navigate("/result");
        }

        return prev.shield
          ? { ...prev, shield: false }
          : { ...prev, hp: newHp };
      });
    }, Math.random() * 2000 + 3000); // 3-5 seconds

    setBotInterval(interval);
  };

  const selectCard = (cardType) => {
    if (gameState.status !== "playing") return;

    // Only clear bot interval if in bot mode
    if (isBotMode && botInterval) {
      clearInterval(botInterval);
      setBotInterval(null);
    }

    const words = gameState.words[cardType];

    console.log("Selecting card:", cardType);
    console.log("Available words:", words);
    console.log("All game words:", gameState.words);

    if (!words || words.length === 0) {
      console.error("No words available for card type:", cardType);
      return;
    }

    const randomWord = words[Math.floor(Math.random() * words.length)];

    setGameState((prev) => ({
      ...prev,
      selectedCard: cardType,
      currentWord: randomWord,
    }));
  };

  const submitWord = (typedWord) => {
    // Case-sensitive comparison for stricter typing challenge
    if (typedWord !== gameState.currentWord) {
      return {
        success: false,
        message: "Incorrect! Check your capitalization!",
      };
    }

    const cardType = gameState.selectedCard;

    // Handle shield
    if (cardType === "shield") {
      // For bot mode, handle locally
      if (isBotMode) {
        setPlayerData((prev) => ({
          ...prev,
          shield: true,
          ammo: prev.ammo - 1,
        }));
        setTimeout(() => {
          setPlayerData((prev) => ({ ...prev, shield: false }));
        }, 5000);
      } else {
        socket.emit("activate_shield", {
          roomId: gameState.roomId,
          typedWord: typedWord,
        });
        setPlayerData((prev) => ({
          ...prev,
          shield: true,
          ammo: prev.ammo - 1,
        }));
        setTimeout(() => {
          setPlayerData((prev) => ({ ...prev, shield: false }));
        }, 5000);
      }

      setGameState((prev) => ({
        ...prev,
        selectedCard: null,
        currentWord: "",
      }));
      return { success: true, message: "Shield activated!" };
    }

    // Handle attacks
    const damageMap = {
      easy: 10,
      medium: 15,
      hard: 20,
    };

    const damage = damageMap[cardType];

    // For bot mode, handle damage locally
    if (isBotMode) {
      setEnemyData((prev) => {
        // Check if bot has shield
        if (prev.shield) {
          return { ...prev, shield: false };
        }

        const newHp = Math.max(0, prev.hp - damage);

        // Check if bot is defeated
        if (newHp <= 0) {
          setTimeout(() => {
            setMatchResult({
              winner: playerData.username,
              reason: "Enemy tower destroyed",
            });
            setGameState((prev) => ({ ...prev, status: "finished" }));
            if (botInterval) {
              clearInterval(botInterval);
              setBotInterval(null);
            }
            // Navigate to result page
            navigate("/result");
          }, 500);
        }

        return { ...prev, hp: newHp };
      });

      setPlayerData((prev) => ({ ...prev, ammo: prev.ammo - 1 }));
      setGameState((prev) => ({
        ...prev,
        selectedCard: null,
        currentWord: "",
      }));

      // Check if player is out of ammo in bot mode
      if (playerData.ammo - 1 <= 0) {
        setTimeout(() => {
          setMatchResult({ winner: "Bot", reason: "Out of ammo" });
          setGameState((prev) => ({ ...prev, status: "finished" }));
          if (botInterval) {
            clearInterval(botInterval);
            setBotInterval(null);
          }
          // Navigate to result page
          navigate("/result");
        }, 500);
      }

      return { success: true, message: `Attack dealt ${damage} damage!` };
    }

    // For multiplayer mode, send attack to server
    socket.emit("send_attack", {
      roomId: gameState.roomId,
      attackType: cardType,
      typedWord: typedWord,
    });

    setPlayerData((prev) => ({ ...prev, ammo: prev.ammo - 1 }));
    setGameState((prev) => ({ ...prev, selectedCard: null, currentWord: "" }));

    // Check if player is out of ammo
    if (playerData.ammo - 1 <= 0) {
      socket.emit("player_lose", { roomId: gameState.roomId });
    }

    return { success: true, message: `Attack sent for ${damage} damage!` };
  };

  const resetGame = () => {
    if (botInterval) {
      clearInterval(botInterval);
      setBotInterval(null);
    }
    setIsBotMode(false);
    setOpponentDisconnected(false);
    setPlayerData({
      username: playerData.username,
      hp: 100,
      maxHp: 100,
      ammo: 50,
      maxAmmo: 50,
      shield: false,
    });
    setEnemyData({
      username: "",
      hp: 100,
      maxHp: 100,
      shield: false,
    });
    setGameState({
      status: "idle",
      roomId: null,
      playerId: null,
      isHost: false,
      players: [],
      words: { easy: [], medium: [], hard: [], shield: [] },
      currentWord: "",
      selectedCard: null,
      duration: 0,
    });
    setMatchResult(null);
    // Clear all session data
    clearSessionData();
    localStorage.removeItem("typeRoyaleState");
    localStorage.removeItem("typeRoyalePlayerId");
    // Keep userId for future games

    // Navigate back to lobby
    navigate("/lobby");
  };

  // Quit game (leave current game and return to lobby)
  const quitGame = () => {
    // Clear bot interval if in bot mode
    if (botInterval) {
      clearInterval(botInterval);
      setBotInterval(null);
    }

    // Emit leave event to server if in multiplayer
    if (!isBotMode && socket && socket.connected && gameState.roomId) {
      socket.emit("leave_room", { roomId: gameState.roomId });
    }

    // Reset all game state
    setIsBotMode(false);
    setOpponentDisconnected(false);
    setPlayerData({
      username: playerData.username,
      hp: 100,
      maxHp: 100,
      ammo: 50,
      maxAmmo: 50,
      shield: false,
      userId: playerData.userId,
    });
    setEnemyData({
      username: "",
      hp: 100,
      maxHp: 100,
      shield: false,
    });
    setGameState({
      status: "idle",
      roomId: null,
      playerId: null,
      isHost: false,
      players: [],
      words: { easy: [], medium: [], hard: [], shield: [] },
      currentWord: "",
      selectedCard: null,
      duration: 0,
    });
    setMatchResult(null);
    // Clear all session data
    clearSessionData();
    localStorage.removeItem("typeRoyaleState");
    localStorage.removeItem("typeRoyalePlayerId");

    // Navigate back to lobby
    navigate("/lobby");
  };

  const value = {
    socket,
    playerData,
    enemyData,
    gameState,
    matchResult,
    isBotMode,
    opponentDisconnected,
    connectSocket,
    createRoom,
    joinRoom,
    rejoinRoom,
    playerReady,
    startBotGame,
    selectCard,
    submitWord,
    resetGame,
    quitGame,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export default GameContext;
