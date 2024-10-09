export type ValidParams = {
  path: string;
  numberRows: number;
};

export interface ReadResult {
  read: () => Promise<string>;
  done: () => boolean;
  close: () => Promise<void>;
}
