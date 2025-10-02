/* Login Types */
export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  user_id: string
  email: string
  preferred_name: string
  session_token: string
  expires_at: string
}

/* Invoice Types */
export interface InvoiceHeaderTypes {
  proformaInvoiceNumber: string
  date: string
}

export interface InvoiceFooterTypes {
  totalDiscount: number
  totalAfterDiscount: number
  invoiceTax: number
  grandTotal: number
}

export interface SaleAgentInfo {
  sale_agent_id: string
  sale_agent_name: string
  registration_number?: string
  address: string
  phone_number: string
  postal_code: string
  tax_number: string
  national_id: string
}

export interface ClientInfo {
  client_id: string
  client_name: string
  registration_number?: string
  delivery_address: string
  phone_number: string
  mobile_number?: string
  postal_code: string
  tax_number?: string
  national_id?: string
}

export interface ProformalInvoice {
  invoice_id?: string
  header: InvoiceHeaderTypes
  products: ProductOffer[]
  saleAgent: SaleAgentInfo
  client: ClientInfo
  footer: InvoiceFooterTypes
}

// Editable product row inside invoice
export interface InvoiceProduct extends ProductOffer {
  amount: number
}

export interface InvoicePayload {
  conversation_id: number
  saleAgent: SaleAgentInfo
  client: ClientInfo
  products: InvoiceProduct[]
}

export interface InvoiceResponse {
  invoiceId: string
  created_at: string
  conversation_id: number
  saleAgent: SaleAgentInfo
  client: ClientInfo
  products: InvoiceProduct[]
  total: number
  totalAfterDiscount: number
}

/* Message Types */
export type ChatMessageType =
  | { id: string | number; role: "user";  content: string;  }
  | { id: string | number; role: "system"; content: string;  }
  | { 
      id: string | number
      role: "ai"
      content: ChatbotResponse
      is_locked?: boolean
      selectedProducts?: ChatbotResponse["offered_product_answer"][number]["offers"]
    }

export interface ChatbotResponse {
  context: string
  answer_id: number
  available_flow_id: number
  input_message_id: number
  conversation_id: number
  intro_answer: string
  input_type: "text" | "image"
  is_success: true
  created_at: string
  offered_product_answer: ProductCategory[]
  summary_answer: string
  is_locked: boolean
}

export interface ProductCategory {
  category: string
  offers: ProductOffer[]
}

export interface ProductOffer {
  id: string
  name: string
  original_price: number
  final_price: number
  discount: number
  quantity: number
  specifications: ProductSpecifications[]
  url?: string
  pictures?: string[]
}

export interface ProductSpecifications {
  Value: string
  AttributeName: string
}

export interface SelectedSpecifications extends ProductSpecifications {
  productId: string
}

export interface ConversationMessagesResponse {
  messages: ChatMessageType[]
}

export interface MessageInputResponse {
  message: ChatMessageType
}