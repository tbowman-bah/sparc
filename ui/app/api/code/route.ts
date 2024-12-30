import { NextResponse } from 'next/server'
import { Message, MessageCode } from '../../../lib/messages'
import { FragmentSchema } from '../../../lib/schema'
import { ExecutionResult } from '../../../lib/types'

export async function POST(request: Request) {
  try {
    const { messages } = await request.json()
    
    // Validate messages
    if (!Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages must be an array' },
        { status: 400 }
      )
    }

    // Extract code-related messages
    const codeMessages = messages.filter((message: Message) => 
      message.content.some((content: { type: string }) => content.type === 'code')
    )

    // Process code messages
    const processedMessages = codeMessages.map((message: Message) => {
      const codeContent = message.content.find((content): content is MessageCode => content.type === 'code')
      if (codeContent) {
        return {
          ...message,
          content: [{
            type: 'code',
            text: codeContent.text,
            code: codeContent.code,
            language: codeContent.language,
            preview: {
              title: 'Code Preview',
              description: 'Generated code fragment',
              files: [{
                name: 'generated_code.js',
                content: codeContent.code || codeContent.text || ''
              }]
            }
          } as MessageCode]
        }
      }
      return message
    })

    // Add processing message
    const responseMessages: Message[] = [
      ...processedMessages,
      {
        role: 'assistant',
        content: [{
          type: 'text',
          text: 'Here is the generated code:'
        }]
      }
    ]

    return NextResponse.json({ messages: responseMessages })
  } catch (error) {
    console.error('Error in code route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
