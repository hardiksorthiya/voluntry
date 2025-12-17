/**
 * PM2 Ecosystem Configuration
 * This file configures PM2 to manage the Voluntry backend server
 * 
 * Usage:
 *   pm2 start ecosystem.config.js        - Start the server
 *   pm2 stop voluntry-backend            - Stop the server
 *   pm2 restart voluntry-backend         - Restart the server
 *   pm2 logs voluntry-backend            - View logs
 *   pm2 status                           - Check status
 *   pm2 save                             - Save current process list
 *   pm2 startup                          - Configure auto-start on boot
 */

module.exports = {
  apps: [{
    name: 'voluntry-backend',
    script: './src/server.js',
    instances: 1,
    exec_mode: 'fork',
    watch: false,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'development',
      PORT: 4000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 4000
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_file: './logs/pm2-combined.log',
    time: true,
    merge_logs: true,
    // Restart delay in milliseconds
    restart_delay: 4000,
    // Wait for graceful shutdown
    kill_timeout: 5000,
    // Listen for shutdown signals
    listen_timeout: 10000
  }]
};

