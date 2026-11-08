export interface FileReader {
  read(): AsyncGenerator<string>;
}
