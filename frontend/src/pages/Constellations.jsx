import React from 'react';
import { Star } from 'lucide-react';

export default function Constellations() {
  const constellations = [
    { name: "The Commuter", stars: 7, total: 10, description: "Use public transport 10 times." },
    { name: "The Herbivore", stars: 12, total: 12, description: "Eat 12 plant-based meals. (Completed!)" },
    { name: "The Saver", stars: 3, total: 15, description: "Keep AC usage under 2 hours for 15 days." }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 fade-in duration-700 pb-10">
      <header className="glass-panel p-8 rounded-3xl relative overflow-hidden border-purple-500/30">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold mb-2 flex items-center gap-3">
            <Star className="text-purple-400 w-8 h-8" />
            Impact Constellations
          </h1>
          <p className="text-slate-300 font-medium text-lg">
            Your achievements literally write themselves into the stars above TerraTwin.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {constellations.map((c, i) => (
          <div key={i} className="glass-panel p-6 rounded-3xl relative overflow-hidden border border-slate-700 hover:border-purple-500/50 transition-colors group">
            {/* Abstract Constellation Drawing */}
            <div className="h-40 w-full mb-6 relative border-b border-slate-700/50">
              <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-100 transition-opacity duration-700">
                 {/* Fake SVG constellation lines for visual effect */}
                 <svg width="100%" height="100%" className="text-purple-400/50 stroke-current drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]">
                    <line x1="20%" y1="80%" x2="50%" y2="20%" strokeWidth="1.5" />
                    <line x1="50%" y1="20%" x2="80%" y2="50%" strokeWidth="1.5" />
                    <circle cx="20%" cy="80%" r="4" fill="#a855f7" />
                    <circle cx="50%" cy="20%" r="6" fill="#a855f7" />
                    <circle cx="80%" cy="50%" r="4" fill="#a855f7" />
                 </svg>
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">{c.name}</h3>
            <p className="text-sm text-slate-400 mb-4 h-10">{c.description}</p>
            
            <div className="flex justify-between items-center text-sm font-bold">
               <span className="text-purple-400">{c.stars} Stars Lit</span>
               <span className="text-slate-500">{c.total} Required</span>
            </div>
            
            <div className="w-full bg-slate-900 rounded-full h-2 mt-2">
              <div className="bg-gradient-to-r from-purple-600 to-fuchsia-400 h-2 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" style={{ width: `${(c.stars/c.total)*100}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
