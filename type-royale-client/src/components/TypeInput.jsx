import { useContext, useEffect, useState } from "react";
import { GameContext } from "../context/GameContext";
import socket from "../utils/socketClient";
import { validateWord } from "../utils/wordValidator";
import { calculateDamage } from "../utils/damageCalculator";

const TypeInput = ({ roomId }) => {
    const {
        selectedCard,
        wordPool,
        ammo,
        setAmmo,
        shieldActive,
        setShieldActive,
    } = useContext(GameContext);

    const [input, setInput] = useState("");
    const [targetWord, setTargetWord] = useState("");
    const [isCorrect, setIsCorrect] = useState(null);

    /* ---------------------------------- */
    /* Pick a new word when card changes  */
    /* ---------------------------------- */
    useEffect(() => {
        if (!selectedCard || !wordPool) return;

        const words = wordPool[selectedCard];
        if (!words || words.length === 0) return;

        const randomWord = words[Math.floor(Math.random() * words.length)];
        setTargetWord(randomWord);
        setInput("");
        setIsCorrect(null);
    }, [selectedCard, wordPool]);

    /* ---------------------------------- */
    /* Handle typing                       */
    /* ---------------------------------- */
    const handleChange = (e) => {
        const value = e.target.value;
        setInput(value);

        if (!targetWord) return;

        // Correct
        if (value === targetWord) {
            setIsCorrect(true);

            // Shield
            if (selectedCard === "shield") {
                socket.emit("activate_shield", { roomId });
                setShieldActive(true);
            }
            // Attack
            else {
                const damage = calculateDamage(selectedCard);
                socket.emit("send_attack", {
                    roomId,
                    damage,
                    type: selectedCard,
                });
            }

            setAmmo((prev) => Math.max(0, prev - 1));

            // Reset for next word
            setTimeout(() => {
                setInput("");
                setIsCorrect(null);

                const words = wordPool[selectedCard];
                const next =
                    words[Math.floor(Math.random() * words.length)];
                setTargetWord(next);
            }, 300);
        }

        // Invalid typing
        else if (!validateWord(value, targetWord)) {
            setIsCorrect(false);
        } else {
            setIsCorrect(null);
        }
    };

    const disabled =
        !selectedCard ||
        ammo <= 0 ||
        (selectedCard === "shield" && shieldActive);

    return (
        <div className="flex flex-col items-center gap-3">
            {/* Target Word */}
            <div className="text-xl font-bold tracking-wider text-white">
                {targetWord || "Select a Card"}
            </div>

            {/* Input */}
            <input
                type="text"
                value={input}
                disabled={disabled}
                onChange={handleChange}
                placeholder="Type here..."
                className={`w-64 rounded-xl px-4 py-2 text-center text-lg font-semibold outline-none transition
          ${isCorrect === true
                        ? "bg-green-500 text-white"
                        : isCorrect === false
                            ? "bg-red-500 text-white"
                            : "bg-gray-800 text-white"
                    }
          ${disabled ? "opacity-50" : ""}
        `}
            />

            {/* Hint */}
            <div className="text-xs text-gray-400">
                {disabled
                    ? "Select a card to begin"
                    : "Type the word exactly"}
            </div>
        </div>
    );
};

export default TypeInput;
