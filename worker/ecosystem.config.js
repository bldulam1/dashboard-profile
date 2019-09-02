module.exports = {
  apps: [
    {
      name: "worker",
      script: "app.js",

      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      args: "",
      autorestart: true,
      watch: true,
      ignore_watch: ["node_modules", "tmp"],
      instances: "1",
      max_memory_restart: "1G",
      detached: true,
      env: {
        NODE_ENV: "development"
      },
      env_production: {
        NODE_ENV: "production"
      }
    }
  ],

  deploy: {
    production: {
      user: "node",
      host: "212.83.163.1",
      ref: "origin/master",
      repo: "git@de01-gitlab01.corp.int:clarity/clarity2.0.git",
      path: "./",
      "post-deploy":
        "npm install && pm2 reload ecosystem.config.js --env production"
    }
  }
};
