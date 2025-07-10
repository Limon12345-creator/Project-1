const { spawn } = require("child_process");
const http = require("http");
const log = require("./logger/log.js");
http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Bot is running");
}).listen(process.env.PORT || 3000, () => {
  log.info("Web service running to keep Render alive");
});

function startProject() {
  const child = spawn("node", ["Goat.js"], {
    cwd: __dirname,
    stdio: "inherit",
    shell: true
  });

  child.on("close", (code) => {
    if (code == 2) {
      log.info("Restarting Project...");
      startProject();
    }
  });
}

startProject();
