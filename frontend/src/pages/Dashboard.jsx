import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  Award,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  Flame,
  Leaf,
  MessageSquare,
  PlusCircle,
  Shield,
  Sparkles,
  Target,
  TreePine,
  TrendingUp,
  Users,
  Utensils,
  Wind,
  Zap,
} from 'lucide-react';
import ProceduralPlanet from '../components/ProceduralPlanet';

function MiniStat({ icon: Icon, label, value, tone = 'emerald' }) {
  return (
    <div className={`dash-mini-stat ${tone}`}>
      <Icon size={18} />
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function SetupCard({ icon: Icon, title, text, done, to }) {
  const content = (
    <div className="dash-setup-card">
      <div className={done ? 'done' : ''}>
        {done ? <CheckCircle2 size={18} /> : <Icon size={18} />}
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
      <ChevronRight size={16} />
    </div>
  );

  return to ? <Link to={to}>{content}</Link> : content;
}

function QuestCard({ icon: Icon, title, progress, total, reward }) {
  const pct = Math.min(100, Math.round((progress / total) * 100));

  return (
    <article className="dash-quest-card">
      <div className="dash-card-top">
        <Icon size={18} />
        <span>{reward}</span>
      </div>
      <h3>{title}</h3>
      <div className="dash-progress">
        <div style={{ width: `${pct}%` }} />
      </div>
      <p>{progress}/{total} completed</p>
    </article>
  );
}

function LeakCard({ icon: Icon, title, kg, fix, high }) {
  return (
    <article className={`dash-leak-card ${high ? 'high' : ''}`}>
      <Icon size={18} />
      <div>
        <div className="dash-leak-title">
          <strong>{title}</strong>
          <span>+{kg} kg</span>
        </div>
        <p>{fix}</p>
      </div>
    </article>
  );
}

function FeatureLink({ icon: Icon, title, text, to }) {
  return (
    <Link to={to} className="dash-feature-link">
      <Icon size={18} />
      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
      <ChevronRight size={16} />
    </Link>
  );
}

export default function Dashboard({ user, appData }) {
  const [showFuture, setShowFuture] = useState(false);
  const name = user?.name?.split(' ')[0] || appData?.profile?.name?.split(' ')[0] || 'Guardian';
  const logs = appData?.logs || [];
  const streak = appData?.streak || 7;
  const fallbackBiomes = useMemo(() => ({ forest: 72, water: 65, air: 58, wildlife: 81 }), []);
  const biomes = appData?.twin || fallbackBiomes;
  const planetHealth = Math.round((biomes.forest + biomes.water + biomes.air + biomes.wildlife) / 4);

  const weekData = [38, 46, 35, 52, 41, 30, 34];
  const maxWeek = Math.max(...weekData);

  return (
    <div className="dash-shell">
      <section className="dash-hero-row">
        <div className="dash-welcome-card">
          <div className="dash-kicker">
            <Flame size={14} />
            {streak} day streak active
          </div>
          <h1>Hey {name}, welcome to your carbon command center.</h1>
          <p>
            Track habits, reveal carbon leaks, finish quests, and grow your TerraTwin without a boring spreadsheet.
          </p>
          <div className="dash-actions">
            <Link to="/app/check-in">
              <PlusCircle size={16} />
              Log today
            </Link>
            <Link to="/app/coach" className="secondary">
              <Sparkles size={16} />
              Ask Aura
            </Link>
          </div>
        </div>

        <div className="dash-planet-card">
          <div className="dash-planet-wrap">
            <ProceduralPlanet health={planetHealth} showStars={false} autoRotate />
          </div>
          <div className="dash-planet-info">
            <div>
              <span>Terra Health</span>
              <strong>{planetHealth}/100</strong>
            </div>
            <div className="dash-health-ring">
              <div style={{ height: `${planetHealth}%` }} />
            </div>
          </div>
        </div>

        <div className="dash-status-grid">
          <MiniStat icon={TreePine} label="Carbon saved" value="145 kg" />
          <MiniStat icon={Shield} label="Rank class" value="Protector" tone="purple" />
          <MiniStat icon={Award} label="Badges" value="12" tone="amber" />
          <MiniStat icon={Target} label="Quest progress" value="68%" tone="sky" />
        </div>
      </section>

      <section className="dash-section">
        <div className="dash-section-head">
          <div>
            <h2>First-Time Setup</h2>
            <p>Clear next steps for a new user.</p>
          </div>
          <span>3 min setup</span>
        </div>
        <div className="dash-setup-grid">
          <SetupCard
            icon={CalendarCheck}
            title="Add daily log"
            text="Transport, food, energy, and shopping."
            done={logs.length > 0}
            to="/app/check-in"
          />
          <SetupCard icon={Target} title="Choose weekly quest" text="Pick one habit challenge to start." />
          <SetupCard icon={MessageSquare} title="Ask Aura" text="Get one simple action for today." to="/app/coach" />
        </div>
      </section>

      <section className="dash-grid-two">
        <div className="dash-panel">
          <div className="dash-section-head compact">
            <div>
              <h2>Active Quests</h2>
              <p>Small missions that make carbon reduction feel like progress.</p>
            </div>
          </div>
          <div className="dash-quest-grid">
            <QuestCard icon={Wind} title="Transit combo" progress={2} total={5} reward="+120 XP" />
            <QuestCard icon={Utensils} title="Low carbon lunch" progress={3} total={4} reward="+80 XP" />
            <QuestCard icon={Zap} title="Energy saver" progress={4} total={7} reward="+95 XP" />
          </div>
        </div>

        <div className="dash-panel">
          <div className="dash-section-head compact">
            <div>
              <h2>Carbon Leak Detector</h2>
              <p>Hidden hotspots become fixable actions.</p>
            </div>
            <span className="danger">3 found</span>
          </div>
          <div className="dash-leak-list">
            <LeakCard icon={Activity} title="Ride pattern spike" kg="6.4" fix="Swap 2 car trips for shared transit." high />
            <LeakCard icon={Zap} title="Cooling over target" kg="4.8" fix="Use a two-hour timer today." />
            <LeakCard icon={Leaf} title="Delivery packaging" kg="3.1" fix="Batch orders once this week." />
          </div>
        </div>
      </section>

      <section className="dash-grid-two">
        <div className="dash-panel">
          <div className="dash-section-head compact">
            <div>
              <h2>Weekly Carbon Pulse</h2>
              <p>Daily CO2 estimate in kg.</p>
            </div>
          </div>
          <div className="dash-bars">
            {weekData.map((value, index) => (
              <div key={index}>
                <span>{value}</span>
                <div style={{ height: `${Math.round((value / maxWeek) * 100)}%` }} />
                <strong>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="dash-panel dash-future">
          <div className="dash-section-head compact">
            <div>
              <h2>Future Simulator</h2>
              <p>See how choices change your 2030 path.</p>
            </div>
          </div>
          <div className="dash-future-grid">
            <MiniStat icon={AlertTriangle} label="Current path" value="+22%" tone="rose" />
            <MiniStat icon={TrendingUp} label="Better route" value="-35%" tone="emerald" />
          </div>
          <button onClick={() => setShowFuture((value) => !value)}>
            <Clock size={16} />
            {showFuture ? 'Hide forecast' : 'Reveal forecast'}
          </button>
          {showFuture && (
            <p className="dash-forecast">
              Aura predicts your fastest win is transport: two shared rides and one lower-energy evening can raise Terra health by 6 points this month.
            </p>
          )}
        </div>
      </section>

      <section className="dash-grid-two">
        <div className="dash-panel">
          <div className="dash-section-head compact">
            <div>
              <h2>Feature Map</h2>
              <p>Every main part of the system is one click away.</p>
            </div>
          </div>
          <div className="dash-feature-grid">
            <FeatureLink icon={CalendarCheck} title="Daily Log" text="Quick habit input." to="/app/check-in" />
            <FeatureLink icon={MessageSquare} title="Aura AI" text="Personal tips." to="/app/coach" />
            <FeatureLink icon={BookOpen} title="Terra-Dex" text="Unlock discoveries." to="/app/terradex" />
            <FeatureLink icon={Download} title="Reports" text="Export progress." to="/app/check-in" />
          </div>
        </div>

        <div className="dash-panel dash-raid">
          <div className="dash-section-head compact">
            <div>
              <h2>Community Raid</h2>
              <p>Cool City Week is live.</p>
            </div>
            <Users size={20} />
          </div>
          <p>12,481 players are saving 10,000 kg CO2 together before Sunday night.</p>
          <div className="dash-raid-meter">
            <div>
              <span>7,420 kg saved</span>
              <span>10,000 kg goal</span>
            </div>
            <div className="dash-progress">
              <div style={{ width: '74.2%' }} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
