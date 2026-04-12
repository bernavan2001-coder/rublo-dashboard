import React from 'react'

const PowerStats = () => {
  return (
    <section className="py-24 px-12 bg-[#020617] grid md:grid-cols-2 gap-20 items-center">
      <div className="space-y-8">
        <h2 className="text-5xl font-black italic uppercase leading-none">
          The "Bweh" <br/> <span className="text-red-600">Intensity.</span>
        </h2>
        <p className="text-slate-400 text-lg leading-relaxed max-w-md">
          Known for having the highest average forehand speed on the tour. Andrey doesn't just play tennis; he dictates points with raw, uncompromising power.
        </p>
        <div className="inline-block border border-slate-800 p-6 rounded-2xl bg-slate-900/30">
          <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-4">Coach Insight</p>
          <p className="italic text-white">"Andrey is a volcano. My job is to make sure he erupts at the right time."</p>
          <p className="text-xs text-slate-500 mt-2">— Marat Safin</p>
        </div>
      </div>
      
      <div className="bg-slate-900/50 p-8 rounded-[3rem] border border-slate-800">
         <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-8">Performance Breakdown</h4>
         <div className="space-y-6">
            {/* Barra de Fuerza */}
            <div className="space-y-2">
               <div className="flex justify-between text-[10px] font-black uppercase">
                  <span>Forehand Aggression</span>
                  <span className="text-red-500">98%</span>
               </div>
               <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-red-600 w-[98%]"></div>
               </div>
            </div>
            {/* Barra de Win Rate */}
            <div className="space-y-2">
               <div className="flex justify-between text-[10px] font-black uppercase">
                  <span>2026 Win Rate</span>
                  <span className="text-white">67%</span>
               </div>
               <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-white w-[67%]"></div>
               </div>
            </div>
         </div>
      </div>
    </section>
  )
}

export default PowerStats;