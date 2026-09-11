import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, AlertCircle, X } from 'lucide-react';
import { askChatbot } from '../../services/api';
import GlassCard from '../ui/GlassCard';
import { motion, AnimatePresence } from 'framer-motion';

const Chatbot = ({ evidenceData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', content: "Hi there! I'm the AI Assistant. Ask me any questions about the article analysis above." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (evidenceData) {
      setIsOpen(true);
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [evidenceData]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isLoading, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    if (!evidenceData) return;

    const userMessage = input.trim();
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const historyToSend = messages.filter((msg, index) => index > 0);
      const response = await askChatbot(historyToSend, userMessage, evidenceData, 'gemma-4-31b-it');
      setMessages([...newMessages, { role: 'model', content: response.response }]);
    } catch (err) {
      console.error("Chat error:", err);
      setError(err.message || "Failed to get response from AI assistant.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4 pointer-events-none">

      {/* Expandable Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="flex flex-col h-[450px] sm:h-[540px] w-[calc(100vw-3rem)] sm:w-[360px] border-[var(--border-color)] shadow-2xl bg-[var(--surface-elevated)] overflow-hidden pointer-events-auto rounded-2xl border"
            style={{ backdropFilter: 'blur(24px)' }}
          >

            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)] bg-[var(--surface)] text-[var(--text-primary)] rounded-t-2xl z-10 relative">
              <div className="flex items-center gap-3">
                <div className="bg-[var(--accent-soft)] p-2 rounded-full shadow-inner">
                  <Bot size={20} className="text-[var(--accent)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Fact-Check Assistant</h3>
                  <p className="text-xs text-[var(--text-secondary)]">Context-Aware AI</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-[var(--text-primary)]/10 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {!evidenceData ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-transparent">
                <Bot size={48} className="text-[var(--text-muted)] mb-4" />
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">AI Chatbot Assistant</h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Analyze an article first to chat about the evidence and findings!
                </p>
              </div>
            ) : (
              <>
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-transparent custom-scrollbar">
                  <AnimatePresence initial={false}>
                    {messages.map((msg, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        <div className={`shrink-0 p-2 rounded-full flex items-center justify-center shadow-sm ${msg.role === 'user' ? 'bg-[var(--accent)] text-white' : 'bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border-color)]'}`}>
                          {msg.role === 'user' ? <User size={16} /> : <Bot size={16} className="text-[var(--accent)]" />}
                        </div>

                        <div className={`max-w-[80%] px-4 py-3 text-sm shadow-sm ${msg.role === 'user'
                            ? 'bg-[var(--accent)] text-white rounded-2xl rounded-tr-sm'
                            : 'bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-2xl rounded-tl-sm'
                          }`}>
                          <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                        </div>
                      </motion.div>
                    ))}

                    {isLoading && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-3"
                      >
                        <div className="shrink-0 p-2 rounded-full bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border-color)] shadow-sm">
                          <Bot size={16} className="text-[var(--accent)]" />
                        </div>
                        <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-2 text-[var(--text-secondary)]">
                          <Loader2 size={16} className="animate-spin text-[var(--accent)]" />
                          <span className="text-xs font-medium">Thinking...</span>
                        </div>
                      </motion.div>
                    )}

                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 p-3 text-xs text-[var(--danger)] bg-[var(--danger-soft)] rounded-xl border border-[var(--danger)]/20"
                      >
                        <AlertCircle size={14} />
                        <p>{error}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-[var(--surface-elevated)] border-t border-[var(--border-color)] backdrop-blur-md relative z-10">
                  <form onSubmit={handleSend} className="relative flex items-center">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask about the evidence..."
                      disabled={isLoading}
                      className="w-full bg-[var(--surface)] border border-[var(--border-color)] rounded-full py-3 pl-4 pr-12 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/20 transition-all disabled:opacity-50 shadow-sm"
                    />
                    <motion.button
                      type="submit"
                      disabled={isLoading || !input.trim()}
                      whileTap={{ scale: 0.9 }}
                      className="absolute right-2 p-2 rounded-full bg-[var(--accent)] text-white hover:opacity-90 transition-opacity disabled:opacity-50 shadow-sm"
                    >
                      <Send size={16} />
                    </motion.button>
                  </form>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`pointer-events-auto relative flex items-center justify-center w-20 h-20 bg-[var(--accent)] text-white rounded-full shadow-xl hover:opacity-90 hover:scale-105 transition-all z-[110]
          ${isAnimating ? 'animate-[spin_1s_ease-in-out_1]' : ''}
        `}
      >
        {isAnimating && (
          <span className="absolute inset-0 rounded-full border-4 border-[var(--border-color)] animate-ping opacity-75"></span>
        )}
        
        {isOpen ? (
          <X size={36} className="animate-in zoom-in duration-200" />
        ) : (
          <Bot size={36} className={`animate-in zoom-in duration-200 ${isAnimating ? 'text-[var(--text-primary)]' : ''}`} />
        )}
        
        {!isOpen && evidenceData && !isAnimating && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-[var(--success)] border-2 border-[var(--border-color)] rounded-full animate-in zoom-in"></span>
        )}
      </button>
    </div>
  );
};

export default Chatbot;
