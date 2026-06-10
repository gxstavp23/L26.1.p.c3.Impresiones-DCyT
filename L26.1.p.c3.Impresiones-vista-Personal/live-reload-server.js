const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname);
const port = 3000;
let clients = [];
let reloadTimer = null;

function sendReload() {
  clients = clients.filter((res) => {
    try {
      res.write("data: reload\n\n");
      return true;
    } catch (_) {
      return false;
    }
  });
}

function scheduleReload() {
  if (reloadTimer) {
    clearTimeout(reloadTimer);
  }
  reloadTimer = setTimeout(() => {
    sendReload();
    reloadTimer = null;
  }, 100);
}

function serveFile(filePath, res) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 Not Found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const map = {
      ".html": "text/html",
      ".js": "application/javascript",
      ".css": "text/css",
      ".json": "application/json",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".svg": "image/svg+xml",
      ".ico": "image/x-icon",
    };
    const contentType = map[ext] || "application/octet-stream";

    res.writeHead(200, {
      "Content-Type": contentType,
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Expires: "0",
      Pragma: "no-cache",
      "Surrogate-Control": "no-store",
    });

    if (ext === ".html") {
      const html = data.toString().replace(
        /<\/body>/i,
        `  <script>
    (function() {
      var source = new EventSource('/reload');
      source.onmessage = function() { window.location.reload(); };
    })();
  </script>\n</body>`
      );
      res.end(html);
    } else {
      res.end(data);
    }
  });
}

const server = http.createServer((req, res) => {
  const requestUrl = req.url.split("?")[0];
  if (requestUrl === "/reload") {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });
    res.write("retry: 10000\n\n");
    clients.push(res);
    req.on("close", () => {
      clients = clients.filter((client) => client !== res);
    });
    return;
  }

  let filePath = requestUrl === "/" ? path.join(root, "index.html") : path.join(root, requestUrl);
  if (!filePath.startsWith(root)) {
    res.writeHead(403, { "Content-Type": "text/plain" });
    res.end("403 Forbidden");
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 Not Found");
      return;
    }
    if (stats.isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }
    serveFile(filePath, res);
  });
});

server.listen(port, () => {
  console.log(`Live reload server running at http://localhost:${port}`);
});

fs.watch(root, { recursive: true }, (eventType, filename) => {
  if (!filename) return;
  const lower = filename.toLowerCase();
  if (lower.endsWith(".ts") || lower.endsWith(".js") || lower.endsWith(".html") || lower.endsWith(".css")) {
    scheduleReload();
  }
});
