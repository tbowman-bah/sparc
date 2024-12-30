import { CommandHandler } from './types'

export const chat: CommandHandler = async (args: string, submit, context) => {
  if (!args) return false

  console.log('=== Chat Command Start ===')
  console.log('Args:', args)

  // Submit user message immediately
  submit({
    messages: [{
      role: 'user',
      content: [{ type: 'text', text: args }]
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
        text: 'Processing your message...',
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
    // Get previous messages excluding any system messages
    const previousMessages = (context.messages || []).filter(msg => msg.role !== 'system');
    
    // Create message payload with system message first if present
    const systemMessage = context.template?.system;
    const messagePayload = systemMessage 
      ? [{ role: 'system', content: [{ type: 'text', text: systemMessage }] }, ...previousMessages]
      : previousMessages;

    const response = await fetch('/api/chat-direct', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: args,
        messages: messagePayload.map(msg => ({
          role: msg.role,
          content: msg.content.map(c => ({
            type: c.type,
            text: c.type === 'text' ? c.text : ''
          }))
        })),
        modelName: context.config?.modelName || 'claude-3-sonnet-20240229'
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const content = data.content;

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

    console.log('=== Chat Command Complete ===')
    return true
  } catch (error: any) {
    console.error('=== Chat Command Error ===')
    console.error('Error Details:', {
      message: error?.message,
      stack: error?.stack,
      name: error?.name
    })
    
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
