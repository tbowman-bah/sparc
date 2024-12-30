import { Command, CommandHandler, CommandContext, SubmitFunction } from './types'
import { toMessageImage, toAISDKMessages } from '../messages'

export const codingCommand: Command = {
  name: 'Coding',
  description: 'Start a coding session',
  handler: async (args: string, submit: SubmitFunction, context: CommandContext) => {
    if (!args) return false;

    // Use the default handler to ensure consistent behavior with direct input
    return context.defaultHandler(args, submit, context);
  }
}
