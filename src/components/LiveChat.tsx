import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Message {
  id: string;
  message: string;
  sender_type: 'visitor' | 'agent';
  created_at: string;
}

const LiveChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInitializeChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setLoading(true);
    try {
      const { data: visitor, error } = await supabase
        .from('chat_visitors')
        .insert([
          {
            name: name.trim(),
            email: email.trim(),
            status: 'waiting',
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setVisitorId(visitor.id);
      setIsInitialized(true);

      // Subscribe to messages for this visitor
      const subscription = supabase
        .channel(`chat:${visitor.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'chat_messages',
            filter: `visitor_id=eq.${visitor.id}`,
          },
          (payload) => {
            setMessages((prev) => [...prev, payload.new as Message]);
          }
        )
        .subscribe();

      // Load existing messages
      const { data: existingMessages } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('visitor_id', visitor.id)
        .order('created_at', { ascending: true });

      if (existingMessages) {
        setMessages(existingMessages);
      }

      return () => {
        subscription.unsubscribe();
      };
    } catch (error) {
      console.error('Error initializing chat:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !visitorId) return;

    const userMessage = message;
    setMessage('');

    try {
      const { error } = await supabase.from('chat_messages').insert([
        {
          visitor_id: visitorId,
          sender_type: 'visitor',
          message: userMessage,
        },
      ]);

      if (error) throw error;
    } catch (error) {
      console.error('Error sending message:', error);
      setMessage(userMessage);
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 bg-black text-white rounded-full p-4 shadow-lg hover:bg-gray-800 transition-all duration-300 z-40 flex items-center gap-2"
        >
          <MessageCircle size={24} />
          <span className="text-sm font-semibold">Chat with us</span>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-2xl z-50 flex flex-col max-h-[600px]">
          {/* Header */}
          <div className="bg-black text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">Live Chat</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-gray-700 p-1 rounded transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Chat Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {!isInitialized ? (
              <form onSubmit={handleInitializeChat} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Starting chat...' : 'Start Chat'}
                </button>
              </form>
            ) : (
              <>
                <div className="text-xs text-gray-500 text-center py-2">
                  Connected as {name}
                </div>
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.sender_type === 'visitor' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`px-3 py-2 rounded-lg max-w-xs ${
                          msg.sender_type === 'visitor'
                            ? 'bg-black text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        {msg.sender_type === 'agent' && (
                          <div className="text-xs font-semibold text-gray-500 mb-1">
                            Agent
                          </div>
                        )}
                        <p className="text-sm break-words">{msg.message}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </>
            )}
          </div>

          {/* Message Input */}
          {isInitialized && (
            <form onSubmit={handleSendMessage} className="border-t p-4 flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
              />
              <button
                type="submit"
                className="bg-black text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Send size={18} />
              </button>
            </form>
          )}
        </div>
      )}
    </>
  );
};

export default LiveChat;
