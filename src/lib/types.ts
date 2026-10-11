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
/** React Flow node state connecting a person record to graph selection actions. */
export type SaibaiFlowNode = {
  nodeData: Person;
  origin: boolean;
  terminus: boolean;
  setSelectedNode: React.Dispatch<React.SetStateAction<Person | null>>;
};
/** Standard div attributes accepted by audio control groups. */
export type AudioCtrlsProps = React.ComponentPropsWithoutRef<"div">;

