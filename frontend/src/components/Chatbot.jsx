import { useState } from 'react'
import '../styles/chatbot.css'

function Chatbot() {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const sendMessage = async (event) => {
    event.preventDefault()

    const trimmedMessage = message.trim()

    if (!trimmedMessage || loading) return

    setMessages((current) => [
      ...current,
      { role: 'user', content: trimmedMessage },
    ])

    setMessage('')
    setLoading(true)

    try {
      const token = localStorage.getItem('token')

      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: trimmedMessage,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Unable to get AI response.')
      }

      setMessages((current) => [
        ...current,
        { role: 'assistant', content: data.reply },
      ])
    } catch (error) {
      console.error('Chatbot error:', error)

      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content:
            'I’m unable to respond right now. Please try again in a moment.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mindora-chatbot">
      {open && (
        <section className="mindora-chat-window">
          <header className="mindora-chat-header">
            <div>
              <strong>Mindora Assistant</strong>
              <span>AI-powered support</span>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chatbot"
            >
              ×
            </button>
          </header>

          <div className="mindora-chat-messages">
            {messages.length === 0 && (
              <div className="mindora-chat-welcome">
                <strong>How can I help?</strong>
                <p>
                  You can talk to me about how you're feeling, ask questions,
                  or discuss something that is troubling you.
                </p>
              </div>
            )}

            {messages.map((item, index) => (
              <div
                key={index}
                className={`mindora-chat-message ${item.role}`}
              >
                {item.content}
              </div>
            ))}

            {loading && (
              <div className="mindora-chat-message assistant">
                Thinking...
              </div>
            )}
          </div>

          <form className="mindora-chat-input" onSubmit={sendMessage}>
            <input
              type="text"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Type a message..."
              disabled={loading}
            />

            <button type="submit" disabled={loading || !message.trim()}>
              Send
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        className="mindora-chat-button"
        onClick={() => setOpen((current) => !current)}
        aria-label="Open Mindora Assistant"
      >
        {open ? '×' : '💬'}
      </button>
    </div>
  )
}

export default Chatbot