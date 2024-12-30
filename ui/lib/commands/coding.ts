import { Command, CommandHandler, CommandContext, SubmitFunction } from './types'

export const codingCommand: Command = {
  name: 'Coding',
  description: 'Start a coding session',
  handler: async (args: string, submit: SubmitFunction, context: CommandContext) => {
    // Simply pass through to default chat handler
    return context.defaultHandler(args, submit, context);
  }
}
