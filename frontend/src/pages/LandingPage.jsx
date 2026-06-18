import { useState } from 'react';
import {
  Activity,
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  Download,
  Flame,
  Globe,
  Leaf,
  Lock,
  MessageSquare,
  Shield,
  Sparkles,
  Star,
  Target,
  Users,
  Zap,
} from 'lucide-react';
import ProceduralPlanet from '../components/ProceduralPlanet';

const features = [
  { icon: Globe, title: 'Living Planet', text: 'Your habits heal or damage a 3D TerraTwin in real time.' },
  { icon: Target, title: 'Carbon Detector', text: 'Find hidden emission leaks and convert them into fix missions.' },
  { icon: Sparkles, title: 'Aura AI Coach', text: 'Get simple swaps for transport, food, shopping, and energy.' },
  { icon: Star, title: 'Quest Streaks', text: 'Earn XP, badges, constellations, and new restored biomes.' },
];

const steps = [
  { icon: CheckCircle2, title: 'Log today', text: 'One-minute check-in for travel, meals, and power use.' },
  { icon: Zap, title: 'Spot leaks', text: 'See the biggest carbon hotspots without reading a report.' },
  { icon: Leaf, title: 'Grow Terra', text: 'Finish quests to unlock species and improve your planet score.' },
];

const systemModules = [
  { icon: CalendarCheck, title: 'Daily Check-In', text: 'Transport, meals, energy, shopping, and quick mood tags.' },
  { icon: Activity, title: 'Leak Radar', text: 'Detect sudden spikes and show the fastest fix for each one.' },
  { icon: MessageSquare, title: 'Aura Coach', text: 'Ask what to change today and get short, personal actions.' },
  { icon: BookOpen, title: 'Terra-Dex', text: 'Unlock restored species, places, and rare collectibles.' },
  { icon: BarChart3, title: 'Progress Reports', text: 'Weekly pulse charts, goal progress, and category breakdowns.' },
  { icon: Download, title: 'Export Hub', text: 'Download CSV logs and summary reports for presentations.' },
];

export default function LandingPage({ onLogin }) {
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const openAuth = (loginMode) => {
    setIsLogin(loginMode);
    setShowAuth(true);
    setError('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError('Please fill in email and password.');
      return;
    }

    if (!isLogin && !form.name) {
      setError('Please enter your name.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin({ name: isLogin ? 'Khushi' : form.name, email: form.email });
    }, 700);
  };

  return (
    <div className="landing-page">
      <header className="landing-nav">
        <div className="landing-brand">
          <div className="landing-brand-icon">
            <Globe size={22} />
          </div>
          <div>
            <p>TerraTwin AI</p>
            <span>Carbon adventure platform</span>
          </div>
        </div>

        <button className="landing-ghost-btn" onClick={() => openAuth(true)}>
          Sign In
        </button>
      </header>

      <main className="landing-main">
        <section className="landing-hero">
          <div className="landing-copy">
            <div className="landing-pill">
              <Flame size={14} />
              Your carbon detector, but as a game
            </div>

            <h1>
              Build your planet by improving your real life habits.
            </h1>

            <p className="landing-subtitle">
              Track carbon choices, reveal emission leaks, complete quests, and watch your TerraTwin become greener every day.
            </p>

            <div className="landing-actions">
              <button className="landing-primary-btn" onClick={() => openAuth(false)}>
                Begin Journey
                <ArrowRight size={18} />
              </button>
              <button className="landing-secondary-btn" onClick={() => openAuth(true)}>
                I Have an Account
              </button>
            </div>

            <div className="landing-stats">
              <div>
                <strong>12.4k</strong>
                <span>Guardians</span>
              </div>
              <div>
                <strong>145k kg</strong>
                <span>Carbon Saved</span>
              </div>
              <div>
                <strong>250+</strong>
                <span>Species Restored</span>
              </div>
            </div>
          </div>

          <div className="landing-planet-panel">
            <div className="landing-panel-top">
              <span className="landing-live-dot" />
              System Lush
            </div>
            <div className="landing-planet">
              <ProceduralPlanet health={85} showStars={false} autoRotate />
            </div>
            <div className="landing-health-card">
              <Activity size={15} />
              <div>
                <span>Health Index</span>
                <strong>85%</strong>
              </div>
            </div>
            <div className="landing-xp-card">
              <Shield size={15} />
              Level 12 Protector
            </div>
          </div>
        </section>

        <section className="landing-loop">
          <div className="landing-section-head">
            <span>How it works</span>
            <h2>Simple setup. Fast feedback. Real game loop.</h2>
          </div>

          <div className="landing-steps">
            {steps.map(({ icon: Icon, title, text }, index) => (
              <article className="landing-step" key={title}>
                <div className="landing-step-number">{index + 1}</div>
                <Icon size={22} />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-feature-grid">
          {features.map(({ icon: Icon, title, text }) => (
            <article className="landing-feature" key={title}>
              <div>
                <Icon size={22} />
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </section>

        <section className="landing-system">
          <div className="landing-section-head">
            <span>Full system</span>
            <h2>Not one page. A complete carbon adventure dashboard.</h2>
          </div>

          <div className="landing-system-grid">
            {systemModules.map(({ icon: Icon, title, text }) => (
              <article className="landing-system-card" key={title}>
                <Icon size={19} />
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-preview">
          <div className="landing-preview-copy">
            <div className="landing-pill muted">
              <Target size={14} />
              Detector preview
            </div>
            <h2>Small cards, clear actions, no boring carbon wall.</h2>
            <p>
              The logged-in dashboard turns every feature into a scan-friendly game surface: quests, leak alerts, XP, future simulator, community raids, and reports.
            </p>
          </div>
          <div className="landing-preview-board">
            <div className="landing-mini-card hot">
              <span>High leak</span>
              <strong>Ride spike</strong>
              <p>Swap 2 car trips to recover 90 XP.</p>
            </div>
            <div className="landing-mini-card good">
              <span>Quest</span>
              <strong>Energy Sprint</strong>
              <p>4/7 days completed.</p>
            </div>
            <div className="landing-mini-card cool">
              <span>Aura tip</span>
              <strong>Best action</strong>
              <p>Batch orders once this week.</p>
            </div>
          </div>
        </section>

        <section className="landing-raid">
          <div>
            <div className="landing-pill muted">
              <Users size={14} />
              Live community raid
            </div>
            <h2>Save 10,000 kg CO2 together this weekend.</h2>
            <p>Every check-in moves the city meter and unlocks a limited Terra-Dex discovery.</p>
          </div>
          <div className="landing-raid-meter">
            <div className="landing-meter-label">
              <span>7,420 kg saved</span>
              <span>10,000 kg goal</span>
            </div>
            <div className="landing-meter-track">
              <div />
            </div>
          </div>
        </section>
      </main>

      {showAuth && (
        <div className="landing-modal">
          <button className="landing-modal-bg" onClick={() => setShowAuth(false)} aria-label="Close" />
          <form className="landing-auth-card" onSubmit={handleSubmit}>
            <div className="landing-auth-icon">
              {isLogin ? <Lock size={24} /> : <Globe size={24} />}
            </div>
            <h2>{isLogin ? 'Welcome back' : 'Create your planet'}</h2>
            <p>{isLogin ? 'Continue growing your TerraTwin.' : 'Start with a quick account setup.'}</p>

            {!isLogin && (
              <input
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
              />
            )}
            <input
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
            />

            {error && <div className="landing-error">{error}</div>}

            <button className="landing-auth-submit" type="submit" disabled={loading}>
              {loading ? 'Opening TerraTwin...' : isLogin ? 'Enter Dashboard' : 'Create Planet'}
            </button>

            <button type="button" className="landing-auth-switch" onClick={() => setIsLogin((value) => !value)}>
              {isLogin ? 'Need a new planet?' : 'Already have a planet?'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
