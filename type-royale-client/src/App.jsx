import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GameProvider } from "./context/GameContext";
import LoginPage from "./pages/LoginPage";
import Lobby from "./pages/Lobby";
import GameArena from "./pages/GameArena";
import WaitingRoom from "./pages/WaitingRoom";
import MatchResultPage from "./pages/MatchResultPage";

// App with React Router
export default function App() {
  return (
    <BrowserRouter>
      <GameProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/room/:roomId" element={<WaitingRoom />} />
          <Route path="/game/:roomId" element={<GameArena />} />
          <Route path="/result" element={<MatchResultPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </GameProvider>
    </BrowserRouter>
  );
}
