import { Command, CommandHandler, CommandContext, SubmitFunction } from './types'
import { toMessageImage } from '../messages'

export const codingCommand: Command = {
  name: 'Coding',
  description: 'Start a coding session',
  handler: async (args: string, submit: SubmitFunction, context: CommandContext) => {
    if (!args) return false;

    // Handle image attachments similar to direct input
    const files = context.files || [];
    const content: any[] = [{ type: 'text', text: args }];
    
    const images = await toMessageImage(files);
    if (images.length > 0) {
      images.forEach((image) => {
        content.push({ type: 'image', image: image.image });
      });
    }

    // Submit user message
    submit({
      messages: [{
        role: 'user',
        content
      }],
      userID: context.userID,
      model: context.model,
      template: context.template,
      config: context.config
    });

    return true;
  }
}
