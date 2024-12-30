import { CommandHandler } from './types'

export const chat: CommandHandler = async (args: string, submit, context) => {
  if (!args) return false

  console.log('=== Chat Command Context ===')
  console.log('Messages:', context.messages)

  // Submit user message immediately
  submit({
    messages: [{
      role: 'user',
      content: [{
        type: 'text',
        text: args
      }]
    }],
    userID: context.userID,
    model: context.model,
    template: context.template,
    config: context.config,
    clearInput: true
  })

  // Show loading indicator
  await new Promise(resolve => setTimeout(resolve, 500))
  submit({
    messages: [{
      role: 'assistant',
      content: [{
        type: 'text',
        text: 'Thinking...',
        icon: 'MessageCircle'
      }],
      loading: true
    }],
    userID: context.userID,
    model: context.model,
    template: context.template,
    config: context.config
  })

  try {
    // Build detailed conversation history
    const history = context.messages
      .filter(msg => msg.role === 'user' || msg.role === 'assistant') // Only include user and assistant messages
      .map(msg => {
        const content = msg.content[0].text;
        return `${msg.role === 'user' ? 'User' : 'Assistant'}: ${content}`;
      })
      .join('\n\n');
    
    // Create prompt with clear context
    const prompt = history 
      ? `Previous conversation:\n${history}\n\nCurrent message:\nUser: ${args}`
      : `User: ${args}`;

    // Ensure userID is defined
    if (!context.userID) {
      throw new Error('userID is required');
    }

    // Standardize fragment structure
    const fragment = {
      template: context.template || 'code-interpreter-v1',
      messages: [{
        role: 'user',
        content: [{
          type: 'text',
          text: prompt
        }]
      }],
      has_additional_dependencies: false,
      install_dependencies_command: '',
      additional_dependencies: [],
      code: [{
        file_name: 'chat.txt',
        file_path: 'chat.txt',
        file_content: prompt,
        file_finished: true
      }]
    };

    const response = await fetch('/api/sandbox', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fragment,
        userID: context.userID
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const { content } = await response.json();

    // Submit final response
    submit({
      messages: [{
        role: 'assistant',
        content: [{ type: 'text', text: content }]
      }],
      userID: context.userID,
      model: context.model,
      template: context.template,
      config: context.config
    });

    return true
  } catch (error: any) {
    console.error('Chat error:', error)
    
    submit({
      messages: [{
        role: 'assistant',
        content: [{ 
          type: 'text', 
          text: `Unable to complete chat. Error: ${error?.message || 'An unexpected error occurred'}`
        }]
      }],
      userID: context.userID,
      model: context.model,
      template: context.template,
      config: context.config
    })
    return true
  }
}
