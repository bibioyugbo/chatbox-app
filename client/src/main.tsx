import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import './index.css'

import ChatBox from './ChatBox.tsx'

// ✅ Initialize session cookie on app start
function initSession() {
    if (!document.cookie.includes("sessionId")) {
        const sessionId = crypto.randomUUID()
        document.cookie = `sessionId=${sessionId}; path=/; max-age=31536000; SameSite=Lax`
        // SameSite=Lax is good default, prevents CSRF issues in prod
        console.log("New session created:", sessionId)
    } else {
        console.log("Existing session:", document.cookie)
    }
}

initSession() // <-- call it before rendering React app

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ChatBox />
    </StrictMode>,
)
