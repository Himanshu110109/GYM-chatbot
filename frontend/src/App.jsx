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
      const res = await fetch("https://gym-chatbot-uu0h.onrender.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });
      if (!res.ok) {
        throw new Error("Request failed");
      }

      const data = await res.json();

      const botMessage = { role: "bot", content: data.answer };
      setMessages((prev) => [...prev, botMessage]);
    } catch {
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
    <div className="h-screen w-full bg-gradient-to-br from-zinc-950 via-black to-zinc-900 text-white flex items-center justify-center px-2 sm:px-4">
      
      <div className="
        w-full 
        max-w-2xl 
        h-full sm:h-[90vh] 
        bg-zinc-900/60 
        backdrop-blur-xl 
        border border-zinc-800 
        rounded-none sm:rounded-2xl 
        shadow-2xl 
        flex flex-col 
        overflow-hidden
      ">

        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-xs sm:text-sm">
              AI
            </div>
            <div>
              <h1 className="text-sm sm:text-lg font-semibold">
                Anytime Fitness
              </h1>
              <p className="text-[10px] sm:text-xs text-zinc-400">
                Made by Himanshu
              </p>
            </div>
          </div>

          <span className="flex items-center gap-1 text-[10px] sm:text-xs text-zinc-400">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Online
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-5">

          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "bot" && (
                  <div className="mr-2 sm:mr-3 w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-[10px] sm:text-xs font-bold">
                    AI
                  </div>
                )}

                <div
                  className={`
                    px-3 sm:px-4 py-2 sm:py-3 
                    rounded-xl 
                    max-w-[85%] sm:max-w-[70%] 
                    text-xs sm:text-sm 
                    leading-relaxed 
                    ${
                      msg.role === "user"
                        ? "bg-blue-600"
                        : "bg-zinc-800 text-zinc-200"
                    }
                  `}
                >
                  {msg.content}
                </div>

                {msg.role === "user" && (
                  <div className="ml-2 sm:ml-3 w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-zinc-700 flex items-center justify-center text-[10px] sm:text-xs font-bold">
                    U
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing */}
          {loading && (
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold">
                AI
              </div>

              <div className="bg-zinc-800 px-3 sm:px-4 py-2 sm:py-3 rounded-xl flex gap-1">
                <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce delay-150"></span>
                <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce delay-300"></span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        <div className="border-t border-zinc-800 p-2 sm:p-4 flex gap-2 sm:gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask about services..."
            className="flex-1 bg-zinc-800 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={sendMessage}
            className="px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-xs sm:text-sm"
          >
            Send
          </button>
        </div>

      </div>
    </div>
  );
}
