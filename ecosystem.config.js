module.exports = {
  apps: [{
    name: 'next-app',
    script: 'npm',
    args: 'start',
    cwd: '/Users/macoxwright/Documents/next-tsx-boilerplate',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    },
    time: true
  }]
}
