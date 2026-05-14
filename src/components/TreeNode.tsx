import React, { useState, useRef, useEffect } from 'react';
import type { FileNode } from '../types';
import './TreeNode.css';

interface TreeNodeProps {
  node: FileNode;
  level: number;
  selectedNodeId: string | null;
  onSelect: (id: string) => void;
  onUpdate: (id: string, updates: Partial<FileNode>) => void;
  onDelete: (id: string) => void;
}

const ArrowIcon = ({ isOpen, hidden }: { isOpen: boolean, hidden?: boolean }) => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style={{ visibility: hidden ? 'hidden' : 'visible', transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.1s', marginRight: '6px', color: '#6b7280', flexShrink: 0 }}>
    <polygon points="8,5 17,12 8,19"></polygon>
  </svg>
);

const FolderIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#3b82f6" style={{ marginRight: '6px', flexShrink: 0 }}>
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
  </svg>
);

const FileIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', flexShrink: 0 }}>
    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
    <polyline points="13 2 13 9 20 9"></polyline>
  </svg>
);

export default function TreeNode({ node, level, selectedNodeId, onSelect, onUpdate, onDelete }: TreeNodeProps) {
  const [isEditing, setIsEditing] = useState(node.name === '');
  const [editName, setEditName] = useState(node.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (node.type === 'folder') {
      onUpdate(node.id, { isOpen: !node.isOpen });
    }
    onSelect(node.id);
  };

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(node.id);
  };

  const handleRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditName(node.name);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(node.id);
  };

  const submitEdit = () => {
    if (editName.trim()) {
      onUpdate(node.id, { name: editName.trim() });
      setIsEditing(false);
    } else if (node.name === '') {
      onDelete(node.id);
    } else {
      setIsEditing(false);
      setEditName(node.name);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      submitEdit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      if (node.name === '') onDelete(node.id);
    }
  };

  const isSelected = selectedNodeId === node.id;

  return (
    <div>
      <div 
        className={`tree-node ${isSelected ? 'selected' : ''}`} 
        style={{ paddingLeft: `${level * 20 + 16}px` }}
        onClick={handleSelect}
      >
        <div className="node-content" onClick={node.type === 'folder' ? handleToggle : undefined} style={{ cursor: node.type === 'folder' ? 'pointer' : 'default' }}>
          {node.type === 'folder' ? (
            <ArrowIcon isOpen={!!node.isOpen} />
          ) : (
            <ArrowIcon isOpen={false} hidden />
          )}
          {node.type === 'folder' ? <FolderIcon /> : <FileIcon />}
          
          {isEditing ? (
            <input
              ref={inputRef}
              className="node-input"
              value={editName}
              onChange={e => setEditName(e.target.value)}
              onBlur={submitEdit}
              onKeyDown={handleKeyDown}
              onClick={e => e.stopPropagation()}
            />
          ) : (
            <span className="node-name">{node.name}</span>
          )}
        </div>

        {!isEditing && (
          <div className="node-actions">
            <button onClick={handleRename}>Rename</button>
            <button onClick={handleDelete}>Delete</button>
          </div>
        )}
      </div>

      {node.type === 'folder' && node.isOpen && node.children && (
        <div className="node-children">
          {node.children.map(child => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              selectedNodeId={selectedNodeId}
              onSelect={onSelect}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
