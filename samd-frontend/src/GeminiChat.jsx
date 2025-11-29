import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function GeminiChat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello — I’m your Farming Assistant. Ask me about crops, soil, irrigation, pests, or weather.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  const API_KEY = import.meta.env.VITE_GROQ_API_KEY;
  console.log("Using Groq API Key:", API_KEY);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ---- SEND MESSAGE FUNCTION ----
  const sendMessage = async () => {
  const text = input.trim();
  if (!text || loading) return;

  setMessages((prev) => [...prev, { role: "user", content: text }]);
  setInput("");
  setLoading(true);

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "You are a farming assistant AI." },
          { role: "user", content: text }
        ],
        temperature: 0.7,
        max_tokens: 500
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Raw Error:", errorText);
      throw new Error("API error: " + response.status);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "No reply.";

    setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
  } catch (err) {
    console.error(err);
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "⚠ AI could not generate a response." }
    ]);
  }

  setLoading(false);
};


  // ---- ENTER SUBMIT ----
  const onKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-[80vh] bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-6">
        <div className="card overflow-hidden rounded-xl shadow bg-white">
          
          {/* Header */}
          <div className="px-6 py-4 border-b bg-white">
            <div className="font-semibold text-lg">Gemini AI Assistant</div>
            <div className="text-xs text-gray-500">
              Ask farming questions — powered by Llama3 (Groq API)
            </div>
          </div>

          {/* Messages */}
          <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4 bg-white">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`max-w-[70%] px-4 py-3 rounded-2xl whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-[var(--accent)] text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {m.content}
                </motion.div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-3 rounded-2xl flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
                </div>
              </div>
            )}

            <div ref={endRef} />
          </div>

          {/* Input Box */}
          <div className="px-6 py-4 bg-white border-t">
            <div className="flex gap-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={onKeyPress}
                rows={1}
                placeholder="Ask about soil, pests, diseases, irrigation..."
                className="flex-1 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--accent)] outline-none resize-none"
              />

              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="px-5 py-2 bg-[var(--accent)] text-white rounded-lg shadow font-semibold disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
