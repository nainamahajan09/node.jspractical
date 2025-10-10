import fs from 'node:fs';
import path from 'node:path';

class FileTransport {
  constructor(logger, fileBase, maxSize = 512000) {
    this.fileBase = fileBase;
    this.maxSize = maxSize;
    this.index = 0;
    this.currentSize = 0;

    const dir = path.dirname(this.fileBase);
    fs.mkdirSync(dir, { recursive: true });

    this.stream = fs.createWriteStream(this._genFilename(), { flags: 'a' });
    logger.on('log', log => this.write(log));
  }

  _genFilename() {
    return `${this.fileBase}.${this.index}.log`;
  }

  write({ ts, level, message }) {
    const entry = `[${ts.toISOString()}] ${level}: ${message}\n`;
    if (this.currentSize + Buffer.byteLength(entry) > this.maxSize) {
      this.stream.end();
      this.index++;
      this.currentSize = 0;
      this.stream = fs.createWriteStream(this._genFilename(), { flags: 'a' });
    }
    this.stream.write(entry);
    this.currentSize += Buffer.byteLength(entry);
  }
}
import { EventEmitter } from 'node:events';

class Logger extends EventEmitter {
  log(level, message) {
    this.emit('log', { ts: new Date(), level, message });
  }
}

const logger = new Logger();

logger.on('log', ({ ts, level, message }) => {
  console.log(`[${ts.toISOString()}] ${level.toUpperCase()}: ${message}`);
});


new FileTransport(logger, path.resolve('logs/app'), 50 * 1024);

logger.log('info', 'Application started!');
logger.log('warn', 'Low disk space!');
logger.log('error', 'Something went wrong!');
