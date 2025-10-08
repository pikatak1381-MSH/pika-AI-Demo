User submits on /chat
     ↓
Optimistic update created
     ↓
Navigate to /chat/new (instant!)
     ↓
Show user message + loading AI response
     ↓
Backend responds with conversation_id=123
     ↓
URL silently updates to /chat/123
     ↓
Real AI response replaces loading state