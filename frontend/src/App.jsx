import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import CommandDeckLayout from './layouts/CommandDeckLayout';
import Dashboard from './pages/Dashboard';
import DailyCheckIn from './pages/DailyCheckIn';
import ClimateCoach from './pages/ClimateCoach';
import TerraDex from './pages/TerraDex';
import Constellations from './pages/Constellations';

const API_BASE = "http://127.0.0.1:8000";

function App() {
  // Load initial user from localStorage if it exists
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('terratwin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [appData, setAppData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAppData = async (userId) => {
    try {
      const res = await fetch(`${API_BASE}/users/${userId}`);
      const data = await res.json();
      if (!data.error) {
        setAppData(data);
      }
    } catch (err) {
      console.error("Error fetching app data:", err);
    }
  };

  const handleLogin = async (userData) => {
    setLoading(true);
    const userId = userData.email.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
    const fullUser = { ...userData, user_id: userId };
    
    try {
      // Create or load user from backend
      const res = await fetch(`${API_BASE}/users/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          name: fullUser.name,
          email: fullUser.email
        })
      });
      const data = await res.json();
      setAppData(data);
      setUser(fullUser);
      localStorage.setItem('terratwin_user', JSON.stringify(fullUser));
    } catch (err) {
      console.error("Backend login error:", err);
      // Fallback in case backend is offline
      const fallbackData = {
        profile: { name: fullUser.name, email: fullUser.email, user_id: userId },
        twin: { forest: 70, water: 65, air: 60, wildlife: 80, planet: 69 },
        logs: [],
        xp: 3600,
        streak: 7
      };
      setAppData(fallbackData);
      setUser(fullUser);
      localStorage.setItem('terratwin_user', JSON.stringify(fullUser));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setAppData(null);
    localStorage.removeItem('terratwin_user');
  };

  const refreshAppData = async () => {
    if (user?.user_id) {
      await fetchAppData(user.user_id);
    }
  };

  useEffect(() => {
    if (user?.user_id) {
      fetchAppData(user.user_id);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-emerald-400 font-extrabold tracking-widest text-sm uppercase">Syncing TerraTwin Core...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            !user
              ? <LandingPage onLogin={handleLogin} />
              : <Navigate to="/app" replace />
          }
        />

        <Route
          path="/app/*"
          element={
            user && appData
              ? (
                <CommandDeckLayout user={user} appData={appData} onLogout={handleLogout}>
                  <Routes>
                    <Route path="" element={<Dashboard user={user} appData={appData} refreshAppData={refreshAppData} />} />
                    <Route path="check-in" element={<DailyCheckIn user={user} appData={appData} refreshAppData={refreshAppData} />} />
                    <Route path="coach" element={<ClimateCoach user={user} appData={appData} refreshAppData={refreshAppData} />} />
                    <Route path="terradex" element={<TerraDex user={user} appData={appData} />} />
                    <Route path="constellations" element={<Constellations user={user} appData={appData} />} />
                  </Routes>
                </CommandDeckLayout>
              )
              : <Navigate to="/" replace />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
