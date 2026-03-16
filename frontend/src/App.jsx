import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatbotUI() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    const question = input;
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://b548-2409-40d2-69-4faf-2656-f67a-c175-db5d.ngrok-free.app/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();

      const botMessage = { role: "bot", content: data.answer };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Server error. Please try again." },
      ]);
    }

    setLoading(false);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="h-screen w-full bg-gradient-to-br from-zinc-950 via-black to-zinc-900 text-white flex items-center justify-center">
      <div className="w-full max-w-2xl h-[90vh] backdrop-blur-xl bg-zinc-900/60 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold">
              AI
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-wide">Anytime Fitness Assistant</h1>
              <p className="text-xs text-zinc-400">Made by Himanshu</p>
            </div>
          </div>

          <div className="text-xs text-zinc-400">
            <span className="inline-flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Online
            </span>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >

                {msg.role === "bot" && (
                  <div className="mr-3 w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold">
                    AI
                  </div>
                )}

                <div
                  className={`px-4 py-3 rounded-xl max-w-[70%] text-sm leading-relaxed shadow-md ${
                    msg.role === "user"
                      ? "bg-blue-600"
                      : "bg-zinc-800 text-zinc-200"
                  }`}
                >
                  {msg.content}
                </div>

                {msg.role === "user" && (
                  <div className="ml-3 w-8 h-8 rounded-lg bg-zinc-700 flex items-center justify-center text-xs font-bold">
                    U
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* typing indicator */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold">
                AI
              </div>

              <div className="bg-zinc-800 px-4 py-3 rounded-xl flex gap-1">
                <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce delay-150"></span>
                <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce delay-300"></span>
              </div>
            </motion.div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-zinc-800 p-4 flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask about services, pricing, membership..."
            className="flex-1 bg-zinc-800/80 backdrop-blur rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />

          <button
            onClick={sendMessage}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:opacity-90 transition text-sm font-medium"
          >
            Send
          </button>
        </div>

      </div>
    </div>
  );
}
