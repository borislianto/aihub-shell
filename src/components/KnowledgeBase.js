'use client';

import { useState, useEffect } from 'react';

export default function KnowledgeBase({ projectId }) {
  const [knowledgeItems, setKnowledgeItems] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [textContent, setTextContent] = useState('');
  const [textTitle, setTextTitle] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  
  useEffect(() => {
    // Fetch knowledge items
    fetchKnowledgeItems();
  }, [projectId]);
  
  const fetchKnowledgeItems = async () => {
    try {
      // Demo data
      setKnowledgeItems([
        {
          id: '1',
          name: 'Sample Document',
          type: 'application/pdf',
          size: 1024 * 1024 * 2.5, // 2.5 MB
          isText: false,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Project Notes',
          type: 'text/plain',
          size: 1024 * 5, // 5 KB
          isText: true,
          content: 'These are sample notes for the project.',
          createdAt: new Date().toISOString()
        }
      ]);
    } catch (error) {
      console.error('Error fetching knowledge items:', error);
    }
  };
  
  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    
    try {
      // Simulasi upload file
      setTimeout(() => {
        const newItems = Array.from(files).map(file => ({
          id: Date.now() + Math.random().toString(36).substring(2, 9),
          name: file.name,
          type: file.type,
          size: file.size,
          isText: false,
          createdAt: new Date().toISOString()
        }));
        
        setKnowledgeItems(prev => [...prev, ...newItems]);
        setIsUploading(false);
      }, 1500);
    } catch (error) {
      console.error('Error uploading files:', error);
      setIsUploading(false);
    }
  };
  
  const handleAddText = () => {
    setEditingItem(null);
    setTextTitle('');
    setTextContent('');
    setShowTextEditor(true);
  };
  
  const handleSaveText = () => {
    if (!textTitle.trim()) {
      alert('Please enter a title for your text');
      return;
    }
    
    if (editingItem) {
      // Update existing text item
      setKnowledgeItems(prev => 
        prev.map(item => 
          item.id === editingItem.id 
            ? {
                ...item,
                name: textTitle,
                content: textContent,
                updatedAt: new Date().toISOString()
              }
            : item
        )
      );
    } else {
      // Add new text item
      const newTextItem = {
        id: Date.now() + Math.random().toString(36).substring(2, 9),
        name: textTitle,
        type: 'text/plain',
        size: new Blob([textContent]).size,
        content: textContent,
        isText: true,
        createdAt: new Date().toISOString()
      };
      
      setKnowledgeItems(prev => [...prev, newTextItem]);
    }
    
    setShowTextEditor(false);
    setTextTitle('');
    setTextContent('');
    setEditingItem(null);
  };
  
  const handleEditText = (item) => {
    setEditingItem(item);
    setTextTitle(item.name);
    setTextContent(item.content || '');
    setShowTextEditor(true);
  };
  
  const handleViewItem = (item) => {
    if (item.isText) {
      handleEditText(item);
    } else {
      alert(`Viewing ${item.name}`);
      // In a real implementation, you would show a viewer for the file
    }
  };
  
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  return (
    <div className="h-full flex flex-col">
      {showTextEditor ? (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingItem ? 'Edit Text' : 'Add New Text'}
              </h3>
              <button
                onClick={() => setShowTextEditor(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                Cancel
              </button>
            </div>
            
            <div className="mb-4">
              <label htmlFor="text-title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                id="text-title"
                value={textTitle}
                onChange={(e) => setTextTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter a title for your text"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="text-content" className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                id="text-content"
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                rows="15"
                placeholder="Enter your text content here..."
              />
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handleSaveText}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Knowledge Base</h2>
            <div className="flex space-x-2">
              <button
                onClick={handleAddText}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Add Text
              </button>
              
              <div>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  multiple
                  onChange={handleFileUpload}
                />
                <label
                  htmlFor="file-upload"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
                >
                  {isUploading ? 'Uploading...' : 'Upload Files'}
                </label>
              </div>
            </div>
          </div>
          
          {knowledgeItems.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">Belum ada item knowledge. Upload file atau tambahkan teks untuk menambah ke knowledge base Anda.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipe
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ukuran
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal 
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {knowledgeItems.map(item => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {item.isText ? (
                            <span className="mr-2 text-green-500">
                              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                              </svg>
                            </span>
                          ) : (
                            <span className="mr-2 text-blue-500">
                              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a3 3 0 00-3-3H8z" clipRule="evenodd" />
                              </svg>
                            </span>
                          )}
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {item.isText ? 'Text Document' : item.type}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{formatFileSize(item.size)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(item.updatedAt || item.createdAt).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => handleViewItem(item)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          {item.isText ? 'Edit' : 'View'}
                        </button>
                        <button 
                          onClick={() => {
                            if (confirm(`Hapus ${item.name}?`)) {
                              setKnowledgeItems(prev => prev.filter(i => i.id !== item.id));
                            }
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}