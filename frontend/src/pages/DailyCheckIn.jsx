import React, { useState } from 'react';
import { Leaf, Car, Zap, Utensils, Send, Check } from 'lucide-react';

export default function DailyCheckIn() {
  const [formData, setFormData] = useState({
    transport: 'bus',
    food: 'mixed',
    ac_hours: 4
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 fade-in duration-700 pb-20">
      <header className="glass-panel p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold mb-2">Sync Daily Logs</h1>
          <p className="text-slate-300 font-medium text-lg">Transmit your daily actions to the TerraTwin core to compute your impact.</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Transport */}
        <section className="glass-panel p-8 rounded-3xl border border-slate-700 hover:border-emerald-500/30 transition-colors">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-emerald-500/10 rounded-xl">
              <Car className="text-emerald-400 w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">Transit Modality</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {['walking', 'bicycle', 'bus', 'car'].map(mode => (
              <SelectButton 
                key={mode} 
                label={mode} 
                selected={formData.transport === mode} 
                onClick={() => setFormData({...formData, transport: mode})} 
              />
            ))}
          </div>
        </section>

        {/* Food */}
        <section className="glass-panel p-8 rounded-3xl border border-slate-700 hover:border-orange-500/30 transition-colors">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-orange-500/10 rounded-xl">
              <Utensils className="text-orange-400 w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">Nutritional Intake</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {['vegan', 'vegetarian', 'mixed', 'meat_heavy'].map(mode => (
              <SelectButton 
                key={mode} 
                label={mode.replace('_', ' ')} 
                selected={formData.food === mode} 
                onClick={() => setFormData({...formData, food: mode})} 
              />
            ))}
          </div>
        </section>

        {/* Energy */}
        <section className="glass-panel p-8 rounded-3xl border border-slate-700 hover:border-blue-500/30 transition-colors">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <Zap className="text-blue-400 w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">Climate Control (AC/Heating)</h2>
          </div>
          <div className="pt-4 pb-2 px-2">
            <input 
              type="range" 
              min="0" max="24" 
              value={formData.ac_hours} 
              onChange={(e) => setFormData({...formData, ac_hours: parseInt(e.target.value)})}
              className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div className="text-center mt-4 font-extrabold text-3xl text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
            {formData.ac_hours} <span className="text-lg text-slate-400 font-medium">Hours</span>
          </div>
        </section>

        <button 
          type="submit" 
          disabled={submitted}
          className={`w-full py-5 rounded-2xl font-extrabold flex items-center justify-center gap-3 transition-all text-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] ${
            submitted 
              ? 'bg-emerald-500 text-slate-900 shadow-[0_0_40px_rgba(16,185,129,0.6)] scale-[0.98]' 
              : 'bg-emerald-400 hover:bg-emerald-300 text-slate-900 hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] hover:-translate-y-1'
          }`}
        >
          {submitted ? (
            <>
              <Check className="w-6 h-6" /> Transmission Successful
            </>
          ) : (
            <>
              <Send className="w-6 h-6" /> Transmit Data to Core
            </>
          )}
        </button>
      </form>
    </div>
  );
}

function SelectButton({ label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-4 rounded-2xl border-2 font-bold capitalize transition-all duration-300 ${
        selected 
          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
          : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white'
      }`}
    >
      {label}
    </button>
  );
}
