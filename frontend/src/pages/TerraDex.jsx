import React from 'react';
import { Leaf, Lock } from 'lucide-react';

export default function TerraDex() {
  const species = [
    { name: "Azure Kingfisher", unlocked: true, rarity: "Rare", img: "🐦" },
    { name: "Emerald Fern", unlocked: true, rarity: "Common", img: "🌿" },
    { name: "Golden Monarch", unlocked: false, rarity: "Epic", img: "🦋" },
    { name: "Bioluminescent Coral", unlocked: false, rarity: "Legendary", img: "🪸" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 fade-in duration-700 pb-10">
      <header className="glass-panel p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold mb-2 flex items-center gap-3">
            <Leaf className="text-emerald-400 w-8 h-8" />
            Terra-Dex
          </h1>
          <p className="text-slate-300 font-medium text-lg">
            Cataloging the life you've restored to TerraTwin. Keep reducing emissions to attract more species.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {species.map((s, i) => (
          <div key={i} className={`glass-panel p-6 rounded-3xl flex flex-col items-center justify-center gap-4 transition-all duration-500 ${s.unlocked ? 'hover:scale-105 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'opacity-60 grayscale'}`}>
            <div className={`text-6xl ${!s.unlocked && 'opacity-20'}`}>
              {s.img}
            </div>
            {s.unlocked ? (
              <div className="text-center">
                <h3 className="font-bold text-white text-lg">{s.name}</h3>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-md mt-2 inline-block uppercase tracking-wider">{s.rarity}</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Lock className="w-5 h-5 text-slate-500" />
                <span className="text-sm font-bold text-slate-500 uppercase">Undiscovered</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
