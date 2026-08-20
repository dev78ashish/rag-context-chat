import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import useSession from '../store/session';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ChatScreen: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { sessionToken } = useSession();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async () => {
    if (!input.trim() || loading) return;

    const question = input.trim();
    setMessages((prev) => [...prev, { role: 'user', content: question }]);
    setInput('');

    try {
      setLoading(true);

      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
      const response = await axios.post(`${apiBaseUrl}/query-context`,
        {
          question,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionToken}`
          }
        }
      );

      const answer =
        response.data?.answer ?? response.data?.message ?? JSON.stringify(response.data);

      setMessages((prev) => [...prev, { role: 'assistant', content: answer }]);
    } catch (error) {
      console.error('API error:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-100">
      {/* Left panel — responses */}
      <div className="flex h-full w-2/3 flex-col border-r border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-4">
          <h1 className="text-lg font-semibold text-gray-900">Conversation</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">
              Responses will appear here once you ask something.
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                      }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="max-w-[75%] rounded-2xl bg-gray-100 px-4 py-3 text-sm text-gray-400">
                    Thinking…
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>
      </div>

      {/* Right panel — input */}
      <div className="flex h-full w-1/3 flex-col bg-gray-50">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Ask a question</h2>
          <p className="mt-1 text-sm text-gray-500">
            Type your question and press Enter or Submit.
          </p>
        </div>

        <div className="flex flex-1 flex-col justify-end p-6">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your input..."
            rows={8}
            className="w-full resize-none rounded-xl border border-gray-300 p-4 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <button
            onClick={handleSubmit}
            disabled={loading || !input.trim()}
            className="mt-4 w-full rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;