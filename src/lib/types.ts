import type React from "react";

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
export type SaibaiFlowNode = {
  nodeData: Person;
  origin: boolean;
  terminus: boolean;
  setSelectedNode: React.Dispatch<React.SetStateAction<Person | null>>;
};
