import { useContext } from "react";
import { GameContext } from "../context/GameContext";
import Card from "./Card";

const CardDeck = () => {
    const {
        selectedCard,
        setSelectedCard,
        ammo,
        shieldActive,
    } = useContext(GameContext);

    const cards = [
        {
            id: "easy",
            title: "Easy",
            damage: 10,
            color: "from-green-400 to-green-600",
            disabled: ammo <= 0,
        },
        {
            id: "medium",
            title: "Medium",
            damage: 35,
            color: "from-yellow-400 to-orange-500",
            disabled: ammo <= 0,
        },
        {
            id: "hard",
            title: "Hard",
            damage: 80,
            color: "from-red-500 to-pink-600",
            disabled: ammo <= 0,
        },
        {
            id: "shield",
            title: "Shield",
            damage: 0,
            color: "from-cyan-400 to-blue-600",
            disabled: shieldActive,
        },
    ];

    const handleSelect = (card) => {
        if (card.disabled) return;
        setSelectedCard(card.id);
    };

    return (
        <div className="flex justify-center gap-4">
            {cards.map((card) => (
                <Card
                    key={card.id}
                    id={card.id}
                    title={card.title}
                    damage={card.damage}
                    gradient={card.color}
                    selected={selectedCard === card.id}
                    disabled={card.disabled}
                    onClick={() => handleSelect(card)}
                />
            ))}
        </div>
    );
};

export default CardDeck;
