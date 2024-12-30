import { CommandHandler } from './types'

export const test: CommandHandler = async (args: string, submit, context) => {
  // Ensure skipAI is false
  const newContext = {
    ...context,
    config: {
      ...context.config,
      skipAI: false,
    },
  }

  // Add user message
  submit({
    messages: [{
      role: 'user',
      content: [{ type: 'text', text: `/test ${args}` }]
    }],
    userID: context.userID,
    model: context.model,
    template: context.template,
    config: newContext.config,
    clearInput: true
  })

  // Show loading state
  submit({
    messages: [{
      role: 'assistant',
      content: [{
        type: 'text',
        text: 'Generating hello world example...',
        icon: 'Code'
      }],
      loading: true
    }],
    userID: context.userID,
    model: context.model,
    template: context.template,
    config: newContext.config
  })

  // Simulate AI response with hello world example
  const helloWorld = {
    commentary: "Creating a simple Hello World web application using Next.js",
    template: "nextjs-developer",
    title: "Hello World",
    description: "Basic Next.js hello world page",
    additional_dependencies: [],
    has_additional_dependencies: false,
    install_dependencies_command: "",
    port: 3000,
    code: [{
      file_name: "page.tsx",
      file_path: "app/page.tsx",
      file_content: `export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Hello World!</h1>
    </main>
  )
}`,
      file_finished: true
    }]
  }

  // Submit the response
  submit({
    messages: [{
      role: 'assistant',
      content: [
        { type: 'text', text: helloWorld.commentary },
        { type: 'code', text: helloWorld.code[0].file_content }
      ],
      object: helloWorld
    }],
    userID: context.userID,
    model: context.model,
    template: context.template,
    config: newContext.config
  })

  return true
}
