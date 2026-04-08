import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import Modal from "../components/Modal";
import Loader from "../components/Loader";
import "../styles/chat.css";

function ChatPage() {
  const { taskId } = useParams();
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const chatEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await API.get(`/messages/${taskId}`);
        setMessages(res.data);
      } catch {
        setModal({ msg: "Error loading chat", type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [taskId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!msg.trim()) return;

    try {
      await API.post("/messages", {
        taskId,
        message: msg
      });

      setMsg("");
    } catch {
      setModal({ msg: "Failed to send message", type: "error" });
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  if (loading) return <Loader text="Loading chat..." />;

  return (
    <div className="chat-container">
      <h2>💬 Task Chat</h2>

      <div className="chat-box">
        {messages.map((m) => (
          <div
            key={m._id}
            className={`message ${
              m.senderId?._id === user._id ? "own" : ""
            }`}
          >
            <p>
              <b>{m.senderId?.name}:</b> {m.message}
            </p>
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </div>

      <div className="chat-input">
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Type a message..."
        />

        <button className="btn" onClick={sendMessage}>
          Send
        </button>
      </div>

      {modal && (
        <Modal
          message={modal.msg}
          type={modal.type}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

export default ChatPage;