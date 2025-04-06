'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export const dynamic = 'force-dynamic';

export default function Dashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [editingProject, setEditingProject] = useState(null);
  
  // Gunakan hook untuk localStorage
  const [authToken] = useLocalStorage('authToken', null);
  
  useEffect(() => {
    // Periksa autentikasi dengan hook
    if (!authToken) {
      router.push('/');
      return;
    }
    
    // Demo data - pada implementasi nyata ini akan berasal dari API
    setProjects([
      { id: '1', name: 'Project 1', description: 'This is a sample project for demonstration', createdAt: new Date(), knowledgeCount: 5, chatCount: 10 },
      { id: '2', name: 'Project 2', description: 'Another example project with some description', createdAt: new Date(), knowledgeCount: 3, chatCount: 7 }
    ]);
  }, [authToken, router]);
  
  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;
    
    const newProject = {
      id: Date.now().toString(),
      name: newProjectName,
      description: newProjectDesc || "No description provided",
      createdAt: new Date().toISOString(),
      knowledgeCount: 0,
      chatCount: 0
    };
  
    setProjects([...projects, newProject]);
    setNewProjectName('');
    setNewProjectDesc('');
    setShowModal(false);
  };
  
  const handleEditProject = () => {
    if (!newProjectName.trim()) return;
    
    setProjects(prev => 
      prev.map(project => 
        project.id === editingProject.id 
          ? {
              ...project,
              name: newProjectName,
              description: newProjectDesc
            } 
          : project
      )
    );
    
    setNewProjectName('');
    setNewProjectDesc('');
    setEditingProject(null);
    setShowModal(false);
  };
  
  const startEditProject = (project, e) => {
    e.stopPropagation(); // Mencegah navigasi ke halaman project
    
    // Log untuk debugging
    console.log("Editing project:", project);
    
    // Set state dengan nilai yang ada dari project
    setEditingProject(project);
    setNewProjectName(project.name || '');
    setNewProjectDesc(project.description || '');
    
    // Pastikan modal ditampilkan
    setShowModal(true);
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Your Projects</h2>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            onClick={() => {
              setEditingProject(null);
              setNewProjectName('');
              setNewProjectDesc('');
              setShowModal(true);
            }}
          >
            Add
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div
              key={project.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
              onClick={() => router.push(`/project/${project.id}`)}
            >
              <div className="p-6">
                <div className="flex justify-between">
                  <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                  <button
                    onClick={(e) => startEditProject(project, e)}
                    className="text-gray-500 hover:text-blue-600"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                  {project.description}
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Created on {new Date(project.createdAt).toLocaleDateString()}
                </p>
                <div className="mt-4 flex items-center">
                  <span className="flex items-center text-sm text-gray-500">
                    <svg className="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                    {project.knowledgeCount} items
                  </span>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="flex items-center text-sm text-gray-500">
                    <svg className="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                      <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                    </svg>
                    {project.chatCount} chats
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {projects.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md">
              <svg className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-gray-500 mb-4">You don&apos;t have any projects yet</p>
              <button
                onClick={() => {
                  setEditingProject(null);
                  setNewProjectName('');
                  setNewProjectDesc('');
                  setShowModal(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                Create Your First Project
              </button>
            </div>
          )}
        </div>
      </main>
      
      {/* Modal untuk menambah/edit project */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingProject ? `Edit Project: ${editingProject.name}` : 'Add New Project'}
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Name
              </label>
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter project name"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={newProjectDesc}
                onChange={(e) => setNewProjectDesc(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter project description"
                rows="3"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingProject(null);
                  setNewProjectName('');
                  setNewProjectDesc('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={editingProject ? handleEditProject : handleCreateProject}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={!newProjectName.trim()}
              >
                {editingProject ? 'Save Changes' : 'Create Project'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}