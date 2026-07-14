const { spawn, execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const services = [
  {
    name: "Auth-Service",
    dir: path.join(__dirname, "auth-service"),
    script: "src/server.js",
    color: "\x1b[33m" // Yellow
  },
  {
    name: "User-Service",
    dir: path.join(__dirname, "user-service"),
    script: "src/server.js",
    color: "\x1b[36m" // Cyan
  },
  {
    name: "Chat-Service",
    dir: path.join(__dirname, "chat-service"),
    script: "src/server.js",
    color: "\x1b[35m" // Magenta
  },
  {
    name: "Upload-Service",
    dir: path.join(__dirname, "upload-service"),
    script: "src/server.js",
    color: "\x1b[34m" // Blue
  },
  {
    name: "Gateway-Service",
    dir: path.join(__dirname, "gateway-service"),
    script: "src/server.js",
    color: "\x1b[32m" // Green
  }
];

const processes = [];
let isShuttingDown = false;

console.log("\x1b[1m\x1b[34m[System] Starting all backend microservices for Staging...\x1b[0m\n");

function shutdownAll() {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log("\n\x1b[1m\x1b[31m[System] Shutting down all backend microservices...\x1b[0m");
  processes.forEach(({ name, proc }) => {
    if (proc && !proc.killed) {
      console.log(`[System] Terminating ${name}...`);
      proc.kill("SIGTERM");
    }
  });
  setTimeout(() => {
    process.exit(0);
  }, 1000);
}

// Pre-flight check: install dependencies if missing
services.forEach((service) => {
  const nodeModulesPath = path.join(service.dir, "node_modules");
  if (!fs.existsSync(nodeModulesPath)) {
    console.log(`\x1b[1m\x1b[35m[System] node_modules not found for ${service.name}. Running 'npm install'...\x1b[0m`);
    try {
      execSync("npm install", { cwd: service.dir, stdio: "inherit" });
      console.log(`\x1b[1m\x1b[32m[System] Dependencies installed successfully for ${service.name}.\x1b[0m\n`);
    } catch (err) {
      console.error(`\x1b[31m[System ERROR] Failed to install dependencies for ${service.name}. Exiting.\x1b[0m`, err);
      process.exit(1);
    }
  }
});

// Spawn each service
services.forEach((service) => {
  console.log(`\x1b[1m[System] Starting ${service.name}...\x1b[0m`);

  const proc = spawn("node", [service.script], {
    cwd: service.dir,
    stdio: ["ignore", "pipe", "pipe"],
    env: { 
      ...process.env,
      NODE_PATH: path.join(service.dir, "node_modules")
    }
  });

  processes.push({ name: service.name, proc });

  // Stream stdout with custom colored prefix
  proc.stdout.on("data", (data) => {
    const lines = data.toString().split("\n");
    lines.forEach((line) => {
      if (line.trim()) {
        console.log(`${service.color}[${service.name}]\x1b[0m ${line.trim()}`);
      }
    });
  });

  // Stream stderr with error prefix
  proc.stderr.on("data", (data) => {
    const lines = data.toString().split("\n");
    lines.forEach((line) => {
      if (line.trim()) {
        console.error(`\x1b[31m[${service.name} ERROR]\x1b[0m ${line.trim()}`);
      }
    });
  });

  // Handle service crash/exit
  proc.on("close", (code) => {
    if (!isShuttingDown) {
      console.log(`\x1b[31m\x1b[1m[System] ${service.name} terminated with exit code ${code}\x1b[0m`);
      shutdownAll();
    }
  });
});

// Capture termination signals
process.on("SIGINT", shutdownAll);
process.on("SIGTERM", shutdownAll);
process.on("exit", shutdownAll);
