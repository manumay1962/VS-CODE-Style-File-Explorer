import FileExplorer from './components/FileExplorer';
import type { FileNode } from './types';

const initialData: FileNode[] = [
  {
    id: '1',
    name: 'src',
    type: 'folder',
    isOpen: true,
    children: [
      {
        id: '2',
        name: 'components',
        type: 'folder',
        isOpen: true,
        children: [
          { id: '3', name: 'Button.tsx', type: 'file' },
          { id: '4', name: 'Tree.tsx', type: 'file' },
          { id: '5', name: 'TreeNode.tsx', type: 'file' },
        ]
      },
      { id: '6', name: 'App.tsx', type: 'file' },
      { id: '7', name: 'main.tsx', type: 'file' },
      { id: '8', name: 'index.css', type: 'file' },
    ]
  },
  {
    id: '9',
    name: 'public',
    type: 'folder',
    isOpen: false,
    children: []
  },
  { id: '10', name: 'package.json', type: 'file' },
  { id: '11', name: 'README.md', type: 'file' },
];

function App() {
  return (
    <div style={{ width: '800px', maxWidth: '100%' }}>
      <FileExplorer initialData={initialData} />
    </div>
  );
}

export default App;
