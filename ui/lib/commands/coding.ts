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
      config: context.config
    });

    // Process with AI
    submit({
      messages: [{
        role: 'assistant',
        content: [{ type: 'text', text: 'Generating code...' }],
        loading: true
      }],
      userID: context.userID,
      model: context.model,
      template: context.template,
      config: {
        ...context.config,
        skipAI: false // Ensure AI processing happens
      }
    });

    return true;
  }
}
