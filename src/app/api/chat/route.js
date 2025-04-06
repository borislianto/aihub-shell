import { NextResponse } from 'next/server';

// Process OpenAI request
async function processOpenAI(apiKey, message, chatMode, template, knowledgeContext = null) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    };
    
    // Setup prompt with knowledge context if available
    let prompt = message;
    if (knowledgeContext) {
      prompt = `Context information:\n${knowledgeContext}\n\nUser query: ${message}`;
    }
    
    // Handle image generation if using DALL-E
    if (chatMode === 'predefined' && template === 'image') {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          prompt: message,
          n: 1,
          size: "1024x1024",
        }),
      });
      
      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      return {
        content: "I've generated an image based on your request:",
        artifacts: [
          {
            type: 'image',
            url: data.data[0].url,
            title: 'Generated image'
          }
        ]
      };
    } else {
      // For text completion
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 2048
        }),
      });
      
      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      return {
        content: data.choices[0].message.content,
        artifacts: []
      };
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}

// Process Anthropic request
async function processAnthropic(apiKey, message, chatMode, template, knowledgeContext = null) {
  try {
    // Setup system prompt based on template
    let systemPrompt = 'You are Claude, a helpful AI assistant.';
    
    if (chatMode === 'predefined' && template === 'coding') {
      systemPrompt = 'You are a coding assistant. Always provide detailed and well-commented code. Use code blocks for code samples.';
    }
    
    // Setup user message with knowledge context if available
    let userMessage = message;
    if (knowledgeContext) {
      userMessage = `Context information:\n${knowledgeContext}\n\nUser query: ${message}`;
    }
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'anthropic-version': '2023-06-01',
        'x-api-key': apiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        max_tokens: 4096,
        system: systemPrompt,
        messages: [
          { role: 'user', content: userMessage }
        ]
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    const content = data.content[0].text;
    
    // Extract code blocks as artifacts
    const codeBlockRegex = /```([a-zA-Z0-9]+)?\n([\s\S]+?)```/g;
    let match;
    const artifacts = [];
    
    while ((match = codeBlockRegex.exec(content)) !== null) {
      const language = match[1] || 'text';
      const code = match[2];
      
      artifacts.push({
        type: 'code',
        language,
        content: code
      });
    }
    
    return {
      content,
      artifacts
    };
  } catch (error) {
    console.error('Anthropic API error:', error);
    throw error;
  }
}

// Process DeepSeek request
async function processDeepSeek(apiKey, message, chatMode, template, knowledgeContext = null) {
  try {
    // Setup prompt based on template
    let prompt = message;
    
    if (chatMode === 'predefined' && template === 'storytelling') {
      prompt = `Create a compelling story based on the following idea: ${message}. Be creative and engaging.`;
    }
    
    // Add knowledge context if available
    if (knowledgeContext) {
      prompt = `Context information:\n${knowledgeContext}\n\nUser query: ${prompt}`;
    }
    
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2048
      }),
    });
    
    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return {
      content: data.choices[0].message.content,
      artifacts: []
    };
  } catch (error) {
    console.error('DeepSeek API error:', error);
    throw error;
  }
}

// Get knowledge context for a project
async function getKnowledgeContext(projectId, query) {
  // In a real implementation, this would query the database for relevant knowledge items
  // For demo purposes, we'll return a placeholder
  return "This is sample knowledge context that would be retrieved from the knowledge base.";
}

export async function POST(request) {
  try {
    const { 
      message, 
      chatMode, 
      apiProvider, 
      template = null, 
      projectId, 
      useKnowledge = true 
    } = await request.json();
    
    // Get API keys from client (in production, you'd store these securely on the server)
    const apiKeys = JSON.parse(localStorage.getItem('apiKeys') || '{}');
    const apiKey = apiKeys[apiProvider];
    
    if (!apiKey) {
      return NextResponse.json(
        { error: `Missing API key for ${apiProvider}` },
        { status: 400 }
      );
    }
    
    // Get relevant knowledge context if enabled
    let knowledgeContext = null;
    if (useKnowledge) {
      knowledgeContext = await getKnowledgeContext(projectId, message);
    }
    
    // Process message with appropriate API provider
    let response;
    
    switch (apiProvider) {
      case 'openai':
        response = await processOpenAI(apiKey, message, chatMode, template, knowledgeContext);
        break;
      case 'anthropic':
        response = await processAnthropic(apiKey, message, chatMode, template, knowledgeContext);
        break;
      case 'deepseek':
        response = await processDeepSeek(apiKey, message, chatMode, template, knowledgeContext);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid API provider' },
          { status: 400 }
        );
    }
    
    return NextResponse.json({
      response: response.content,
      artifacts: response.artifacts || []
    });
  } catch (error) {
    console.error('Error processing chat:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}