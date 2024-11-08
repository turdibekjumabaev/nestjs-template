module.exports = {
    apps: [{
        name: 'app',
        script: 'dist/main.js',
        instances: '2',
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
    }]
};
