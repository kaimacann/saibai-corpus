import type React from "react";

/** Media metadata and accessible labels accepted by the corpus audio player. */
export type PlayerProps = {
  src: string;
  poster?: string;
  className?: string;
  title?: string;
  author?: string;
  meta?: string;
  alt?: string;
};
/** Track metadata displayed alongside a Saibai audio recording. */
export type AudioTrack = {
  title: string;
  author: string;
  audio: string;
  date: string;
  source: string;
};
/** A person record with family links and optional annotation and recording data. */
export type Person = {
  id: string;
  name: string;
  spouseId: string | null;
  parents: string[];
  children: string[];
  annotations?: string[];
  clans: string[];
  audio?: AudioTrack[];
};
/** React Flow node state connecting a person record to graph selection actions. */
export type SaibaiFlowNode = {
  nodeData: Person;
  origin: boolean;
  terminus: boolean;
  setSelectedNode: React.Dispatch<React.SetStateAction<Person | null>>;
};
/** Button attributes combined with the shared corpus button style variants. */
/** Standard div attributes accepted by audio control groups. */
export type AudioCtrlsProps = React.ComponentPropsWithoutRef<"div"> & {
  className?: string;
};
