/**
 * PM2 ecosystem file for the production VPS.
 *
 *   pm2 start ecosystem.config.cjs
 *   pm2 save
 *   pm2 startup        # generates the systemd hook for auto-start on boot
 *
 * Keep `instances: 1` — SQLite is a single-writer database; running the app
 * in cluster mode would race the .db file. Vertical-scale this box first.
 */
module.exports = {
  apps: [
    {
      name: 'pulse',
      cwd: __dirname,
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
}
