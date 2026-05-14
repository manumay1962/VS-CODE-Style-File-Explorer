export type NodeType = 'file' | 'folder';

export interface FileNode {
  id: string;
  name: string;
  type: NodeType;
  isOpen?: boolean;
  children?: FileNode[];
}
