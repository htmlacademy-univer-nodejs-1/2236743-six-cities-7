export function generateRandomValue(min: number, max: number, numAfterDigit = 0): number {
  return Number((Math.random() * (max - min) + min).toFixed(numAfterDigit));
}

export function getRandomItem<T>(items: T[]): T {
  return items[generateRandomValue(0, items.length - 1)];
}

export function getRandomItems<T>(items: T[], count = generateRandomValue(1, items.length)): T[] {
  return [...items]
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
}

export function getRandomBoolean(): boolean {
  return Math.random() < 0.5;
}

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
