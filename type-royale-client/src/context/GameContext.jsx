import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

const DEV_AUTO_START = true;


const GameContext = createContext();

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within GameProvider');
    }
    return context;
};

export const GameProvider = ({ children }) => {
    // Socket connection
    const [socket, setSocket] = useState(null);

    // Player state
    const [playerData, setPlayerData] = useState({
        username: '',
        hp: 100,
        maxHp: 100,
        ammo: 50,
        maxAmmo: 50,
        shield: false
    });

    // Enemy state
    const [enemyData, setEnemyData] = useState({
        username: '',
        hp: 100,
        maxHp: 100,
        shield: false
    });

    // Game state
    const [gameState, setGameState] = useState({
        status: DEV_AUTO_START ? 'playing' : 'idle',
        roomId: DEV_AUTO_START ? 'dev-room' : null,
        words: DEV_AUTO_START
            ? {
                easy: ['fire', 'mage', 'orb'],
                medium: ['fireball', 'wizard'],
                hard: ['conflagration'],
                shield: ['barrier', 'aegis']
            }
            : {
                easy: [],
                medium: [],
                hard: [],
                shield: []
            },
        currentWord: '',
        selectedCard: null,
        duration: 0
    });


    // Match result
    const [matchResult, setMatchResult] = useState(null);

    // Bot mode
    const [isBotMode, setIsBotMode] = useState(false);
    const [botInterval, setBotInterval] = useState(null);

    // Initialize socket connection
    useEffect(() => {
        const newSocket = io('http://localhost:3000', {
            autoConnect: false
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    // Socket event listeners
    useEffect(() => {
        if (!socket) return;

        socket.on('room_update', (data) => {
            console.log('Room update:', data);
            if (data.players.length === 2) {
                const enemy = data.players.find(p => p.username !== playerData.username);
                setEnemyData(prev => ({ ...prev, username: enemy.username }));
            }
        });

        socket.on('game_start', (data) => {
            console.log('Game starting:', data);
            setGameState(prev => ({
                ...prev,
                status: 'playing',
                words: data.words
            }));
        });

        socket.on('receive_attack', (data) => {
            console.log('Received attack:', data);
            const newHp = playerData.shield ? playerData.hp : Math.max(0, playerData.hp - data.damage);
            
            setPlayerData(prev => {
                if (prev.shield) {
                    // Shield blocks the attack
                    return { ...prev, shield: false };
                }
                return { ...prev, hp: newHp };
            });

            // Check if player HP reaches zero (player loses)
            if (newHp <= 0 && !playerData.shield) {
                setMatchResult({ winner: enemyData.username, reason: 'Your tower destroyed' });
                setGameState(prev => ({ ...prev, status: 'finished' }));
            }
        });

        socket.on('enemy_shield_active', () => {
            console.log('Enemy activated shield');
            setEnemyData(prev => ({ ...prev, shield: true }));

            // Remove shield visual after 3 seconds
            setTimeout(() => {
                setEnemyData(prev => ({ ...prev, shield: false }));
            }, 3000);
        });

        socket.on('match_result', (data) => {
            console.log('Match result:', data);
            setMatchResult(data);
            setGameState(prev => ({ ...prev, status: 'finished' }));
        });

        return () => {
            socket.off('room_update');
            socket.off('game_start');
            socket.off('receive_attack');
            socket.off('enemy_shield_active');
            socket.off('match_result');
        };
    }, [socket, playerData.username, playerData.shield]);

    // Actions
    const connectSocket = () => {
        if (socket && !socket.connected) {
            socket.connect();
        }
    };

    const joinRoom = (roomId, username) => {
        if (socket) {
            socket.emit('join_room', { roomId, username });
            setPlayerData(prev => ({ ...prev, username }));
            setGameState(prev => ({ ...prev, roomId, status: 'lobby' }));
        }
    };

    const startBotGame = (username) => {
        setIsBotMode(true);
        setPlayerData(prev => ({ ...prev, username }));
        setEnemyData({
            username: 'Bot',
            hp: 100,
            maxHp: 100,
            shield: false
        });
        setGameState({
            status: 'playing',
            roomId: 'bot-game',
            words: {
                easy: ['cat', 'dog', 'run', 'jump'],
                medium: ['battle', 'wizard', 'dragon'],
                hard: ['conflagration', 'metamorphosis'],
                shield: ['protect', 'defend']
            },
            currentWord: '',
            selectedCard: null,
            duration: 0
        });

        // Start bot AI
        startBotAI();
    };

    const startBotAI = () => {
        const interval = setInterval(() => {
            // Bot randomly attacks every 3-5 seconds
            const botDamages = [10, 10, 15, 15, 20]; // Bot prefers easy/medium
            const randomDamage = botDamages[Math.floor(Math.random() * botDamages.length)];

            setPlayerData(prev => {
                if (prev.hp <= 0) return prev;

                const newHp = prev.shield ? prev.hp : Math.max(0, prev.hp - randomDamage);
                
                if (newHp <= 0) {
                    setMatchResult({ winner: 'Bot', reason: 'Your tower destroyed' });
                    setGameState(prev => ({ ...prev, status: 'finished' }));
                    clearInterval(interval);
                }

                return prev.shield ? { ...prev, shield: false } : { ...prev, hp: newHp };
        // Bot mode: no socket, just local state
        if (isBotMode) {
            // Update enemy HP locally
            const newEnemyHp = Math.max(0, enemyData.hp - damage);
            setEnemyData(prev => ({
                ...prev,
                hp: newEnemyHp
            }));

            setPlayerData(prev => ({ ...prev, ammo: prev.ammo - 1 }));
            setGameState(prev => ({ ...prev, selectedCard: null, currentWord: '' }));

            // Check if enemy HP reaches zero (player wins)
            if (newEnemyHp <= 0) {
                setMatchResult({ winner: playerData.username, reason: 'Enemy tower destroyed' });
                setGameState(prev => ({ ...prev, status: 'finished' }));
                if (botInterval) clearInterval(botInterval);
            }

            return { success: true, message: `Hit for ${damage} damage!` };
        }

            });
        }, Math.random() * 2000 + 3000); // 3-5 seconds

        setBotInterval(interval);
    };

    const selectCard = (cardType) => {
        if (gameState.status !== 'playing') return;

        const words = gameState.words[cardType];
        if (botInterval) {
            clearInterval(botInterval);
            setBotInterval(null);
        }
        setIsBotMode(false);
        if (!words || words.length === 0) return;

        const randomWord = words[Math.floor(Math.random() * words.length)];

        setGameState(prev => ({
            ...prev,
            selectedCard: cardType,
            currentWord: randomWord
        }));
    };

    const submitWord = (typedWord) => {
        if (typedWord.toLowerCase() !== gameState.currentWord.toLowerCase()) {
            return { success: false, message: 'Incorrect word!' };
        }

        const cardType = gameState.selectedCard;

        // Handle shield
        if (cardType === 'shield') {
            socket.emit('activate_shield', { roomId: gameState.roomId });
            setPlayerData(prev => ({ ...prev, shield: true, ammo: prev.ammo - 1 }));

            // Remove shield after it blocks one attack or 5 seconds
            setTimeout(() => {
                setPlayerData(prev => ({ ...prev, shield: false }));
            }, 5000);

            setGameState(prev => ({ ...prev, selectedCard: null, currentWord: '' }));
            return { success: true, message: 'Shield activated!' };
        }

        // Handle attacks
        const damageMap = {
            easy: 10,
            medium: 15,
            hard: 20
        };

        const damage = damageMap[cardType];

        socket.emit('send_attack', {
            roomId: gameState.roomId,
            damage,
            type: cardType
        });

        // Update enemy HP locally (will be synced by server)
        const newEnemyHp = Math.max(0, enemyData.hp - damage);
        setEnemyData(prev => ({
            ...prev,
            hp: newEnemyHp
        }));

        setPlayerData(prev => ({ ...prev, ammo: prev.ammo - 1 }));
        setGameState(prev => ({ ...prev, selectedCard: null, currentWord: '' }));

        // Check if enemy HP reaches zero (player wins)
        if (newEnemyHp <= 0) {
            socket.emit('player_win', { roomId: gameState.roomId, winner: playerData.username });
            setMatchResult({ winner: playerData.username, reason: 'Enemy tower destroyed' });
            setGameState(prev => ({ ...prev, status: 'finished' }));
        }

        // Check if player is out of ammo
        if (playerData.ammo - 1 <= 0) {
            socket.emit('player_lose', { roomId: gameState.roomId });
        }

        return { success: true, message: `Hit for ${damage} damage!` };
    };

    const resetGame = () => {
        if (botInterval) {
            clearInterval(botInterval);
            setBotInterval(null);
        }
        setIsBotMode(false);
        setPlayerData({
            username: playerData.username,
            hp: 100,
            maxHp: 100,
            ammo: 50,
            maxAmmo: 50,
            shield: false
        });
        setEnemyData({
            username: '',
            hp: 100,
            maxHp: 100,
            shield: false
        });
        setGameState({
            status: 'idle',
            roomId: null,
            words: { easy: [], medium: [], hard: [], shield: [] },
            currentWord: '',
            selectedCard: null,
            duration: 0
        });
        setMatchResult(null);
    };

    const value = {
        socket,
        playerData,
        enemyData,
        gameState,
        matchResult,
        connectSocket,
        joinRoom,
        startBotGame,
        selectCard,
        submitWord,
        resetGame
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
};

export default GameContext;