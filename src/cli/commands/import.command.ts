import chalk from 'chalk';
import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/file-reader/tsv-file-reader.js';

export class ImportCommand implements Command {
  public getName(): string {
    return '--import';
  }

  public execute(...parameters: string[]): void {
    const [filename] = parameters;

    if (!filename) {
      console.error(chalk.red('Path to TSV file is required'));
      return;
    }

    const fileReader = new TSVFileReader(filename.trim());

    try {
      fileReader.read();
      const offers = fileReader.toArray();
      console.info(offers);
      console.info(chalk.green(`Imported ${offers.length} offers from ${filename}`));
    } catch (error: unknown) {
      console.error(chalk.red(`Can't import data from file: ${filename}`));

      if (error instanceof Error) {
        console.error(chalk.red(`Details: ${error.message}`));
      }
    }
  }
}
