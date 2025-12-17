import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { Users, Loader2 } from 'lucide-react';

const WaitingRoom = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const { gameState, playerReady, resetGame, rejoinRoom, socket } = useGame();
    const [isReconnecting, setIsReconnecting] = useState(false);
    const [reconnectAttempted, setReconnectAttempted] = useState(false);

    // Attempt to rejoin room if state is lost (page refresh)
    useEffect(() => {
        if (!gameState.roomId && roomId && !reconnectAttempted) {
            setIsReconnecting(true);
            setReconnectAttempted(true);
            
            // Wait a bit for socket to initialize
            const timer = setTimeout(() => {
                const success = rejoinRoom(roomId);
                if (!success) {
                    setIsReconnecting(false);
                }
            }, 500);
            
            return () => clearTimeout(timer);
        }
    }, [gameState.roomId, roomId, reconnectAttempted, rejoinRoom]);

    // Stop showing reconnecting once we have room data
    useEffect(() => {
        if (gameState.roomId) {
            setIsReconnecting(false);
        }
    }, [gameState.roomId]);

    const players = gameState.players || [];
    const isFull = players.length === 2;
    const isHost = gameState.isHost;

    // Show reconnecting state
    if (isReconnecting) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-black flex items-center justify-center p-6">
                <div className="bg-slate-800/50 backdrop-blur-lg p-8 rounded-2xl border-2 border-purple-500 max-w-md w-full text-center">
                    <Loader2 className="w-16 h-16 text-purple-400 mx-auto mb-4 animate-spin" />
                    <h1 className="text-2xl font-bold text-white mb-4">Reconnecting...</h1>
                    <p className="text-gray-300">Rejoining room {roomId}</p>
                </div>
            </div>
        );
    }

    // If no room data after reconnect attempt, show error
    if (!gameState.roomId && reconnectAttempted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-black flex items-center justify-center p-6">
                <div className="bg-slate-800/50 backdrop-blur-lg p-8 rounded-2xl border-2 border-purple-500 max-w-md w-full text-center">
                    <h1 className="text-2xl font-bold text-white mb-4">Room Not Found</h1>
                    <p className="text-gray-300 mb-6">The room doesn't exist or has expired.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors"
                    >
                        Return to Lobby
                    </button>
                </div>
            </div>
        );
    }

    const handleLeaveRoom = () => {
        resetGame();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-black flex items-center justify-center p-6">
            <div className="bg-slate-800/50 backdrop-blur-lg p-8 rounded-2xl border-2 border-purple-500 max-w-md w-full">
                <Users className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-white text-center mb-2">Waiting Room</h1>
                <p className="text-gray-300 text-center mb-6">
                    Room ID: <span className="text-purple-400 font-bold">{gameState.roomId}</span>
                </p>

                <div className="bg-slate-900/50 rounded-lg p-6 mb-6">
                    <p className="text-gray-400 text-sm mb-3">Players ({players.length}/2):</p>
                    <div className="space-y-2">
                        {players.map((player, index) => (
                            <div key={index} className="flex items-center gap-3 bg-green-900/30 p-3 rounded-lg border border-green-500/30">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-white font-semibold">{player.username}</span>
                                {index === 0 && <span className="text-yellow-400 text-xs ml-auto">👑 Host</span>}
                            </div>
                        ))}
                        {!isFull && (
                            <div className="flex items-center gap-3 bg-slate-700/30 p-3 rounded-lg border border-gray-600/30">
                                <div className="w-3 h-3 bg-gray-500 rounded-full" />
                                <span className="text-gray-400">Waiting for opponent...</span>
                            </div>
                        )}
                    </div>
                </div>

                {isFull ? (
                    isHost ? (
                        <button
                            onClick={playerReady}
                            className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold text-lg rounded-lg transition-all duration-300 hover:shadow-lg mb-4"
                        >
                            🎮 Start Game
                        </button>
                    ) : (
                        <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 mb-4">
                            <p className="text-blue-200 text-sm text-center">
                                ⏳ Waiting for host to start the game...
                            </p>
                        </div>
                    )
                ) : (
                    <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-4 mb-4">
                        <p className="text-yellow-200 text-sm text-center">
                            Share the Room ID with your friend to start the battle!
                        </p>
                    </div>
                )}

                <button
                    onClick={handleLeaveRoom}
                    className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
                >
                    Leave Room
                </button>
            </div>
        </div>
    );
};

export default WaitingRoom;
