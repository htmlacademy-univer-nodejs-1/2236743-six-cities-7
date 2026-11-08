import chalk from 'chalk';
import { Command } from './command.interface.js';
import { createOffer, getErrorMessage } from '../../shared/helpers/index.js';
import { DatabaseClient, MongoDatabaseClient } from '../../shared/libs/database-client/index.js';
import { TSVFileReader } from '../../shared/libs/file-reader/tsv-file-reader.js';
import { ConsoleLogger, Logger } from '../../shared/libs/logger/index.js';
import { DefaultOfferService, OfferModel, OfferService } from '../../shared/modules/offer/index.js';
import { DefaultUserService, UserModel, UserService } from '../../shared/modules/user/index.js';
import { Offer } from '../../shared/types/index.js';

const DEFAULT_USER_PASSWORD = '123456';

export class ImportCommand implements Command {
  private readonly logger: Logger;
  private readonly databaseClient: DatabaseClient;
  private readonly userService: UserService;
  private readonly offerService: OfferService;

  constructor() {
    this.logger = new ConsoleLogger();
    this.databaseClient = new MongoDatabaseClient(this.logger);
    this.userService = new DefaultUserService(this.logger, UserModel);
    this.offerService = new DefaultOfferService(this.logger, OfferModel);
  }

  private async saveOffer({ author, ...offer }: Offer, salt: string): Promise<void> {
    const user = await this.userService.findOrCreate({
      ...author,
      password: DEFAULT_USER_PASSWORD,
    }, salt);

    await this.offerService.create({
      ...offer,
      authorId: user.id,
    });
  }

  public getName(): string {
    return '--import';
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [filename, uri, salt] = parameters;

    if (!filename || !uri || !salt) {
      console.error(chalk.red('Usage: --import <path> <uri> <salt>'));
      return;
    }

    let importedCount = 0;

    try {
      await this.databaseClient.connect(uri);

      for await (const line of new TSVFileReader(filename.trim()).read()) {
        await this.saveOffer(createOffer(line), salt);
        importedCount++;
      }

      console.info(chalk.green(`${importedCount} rows imported`));
    } catch (error: unknown) {
      console.error(chalk.red(`Can't import data from file: ${filename}`));
      console.error(chalk.red(`Details: ${getErrorMessage(error)}`));
    } finally {
      await this.databaseClient.disconnect();
    }
  }
}
