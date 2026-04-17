import React, { useState, useEffect } from 'react';
import { supabase } from "./lib/supabase";
import { Globe, ListChecks } from 'lucide-react';

// 1. IMPORTACIÓN DE COMPONENTES
import PlayerProfile from './components/PlayerProfile';
import MajorAchievements from './components/MajorAchievements';
import UpcomingSchedule from './components/UpcomingSchedule';
import PointsProduction from './components/PointsProduction';
import RublevMood from './components/RublevMood';
import HeadToHead from './components/HeadToHead';
import FullCalendar from './components/FullCalendar';
import FoundationPage from './components/FoundationPage';
import TrophyCabinet from './components/TrophyCabinet';
import RankingJourney from './components/RankingJourney';
import SeasonOverview from './components/SeasonOverview';
import SeasonResultsTimeline from './components/SeasonResultsTimeline';
import LatestDrawBox from './components/LatestDrawBox';

// 2. COMPONENTE DASHBOARD
const Dashboard = ({ activeTab, setActiveTab }) => {
  return (
    <div className="max-w-6xl mx-auto bg-[#0a0a0a] border-x border-white/10 min-h-screen relative z-10 shadow-[0_0_100px_rgba(0,0,0,0.6)]">
      <PlayerProfile activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="p-10 pt-16">
        {/* TAB: DASHBOARD (STATS) */}
        {activeTab === 'stats' && (
          <div className="space-y-20 animate-in fade-in duration-700">
            <SeasonOverview setActiveTab={setActiveTab} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 pt-16 border-t border-white/10 relative">
              <div className="absolute top-0 left-0 w-24 h-[2px] bg-white"></div>
              <div className="lg:col-span-6">
                <UpcomingSchedule setActiveTab={setActiveTab} />
              </div>
              <div className="lg:col-span-6">
                <LatestDrawBox setActiveTab={setActiveTab} />
              </div>
            </div>

            <div className="space-y-16">
              <PointsProduction setActiveTab={setActiveTab} />
            </div>

            <div className="pt-16 border-t border-white/10 relative">
              <div className="absolute top-0 left-0 w-12 h-[1px] bg-white/40"></div>
              <MajorAchievements setActiveTab={setActiveTab} />
            </div>
          </div>
        )}

        {/* TAB: MATCH RESULTS */}
        {activeTab === 'results' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-12">
               <h2 className="text-4xl font-black italic uppercase text-white tracking-tighter">Season Results <span className="text-red-600">Timeline</span></h2>
               <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em] mt-2">Chronological Match Log // 2026</p>
            </div>
            <SeasonResultsTimeline setActiveTab={setActiveTab} />
          </div>
        )}

        {/* OTRAS PESTAÑAS */}
        {activeTab === 'h2h' && (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <HeadToHead />
          </div>
        )}

        {activeTab === 'calendar' && <FullCalendar />}
        {activeTab === 'titles' && <TrophyCabinet />}
        {activeTab === 'mood' && <RublevMood />}
        {activeTab === 'ranking' && <RankingJourney />}

        {activeTab === 'foundation' && (
          <div className="animate-in fade-in duration-700">
            <FoundationPage />
          </div>
        )}
      </div>
    </div>
  );
};

// 3. COMPONENTE APP (Entry Point)
function App() {
  const [activeTab, setActiveTab] = useState('stats');

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    const validTabs = ['stats', 'h2h', 'titles', 'calendar', 'foundation', 'ranking', 'mood', 'results'];
    
    if (hash && validTabs.includes(hash)) {
      setActiveTab(hash);
    }

    const handlePopState = () => {
      const newHash = window.location.hash.replace('#', '');
      if (newHash && validTabs.includes(newHash)) {
        setActiveTab(newHash);
      } else {
        setActiveTab('stats');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleTabChange = (tabId) => {
    if (activeTab === 'stats' && tabId !== 'stats') {
      localStorage.setItem('scrollBackPosition', window.scrollY);
    }

    setActiveTab(tabId);
    window.location.hash = tabId;

    const isNavigatingToTournament = localStorage.getItem('targetTournament');
    const isReturningToStats = tabId === 'stats' && localStorage.getItem('scrollBackPosition');

    if (!isNavigatingToTournament && !isReturningToStats) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    /* Eliminamos bg-black aquí para que el fondo de index.css tome el control */
    <div className="min-h-screen font-sans selection:bg-red-500/30 overflow-x-hidden relative">
      
      {/* Esta capa debe ser transparente o respetar los estilos del CSS */}
      <div className="bg-glow"></div>

      {/* Navegación Superior - bg-black se mantiene para contraste del menú */}
      <nav className="bg-black border-b border-white/5 py-9 px-10 flex flex-col items-center gap-4 relative z-[100]">
        <img
          src="https://rubloshop.com/cdn/shop/files/logo_new_4.png?v=1736699038&width=120"
          alt="RUBLO Logo"
          className="w-24 h-auto cursor-pointer"
          style={{ filter: 'brightness(0) invert(1)' }} 
          onClick={() => handleTabChange('stats')}
        />
      </nav>

      <main className="relative z-10">
        <Dashboard activeTab={activeTab} setActiveTab={handleTabChange} />
      </main>

      {/* Footer - Mantenemos su fondo oscuro para cerrar el diseño */}
      <footer className="mt-40 bg-[#050505] border-t border-white/10 relative z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.4)]">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-80"></div>

        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            <div className="md:col-span-3 flex flex-col gap-4 text-white">
              <img
                src="https://rubloshop.com/cdn/shop/files/logo_new_4.png?v=1736699038&width=120"
                alt="RUBLO Logo"
                className="w-20 h-auto"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                Performance Tracker <br />
                <span className="text-red-600 font-black tracking-[0.3em]">UNIT: RE-44</span>
              </p>
            </div>

            <div className="md:col-span-6 flex flex-col justify-center border-y md:border-y-0 md:border-l md:border-r border-white/10 py-6 md:py-2 px-8">
              <div className="grid grid-cols-2 gap-4 md:gap-12">
                <div className="flex flex-col gap-4">
                  <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">Directory</span>
                  <nav className="flex flex-col gap-3">
                    {[
                      { id: 'stats', label: 'Dashboard', color: 'text-white' },
                      { id: 'results', label: 'Match Results', color: 'text-white' },
                      { id: 'h2h', label: 'H2H Matrix', color: 'text-white' },
                      { id: 'foundation', label: 'Foundation', color: 'text-emerald-500' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleTabChange(item.id)}
                        className={`text-left text-[9px] font-bold ${item.color}/50 hover:${item.color} uppercase tracking-widest transition-all flex items-center gap-2 group whitespace-nowrap`}
                      >
                        <span className="text-red-600 opacity-0 group-hover:opacity-100 transition-all font-black">//</span>
                        {item.label}
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="flex flex-col gap-4 text-white">
                  <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">Network</span>
                  <div className="flex flex-col gap-3">
                    <a href="https://www.instagram.com/andreyrublev/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-white/40 hover:text-white transition-all group">
                      <div className="w-5 h-5 flex items-center justify-center bg-white/5 group-hover:bg-red-600 rounded-sm text-[7px] font-black">IG</div>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-white/60">Instagram</span>
                    </a>
                    <a href="https://rubloshop.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-white/40 hover:text-white transition-all group">
                      <div className="w-5 h-5 flex items-center justify-center bg-white/5 group-hover:bg-red-600 rounded-sm"><Globe size={10} className="text-white"/></div>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-white/60">Official Shop</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-3 flex md:justify-end text-left md:text-right">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white leading-[0.9]">
                Built For <br />
                <span className="text-red-600">Winning.</span>
              </h2>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;