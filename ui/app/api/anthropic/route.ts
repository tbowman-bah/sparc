import { NextResponse } from 'next/server'
import { ChatAnthropic } from '@langchain/anthropic'
import { HumanMessage, SystemMessage } from '@langchain/core/messages'

export async function POST(req: Request) {
  try {
    const { prompt, modelName } = await req.json()
    
    const model = new ChatAnthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
      modelName: modelName || 'claude-3-sonnet-20240229'
    })

    const messages = [
      new SystemMessage(`You are a research assistant. Analyze the provided topic and generate a comprehensive research report.`),
      new HumanMessage(prompt)
    ]

    const response = await model.invoke(messages)
    
    return NextResponse.json({ 
      content: response.content.toString() 
    })
    
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
