import React, { useEffect, useState } from "react";

const Confetti = ({ isActive = true, duration = 5000 }) => {
  const [particles, setParticles] = useState([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!isActive) return;

    // Generate confetti particles
    const colors = [
      "#FFD700", // Gold
      "#FFA500", // Orange
      "#FF6B6B", // Red
      "#4ECDC4", // Teal
      "#45B7D1", // Blue
      "#96CEB4", // Green
      "#FFEAA7", // Yellow
      "#DDA0DD", // Plum
      "#98D8C8", // Mint
      "#F7DC6F", // Light Yellow
    ];

    const shapes = ["square", "circle", "triangle"];

    const newParticles = Array.from({ length: 150 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10 - Math.random() * 20,
      size: Math.random() * 10 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      speedX: (Math.random() - 0.5) * 3,
      speedY: Math.random() * 3 + 2,
      delay: Math.random() * 2,
      wobble: Math.random() * 10,
      wobbleSpeed: Math.random() * 2 + 1,
    }));

    setParticles(newParticles);

    // Hide confetti after duration
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [isActive, duration]);

  if (!isActive || !isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-confetti-fall"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor:
              particle.shape !== "triangle" ? particle.color : "transparent",
            borderRadius: particle.shape === "circle" ? "50%" : "0",
            borderLeft:
              particle.shape === "triangle"
                ? `${particle.size / 2}px solid transparent`
                : "none",
            borderRight:
              particle.shape === "triangle"
                ? `${particle.size / 2}px solid transparent`
                : "none",
            borderBottom:
              particle.shape === "triangle"
                ? `${particle.size}px solid ${particle.color}`
                : "none",
            transform: `rotate(${particle.rotation}deg)`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
            "--speed-x": particle.speedX,
            "--speed-y": particle.speedY,
            "--wobble": particle.wobble,
            "--wobble-speed": particle.wobbleSpeed,
            "--rotation-speed": particle.rotationSpeed,
          }}
        />
      ))}

      {/* Extra sparkle effects */}
      {Array.from({ length: 20 }, (_, i) => (
        <div
          key={`sparkle-${i}`}
          className="absolute animate-sparkle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: "4px",
            height: "4px",
            backgroundColor: "#FFD700",
            borderRadius: "50%",
            boxShadow: "0 0 10px 2px rgba(255, 215, 0, 0.8)",
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
