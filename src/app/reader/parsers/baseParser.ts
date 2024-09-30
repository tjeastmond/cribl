export abstract class BaseParser<T> {
  public buffer: string[];

  constructor(buffer: string[]) {
    this.buffer = buffer;
  }

  public abstract isValid(line: string): boolean;
  public abstract parseLine(line: string): T;

  public checkFirst(): boolean {
    return this.isValid(this.buffer[0]);
  }

  public parse(): T[] {
    return this.buffer.map((line) => {
      const parsedLine = this.parseLine(line);
      return parsedLine;
    });
  }
}
