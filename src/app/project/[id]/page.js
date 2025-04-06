'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ChatInterface from '@/components/ChatInterface';
import KnowledgeBase from '@/components/KnowledgeBase';
import Navbar from '@/components/Navbar';

export default function ProjectDetail() {
  const router = useRouter();
  // Gunakan useParams() untuk mendapatkan parameter dari URL
  const params = useParams();
  const projectId = params.id;
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState('chat');
  
  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/');
      return;
    }
    
    // Demo: Set dummy project data
    setProject({
      id: projectId,
      name: `Project ${projectId}`,
      description: "This is a sample project description",
      createdAt: new Date().toISOString()
    });
  }, [projectId, router]);
  
  if (!project) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar projectName={project.name} />
      
      <div className="container mx-auto px-4 py-6">
        {/* Tab navigation */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('chat')}
              className={`py-4 px-1 ${
                activeTab === 'chat'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Chat
            </button>
            <button
              onClick={() => setActiveTab('knowledge')}
              className={`py-4 px-1 ${
                activeTab === 'knowledge'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Knowledge Base
            </button>
          </nav>
        </div>
        
        {/* Fixed height content area */}
        <div className="bg-white rounded-lg shadow" style={{ height: '70vh' }}>
          {activeTab === 'chat' ? (
            <ChatInterface projectId={projectId} />
          ) : (
            <KnowledgeBase projectId={projectId} />
          )}
        </div>
      </div>
    </div>
  );
}