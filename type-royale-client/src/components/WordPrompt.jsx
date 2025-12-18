import { useMemo } from "react";

const WordPrompt = ({
    word = "",
    typed = "",
    status = "idle",
    // "idle" | "correct" | "wrong"
}) => {
    const letters = useMemo(() => word.split(""), [word]);

    return (
        <div className="flex justify-center gap-1 text-2xl font-bold tracking-wider">
            {letters.map((char, idx) => {
                let color = "text-gray-400";

                if (typed[idx]) {
                    if (typed[idx] === char) {
                        color = "text-green-400";
                    } else {
                        color = "text-red-500";
                    }
                }

                if (status === "correct") {
                    color = "text-green-500";
                }

                return (
                    <span
                        key={idx}
                        className={`transition-colors duration-150 ${color}`}
                    >
                        {char}
                    </span>
                );
            })}
        </div>
    );
};

export default WordPrompt;
