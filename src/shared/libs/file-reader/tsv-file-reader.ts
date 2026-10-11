import EventEmitter from 'node:events';
import { createReadStream } from 'node:fs';
import { FileReader } from './file-reader.interface.js';

const CHUNK_SIZE = 16384;

export class TSVFileReader extends EventEmitter implements FileReader {
  constructor(
    private readonly filename: string
  ) {
    super();
  }

  public async read(): Promise<void> {
    const readStream = createReadStream(this.filename, {
      highWaterMark: CHUNK_SIZE,
      encoding: 'utf-8',
    });

    let remainingData = '';
    let importedRowCount = 0;

    for await (const chunk of readStream) {
      remainingData += chunk.toString();

      let nextLinePosition = remainingData.indexOf('\n');

      while (nextLinePosition >= 0) {
        const completeRow = remainingData.slice(0, nextLinePosition + 1);
        remainingData = remainingData.slice(nextLinePosition + 1);

        if (completeRow.trim()) {
          importedRowCount++;
          this.emit('line', completeRow);
        }

        nextLinePosition = remainingData.indexOf('\n');
      }
    }

    if (remainingData.trim()) {
      importedRowCount++;
      this.emit('line', remainingData);
    }

    this.emit('end', importedRowCount);
  }
}
