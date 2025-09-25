const fs = require('fs');

fs.readFile('example.txt', 'utf8', (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }
  console.log("Non-Blocking Read Output:");
  console.log(data);
});

console.log("This message prints BEFORE file is read (non-blocking).");
