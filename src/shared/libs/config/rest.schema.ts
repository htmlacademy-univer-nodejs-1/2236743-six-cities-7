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
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
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
  DB_PORT: {
    doc: 'Port of the database server',
    format: 'port',
    env: 'DB_PORT',
    default: null,
  },
  DB_USER: {
    doc: 'Username to connect to the database',
    format: 'non-empty-string',
    env: 'DB_USER',
    default: null,
  },
  DB_PASSWORD: {
    doc: 'Password to connect to the database',
    format: 'non-empty-string',
    env: 'DB_PASSWORD',
    default: null,
    sensitive: true,
  },
  DB_NAME: {
    doc: 'Database name',
    format: 'non-empty-string',
    env: 'DB_NAME',
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
