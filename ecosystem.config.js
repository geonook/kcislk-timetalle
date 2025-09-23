module.exports = {
  apps: [{
    name: 'kcislk-api',
    script: 'run_server.py',
    cwd: '/opt/kcislk-timetable/backend',
    interpreter: '/opt/kcislk-timetable/backend/venv/bin/python',
    instances: 1,
    exec_mode: 'fork',

    // Environment variables
    env: {
      NODE_ENV: 'production',
      FLASK_ENV: 'production',
      FLASK_DEBUG: 'false',
      PORT: '8081',
      PYTHONPATH: '/opt/kcislk-timetable/backend',
    },

    // Environment variables for staging
    env_staging: {
      NODE_ENV: 'staging',
      FLASK_ENV: 'staging',
      FLASK_DEBUG: 'true',
      PORT: '8082',
      PYTHONPATH: '/opt/kcislk-timetable/backend',
    },

    // Logging
    log_file: '/var/log/kcislk-timetable/combined.log',
    out_file: '/var/log/kcislk-timetable/out.log',
    error_file: '/var/log/kcislk-timetable/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',

    // Auto restart
    watch: false,
    ignore_watch: ['node_modules', 'logs', '*.log'],
    autorestart: true,
    max_restarts: 10,
    restart_delay: 4000,

    // Memory and CPU limits
    max_memory_restart: '1G',

    // Health monitoring
    min_uptime: '10s',

    // Graceful shutdown
    kill_timeout: 5000,

    // Additional options
    merge_logs: true,
    time: true,
  }],

  deploy: {
    production: {
      user: 'deploy',
      host: 'your-server.com',
      ref: 'origin/main',
      repo: 'https://github.com/geonook/kcislk-timetable.git',
      path: '/opt/kcislk-timetable',
      'post-deploy': 'cd timetable_api && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt && pm2 reload ecosystem.config.js --env production'
    },

    staging: {
      user: 'deploy',
      host: 'staging-server.com',
      ref: 'origin/develop',
      repo: 'https://github.com/geonook/kcislk-timetable.git',
      path: '/opt/kcislk-timetable-staging',
      'post-deploy': 'cd timetable_api && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt && pm2 reload ecosystem.config.js --env staging'
    }
  }
};