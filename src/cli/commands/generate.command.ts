import axios from 'axios';
import chalk from 'chalk';
import { Command } from './command.interface.js';
import { getErrorMessage } from '../../shared/helpers/index.js';
import { TSVFileWriter } from '../../shared/libs/file-writer/tsv-file-writer.js';
import { TSVOfferGenerator } from '../../shared/libs/offer-generator/tsv-offer-generator.js';
import { MockServerData } from '../../shared/types/index.js';

export class GenerateCommand implements Command {
  private async load(url: string): Promise<MockServerData> {
    const { data } = await axios.get<MockServerData>(url);
    return data;
  }

  private async write(filepath: string, offerCount: number, mockData: MockServerData): Promise<void> {
    const offerGenerator = new TSVOfferGenerator(mockData);
    const fileWriter = new TSVFileWriter(filepath);

    for (let i = 0; i < offerCount; i++) {
      await fileWriter.write(offerGenerator.generate());
    }

    await fileWriter.close();
  }

  public getName(): string {
    return '--generate';
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const offerCount = Number.parseInt(count, 10);

    if (!Number.isInteger(offerCount) || offerCount <= 0 || !filepath || !url) {
      console.error(chalk.red('Usage: --generate <n> <path> <url>'));
      return;
    }

    try {
      const mockData = await this.load(url);
      await this.write(filepath, offerCount, mockData);
      console.info(chalk.green(`File ${filepath} was created`));
    } catch (error: unknown) {
      console.error(chalk.red('Can\'t generate data'));
      console.error(chalk.red(`Details: ${getErrorMessage(error)}`));
    }
  }
}
