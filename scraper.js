import axios from 'axios';
import * as cheerio from 'cheerio';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://frjcotnwljwdnxuncnex.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyamNvdG53bGp3ZG54dW5jbmV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMDQxNDIsImV4cCI6MjA5MDU4MDE0Mn0.9vdOBlPyUgTCmVjlXkpq5RvUovSCV17c3dAtw-r6wtc';
const supabase = createClient(supabaseUrl, supabaseKey);

// Configuración de Headers
const axiosConfig = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  }
};

async function scrapeEverything() {
  const urlDraw = 'https://tennistonic.com/rankings/?m=atp&live=draw';
  const urlRank = 'https://tennistonic.com/rankings/?m=atp&live=normal';

  try {
    console.log('🚀 Iniciando Scrapeo Integral...');

    // --- 1. SCRAPE RANKING ---
    console.log('📡 Obteniendo Ranking...');
    const resRank = await axios.get(urlRank, axiosConfig);
    const $rank = cheerio.load(resRank.data);
    let rublevRankData = null;

    $rank('tr').each((i, el) => {
      const name = $rank(el).find('td:nth-child(3) font').text().trim();
      if (name.includes('A.Rublev')) {
        rublevRankData = {
          last_name: 'Rublev',
          current_rank: parseInt($rank(el).find('td.live_rank_td font').first().text().trim()) || 0,
          live_rank: parseInt($rank(el).find('td.live_rank_td font').first().text().trim()) || 0,
          points: parseInt($rank(el).find('td:nth-child(4) a').text().trim()) || 0,
          career_high: parseInt($rank(el).find('td:nth-child(2) font').text().trim()) || 0,
          updated_at: new Date().toISOString()
        };
      }
    });

    // --- 2. SCRAPE DRAW (VERSIÓN DEFINITIVA) ---
    console.log('📡 Buscando estructura del cuadro...');
    const resDraw = await axios.get(urlDraw, axiosConfig);
    const $draw = cheerio.load(resDraw.data);
    
    // Obtenemos el nombre del torneo principal
    let tournamentName = $draw('h1').first().text().trim();
    if (!tournamentName) tournamentName = "Monte-Carlo Rolex Masters";
    
    const fullDrawArray = [];
    let latestDrawData = null;

    // Buscamos cualquier div que tenga position absolute (coordenadas del cuadro)
    $draw('div[style*="position:absolute"]').each((i, el) => {
      const styleStr = $draw(el).attr('style') || '';
      
      // Capturamos cualquier etiqueta <a> dentro de este bloque
      const $a = $draw(el).find('a').first();
      const playerName = $a.text().trim();
      const playerUrl = $a.attr('href') || '';

      // Si encontramos un nombre real (ignoramos casilleros vacíos, Bye o Qualifiers)
      if (playerName && playerName !== 'Bye' && !playerName.includes('Qualifier')) {
        
        // Regex robusto para sacar el left y el top sin importar si hay espacios
        const leftMatch = styleStr.match(/left:\s*(\d+)/i);
        const topMatch = styleStr.match(/top:\s*(\d+)/i);
        
        if (leftMatch && topMatch) {
          const left = parseInt(leftMatch[1]);
          const top = parseInt(topMatch[1]);
          const isRublev = playerName.toLowerCase().includes('rublev');

          // Extraemos el ID de ATP desde la URL si existe (ej: .../atp/29372/...)
          const atpIdMatch = playerUrl.match(/\/atp\/(\d+)\//);
          const atpId = atpIdMatch ? atpIdMatch[1] : null;

          fullDrawArray.push({
            player_name: playerName,
            atp_id: atpId,
            round_x: left,
            pos_y: top,
            is_rublev: isRublev,
            updated_at: new Date().toISOString()
          });

          // Preparamos los datos para la cajita chica de la landing
          if (isRublev) {
            latestDrawData = {
              player_id: 'Rublev',
              tournament_name: tournamentName,
              current_round: left === 0 ? '1st Round' : `Round of ${128 / Math.pow(2, left/170)}`,
              opponent: 'Awaiting Opponent', // Se actualizará en el frontend
              h2h_url: playerUrl,
              updated_at: new Date().toISOString()
            };
          }
        }
      }
    });

    // --- 3. GUARDAR TODO ---
    if (rublevRankData) {
      await supabase.from('player_ranking').upsert(rublevRankData, { onConflict: 'last_name' });
      console.log('✅ Ranking Sincronizado');
    }

    if (fullDrawArray.length > 0) {
      // Borramos el cuadro anterior para no mezclar torneos
      await supabase.from('tournament_draw_full').delete().neq('player_name', 'empty_grid'); 
      
      // Insertamos el nuevo cuadro
      const { error } = await supabase.from('tournament_draw_full').insert(fullDrawArray);
      
      if (error) {
        console.error('❌ Error guardando el cuadro en Supabase:', error.message);
      } else {
        console.log(`✅ Full Draw Sincronizado (${fullDrawArray.length} casilleros detectados)`);
      }
    } else {
      console.log('❌ No se encontraron jugadores. Es posible que TennisTonic haya bloqueado la carga del cuadro.');
    }

    if (latestDrawData) {
      await supabase.from('current_draw').upsert(latestDrawData, { onConflict: 'player_id' });
      console.log('✅ Latest Draw Box Sincronizada');
    }

    console.log('🎉 PROCESO COMPLETADO CON ÉXITO.');

  } catch (error) {
    console.error('❌ Error en el proceso:', error.message);
  }
}

scrapeEverything();