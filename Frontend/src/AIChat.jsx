import { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  Bot,
  Send,
  Paperclip
} from "lucide-react";

import "./AIChat.css";
import translations from "./translations";

export default function AIChat({
  onBack,
  language = "ENG"
}) {
  const t = translations[language] || translations.ENG;
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [messages, isLoading]);

    const handleSend = () => {
        if (!message.trim()) return;

        const newMessage = {
            id: Date.now(),
            sender: "user",
            text: message
        };

        setMessages((currentMessages) => [
            ...currentMessages,
            newMessage
        ]);

        console.log("Message for backend:", {
            message: message,
            language: language
        });

        setMessage("");
        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    };

    const handleQuickReply = (text) => {
        const newMessage = {
            id: Date.now(),
            sender: "user",
            text: text
        };

        setMessages((currentMessages) => [
            ...currentMessages,
            newMessage
        ]);

        console.log("Quick reply for backend:", {
            message: text,
            language: language
        });

        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    };

  return (
    <div className="ai-chat-page">

      <div className="ai-chat-header">

        <button
          type="button"
          className="ai-back-button"
          onClick={onBack}
        >
          <ChevronLeft size={23} />
        </button>

        <div className="ai-header-info">

          <div className="ai-header-icon">
            <Bot size={22} />
          </div>

          <div>
            <h2>
              MYSafety AI Assistant
            </h2>

            <p>{t.support.aiSubtitle}</p>   
          </div>

        </div>

      </div>


      <div className="ai-chat-messages">
        <div className="chat-message-row ai-message-row">
            <div className="chat-ai-avatar">
                <Bot size={18} />
            </div>

            <div className="chat-bubble ai-bubble">
                {language === "BM"
                ? "Hai! Saya pembantu AI MYSafety."
                : "Hi! I'm the MYSafety AI Assistant."}
            </div>
            </div>

            <div className="chat-message-row ai-message-row">
            <div className="chat-ai-avatar">
                <Bot size={18} />
            </div>

            <div className="chat-bubble ai-bubble">
                {language === "BM"
                ? "Bagaimana saya boleh membantu?"
                : "How can I help?"}
            </div>
            </div>

        {messages.map((item) => (

          <div
            key={item.id}
            className={`chat-message-row ${
              item.sender === "user"
                ? "user-message-row"
                : "ai-message-row"
            }`}
          >

            {item.sender === "ai" && (
              <div className="chat-ai-avatar">
                <Bot size={18} />
              </div>
            )}

            <div
              className={`chat-bubble ${
                item.sender === "user"
                  ? "user-bubble"
                  : "ai-bubble"
              }`}
            >
              {item.text}
            </div>

          </div>

        ))}

        {isLoading && (
            <div className="chat-message-row ai-message-row">

                <div className="chat-ai-avatar">
                <Bot size={18} />
                </div>

                <div className="chat-bubble ai-bubble ai-loading-bubble">
                <span></span>
                <span></span>
                <span></span>
                </div>

            </div>
        )}

        <div ref={messagesEndRef}></div>

      </div>


    <div className="ai-quick-replies">

        <button
            type="button"
            onClick={() =>
            handleQuickReply(
                t.support.robberyQuick
            )
            }
        >
            {t.support.robberyQuick}
        </button>

        <button
            type="button"
            onClick={() =>
            handleQuickReply(
                t.support.reportQuick
            )
            }
        >
            {t.support.reportQuick}
        </button>

        <button
            type="button"
            onClick={() =>
            handleQuickReply(
                t.support.safetyQuick
            )
            }
        >
            {t.support.safetyQuick}
        </button>

    </div>


      <div className="ai-chat-input-area">

        <button
          type="button"
          className="ai-attachment-button"
        >
          <Paperclip size={20} />
        </button>

        <input
          type="text"
          value={message}
          placeholder={t.support.typeMessage}
          onChange={(event) =>
            setMessage(event.target.value)
          }
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSend();
            }
          }}
        />

        <button
          type="button"
          className="ai-send-button"
          onClick={handleSend}
        >
          <Send size={19} />
        </button>

      </div>

    </div>
  );
}