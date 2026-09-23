import { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, Loader } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../useLanguage'

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || ''

const SYSTEM_PROMPT = `You are a helpful AI assistant for VisionCraft, a computer vision MLOps platform. 

VisionCraft is a desktop app that helps users build computer vision models with an AI agent. Here's what you need to know:

**Core Features:**
- AI Agent with 3 modes: Plan (outlines steps), Execute (does the work), Review (assesses results)
- Runs entirely locally on the user's machine - no cloud lock-in
- Users bring their own API keys (OpenAI, Groq, Gemini, Roboflow, Kaggle, Hugging Face)
- Agent explains what it's doing at every step

**Complete Pipeline:**
1. Dataset Sourcing: Search Roboflow, Kaggle, Hugging Face inside the app
2. Training: Live metrics (loss, mAP) stream in real time, not just exit codes
3. Model Marketplace: Browse pretrained detection/classification/segmentation models
4. Deployment: Export to ONNX, Core ML, TensorRT and push to edge devices
5. Monitoring: Track throughput, latency, drift across your device fleet

**Key Benefits:**
- Everything in one window (no stitching tools together)
- Data never leaves your machine
- Agent proposes fixes when metrics slip
- Compare training runs and roll back to best checkpoint
- Inspect class balance before committing to expensive training

**Availability:**
- macOS available now (early access)
- Windows and Linux coming soon
- Join waitlist to get notified

Be concise, helpful, and enthusiastic. If asked about features not mentioned above, say you don't have that information yet. Always encourage joining the waitlist.`

export default function Chatbot() {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: t.chatbot.greeting,
      isTyping: false
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [typingMessageIndex, setTypingMessageIndex] = useState(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const typingIntervalRef = useRef(null)

  // Update greeting when language changes
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].role === 'assistant') {
        return [{ role: 'assistant', content: t.chatbot.greeting, isTyping: false }]
      }
      return prev
    })
  }, [t.chatbot.greeting])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Cleanup typing interval on unmount
  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current)
      }
    }
  }, [])

  const typeMessage = (fullContent, messageIndex) => {
    let currentIndex = 0
    const typingSpeed = 20 // milliseconds per character (faster = lower number)
    
    // Clear any existing interval
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current)
    }

    typingIntervalRef.current = setInterval(() => {
      if (currentIndex < fullContent.length) {
        currentIndex++
        setMessages(prev => {
          const newMessages = [...prev]
          newMessages[messageIndex] = {
            ...newMessages[messageIndex],
            displayContent: fullContent.slice(0, currentIndex),
            isTyping: true
          }
          return newMessages
        })
        scrollToBottom()
      } else {
        clearInterval(typingIntervalRef.current)
        setMessages(prev => {
          const newMessages = [...prev]
          newMessages[messageIndex] = {
            ...newMessages[messageIndex],
            isTyping: false
          }
          return newMessages
        })
        setTypingMessageIndex(null)
      }
    }, typingSpeed)
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage, isTyping: false }])
    setIsLoading(true)

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'mixtral-8x7b-32768',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages.slice(-6).map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMessage }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      })

      const data = await response.json()
      
      if (data.choices && data.choices[0]) {
        const assistantMessage = data.choices[0].message.content
        
        // Add message with empty displayContent, then start typing
        setMessages(prev => {
          const newMessages = [
            ...prev,
            { 
              role: 'assistant', 
              content: assistantMessage,
              displayContent: '',
              isTyping: true
            }
          ]
          // Start typing animation for the last message
          const lastIndex = newMessages.length - 1
          setTypingMessageIndex(lastIndex)
          setTimeout(() => typeMessage(assistantMessage, lastIndex), 100)
          return newMessages
        })
      } else {
        throw new Error('Invalid response')
      }
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [
        ...prev,
        { 
          role: 'assistant', 
          content: t.chatbot.error,
          isTyping: false
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Floating button */}
      <motion.button
        className="chatbot-trigger"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring' }}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chatbot-window"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="chatbot-header">
              <div className="chatbot-header-content">
                <MessageSquare size={20} />
                <div>
                  <h3>{t.chatbot.title}</h3>
                  <p>{t.chatbot.subtitle}</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="chatbot-messages">
              {messages.map((msg, i) => (
                <div key={i} className={`chatbot-message ${msg.role}`}>
                  <div className="chatbot-message-content">
                    {msg.displayContent !== undefined ? msg.displayContent : msg.content}
                    {msg.isTyping && <span className="typing-cursor">▊</span>}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="chatbot-message assistant">
                  <div className="chatbot-message-content">
                    <Loader size={16} className="chatbot-loader" />
                    <span>{t.chatbot.thinking}</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="chatbot-input-wrapper">
              <input
                ref={inputRef}
                type="text"
                className="chatbot-input"
                placeholder={t.chatbot.inputPlaceholder}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
              <button
                className="chatbot-send"
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
