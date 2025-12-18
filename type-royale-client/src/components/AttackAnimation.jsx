import { useEffect, useState } from "react";

const AttackAnimation = ({ type = "fireball", trigger }) => {
    const [active, setActive] = useState(false);

    /**
     * trigger should change value whenever
     * a new attack is received (e.g. timestamp or counter)
     */
    useEffect(() => {
        if (!trigger) return;

        setActive(true);
        const timeout = setTimeout(() => setActive(false), 800);

        return () => clearTimeout(timeout);
    }, [trigger]);

    if (!active) return null;

    return (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            {type === "fireball" && <Fireball />}
            {type === "shield" && <Shield />}
        </div>
    );
};

export default AttackAnimation;

/* ---------------------------------- */
/* Fireball Animation                  */
/* ---------------------------------- */
const Fireball = () => {
    return (
        <div className="relative">
            <div className="h-16 w-16 animate-fireball rounded-full bg-gradient-to-br from-orange-400 via-red-500 to-yellow-400 shadow-[0_0_40px_10px_rgba(255,80,0,0.7)]" />
        </div>
    );
};

/* ---------------------------------- */
/* Shield Animation                    */
/* ---------------------------------- */
const Shield = () => {
    return (
        <div className="relative">
            <div className="h-24 w-24 animate-shield rounded-full border-4 border-cyan-400 bg-cyan-400/10 shadow-[0_0_30px_5px_rgba(0,200,255,0.6)]" />
        </div>
    );
};
