import { useEffect, useState } from "react";
import useVolunteerStore from "../store/useVolunteerStore";

const Chat = () => {
  const { chatHistory, loadChatHistory, sendChatMessage } = useVolunteerStore();
  const [input, setInput] = useState("");

  useEffect(() => {
    loadChatHistory();
  }, [loadChatHistory]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    await sendChatMessage(input);
    setInput("");
  };

  return (
    <div className="chat-page">
      <div className="chat-history">
        {chatHistory.map((message) => (
          <div
            key={message._id}
            className={`chat-bubble ${message.role === "assistant" ? "assistant" : "user"}`}
          >
            {message.content}
          </div>
        ))}
      </div>
      <form className="chat-input" onSubmit={handleSend}>
        <input
          placeholder="Ask the AI coach anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;

