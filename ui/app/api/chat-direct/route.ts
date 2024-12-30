import { NextResponse } from 'next/server'
import { ChatAnthropic } from '@langchain/anthropic'
import { HumanMessage, SystemMessage } from '@langchain/core/messages'
import { chatTemplate } from '@/lib/commands/chat-template'

export async function POST(req: Request) {
  try {
    const { prompt, messages: previousMessages, modelName } = await req.json()
    
    const model = new ChatAnthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
      modelName: modelName || 'claude-3-sonnet-20240229'
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

    const messages = [
      new SystemMessage(chatTemplate.system),
      ...messageHistory,
      new HumanMessage(prompt)
    ]

    try {
      const response = await model.invoke(messages)
      
      return NextResponse.json({ 
        content: response.content.toString() 
      })
    } catch (error: any) {
      console.error('Chat API Error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to process chat request' },
        { status: 500 }
      )
    }
    
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
