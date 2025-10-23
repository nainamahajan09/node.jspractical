import http from "http";
import fs from "fs";
import path from "path";

const server = http.createServer((req, res) => {
  console.log(`📍 Request received for: ${req.url}`);

  // Track URL patterns
  const patterns = ["/", "/home", "/about", "/contact", "/about", "/home"];

  // Check for redundancy
  const uniquePatterns = [...new Set(patterns)];
  if (uniquePatterns.length < patterns.length) {
    console.log("⚠️ Redundant paths detected — resolving...");
    // Use path.normalize() to clean redundant routes
    const cleanedPaths = uniquePatterns.map(p => path.normalize(p));
    console.log("✅ Cleaned paths:", cleanedPaths);
  } else {
    console.log("✅ No redundancy found — using path.join()");
  }

  // Serve simple HTML pages
  let filePath = "";
  if (req.url === "/" || req.url === "/home") {
    filePath = path.join(process.cwd(), "views", "index.html");
  } else if (req.url === "/about") {
    filePath = path.join(process.cwd(), "views", "about.html");
  } else if (req.url === "/contact") {
    filePath = path.join(process.cwd(), "views", "contact.html");
  } else {
    filePath = path.join(process.cwd(), "views", "404.html");
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Server error");
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(content);
    }
  });
});

server.listen(3000, () => {
  console.log("🌍 Server running at http://localhost:3000/");
});
