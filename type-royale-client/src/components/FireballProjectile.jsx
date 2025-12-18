import { useEffect } from "react";
import fireballImg from "../assets/images/effects/fireball.png";

const FireballProjectile = ({ direction = "right", onDone }) => {
  useEffect(() => {
    const t = setTimeout(() => {
      onDone?.();
    }, 700);

    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <img
      src={fireballImg}
      alt="Fireball"
      className={`pointer-events-none absolute top-1/2 w-12 pixelated
        ${direction === "right" ? "fireball-right" : "fireball-left"}
      `}
      style={{ transform: "translateY(-50%)" }}
    />
  );
};

export default FireballProjectile;
