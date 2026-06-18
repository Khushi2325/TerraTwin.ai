import React, { useState } from 'react';
import { Sparkles, User, Send } from 'lucide-react';

export default function ClimateCoach() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Greetings Commander. I am Aura, the consciousness of your TerraTwin. My analysis indicates our transportation emissions are sub-optimal. How shall we optimize our transit protocol today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    if(!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    // Mock AI response
    setTimeout(() => {
      setMessages([...newMessages, { role: 'assistant', content: "Affirmative. Rerouting your primary transit to the public bus network will mitigate approximately 12kg of CO2. I have registered a new Constellation star for this directive." }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-6rem)] flex flex-col animate-in slide-in-from-bottom-4 fade-in duration-700 pb-4">
      <header className="glass-panel p-8 rounded-3xl relative overflow-hidden mb-6 flex-shrink-0 border-teal-500/30">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold flex items-center gap-4">
            <div className="p-2 bg-teal-500/20 rounded-xl border border-teal-500/50 shadow-[0_0_15px_rgba(20,184,166,0.4)]">
              <Sparkles className="text-teal-400 w-8 h-8" />
            </div>
            Aura: Core Intelligence
          </h1>
          <p className="text-slate-300 font-medium text-lg mt-3">Your direct neural link to the planet's AI consciousness.</p>
        </div>
      </header>

      {/* Chat Interface */}
      <div className="flex-1 glass-panel rounded-3xl border border-slate-700/80 flex flex-col overflow-hidden relative">
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md z-0 pointer-events-none"></div>
        
        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${
                msg.role === 'user' 
                  ? 'bg-slate-800 border-slate-600' 
                  : 'bg-teal-900/50 border-teal-500/50 shadow-[0_0_15px_rgba(20,184,166,0.3)]'
              }`}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-slate-300" /> : <Sparkles className="w-5 h-5 text-teal-400" />}
              </div>
              <div className={`p-5 rounded-2xl max-w-[80%] backdrop-blur-md font-medium leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-slate-800/80 border border-slate-700 text-white rounded-tr-sm' 
                  : 'bg-teal-500/10 border border-teal-500/30 text-teal-50 rounded-tl-sm'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-4">
               <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-teal-900/50 border border-teal-500/50 shadow-[0_0_15px_rgba(20,184,166,0.3)] animate-pulse">
                <Sparkles className="w-5 h-5 text-teal-400" />
              </div>
              <div className="p-5 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-50 rounded-tl-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <div className="p-5 border-t border-slate-700/80 bg-slate-900/80 relative z-10">
          <form onSubmit={handleSend} className="flex gap-3">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Transmit query to Aura..." 
              className="flex-1 bg-slate-800/80 text-white font-medium rounded-xl px-5 py-4 border border-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all placeholder-slate-500"
            />
            <button 
              type="submit" 
              disabled={!input.trim()}
              className="bg-teal-500 hover:bg-teal-400 disabled:opacity-50 disabled:hover:bg-teal-500 text-slate-900 px-6 py-4 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(20,184,166,0.3)] hover:shadow-[0_0_25px_rgba(20,184,166,0.5)] flex items-center justify-center"
            >
              <Send className="w-6 h-6" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
