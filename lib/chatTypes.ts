export type Conversation = {
  conversation_id: number
  user_id: string
  created_at: string
  updated_at: string
  input_messages?: Message[]
  answers?: Answer[]
}

export type Message = {
  id?: number
  conversation_id: number
  role: "user" | "assistant"
  content: string
  created_at?: string
  tempId?: string // local ephemeral messages
}

export type Answer = {
  answer_id: number
  conversation_id: number
  intro_answer: string
  summary_answer: string
  context: string
}