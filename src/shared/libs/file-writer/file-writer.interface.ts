export interface FileWriter {
  write(row: string): Promise<void>;
  close(): Promise<void>;
}
