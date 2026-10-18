import convict from 'convict';
import validator from 'convict-format-with-validator';

convict.addFormats(validator);
convict.addFormat({
  name: 'non-empty-string',
  validate: (value: unknown) => {
    if (typeof value !== 'string' || !value.trim()) {
      throw new Error('must be a non-empty string');
    }
  },
});

export type RestSchema = {
  PORT: number;
  DB_HOST: string;
  SALT: string;
};

export const configRestSchema = convict<RestSchema>({
  PORT: {
    doc: 'Port for incoming connections',
    format: 'port',
    env: 'PORT',
    default: null,
  },
  DB_HOST: {
    doc: 'IP address of the database server',
    format: 'ipaddress',
    env: 'DB_HOST',
    default: null,
  },
  SALT: {
    doc: 'Salt for password hash',
    format: 'non-empty-string',
    env: 'SALT',
    default: null,
    sensitive: true,
  },
});
