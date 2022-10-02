export type User = Record<string , null | string | number | boolean | string[]>;

export type Toast = {
  content: string;
  duration?: number;
  error?: boolean;
};
