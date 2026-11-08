export function getMongoURI(
  username: string,
  password: string,
  host: string,
  port: number,
  databaseName: string,
): string {
  return `mongodb://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${host}:${port}/${databaseName}?authSource=admin`;
}
