import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, AlertCircle, X } from 'lucide-react';
import { askChatbot } from '../../services/api';
import GlassCard from '../ui/GlassCard';

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
      {isOpen && (
        <GlassCard className="flex flex-col h-[450px] sm:h-[540px] w-[calc(100vw-3rem)] sm:w-[360px] border-brand-gray/20 shadow-2xl bg-white/70 overflow-hidden animate-in zoom-in-95 fade-in duration-200 pointer-events-auto origin-bottom-right">

          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-brand-gray/10 bg-brand-navy text-white rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Bot size={20} className="text-brand-orange" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Fact-Check Assistant</h3>
                <p className="text-xs text-white/70">Context-Aware AI</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {!evidenceData ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-slate-50/50">
              <Bot size={48} className="text-brand-gray/30 mb-4" />
              <h3 className="text-lg font-semibold text-brand-navy mb-2">AI Chatbot Assistant</h3>
              <p className="text-sm text-brand-gray">
                Analyze an article first to chat about the evidence and findings!
              </p>
            </div>
          ) : (
            <>
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <div className={`shrink-0 p-2 rounded-full flex items-center justify-center shadow-sm ${msg.role === 'user' ? 'bg-brand-emerald text-white' : 'bg-white text-brand-navy border border-brand-gray/10'}`}>
                      {msg.role === 'user' ? <User size={16} /> : <Bot size={16} className="text-brand-orange" />}
                    </div>

                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${msg.role === 'user'
                        ? 'bg-brand-emerald text-white rounded-tr-sm'
                        : 'bg-white text-brand-navy border border-brand-gray/10 rounded-tl-sm'
                      }`}>
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 p-2 rounded-full bg-white text-brand-navy border border-brand-gray/10 shadow-sm">
                      <Bot size={16} className="text-brand-orange" />
                    </div>
                    <div className="bg-white border border-brand-gray/10 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-2 text-brand-gray">
                      <Loader2 size={16} className="animate-spin text-brand-orange" />
                      <span className="text-xs font-medium">Thinking...</span>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="flex items-center gap-2 p-3 text-xs text-red-600 bg-red-50 rounded-xl border border-red-100">
                    <AlertCircle size={14} />
                    <p>{error}</p>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white/80 border-t border-brand-gray/10 backdrop-blur-sm">
                <form onSubmit={handleSend} className="relative flex items-center">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about the evidence..."
                    disabled={isLoading}
                    className="w-full bg-slate-50 border border-brand-gray/20 rounded-full py-3 pl-4 pr-12 text-sm text-brand-navy placeholder-brand-gray focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 transition-all disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="absolute right-2 p-2 rounded-full bg-brand-navy text-white hover:bg-brand-orange transition-colors disabled:opacity-50 disabled:hover:bg-brand-navy shadow-sm"
                  >
                    <Send size={16} />
                  </button>
                </form>
              </div>
            </>
          )}
        </GlassCard>
      )}

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`pointer-events-auto relative flex items-center justify-center w-20 h-20 bg-brand-navy text-white rounded-full shadow-xl hover:bg-[#1a2333] hover:scale-105 transition-all z-[110]
          ${isAnimating ? 'animate-[spin_1s_ease-in-out_1]' : ''}
        `}
      >
        {isAnimating && (
          <span className="absolute inset-0 rounded-full border-4 border-brand-orange animate-ping opacity-75"></span>
        )}
        
        {isOpen ? (
          <X size={36} className="animate-in zoom-in duration-200" />
        ) : (
          <Bot size={36} className={`animate-in zoom-in duration-200 ${isAnimating ? 'text-brand-orange' : ''}`} />
        )}
        
        {!isOpen && evidenceData && !isAnimating && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-brand-orange border-2 border-white rounded-full animate-in zoom-in"></span>
        )}
      </button>
    </div>
  );
};

export default Chatbot;
