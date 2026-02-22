// server/ecosystem.config.cjs
module.exports = {
    apps: [{
      name: 'kipc-scraper',
      script: 'index.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      }
    }, {
      name: 'kipc-cron',
      script: 'scripts/cron-scrape.js',
      instances: 1,
      autorestart: true,
      watch: false,
      cron_restart: '0 */8 * * *', // Reiniciar cada 8 horas
      max_memory_restart: '1G'
    }]
  };