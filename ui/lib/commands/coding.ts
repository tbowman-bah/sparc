import { Command, CommandHandler, CommandContext, SubmitFunction } from './types'

export const codingCommand: Command = {
  name: 'Coding',
  description: 'Start a coding session',
  handler: async (args: string, submit: SubmitFunction, context: CommandContext) => {
    if (!args) return false;

    // Add user message
    submit({
      messages: [{
        role: 'user',
        content: [{ type: 'text', text: args }]
      }],
      userID: context.userID,
      model: context.model,
      template: context.template,
      config: {
        ...context.config,
        skipAI: false // Ensure AI processing happens
      }
    });

    // Show loading indicator
    await new Promise(resolve => setTimeout(resolve, 500));
    submit({
      messages: [{
        role: 'assistant',
        content: [{
          type: 'text',
          text: 'Generating code...',
          icon: 'Code'
        }],
        loading: true
      }],
      userID: context.userID,
      model: context.model,
      template: context.template,
      config: context.config
    });

    try {
      // Use the default handler with AI processing enabled
      return context.defaultHandler(args, submit, {
        ...context,
        config: {
          ...context.config,
          skipAI: false
        }
      });
    } catch (error: any) {
      console.error('Coding error:', error);
      
      submit({
        messages: [{
          role: 'assistant',
          content: [{ 
            type: 'text', 
            text: `Unable to generate code. Error: ${error?.message || 'An unexpected error occurred'}`
          }]
        }],
        userID: context.userID,
        model: context.model,
        template: context.template,
        config: context.config
      });
      return true;
    }
  }
}
