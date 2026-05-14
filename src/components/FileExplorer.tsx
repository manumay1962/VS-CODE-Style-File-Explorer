import { useState, useEffect } from 'react';
import type { FileNode, NodeType } from '../types';
import TreeNode from './TreeNode';
import './FileExplorer.css';

interface FileExplorerProps {
  initialData: FileNode[];
}

export default function FileExplorer({ initialData }: FileExplorerProps) {
  const [nodes, setNodes] = useState<FileNode[]>(() => {
    const saved = localStorage.getItem('fileExplorerData');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialData;
      }
    }
    return initialData;
  });
  
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('fileExplorerData', JSON.stringify(nodes));
  }, [nodes]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleAddNode = (type: NodeType) => {
    const newNode: FileNode = {
      id: generateId(),
      name: '',
      type,
      isOpen: type === 'folder' ? true : undefined,
      children: type === 'folder' ? [] : undefined,
    };

    if (!selectedNodeId) {
      setNodes([newNode, ...nodes]);
      return;
    }

    const updateNodes = (currentNodes: FileNode[]): FileNode[] => {
      return currentNodes.map(node => {
        if (node.id === selectedNodeId && node.type === 'folder') {
          return {
            ...node,
            isOpen: true,
            children: [newNode, ...(node.children || [])]
          };
        } else if (node.children) {
          return {
            ...node,
            children: updateNodes(node.children)
          };
        }
        return node;
      });
    };

    let added = false;
    const updateNodesStrict = (currentNodes: FileNode[]): FileNode[] => {
      return currentNodes.map(node => {
        if (node.id === selectedNodeId && node.type === 'folder') {
          added = true;
          return {
            ...node,
            isOpen: true,
            children: [newNode, ...(node.children || [])]
          };
        } else if (node.children) {
          const newChildren = updateNodesStrict(node.children);
          return { ...node, children: newChildren };
        }
        return node;
      });
    };

    const newNodes = updateNodesStrict(nodes);
    if (added) {
      setNodes(newNodes);
    } else {
      setNodes([newNode, ...nodes]);
    }
  };

  const updateNode = (id: string, updates: Partial<FileNode>) => {
    const updateNodesRecursive = (currentNodes: FileNode[]): FileNode[] => {
      return currentNodes.map(node => {
        if (node.id === id) {
          return { ...node, ...updates };
        } else if (node.children) {
          return { ...node, children: updateNodesRecursive(node.children) };
        }
        return node;
      });
    };
    setNodes(updateNodesRecursive(nodes));
  };

  const deleteNode = (id: string) => {
    const deleteNodesRecursive = (currentNodes: FileNode[]): FileNode[] => {
      return currentNodes.filter(node => node.id !== id).map(node => {
        if (node.children) {
          return { ...node, children: deleteNodesRecursive(node.children) };
        }
        return node;
      });
    };
    setNodes(deleteNodesRecursive(nodes));
    if (selectedNodeId === id) setSelectedNodeId(null);
  };

  return (
    <div className="file-explorer-container">
      <div className="window-bar">
        <div className="mac-dots">
          <span className="dot red"></span>
          <span className="dot yellow"></span>
          <span className="dot green"></span>
        </div>
        <div className="window-title">File Explorer</div>
      </div>

      <div className="action-bar">
        <button className="action-btn primary" onClick={() => handleAddNode('file')}>
          + New File
        </button>
        <button className="action-btn" onClick={() => handleAddNode('folder')}>
          + New Folder
        </button>
      </div>

      <div className="tree-container">
        {nodes.map(node => (
          <TreeNode
            key={node.id}
            node={node}
            level={0}
            selectedNodeId={selectedNodeId}
            onSelect={setSelectedNodeId}
            onUpdate={updateNode}
            onDelete={deleteNode}
          />
        ))}
      </div>
    </div>
  );
}
