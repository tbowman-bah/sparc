import { StreamingTextResponse, Message } from 'ai'
import { ChatAnthropic } from '@langchain/anthropic'
import { HumanMessage, SystemMessage } from '@langchain/core/messages'
import { chatTemplate } from '@/lib/commands/chat-template'

export async function POST(req: Request) {
  try {
    const { prompt, messages: previousMessages, modelName } = await req.json()
    
    const model = new ChatAnthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
      modelName: modelName || 'claude-3-sonnet-20240229',
      streaming: true
    })

    // Convert previous messages to the format expected by the model
    const messageHistory = previousMessages?.map((msg: any) => {
      // Handle nested content structure
      let messageText = ''
      if (Array.isArray(msg.content)) {
        const textContent = msg.content.find((c: any) => c.type === 'text')
        messageText = textContent?.text || ''
      } else {
        messageText = msg.content || ''
      }
      
      return msg.role === 'user' 
        ? new HumanMessage(messageText)
        : new SystemMessage(messageText)
    }) || []

    // Filter out any existing system messages from history
    const filteredHistory = messageHistory.filter(msg => !(msg instanceof SystemMessage));
    
    // Always add system message as first message
    const messages = [new SystemMessage(chatTemplate.system), ...filteredHistory, new HumanMessage(prompt)]

    const stream = await model.stream(messages);
    return new StreamingTextResponse(stream);
    
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
