import io from 'socket.io-client';

// Socket configuration
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3000';

export const initializeSocket = () => {
    const socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
    });

    // Connection event handlers
    socket.on('connect', () => {
        console.log('✅ Socket connected:', socket.id);
    });

    socket.on('disconnect', (reason) => {
        console.log('❌ Socket disconnected:', reason);
    });

    socket.on('connect_error', (error) => {
        console.error('🔥 Connection error:', error);
    });

    return socket;
};

// Socket event emitters
export const socketEmit = {
    joinRoom: (socket, { roomId, username }) => {
        socket.emit('join_room', { roomId, username });
    },

    sendAttack: (socket, { roomId, damage, type }) => {
        socket.emit('send_attack', { roomId, damage, type });
    },

    activateShield: (socket, { roomId }) => {
        socket.emit('activate_shield', { roomId });
    },

    playerLose: (socket, { roomId }) => {
        socket.emit('player_lose', { roomId });
    },
};

// Socket event listeners helper
export const setupSocketListeners = (socket, callbacks) => {
    const events = {
        room_update: callbacks.onRoomUpdate,
        game_start: callbacks.onGameStart,
        receive_attack: callbacks.onReceiveAttack,
        enemy_shield_active: callbacks.onEnemyShield,
        match_result: callbacks.onMatchResult,
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