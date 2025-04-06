'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
  const router = useRouter();
  const [apiKeys, setApiKeys] = useState({
    openai: '',
    anthropic: '',
    deepseek: ''
  });
  
  useEffect(() => {
    const tempToken = localStorage.getItem('tempAuthToken');
    if (!tempToken) {
      router.push('/');
    }
  }, [router]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApiKeys(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Demo: simpan ke localStorage
      localStorage.removeItem('tempAuthToken');
      localStorage.setItem('authToken', 'user-token');
      localStorage.setItem('apiKeys', JSON.stringify(apiKeys));
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
    }
  };
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Complete Registration</h1>
          <p className="mt-2 text-gray-600">
            Please provide your API keys to start using Hub Shell
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="openai" className="block text-sm font-medium text-gray-700">
                OpenAI API Key
              </label>
              <input
                id="openai"
                name="openai"
                type="password"
                required
                value={apiKeys.openai}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="anthropic" className="block text-sm font-medium text-gray-700">
                Anthropic API Key
              </label>
              <input
                id="anthropic"
                name="anthropic"
                type="password"
                required
                value={apiKeys.anthropic}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="deepseek" className="block text-sm font-medium text-gray-700">
                DeepSeek API Key
              </label>
              <input
                id="deepseek"
                name="deepseek"
                type="password"
                required
                value={apiKeys.deepseek}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
            >
              Complete Registration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}