import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Plus, LogIn, Sword, Bot } from 'lucide-react';

const Lobby = () => {
    const { createRoom, joinRoom, connectSocket, startBotGame } = useGame();
    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');
    const [mode, setMode] = useState('menu'); // menu, create, join, bot

    const handleBotGame = () => {
        if (!username.trim()) {
            alert('Please enter your username!');
            return;
        }
        startBotGame(username);
    };

    const handleCreateRoom = () => {
        if (!username.trim()) {
            alert('Please enter your username!');
            return;
        }
        connectSocket();
        // Wait for connection before creating room
        setTimeout(() => {
            createRoom(username);
        }, 500);
    };

    const handleJoinRoom = () => {
        if (!username.trim() || !roomId.trim()) {
            alert('Please enter both username and room ID!');
            return;
        }
        connectSocket();
        // Wait for connection before joining
        setTimeout(() => {
            joinRoom(roomId, username);
        }, 500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-black flex items-center justify-center p-6">
            <div className="max-w-4xl w-full">
                {/* Header */}
                <div className="text-center mb-12">
                    <Sword className="w-20 h-20 text-purple-400 mx-auto mb-4" />
                    <h1 className="text-6xl font-bold text-white mb-4">TYPE ROYALE</h1>
                    <p className="text-xl text-purple-300">Battle with Words, Conquer with Speed</p>
                </div>

                {/* Main Menu */}
                {mode === 'menu' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Play vs Bot */}
                        <button
                            onClick={() => setMode('bot')}
                            className="group bg-gradient-to-br from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 p-8 rounded-2xl border-2 border-green-400 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/50"
                        >
                            <Bot className="w-16 h-16 text-white mx-auto mb-4 group-hover:scale-110 transition-transform" />
                            <h2 className="text-3xl font-bold text-white mb-2">vs Bot</h2>
                            <p className="text-green-200">Practice against AI</p>
                        </button>

                        {/* Create Room */}
                        <button
                            onClick={() => setMode('create')}
                            className="group bg-gradient-to-br from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 p-8 rounded-2xl border-2 border-purple-400 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50"
                        >
                            <Plus className="w-16 h-16 text-white mx-auto mb-4 group-hover:scale-110 transition-transform" />
                            <h2 className="text-3xl font-bold text-white mb-2">Create Room</h2>
                            <p className="text-purple-200">Start a new battle arena</p>
                        </button>

                        {/* Join Room */}
                        <button
                            onClick={() => setMode('join')}
                            className="group bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 p-8 rounded-2xl border-2 border-blue-400 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50"
                        >
                            <LogIn className="w-16 h-16 text-white mx-auto mb-4 group-hover:scale-110 transition-transform" />
                            <h2 className="text-3xl font-bold text-white mb-2">Join Room</h2>
                            <p className="text-blue-200">Enter an existing battle</p>
                        </button>
                    </div>
                )}

                {/* Bot Game Form */}
                {mode === 'bot' && (
                    <div className="bg-slate-800/50 backdrop-blur-lg p-8 rounded-2xl border-2 border-green-500 max-w-md mx-auto">
                        <h2 className="text-3xl font-bold text-white mb-6 text-center">Play vs Bot</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-green-300 mb-2 font-semibold">Your Username</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-900/50 border-2 border-green-500 rounded-lg text-white focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-500/50"
                                    placeholder="Enter your name..."
                                    maxLength={20}
                                />
                            </div>

                            <button
                                onClick={handleBotGame}
                                className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold text-lg rounded-lg transition-all duration-300 hover:shadow-lg"
                            >
                                Start Bot Battle
                            </button>

                            <button
                                onClick={() => setMode('menu')}
                                className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
                            >
                                Back
                            </button>
                        </div>
                    </div>
                )}

                {/* Create Room Form */}
                {mode === 'create' && (
                    <div className="bg-slate-800/50 backdrop-blur-lg p-8 rounded-2xl border-2 border-purple-500 max-w-md mx-auto">
                        <h2 className="text-3xl font-bold text-white mb-6 text-center">Create Room</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-purple-300 mb-2 font-semibold">Your Username</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-900/50 border-2 border-purple-500 rounded-lg text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/50"
                                    placeholder="Enter your name..."
                                    maxLength={20}
                                />
                            </div>

                            <button
                                onClick={handleCreateRoom}
                                className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold text-lg rounded-lg transition-all duration-300 hover:shadow-lg"
                            >
                                Create & Wait for Opponent
                            </button>

                            <button
                                onClick={() => setMode('menu')}
                                className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
                            >
                                Back
                            </button>
                        </div>
                    </div>
                )}

                {/* Join Room Form */}
                {mode === 'join' && (
                    <div className="bg-slate-800/50 backdrop-blur-lg p-8 rounded-2xl border-2 border-blue-500 max-w-md mx-auto">
                        <h2 className="text-3xl font-bold text-white mb-6 text-center">Join Room</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-blue-300 mb-2 font-semibold">Your Username</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-900/50 border-2 border-blue-500 rounded-lg text-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/50"
                                    placeholder="Enter your name..."
                                    maxLength={20}
                                />
                            </div>

                            <div>
                                <label className="block text-blue-300 mb-2 font-semibold">Room ID</label>
                                <input
                                    type="text"
                                    value={roomId}
                                    onChange={(e) => setRoomId(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-900/50 border-2 border-blue-500 rounded-lg text-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/50"
                                    placeholder="Enter room ID..."
                                />
                            </div>

                            <button
                                onClick={handleJoinRoom}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-lg rounded-lg transition-all duration-300 hover:shadow-lg"
                            >
                                Join Battle
                            </button>

                            <button
                                onClick={() => setMode('menu')}
                                className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
                            >
                                Back
                            </button>
                        </div>
                    </div>
                )}

                {/* Game Info */}
                <div className="mt-12 bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
                    <h3 className="text-xl font-bold text-white mb-4 text-center">How to Play</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                        <div>
                            <div className="text-3xl mb-2">⚡</div>
                            <p className="text-gray-300 text-sm">Type words to cast spells</p>
                        </div>
                        <div>
                            <div className="text-3xl mb-2">🔥</div>
                            <p className="text-gray-300 text-sm">Choose cards strategically</p>
                        </div>
                        <div>
                            <div className="text-3xl mb-2">🛡️</div>
                            <p className="text-gray-300 text-sm">Use shields wisely</p>
                        </div>
                        <div>
                            <div className="text-3xl mb-2">👑</div>
                            <p className="text-gray-300 text-sm">Destroy enemy tower!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Lobby;