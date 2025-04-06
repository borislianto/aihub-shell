'use client';

import { useState, useRef, useEffect } from 'react';

export default function ChatInterface({ projectId }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatMode, setChatMode] = useState('free'); // 'free' atau 'predefined'
  const [selectedApi, setSelectedApi] = useState('anthropic');
  const [saveChat, setSaveChat] = useState(true);
  const [predefinedTemplate, setPredefinedTemplate] = useState('');
  
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    // Scroll ke bawah saat pesan baru muncul
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    
    const newUserMessage = {
      role: 'user',
      content: inputText,
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setInputText('');
    setIsLoading(true);
    
    try {
      // Dalam implementasi nyata, ini akan memanggil API
      // Untuk demo, kita simulasikan respons AI
      setTimeout(() => {
        let responseContent = "Ini adalah respons demo dari ";
        let artifacts = [];
        
        if (chatMode === 'free') {
          switch(selectedApi) {
            case 'openai':
              responseContent += "OpenAI API.";
              break;
            case 'anthropic':
              responseContent += "Anthropic API (Claude).";
              break;
            case 'deepseek':
              responseContent += "DeepSeek API.";
              break;
            default:
              responseContent += "AI assistant.";
          }
        } else if (chatMode === 'predefined') {
          switch(predefinedTemplate) {
            case 'coding':
              responseContent += "Coding Assistant. Berikut contoh kode:";
              artifacts.push({
                type: 'code',
                language: 'javascript',
                content: 'function helloWorld() {\n  console.log("Hello, world!");\n}\n\nhelloWorld();'
              });
              break;
            case 'storytelling':
              responseContent += "Story Creator. Berikut awal cerita yang dibuat:";
              artifacts.push({
                type: 'markdown',
                content: '# Petualangan di Negeri Ajaib\n\nPada suatu hari, di sebuah desa kecil yang tersembunyi di antara pegunungan, hiduplah seorang anak bernama Maya. Maya selalu bermimpi untuk menjelajahi dunia di luar desanya...'
              });
              break;
            case 'image':
              responseContent += "Image Generator. Berikut gambar yang dihasilkan:";
              artifacts.push({
                type: 'image',
                url: 'https://placehold.co/600x400',
                title: 'Generated image'
              });
              break;
            default:
              responseContent += "Template Assistant.";
          }
        }
        
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: responseContent,
          artifacts: artifacts
        }]);
        setIsLoading(false);
      }, 1500);
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Maaf, terjadi kesalahan saat memproses permintaan Anda.',
      }]);
      setIsLoading(false);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const predefinedTemplates = [
    { id: 'coding', name: 'Coding Assistant', api: 'anthropic' },
    { id: 'storytelling', name: 'Story Creator', api: 'deepseek' },
    { id: 'image', name: 'Image Generator', api: 'openai' }
  ];
  
  const handleTemplateChange = (templateId) => {
    setPredefinedTemplate(templateId);
    
    // Set default API berdasarkan template
    const template = predefinedTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedApi(template.api);
    }
  };
  
  // Helper function untuk render markdown
  const renderMarkdown = (content) => {
    // Implementasi sederhana
    return content
      .replace(/#{3}(.*?)\n/g, '<h3>$1</h3>')
      .replace(/#{2}(.*?)\n/g, '<h2>$1</h2>')
      .replace(/#{1}(.*?)\n/g, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br />');
  };
  
  return (
    <div className="h-full flex flex-col">
      {/* Chat configuration */}
      <div className="bg-white p-4 border-b">
        <div className="flex flex-wrap gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chat Mode
            </label>
            <div className="flex space-x-2">
              <button
                className={`px-3 py-1 text-sm rounded-md ${
                  chatMode === 'free' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}
                onClick={() => setChatMode('free')}
              >
                Free Chat
              </button>
              <button
                className={`px-3 py-1 text-sm rounded-md ${
                  chatMode === 'predefined' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}
                onClick={() => setChatMode('predefined')}
              >
                Predefined Template
              </button>
            </div>
          </div>
          
          {chatMode === 'free' && (
            <>
              <div>
                <label htmlFor="api-select" className="block text-sm font-medium text-gray-700 mb-1">
                  API Provider
                </label>
                <select
                  id="api-select"
                  value={selectedApi}
                  onChange={(e) => setSelectedApi(e.target.value)}
                  className="block w-full pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="openai">OpenAI</option>
                  <option value="anthropic">Anthropic</option>
                  <option value="deepseek">DeepSeek</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={saveChat}
                    onChange={(e) => setSaveChat(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">Save Chat</span>
                </label>
              </div>
            </>
          )}
          
          {chatMode === 'predefined' && (
            <div>
              <label htmlFor="template-select" className="block text-sm font-medium text-gray-700 mb-1">
                Select Template
              </label>
              <select
                id="template-select"
                value={predefinedTemplate}
                onChange={(e) => handleTemplateChange(e.target.value)}
                className="block w-full pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="" disabled>Select a template</option>
                {predefinedTemplates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
      
      {/* Messages area - will scroll */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-gray-500">
            <p>Belum ada pesan. Mulai percakapan!</p>
            {chatMode === 'predefined' && !predefinedTemplate && (
              <p className="mt-2 text-sm">Pilih template untuk memulai</p>
            )}
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  message.role === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                <div
                  className={`inline-block max-w-3xl px-4 py-2 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-900 border border-gray-200'
                  }`}
                >
                  <div>{message.content}</div>
                  
                  {/* Render artifacts if present */}
                  {message.artifacts && message.artifacts.length > 0 && (
                    <div className="mt-4 border-t pt-2">
                      {message.artifacts.map((artifact, artifactIndex) => (
                        <div key={artifactIndex} className="mt-2">
                          {artifact.type === 'code' && (
                            <div className="bg-gray-800 text-white p-4 rounded overflow-auto">
                              <div className="text-xs text-gray-400 mb-2">{artifact.language}</div>
                              <pre><code>{artifact.content}</code></pre>
                            </div>
                          )}
                          
                          {artifact.type === 'image' && (
                            <div>
                              <div className="text-xs text-gray-500 mb-1">{artifact.title}</div>
                              <img 
                                src={artifact.url} 
                                alt={artifact.title || 'Generated image'} 
                                className="max-w-full rounded border border-gray-200"
                              />
                            </div>
                          )}
                          
                          {artifact.type === 'markdown' && (
                            <div className="bg-gray-50 p-4 rounded border border-gray-200">
                              <div dangerouslySetInnerHTML={{ __html: renderMarkdown(artifact.content) }} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      {/* Input area - fixed at bottom */}
      <div className="bg-white p-4 border-t">
        <div className="flex space-x-2">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ketik pesan..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            rows="2"
            disabled={isLoading || (chatMode === 'predefined' && !predefinedTemplate)}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputText.trim() || (chatMode === 'predefined' && !predefinedTemplate)}
            className={`px-4 py-2 rounded-md focus:outline-none ${
              isLoading || !inputText.trim() || (chatMode === 'predefined' && !predefinedTemplate)
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Mengirim...' : 'Kirim'}
          </button>
        </div>
      </div>
    </div>
  );
}