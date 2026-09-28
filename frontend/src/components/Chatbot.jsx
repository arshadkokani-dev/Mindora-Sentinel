import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import '../styles/chatbot.css'

function Chatbot() {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const startNewChat = () => {
    setMessages([])
    setMessage('')
  }
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef(null)
  const [language, setLanguage] = useState('English')

  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' })
    }
  }, [messages, open])

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

      const response = await fetch(`https://mindora-sentinel-backend.onrender.com/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: trimmedMessage,
          context: messages
            .map((item) => `${item.role}: ${item.content}`)
            .join("\n"),
            language,
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

  const startVoiceInput = () => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition

  if (!SpeechRecognition) {
    alert('Speech recognition is not supported in this browser.')
    return
  }

  if (listening && recognitionRef.current) {
    recognitionRef.current.stop()
    return
  }

  const recognition = new SpeechRecognition()

  recognition.lang =
    language === 'Hindi'
      ? 'hi-IN'
      : language === 'Marathi'
        ? 'mr-IN'
        : 'en-IN'

  recognition.interimResults = false
  recognition.maxAlternatives = 1

  recognition.onstart = () => {
    recognitionRef.current = recognition
    setListening(true)
  }

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript
    setMessage((current) => `${current} ${transcript}`.trim())
  }

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error)
    alert(`Voice input error: ${event.error}`)
    setListening(false)
    recognitionRef.current = null
  }

  recognition.onend = () => {
    setListening(false)
    recognitionRef.current = null
  }

  try {
    recognition.start()
  } catch (error) {
    console.error('Failed to start speech recognition:', error)
    setListening(false)
    recognitionRef.current = null
    alert('Voice input could not start. Please check microphone permission.')
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

              <select
                className="mindora-language-select"
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                aria-label="Chat language"
              >
                <option value="English">English</option>
                <option value="Hindi">हिन्दी</option>
                <option value="Marathi">मराठी</option>
              </select>
            </div>

            <div className="mindora-chat-header-actions">
              <button
                type="button"
                className="mindora-new-chat"
                onClick={startNewChat}
                aria-label="Start new chat"
                title="New chat"
              >
                +
              </button>

              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chatbot"
              >
                ×
              </button>
            </div>
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
                <ReactMarkdown>{item.content}</ReactMarkdown>
              </div>
            ))}

            <div ref={messagesEndRef} />

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

            <button
              type="button"
              onClick={startVoiceInput}
              disabled={loading}
              title={listening ? 'Listening...' : 'Voice input'}
              aria-label={listening ? 'Listening' : 'Voice input'}
            >
              {listening ? '●' : '🎤'}
            </button>

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