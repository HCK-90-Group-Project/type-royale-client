import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const DEV_AUTO_START = false;


const GameContext = createContext();

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within GameProvider');
    }
    return context;
};

export const GameProvider = ({ children }) => {
    const navigate = useNavigate();
    
    // Socket connection
    const [socket, setSocket] = useState(null);

    // Player state
    const [playerData, setPlayerData] = useState({
        username: '',
        hp: 100,
        maxHp: 100,
        ammo: 50,
        maxAmmo: 50,
        shield: false,
        userId: null
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
        playerId: null,
        isHost: false,
        players: [],
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

    // Load state from localStorage on mount
    useEffect(() => {
        const savedState = localStorage.getItem('typeRoyaleState');
        if (savedState) {
            try {
                const parsed = JSON.parse(savedState);
                if (parsed.playerData) setPlayerData(parsed.playerData);
                if (parsed.enemyData) setEnemyData(parsed.enemyData);
                if (parsed.matchResult) setMatchResult(parsed.matchResult);
                
                if (parsed.gameState) {
                    setGameState(parsed.gameState);
                    
                    // Reconnect socket and rejoin room if in active game
                    if ((parsed.gameState.status === 'lobby' || parsed.gameState.status === 'playing') && parsed.gameState.roomId) {
                        setTimeout(() => {
                            if (socket && !socket.connected) {
                                socket.connect();
                                
                                // Wait for connection then rejoin room
                                socket.once('connect', () => {
                                    console.log('Reconnected! Rejoining room:', parsed.gameState.roomId);
                                    // Use the same userId that was saved
                                    const userId = parsed.playerData?.userId || localStorage.getItem('typeRoyaleUserId');
                                    socket.emit('join_room', { 
                                        roomId: parsed.gameState.roomId, 
                                        username: parsed.playerData.username,
                                        userId: userId
                                    });
                                });
                            }
                        }, 500);
                    }
                }
                console.log('State restored from localStorage');
            } catch (e) {
                console.error('Failed to restore state:', e);
            }
        }
    }, [socket]);

    // Save state to localStorage whenever it changes
    useEffect(() => {
        const stateToSave = {
            playerData,
            enemyData,
            gameState,
            matchResult
        };
        localStorage.setItem('typeRoyaleState', JSON.stringify(stateToSave));
    }, [playerData, enemyData, gameState, matchResult]);

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

        socket.on('room_created', (data) => {
            console.log('Room created:', data);
            setGameState(prev => ({
                ...prev,
                roomId: data.roomId,
                status: 'lobby',
                isHost: true,
                players: [{ username: playerData.username }]
            }));
            // Navigate to waiting room
            navigate(`/room/${data.roomId}`);
        });

        socket.on('room_update', (data) => {
            console.log('Room update:', data);
            if (data.players && data.players.length > 0) {
                setGameState(prev => ({
                    ...prev,
                    players: data.players
                }));
                
                if (data.players.length === 2) {
                    const enemy = data.players.find(p => p.username !== playerData.username);
                    if (enemy) {
                        setEnemyData(prev => ({ ...prev, username: enemy.username }));
                    }
                }
            }
        });

        socket.on('join_room_error', (data) => {
            console.error('Join room error:', data.message);
            alert(data.message);
            setGameState(prev => ({ ...prev, status: 'idle' }));
            navigate('/');
        });

        socket.on('game_start', (data) => {
            console.log('Game starting:', data);
            
            // Convert word array to categorized object
            const categorizedWords = {
                easy: [],
                medium: [],
                hard: [],
                shield: []
            };
            
            if (data.words && Array.isArray(data.words)) {
                data.words.forEach(wordObj => {
                    const word = typeof wordObj === 'string' ? wordObj : wordObj.word;
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
            
            console.log('Categorized words:', categorizedWords);
            
            // Store playerId and roomId in localStorage for persistence
            localStorage.setItem('typeRoyalePlayerId', data.yourPlayerId);
            const currentRoomId = data.gameState?.roomId || gameState.roomId;
            
            setGameState(prev => ({
                ...prev,
                status: 'playing',
                playerId: data.yourPlayerId,
                words: categorizedWords
            }));
            
            // Navigate to game arena
            navigate(`/game/${currentRoomId}`);
        });

        socket.on('receive_attack', (data) => {
            console.log('Received attack:', data);
            
            // Use server's authoritative HP value
            setPlayerData(prev => {
                if (data.blocked) {
                    // Shield blocked the attack
                    return { ...prev, shield: false };
                }
                
                // Use targetHp from server (authoritative)
                const newHp = data.targetHp;
                
                // Check if player HP reaches zero (player loses)
                if (newHp <= 0) {
                    setTimeout(() => {
                        setMatchResult({ winner: enemyData.username, reason: 'Your tower destroyed' });
                        setGameState(prev => ({ ...prev, status: 'finished' }));
                    }, 500);
                }
                
                return { ...prev, hp: newHp };
            });
        });

        socket.on('attack_launched', (data) => {
            console.log('Attack launched:', data);
            // Update ammo count if it's our attack
            if (data.from === 'player1' || data.from === 'player2') {
                // Visual feedback could go here
            }
        });

        socket.on('attack_impact', (data) => {
            console.log('Attack impact:', data, 'My playerId:', gameState.playerId);
            
            // Only update enemy HP if the target is NOT us
            // We check both gameState.playerId and compare with stored playerId
            const myPlayerId = gameState.playerId || localStorage.getItem('typeRoyalePlayerId');
            
            if (data.targetPlayerId !== myPlayerId) {
                setEnemyData(prev => ({
                    ...prev,
                    hp: data.targetHp
                }));
            }
        });

        socket.on('enemy_shield_active', () => {
            console.log('Enemy activated shield');
            setEnemyData(prev => ({ ...prev, shield: true }));

            // Remove shield visual after duration
            setTimeout(() => {
                setEnemyData(prev => ({ ...prev, shield: false }));
            }, 5000);
        });

        socket.on('shield_activated', (data) => {
            console.log('Shield activated:', data);
        });

        socket.on('match_result', (data) => {
            console.log('Match result:', data);
            
            // Map player1/player2 to actual usernames
            let winnerName = data.winner;
            if (data.finalState) {
                if (data.winner === 'player1') {
                    winnerName = data.finalState.player1.username;
                } else if (data.winner === 'player2') {
                    winnerName = data.finalState.player2.username;
                }
            }
            
            setMatchResult({
                ...data,
                winner: winnerName,
                winnerPlayerId: data.winner
            });
            setGameState(prev => ({ ...prev, status: 'finished' }));
        });

        socket.on('player_disconnected', (data) => {
            console.log('Player disconnected:', data);
            alert(data.message);
            setGameState(prev => ({ ...prev, status: 'idle' }));
            navigate('/');
        });

        return () => {
            socket.off('room_created');
            socket.off('room_update');
            socket.off('join_room_error');
            socket.off('game_start');
            socket.off('receive_attack');
            socket.off('attack_launched');
            socket.off('attack_impact');
            socket.off('enemy_shield_active');
            socket.off('shield_activated');
            socket.off('match_result');
            socket.off('player_disconnected');
        };
    }, [socket, playerData.username, enemyData.username, gameState.roomId, navigate]);

    // Actions
    const connectSocket = () => {
        if (socket && !socket.connected) {
            socket.connect();
        }
    };

    // Generate or get persistent userId
    const getOrCreateUserId = () => {
        let userId = localStorage.getItem('typeRoyaleUserId');
        if (!userId) {
            userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem('typeRoyaleUserId', userId);
        }
        return userId;
    };

    const createRoom = (username) => {
        if (socket && socket.connected) {
            const userId = getOrCreateUserId();
            socket.emit('create_room', { username, userId });
            setPlayerData(prev => ({ ...prev, username, userId }));
        }
    };

    const joinRoom = (roomId, username) => {
        if (socket && socket.connected) {
            const userId = getOrCreateUserId();
            socket.emit('join_room', { roomId, username, userId });
            setPlayerData(prev => ({ ...prev, username, userId }));
            setGameState(prev => ({ ...prev, roomId, status: 'lobby', isHost: false }));
            // Navigate to waiting room
            navigate(`/room/${roomId}`);
        }
    };

    // Rejoin a room (for page refresh scenarios)
    const rejoinRoom = (roomId) => {
        // Get saved data from localStorage
        const savedState = localStorage.getItem('typeRoyaleState');
        if (!savedState) return false;
        
        try {
            const parsed = JSON.parse(savedState);
            const username = parsed.playerData?.username;
            const userId = parsed.playerData?.userId || localStorage.getItem('typeRoyaleUserId');
            
            if (!username || !userId) return false;
            
            // Restore player data
            if (parsed.playerData) setPlayerData(parsed.playerData);
            if (parsed.enemyData) setEnemyData(parsed.enemyData);
            if (parsed.gameState) setGameState(parsed.gameState);
            
            // Connect socket and rejoin
            if (socket && !socket.connected) {
                socket.connect();
                
                socket.once('connect', () => {
                    console.log('Reconnecting to room:', roomId);
                    socket.emit('join_room', { roomId, username, userId });
                });
            } else if (socket && socket.connected) {
                console.log('Already connected, rejoining room:', roomId);
                socket.emit('join_room', { roomId, username, userId });
            }
            
            return true;
        } catch (e) {
            console.error('Failed to rejoin room:', e);
            return false;
        }
    };

    const playerReady = () => {
        if (socket && socket.connected && gameState.roomId) {
            socket.emit('player_ready', { roomId: gameState.roomId });
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

        // Navigate to game arena
        navigate('/game/bot-game');

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
            });
        }, Math.random() * 2000 + 3000); // 3-5 seconds

        setBotInterval(interval);
    };

    const selectCard = (cardType) => {
        if (gameState.status !== 'playing') return;

        // Only clear bot interval if in bot mode
        if (isBotMode && botInterval) {
            clearInterval(botInterval);
            setBotInterval(null);
        }

        const words = gameState.words[cardType];
        
        console.log('Selecting card:', cardType);
        console.log('Available words:', words);
        console.log('All game words:', gameState.words);
        
        if (!words || words.length === 0) {
            console.error('No words available for card type:', cardType);
            return;
        }

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
            socket.emit('activate_shield', { 
                roomId: gameState.roomId,
                typedWord: typedWord 
            });
            setPlayerData(prev => ({ ...prev, shield: true, ammo: prev.ammo - 1 }));

            // Remove shield after it blocks one attack or duration
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

        // Send attack to server with correct parameters
        socket.emit('send_attack', {
            roomId: gameState.roomId,
            attackType: cardType,
            typedWord: typedWord
        });

        setPlayerData(prev => ({ ...prev, ammo: prev.ammo - 1 }));
        setGameState(prev => ({ ...prev, selectedCard: null, currentWord: '' }));

        // Check if player is out of ammo
        if (playerData.ammo - 1 <= 0) {
            socket.emit('player_lose', { roomId: gameState.roomId });
        }

        return { success: true, message: `Attack sent for ${damage} damage!` };
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
            playerId: null,
            isHost: false,
            players: [],
            words: { easy: [], medium: [], hard: [], shield: [] },
            currentWord: '',
            selectedCard: null,
            duration: 0
        });
        setMatchResult(null);
        localStorage.removeItem('typeRoyaleState');
        localStorage.removeItem('typeRoyalePlayerId');
        // Keep userId for future games
        
        // Navigate back to lobby
        navigate('/');
    };

    const value = {
        socket,
        playerData,
        enemyData,
        gameState,
        matchResult,
        connectSocket,
        createRoom,
        joinRoom,
        rejoinRoom,
        playerReady,
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