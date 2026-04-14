import React, { useState, useEffect } from 'react';
import { supabase } from "./lib/supabase";
import { Globe, LayoutDashboard, Calendar, BarChart3, Medal, Smile, Swords, Heart } from 'lucide-react';

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

// 2. COMPONENTE DASHBOARD (LAYOUT INTERNO)
const Dashboard = ({ activeTab, setActiveTab }) => {
  return (
    <div className="max-w-6xl mx-auto bg-[#0a0a0a] border-x border-white/10 min-h-screen relative z-10 shadow-[0_0_100px_rgba(0,0,0,0.4)]">
      <PlayerProfile activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="p-10 pt-16">
        {/* TABS DINÁMICOS */}
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
              <PointsProduction />
            </div>

            <div className="pt-16 border-t border-white/10 relative">
              <div className="absolute top-0 left-0 w-12 h-[1px] bg-white/40"></div>
              <MajorAchievements setActiveTab={setActiveTab} />
            </div>
          </div>
        )}

        {activeTab === 'h2h' && (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <HeadToHead />
          </div>
        )}

        {activeTab === 'results' && <SeasonResultsTimeline />}
        {activeTab === 'ranking' && <RankingJourney />}
        {activeTab === 'calendar' && <FullCalendar />}
        {activeTab === 'titles' && <TrophyCabinet />}
        {activeTab === 'mood' && <RublevMood />}

        {activeTab === 'foundation' && (
          <div className="animate-in fade-in duration-700">
            <FoundationPage />
          </div>
        )}
      </div>
    </div>
  );
};

// 3. COMPONENTE APP (ENTRY POINT)
function App() {
  const [activeTab, setActiveTab] = useState('stats');

  // --- LÓGICA DE NAVEGACIÓN POR URL (HASH ROUTING) ---
  useEffect(() => {
    // 1. Leer la URL al cargar la página por primera vez
    const hash = window.location.hash.replace('#', '');
    const validTabs = ['stats', 'h2h', 'titles', 'calendar', 'foundation', 'ranking', 'mood', 'results'];
    
    if (hash && validTabs.includes(hash)) {
      setActiveTab(hash);
    }

    // 2. Escuchar cuando el usuario toca "Atrás" o "Adelante" en el navegador
    const handlePopState = () => {
      const newHash = window.location.hash.replace('#', '');
      if (newHash && validTabs.includes(newHash)) {
        setActiveTab(newHash);
      } else {
        setActiveTab('stats'); // Fallback por defecto
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 3. Función unificada para cambiar de pestaña, actualizar URL y subir el scroll
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    window.location.hash = tabId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen font-sans selection:bg-white/30 text-white antialiased overflow-x-hidden relative">

      {/* --- CAPAS DE AURORA BOREAL --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[100%] h-[80%] bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_60%)] blur-[100px] animate-pulse"></div>
        <div className="absolute top-[15%] right-[-10%] w-[80%] h-[40%] bg-[linear-gradient(110deg,transparent_20%,rgba(200,200,200,0.06)_50%,transparent_80%)] rotate-12 blur-[80px] animate-[bounce_15s_infinite]"></div>
        <div className="absolute -bottom-[10%] left-[20%] w-[70%] h-[50%] bg-[radial-gradient(circle,rgba(255,255,255,0.04)_0%,transparent_70%)] blur-[120px]"></div>
      </div>

      {/* TEXTURA DE RUIDO GLOBAL */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[999]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }}>
      </div>

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
        {/* Pasamos handleTabChange en lugar de setActiveTab directo */}
        <Dashboard activeTab={activeTab} setActiveTab={handleTabChange} />
      </main>

      {/* --- FOOTER DE ALTO CONTRASTE --- */}
      <footer className="mt-40 bg-[#050505] border-t border-white/10 relative z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.2)]">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-80"></div>

        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">

            {/* 1. BRANDING (Columna 3/12) */}
            <div className="md:col-span-3 flex flex-col gap-4">
              <img
                src="https://rubloshop.com/cdn/shop/files/logo_new_4.png?v=1736699038&width=120"
                alt="RUBLO Logo"
                className="w-20 h-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 leading-relaxed">
                Performance Tracker <br />
                <span className="text-red-600 font-black tracking-[0.3em]">UNIT: RE-44</span>
              </p>
            </div>

            {/* 2. DIRECTORIO & REDES (Columna 6/12) */}
            <div className="md:col-span-6 flex flex-col justify-center border-y md:border-y-0 md:border-l md:border-r border-white/10 py-6 md:py-2 px-8">
              <div className="grid grid-cols-2 gap-4 md:gap-12">

                {/* Directorio */}
                <div className="flex flex-col gap-4">
                  <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">Directory</span>
                  <nav className="flex flex-col gap-3">
                    {[
                      { id: 'stats', label: 'Dashboard', color: 'text-white' },
                      { id: 'h2h', label: 'H2H Matrix', color: 'text-white' },
                      { id: 'titles', label: 'Honours', color: 'text-white' },
                      { id: 'foundation', label: 'Foundation', color: 'text-emerald-500' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleTabChange(item.id)}
                        className={`text-left text-[9px] font-bold ${item.color}/50 hover:${item.color} uppercase tracking-widest transition-all flex items-center gap-2 group whitespace-nowrap`}
                      >
                        <span className="text-red-600 opacity-0 group-hover:opacity-100 transition-all font-black leading-none">//</span>
                        {item.label}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Network */}
                <div className="flex flex-col gap-4">
                  <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">Network</span>
                  <div className="flex flex-col gap-3">
                    <a href="https://www.instagram.com/andreyrublev/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-white/40 hover:text-white transition-all group">
                      <div className="w-5 h-5 flex items-center justify-center bg-white/5 group-hover:bg-red-600 rounded-sm transition-colors text-[7px] font-black">IG</div>
                      <span className="text-[9px] font-bold uppercase tracking-widest">Instagram</span>
                    </a>
                    <a href="https://twitter.com/AndreyRublev97" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-white/40 hover:text-white transition-all group">
                      <div className="p-1 bg-white/5 group-hover:bg-red-600 rounded-sm transition-colors text-[7px] font-black w-5 h-5 flex items-center justify-center">X</div>
                      <span className="text-[9px] font-bold uppercase tracking-widest">Twitter</span>
                    </a>
                    <a href="https://rubloshop.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-white/40 hover:text-white transition-all group">
                      <div className="w-5 h-5 flex items-center justify-center bg-white/5 group-hover:bg-red-600 rounded-sm transition-colors"><Globe size={10} /></div>
                      <span className="text-[9px] font-bold uppercase tracking-widest">Official Shop</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. STATEMENT (Columna 3/12) */}
            <div className="md:col-span-3 flex md:justify-end text-left md:text-right">
              <div className="flex flex-col md:items-end">
                <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white leading-[0.9]">
                  Built For <br />
                  <span className="text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.3)]">Winning.</span>
                </h2>
              </div>
            </div>
          </div>

          {/* BOTTOM COPYRIGHT */}
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em]">
              © 2026 RUBLO PERFORMANCE UNIT
            </p>
            <div className="flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-sm border border-white/5">
              <div className="h-[1px] w-4 bg-red-600"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;