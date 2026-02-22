// server/lib/robotsChecker.js
import { chromium } from 'playwright';
import robotsParser from 'robots-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const robotsCache = new Map();

export async function verificarRobotsTxt(url, sitio) {
  try {
    // Verificar caché
    if (robotsCache.has(sitio)) {
      const cache = robotsCache.get(sitio);
      if (Date.now() - cache.timestamp < 24 * 60 * 60 * 1000) { // 24 horas de caché
        return cache.permite;
      }
    }
    
    const urlObj = new URL(url);
    const robotsUrl = `${urlObj.protocol}//${urlObj.hostname}/robots.txt`;
    
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    let permite = true;
    
    try {
      const response = await page.goto(robotsUrl, { timeout: 5000 });
      const content = await page.content();
      
      const robots = robotsParser(robotsUrl, content);
      
      // Verificar nuestro user-agent específico
      const userAgent = 'KIPC-Bot';
      permite = robots.isAllowed(url, userAgent);
      
      console.log(`[Robots] ${sitio}: ${permite ? '✅ Permitido' : '❌ Bloqueado'}`);
      
    } catch (error) {
      console.log(`[Robots] No se pudo obtener robots.txt para ${sitio}, asumiendo permitido`);
    }
    
    await browser.close();
    
    // Guardar en caché
    robotsCache.set(sitio, {
      permite,
      timestamp: Date.now()
    });
    
    return permite;
    
  } catch (error) {
    console.error('[Robots] Error:', error);
    return true; // Por defecto permitir si hay error
  }
}

export function registrarAcceso(sitio, exito, detalles = {}) {
  const logDir = path.join(__dirname, '../logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  const logPath = path.join(logDir, 'scraping.log');
  const entry = {
    timestamp: new Date().toISOString(),
    sitio,
    exito,
    ...detalles
  };
  
  fs.appendFileSync(logPath, JSON.stringify(entry) + '\n');
}