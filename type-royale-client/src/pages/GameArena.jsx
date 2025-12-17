import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Heart, Crosshair, Shield, Flame, Trophy, Target } from 'lucide-react';
import Card from '../components/Card';
// Image assets (Vite-friendly imports)
import jungleBg from '../assets/images/background/jungle_bg.png';
import towerPlayer from '../assets/images/towers/tower_player.png';
import towerEnemy from '../assets/images/towers/tower_enemy.png';

const GameArena = () => {
    const { playerData, enemyData, gameState, submitWord, selectCard, matchResult, resetGame } = useGame();
    const [typedWord, setTypedWord] = useState('');
    const [message, setMessage] = useState('');
    const [attackAnimation, setAttackAnimation] = useState(false);

    // Handle word submission
    const handleSubmit = () => {
        if (!typedWord.trim() || !gameState.selectedCard) return;

        const result = submitWord(typedWord);
        setMessage(result.message);
        setTypedWord('');

        if (result.success && gameState.selectedCard !== 'shield') {
            setAttackAnimation(true);
            setTimeout(() => setAttackAnimation(false), 600);
        }

        setTimeout(() => setMessage(''), 2000);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    // Card configurations
    const cards = [
        { type: 'easy', damage: 10, difficulty: '3-4 letters' },
        { type: 'medium', damage: 15, difficulty: '5-7 letters' },
        { type: 'hard', damage: 20, difficulty: '8+ letters' },
        { type: 'shield', damage: 0, difficulty: 'Defense' }
    ];

    if (gameState.status !== 'playing' && !matchResult) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-black flex items-center justify-center">
                <div className="text-white text-2xl">Waiting for game to start...</div>
            </div>
        );
    }

    if (matchResult) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-black flex items-center justify-center">
                <div className="bg-slate-800/50 backdrop-blur-lg p-12 rounded-2xl border-2 border-yellow-500 text-center">
                    <Trophy className="w-24 h-24 text-yellow-400 mx-auto mb-6" />
                    <h1 className="text-4xl font-bold text-white mb-4">
                        {matchResult.winner === playerData.username ? 'VICTORY!' : 'DEFEAT'}
                    </h1>
                    <p className="text-xl text-gray-300 mb-8">Winner: {matchResult.winner}</p>
                    <button
                        onClick={resetGame}
                        className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold text-lg rounded-lg transition-all duration-300 hover:shadow-lg"
                    >
                        Return to Lobby
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 relative">
            {/* Full-screen jungle background */}
            <div
                className="fixed inset-0 bg-center bg-cover -z-10"
                style={{ backgroundImage: `url(${jungleBg})` }}
            />
            <div className="fixed inset-0 bg-black/30 -z-10" />

            {/* Header - Enemy Info */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="bg-red-900/30 backdrop-blur-sm rounded-2xl p-6 border-2 border-red-500/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Target className="w-10 h-10 text-red-400" />
                            <div>
                                <h3 className="text-2xl font-bold text-red-100">{enemyData.username}</h3>
                                <p className="text-red-300 text-sm">Enemy Tower</p>
                            </div>
                        </div>

                        {/* Enemy HP Bar */}
                        <div className="flex-1 mx-8">
                            <div className="flex items-center gap-2 mb-2">
                                <Heart className="w-5 h-5 text-red-400" />
                                <span className="text-red-100 font-bold">{enemyData.hp} / {enemyData.maxHp}</span>
                            </div>
                            <div className="w-full h-6 bg-slate-800 rounded-full overflow-hidden border-2 border-red-500/50">
                                <div
                                    className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-500"
                                    style={{ width: `${(enemyData.hp / enemyData.maxHp) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Enemy Shield Indicator */}
                        {enemyData.shield && (
                            <div className="animate-pulse">
                                <Shield className="w-12 h-12 text-blue-400" fill="currentColor" />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Battle Arena */}
            <div className="max-w-7xl mx-auto mb-8 relative">
                <div className="rounded-2xl p-6 md:p-8 min-h-[420px] md:min-h-[500px] relative overflow-hidden">
                    {/* Towers visuals inside arena */}
                    <img
                        src={towerEnemy}
                        alt="Enemy tower"
                        className="pointer-events-none select-none absolute bottom-4 right-6 h-48 md:h-64 object-contain drop-shadow-2xl"
                    />
                    <img
                        src={towerPlayer}
                        alt="Player tower"
                        className="pointer-events-none select-none absolute bottom-4 left-6 h-48 md:h-64 object-contain drop-shadow-2xl"
                    />

                    {/* Center content with padding for cards at bottom */}
                    <div className="relative z-10 flex flex-col items-center justify-center w-full h-full pb-32 md:pb-36">
                        {/* Attack Animation */}
                        {attackAnimation && (
                            <Flame className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 text-orange-500 animate-ping" />
                        )}

                        {/* Word Display */}
                        {gameState.selectedCard && gameState.currentWord ? (
                            <div className="text-center">
                                <p className="text-gray-300 mb-4">Type this word:</p>
                                <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 tracking-wider">
                                    {gameState.currentWord.toUpperCase()}
                                </h2>

                                {/* Input */}
                                <div className="max-w-md mx-auto">
                                    <input
                                        type="text"
                                        value={typedWord}
                                        onChange={(e) => setTypedWord(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        className="w-full px-6 py-4 text-2xl text-center bg-slate-900/60 border-2 border-purple-500 rounded-xl text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/50"
                                        placeholder="Type here..."
                                        autoFocus
                                    />
                                    <button
                                        onClick={handleSubmit}
                                        className="mt-4 px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors"
                                    >
                                        Submit
                                    </button>
                                </div>

                                {/* Message Feedback */}
                                {message && (
                                    <p className={`mt-4 text-lg font-bold ${message.includes('Incorrect') ? 'text-red-400' : 'text-green-400'}`}>
                                        {message}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="text-center">
                                <Crosshair className="w-20 h-20 md:w-24 md:h-24 text-purple-400 mx-auto mb-4" />
                                <p className="text-2xl text-purple-200">Select a card to begin!</p>
                            </div>
                        )}
                    </div>

                    {/* Card Deck inside arena at bottom */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-3 md:gap-4 justify-center">
                        {cards.map((card) => (
                            <Card
                                key={card.type}
                                type={card.type}
                                damage={card.damage}
                                difficulty={card.difficulty}
                                onClick={() => selectCard(card.type)}
                                disabled={gameState.selectedCard !== null || playerData.ammo <= 0}
                                isSelected={gameState.selectedCard === card.type}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Player Section */}
            <div className="max-w-7xl mx-auto">
                <div className="bg-green-900/30 backdrop-blur-sm rounded-2xl p-6 border-2 border-green-500/50 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Heart className="w-10 h-10 text-green-400" fill="currentColor" />
                            <div>
                                <h3 className="text-2xl font-bold text-green-100">{playerData.username}</h3>
                                <p className="text-green-300 text-sm">Your Tower</p>
                            </div>
                        </div>

                        {/* Player HP Bar */}
                        <div className="flex-1 mx-8">
                            <div className="flex items-center gap-2 mb-2">
                                <Heart className="w-5 h-5 text-green-400" />
                                <span className="text-green-100 font-bold">{playerData.hp} / {playerData.maxHp}</span>
                            </div>
                            <div className="w-full h-6 bg-slate-800 rounded-full overflow-hidden border-2 border-green-500/50">
                                <div
                                    className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
                                    style={{ width: `${(playerData.hp / playerData.maxHp) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Ammo Counter */}
                        <div className="text-center bg-slate-900/50 rounded-lg px-6 py-3">
                            <p className="text-yellow-400 text-sm">AMMO</p>
                            <p className="text-3xl font-bold text-white">{playerData.ammo}</p>
                        </div>

                        {/* Player Shield */}
                        {playerData.shield && (
                            <div className="animate-pulse ml-4">
                                <Shield className="w-12 h-12 text-blue-400" fill="currentColor" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameArena;