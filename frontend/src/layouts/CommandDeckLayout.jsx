import React, { useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Globe, Leaf, CheckCircle, MessageSquare, Star, LogOut, Zap } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Sphere } from '@react-three/drei';

function BgPlanet() {
  const ref = useRef();
  useFrame(() => { if (ref.current) ref.current.rotation.y += 0.0008; });
  return (
    <mesh ref={ref} position={[6, 1, -8]}>
      <sphereGeometry args={[5, 64, 64]} />
      <meshStandardMaterial color="#064e3b" roughness={0.8} emissive="#022c22" emissiveIntensity={0.15} />
    </mesh>
  );
}

function BackgroundScene() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 12], fov: 50 }}>
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} color="#10b981" />
        <Stars radius={120} depth={70} count={6000} factor={4} saturation={0} fade speed={0.3} />
        <BgPlanet />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/40 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-transparent to-slate-950/80 pointer-events-none" />
    </div>
  );
}

const navItems = [
  { path: '/app', label: 'Command Center', icon: Globe },
  { path: '/app/check-in', label: 'Daily Log', icon: CheckCircle },
  { path: '/app/coach', label: 'Aura AI', icon: MessageSquare },
  { path: '/app/terradex', label: 'Terra-Dex', icon: Leaf },
  { path: '/app/constellations', label: 'Constellations', icon: Star },
];

function isActivePath(current, target) {
  if (target === '/app') return current === '/app';
  return current.startsWith(target);
}

export default function CommandDeckLayout({ children, user, onLogout }) {
  const location = useLocation();
  const firstName = user?.name?.split(' ')[0] || 'Guardian';
  const initial = firstName[0]?.toUpperCase() || 'G';

  return (
    <div className="min-h-screen text-white relative flex">
      <BackgroundScene />

      {/* ── Sidebar ────────────────────────────────────── */}
      <nav className="relative z-20 w-20 md:w-68 flex-shrink-0 h-screen flex flex-col p-4 md:p-5 gap-5 border-r border-slate-800/40">
        {/* Logo */}
        <div className="flex items-center gap-3 px-1 py-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center shadow-[0_0_16px_rgba(16,185,129,0.3)] flex-shrink-0">
            <Globe className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="hidden md:block">
            <p className="text-lg font-extrabold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent leading-tight">TerraTwin</p>
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">AI Carbon Companion</p>
          </div>
        </div>

        {/* XP Progress */}
        <div className="glass hidden md:block p-4 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Earth Protector</span>
            </div>
            <span className="text-xs font-extrabold text-amber-400">Lv.12</span>
          </div>
          <div className="h-1.5 w-full bg-slate-900 rounded-full">
            <div className="h-1.5 rounded-full bg-gradient-to-r from-amber-600 to-yellow-400" style={{ width: '72%' }} />
          </div>
          <p className="text-right text-[10px] text-slate-500 font-bold mt-1">3,600 / 5,000 XP</p>
        </div>

        {/* Nav */}
        <div className="flex flex-col gap-1 flex-1">
          {navItems.map(({ path, label, icon: Icon }) => {
            const active = isActivePath(location.pathname, path);
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3.5 px-3 py-3 rounded-xl transition-all duration-200 group ${
                  active
                    ? 'bg-emerald-500/12 border border-emerald-500/35 text-emerald-400'
                    : 'border border-transparent text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'drop-shadow-[0_0_6px_rgba(16,185,129,0.8)]' : ''}`} />
                <span className="hidden md:block text-sm font-semibold">{label}</span>
                {active && <div className="ml-auto w-1.5 h-1.5 bg-emerald-400 rounded-full hidden md:block animate-pulse" />}
              </Link>
            );
          })}
        </div>

        {/* User card */}
        <div className="glass p-3 rounded-xl border border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center font-extrabold text-slate-950 flex-shrink-0 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
            {initial}
          </div>
          <div className="hidden md:flex flex-col flex-1 min-w-0">
            <span className="text-sm font-bold text-white truncate">{firstName}</span>
            <span className="text-[10px] text-emerald-400 font-medium">🌱 Earth Protector</span>
          </div>
          <button
            onClick={onLogout}
            className="hidden md:flex text-slate-600 hover:text-red-400 transition-colors p-1.5 hover:bg-red-500/10 rounded-lg"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* ── Main content ───────────────────────────────── */}
      <main className="relative z-10 flex-1 h-screen overflow-y-auto p-5 md:p-8">
        {children}
      </main>
    </div>
  );
}
