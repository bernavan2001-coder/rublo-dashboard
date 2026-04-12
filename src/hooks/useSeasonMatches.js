import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useSeasonMatches = (playerName = 'Rublev') => {
  const [groupedMatches, setGroupedMatches] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      // Traemos logo_url explícitamente
      const { data, error } = await supabase
        .from('tournament_matches_2026')
        .select('*') 
        .eq('player_last_name', playerName)
        .order('match_date', { ascending: false });

      if (data) {
        // --- TEST DE CONSOLA ---
        console.log("¿Hay logos en la data?", data.map(m => m.logo_url));
        
        const grouped = data.reduce((acc, match) => {
          const name = match.tournament_name;
          if (!acc[name]) acc[name] = [];
          acc[name].push(match);
          return acc;
        }, {});
        setGroupedMatches(grouped);
      }
      setLoading(false);
    };

    fetchMatches();
  }, [playerName]);

  return { groupedMatches, loading };
};