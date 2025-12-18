import io from "socket.io-client";

// Socket configuration
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:3000";

export const initializeSocket = () => {
  const socket = io(SOCKET_URL, {
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  // Connection event handlers
  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("❌ Socket disconnected:", reason);
  });

  socket.on("connect_error", (error) => {
    console.error("🔥 Connection error:", error);
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
