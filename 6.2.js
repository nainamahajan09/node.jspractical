import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { pipeline } from 'node:stream/promises';

const inputPath = path.resolve('data/users.csv');
const outPath = path.resolve('out/domains.json');

const domainCounts = Object.create(null);

async function processUsersCsv(inFile, outFile) {
  const fileStream = fs.createReadStream(inFile);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    if (!line.trim() || line.startsWith('email')) continue; 
    const [, email] = line.split(',');
    if (!email) continue;
    const domain = email.split('@')[1];
    domainCounts[domain] = (domainCounts[domain] || 0) + 1;
  }

  
  await fs.promises.mkdir(path.dirname(outFile), { recursive: true });
  await fs.promises.writeFile(outFile, JSON.stringify(domainCounts, null, 2));
}

await processUsersCsv(inputPath, outPath);
console.log("Domain counting complete.");
