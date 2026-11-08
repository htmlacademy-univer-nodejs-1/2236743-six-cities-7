import { createReadStream } from 'node:fs';
import { FileReader } from './file-reader.interface.js';

const CHUNK_SIZE = 16384;

export class TSVFileReader implements FileReader {
  constructor(
    private readonly filename: string
  ) {}

  public async *read(): AsyncGenerator<string> {
    const readStream = createReadStream(this.filename, {
      highWaterMark: CHUNK_SIZE,
      encoding: 'utf-8',
    });

    let remainingData = '';

    for await (const chunk of readStream) {
      remainingData += chunk.toString();

      let nextLinePosition = remainingData.indexOf('\n');

      while (nextLinePosition >= 0) {
        const completeRow = remainingData.slice(0, nextLinePosition + 1);
        remainingData = remainingData.slice(nextLinePosition + 1);

        if (completeRow.trim()) {
          yield completeRow;
        }

        nextLinePosition = remainingData.indexOf('\n');
      }
    }

    if (remainingData.trim()) {
      yield remainingData;
    }
  }
}
