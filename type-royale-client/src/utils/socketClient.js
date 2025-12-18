import io from "socket.io-client";

// Socket configuration
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

// Session storage keys for persistence
const SESSION_KEYS = {
  ROOM_ID: "typeRoyale_roomId",
  USER_ID: "typeRoyale_userId",
  USERNAME: "typeRoyale_username",
  GAME_STATUS: "typeRoyale_gameStatus",
};

// Save session data for reconnection
export const saveSessionData = (data) => {
  if (data.roomId) sessionStorage.setItem(SESSION_KEYS.ROOM_ID, data.roomId);
  if (data.userId) sessionStorage.setItem(SESSION_KEYS.USER_ID, data.userId);
  if (data.username) sessionStorage.setItem(SESSION_KEYS.USERNAME, data.username);
  if (data.gameStatus) sessionStorage.setItem(SESSION_KEYS.GAME_STATUS, data.gameStatus);
};

// Get session data for reconnection
export const getSessionData = () => {
  return {
    roomId: sessionStorage.getItem(SESSION_KEYS.ROOM_ID),
    userId: sessionStorage.getItem(SESSION_KEYS.USER_ID),
    username: sessionStorage.getItem(SESSION_KEYS.USERNAME),
    gameStatus: sessionStorage.getItem(SESSION_KEYS.GAME_STATUS),
  };
};

// Clear session data
export const clearSessionData = () => {
  Object.values(SESSION_KEYS).forEach((key) => sessionStorage.removeItem(key));
};

// Check if there's an active session to reconnect to
export const hasActiveSession = () => {
  const session = getSessionData();
  return !!(session.roomId && session.userId && session.username);
};

export const initializeSocket = () => {
  const socket = io(SOCKET_URL, {
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionDelay: 500,
    reconnectionDelayMax: 2000,
    reconnectionAttempts: 10,
    timeout: 10000,
    autoConnect: true,
  });

  // Connection event handlers
  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);

    // Attempt to rejoin if there's an active session
    const session = getSessionData();
    if (session.roomId && session.userId && session.username) {
      console.log("🔄 Active session found, attempting to rejoin room:", session.roomId);
      socket.emit("rejoin_room", {
        roomId: session.roomId,
        userId: session.userId,
        username: session.username,
        gameStatus: session.gameStatus,
      });
    }
  });

  socket.on("disconnect", (reason) => {
    console.log("❌ Socket disconnected:", reason);
    // Don't clear session data on disconnect - we want to be able to reconnect
  });

  socket.on("connect_error", (error) => {
    console.error("🔥 Connection error:", error);
  });

  socket.on("reconnect", (attemptNumber) => {
    console.log(`🔄 Reconnected after ${attemptNumber} attempts`);
  });

  socket.on("reconnect_attempt", (attemptNumber) => {
    console.log(`🔄 Reconnection attempt ${attemptNumber}`);
  });

  socket.on("reconnect_failed", () => {
    console.error("❌ Failed to reconnect after all attempts");
  });

  return socket;
};

// Socket event emitters
export const socketEmit = {
  createRoom: (socket, { username, userId }) => {
    socket.emit("create_room", { username, userId });
  },

  joinRoom: (socket, { roomId, username, userId }) => {
    socket.emit("join_room", { roomId, username, userId });
    // Save session data for reconnection
    saveSessionData({ roomId, username, userId, gameStatus: "lobby" });
  },

  rejoinRoom: (socket, { roomId, username, userId, gameStatus }) => {
    socket.emit("rejoin_room", { roomId, username, userId, gameStatus });
  },

  playerReady: (socket, { roomId }) => {
    socket.emit("player_ready", { roomId });
  },

  sendAttack: (socket, { roomId, attackType, typedWord }) => {
    socket.emit("send_attack", { roomId, attackType, typedWord });
  },

  activateShield: (socket, { roomId, typedWord }) => {
    socket.emit("activate_shield", { roomId, typedWord });
  },

  playerLose: (socket, { roomId }) => {
    socket.emit("player_lose", { roomId });
  },

  leaveRoom: (socket, { roomId }) => {
    socket.emit("leave_room", { roomId });
    clearSessionData();
  },
};

// Socket event listeners helper
export const setupSocketListeners = (socket, callbacks) => {
  const events = {
    room_created: callbacks.onRoomCreated,
    room_update: callbacks.onRoomUpdate,
    join_room_error: callbacks.onJoinRoomError,
    player_ready_update: callbacks.onPlayerReadyUpdate,
    game_start: callbacks.onGameStart,
    receive_attack: callbacks.onReceiveAttack,
    enemy_shield_active: callbacks.onEnemyShield,
    attack_launched: callbacks.onAttackLaunched,
    shield_activated: callbacks.onShieldActivated,
    match_result: callbacks.onMatchResult,
    player_disconnected: callbacks.onPlayerDisconnected,
    player_temporarily_disconnected: callbacks.onPlayerTemporarilyDisconnected,
    player_reconnected: callbacks.onPlayerReconnected,
    rejoin_success: callbacks.onRejoinSuccess,
    rejoin_failed: callbacks.onRejoinFailed,
  };

  Object.entries(events).forEach(([event, callback]) => {
    if (callback) {
      socket.on(event, callback);
    }
  });

  // Return cleanup function
  return () => {
    Object.keys(events).forEach((event) => {
      socket.off(event);
    });
  };
};
