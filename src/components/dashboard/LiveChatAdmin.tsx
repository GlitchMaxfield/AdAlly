import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { Send, X } from 'lucide-react';

interface Visitor {
  id: string;
  name: string;
  email: string;
  status: string;
  created_at: string;
}

interface Message {
  id: string;
  visitor_id: string;
  sender_type: 'visitor' | 'agent';
  message: string;
  created_at: string;
}

const LiveChatAdmin: React.FC = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadVisitors();
    const interval = setInterval(loadVisitors, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedVisitor) {
      loadMessages(selectedVisitor.id);
      const interval = setInterval(() => loadMessages(selectedVisitor.id), 2000);
      return () => clearInterval(interval);
    }
  }, [selectedVisitor]);

  const loadVisitors = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_visitors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVisitors(data || []);
    } catch (error) {
      console.error('Error loading visitors:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (visitorId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('visitor_id', visitorId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedVisitor) return;

    const message = newMessage;
    setNewMessage('');

    try {
      const { error } = await supabase.from('chat_messages').insert([
        {
          visitor_id: selectedVisitor.id,
          sender_type: 'agent',
          sender_id: (await supabase.auth.getUser()).data.user?.id,
          message: message,
        },
      ]);

      if (error) throw error;
      loadMessages(selectedVisitor.id);
    } catch (error) {
      console.error('Error sending message:', error);
      setNewMessage(message);
    }
  };

  const handleMarkClosed = async (visitorId: string) => {
    try {
      const { error } = await supabase
        .from('chat_visitors')
        .update({ status: 'closed' })
        .eq('id', visitorId);

      if (error) throw error;
      loadVisitors();
      if (selectedVisitor?.id === visitorId) {
        setSelectedVisitor(null);
      }
    } catch (error) {
      console.error('Error closing chat:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
      {/* Visitors List */}
      <div className="border rounded-lg overflow-hidden flex flex-col">
        <div className="bg-black text-white p-4 font-semibold">
          Visitors ({visitors.length})
        </div>
        <div className="flex-1 overflow-y-auto">
          {visitors.length === 0 ? (
            <div className="p-4 text-gray-500 text-center">No visitors yet</div>
          ) : (
            <div className="space-y-1">
              {visitors.map((visitor) => (
                <button
                  key={visitor.id}
                  onClick={() => setSelectedVisitor(visitor)}
                  className={`w-full text-left p-3 border-b transition-colors ${
                    selectedVisitor?.id === visitor.id
                      ? 'bg-black text-white'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="font-semibold text-sm">{visitor.name}</div>
                  <div className="text-xs text-gray-600 truncate">
                    {visitor.email}
                  </div>
                  <div className="text-xs">
                    <span
                      className={`inline-block px-2 py-1 rounded mt-1 ${
                        visitor.status === 'waiting'
                          ? 'bg-yellow-100 text-yellow-800'
                          : visitor.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {visitor.status}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="lg:col-span-2 border rounded-lg flex flex-col">
        {selectedVisitor ? (
          <>
            {/* Header */}
            <div className="bg-black text-white p-4 flex justify-between items-center">
              <div>
                <div className="font-semibold">{selectedVisitor.name}</div>
                <div className="text-sm text-gray-300">{selectedVisitor.email}</div>
              </div>
              <button
                onClick={() => setSelectedVisitor(null)}
                className="hover:bg-gray-700 p-1 rounded transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-gray-500 text-center py-8">
                  No messages yet
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender_type === 'visitor' ? 'justify-start' : 'justify-end'
                    }`}
                  >
                    <div
                      className={`px-3 py-2 rounded-lg max-w-xs ${
                        msg.sender_type === 'visitor'
                          ? 'bg-gray-100 text-gray-900'
                          : 'bg-black text-white'
                      }`}
                    >
                      {msg.sender_type === 'agent' && (
                        <div className="text-xs font-semibold mb-1">You</div>
                      )}
                      <p className="text-sm break-words">{msg.message}</p>
                      <div className="text-xs mt-1 opacity-70">
                        {new Date(msg.created_at).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t p-4 space-y-2">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
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
              <button
                onClick={() => handleMarkClosed(selectedVisitor.id)}
                className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
              >
                Close Chat
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a visitor to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveChatAdmin;
