module.exports = {
    apps: [
      {
        name: 'kickpredict',
        cwd: '/opt/kickpredict/server',
        instances: "max",
        script: 'npm',
        args: 'start',
        exec_mode : "cluster",
        env: {
            "NODE_ENV": "production"
        },
      },
    ],
  };
  