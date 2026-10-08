export type Person = {
  id: string;
  name: string;
  spouseId: string | null;
  parents: string[];
  children: string[];
  annotations?: string[];
  clans: string[];
  audio?: {
    title: string;
    author: string;
    audio: string;
    date: string;
    source: string;
  }[];
};
