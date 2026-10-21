import { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  Bot,
  Send,
  Paperclip
} from "lucide-react";

import "./AIChat.css";
import translations from "./translations";
import ReactMarkdown from "react-markdown";

export default function AIChat({
  onBack,
  language = "ENG"
}) {
    const t = translations[language] || translations.ENG;
  const isBM = language === "BM";

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const messagesEndRef = useRef(null);
  const sendingRef = useRef(false);

  const apiBase = (
    import.meta.env.VITE_API_BASE_URL ||
    "http://127.0.0.1:5001"
  ).replace(/\/$/, "");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages, isLoading, error]);

  const sendMessage = async (text, clearInput = false) => {
    const trimmedText = text.trim();

    if (!trimmedText || sendingRef.current) return;

    if (trimmedText.length > 4000) {
      setError(
        isBM
          ? "Mesej mesti kurang daripada atau sama dengan 4000 aksara."
          : "Messages must not exceed 4000 characters."
      );
      return;
    }

    // Send recent conversation only.
    // Do not include the new message twice.
    const history = messages.slice(-8).map((item) => ({
      role: item.sender === "user" ? "user" : "assistant",
      content: item.text.slice(0, 4000)
    }));

    let contextLength = history.reduce(
      (total, item) => total + item.content.length,
      trimmedText.length
    );

    while (contextLength > 16000 && history.length) {
      contextLength -= history.shift().content.length;
    }

    const userMessageId = crypto.randomUUID();

    sendingRef.current = true;
    setIsLoading(true);
    setError("");

    setMessages((current) => [
      ...current,
      {
        id: userMessageId,
        sender: "user",
        text: trimmedText
      }
    ]);

    if (clearInput) {
      setMessage("");
    }

    const controller = new AbortController();

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 90000);

    try {
      const response = await fetch(`${apiBase}/api/chatbot`, {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: trimmedText,
          history
        })
      });

      const data = await response.json();

      if (
        !response.ok ||
        !data.success ||
        typeof data.reply !== "string" ||
        !data.reply.trim()
      ) {
        const requestError = new Error("Chat request failed");
        requestError.status = response.status;
        throw requestError;
      }

      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          sender: "ai",
          text: data.reply.trim()
        }
      ]);
    } catch (requestError) {
      // Remove the failed message from conversation history.
      setMessages((current) =>
        current.filter((item) => item.id !== userMessageId)
      );

      if (clearInput) {
        setMessage(trimmedText);
      }

      if (requestError.name === "AbortError") {
        setError(
          isBM
            ? "Jawapan mengambil masa terlalu lama. Sila cuba lagi."
            : "The reply took too long. Please try again."
        );
      } else if (requestError.status === 429) {
        setError(
          isBM
            ? "Had penggunaan pembantu AI telah dicapai. Cuba lagi kemudian."
            : "The AI assistant has reached its usage limit. Please try again later."
        );
      } else {
        setError(
          isBM
            ? "Mesej tidak dapat dihantar. Sila cuba lagi."
            : "Your message could not be sent. Please try again."
        );
      }
    } finally {
      clearTimeout(timeoutId);
      sendingRef.current = false;
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    void sendMessage(message, true);
  };

  const handleQuickReply = (text) => {
    void sendMessage(text);
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
      <p
        role="note"
        style={{
          margin: "8px 16px",
          fontSize: "12px",
          color: "#555"
        }}
      >
        {isBM
          ? "Demo pembangunan: gunakan mesej rekaan sahaja. Mesej dihantar kepada Gemini."
          : "Development demo: use fictional messages only. Messages are sent to Gemini."}
      </p>

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
              {item.sender === "ai" ? (
                <ReactMarkdown
                  skipHtml
                  allowedElements={[
                    "p",
                    "strong",
                    "em",
                    "ul",
                    "ol",
                    "li",
                    "br",
                    "blockquote"
                  ]}
                  unwrapDisallowed
                >
                  {item.text}
                </ReactMarkdown>
              ) : (
                <span className="chat-user-text">
                  {item.text}
                </span>
              )}
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
                {error && (
          <div
            role="alert"
            style={{
              color: "#b42318",
              padding: "12px",
              fontSize: "14px"
            }}
          >
            {error}
          </div>
        )}
        <div ref={messagesEndRef}></div>

      </div>


    <div className="ai-quick-replies">

        <button
            type="button"
            disabled={isLoading}
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
            disabled={isLoading}
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
            disabled={isLoading}
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
          disabled
          title={
            isBM
              ? "Lampiran belum tersedia"
              : "Attachments are not available yet"
          }
        >
          <Paperclip size={20} />
        </button>

        <input
          type="text"
          value={message}
          maxLength={4000}
          disabled={isLoading}
          placeholder={t.support.typeMessage}
          onChange={(event) =>
            setMessage(event.target.value)
          }
          onKeyDown={(event) => {
            if (
              event.key === "Enter" &&
              !event.nativeEvent.isComposing
            ) {
              event.preventDefault();
              handleSend();
            }
          }}
        />

        <button
          type="button"
          className="ai-send-button"
          onClick={handleSend}
          disabled={isLoading || !message.trim()}
          aria-label={isBM ? "Hantar mesej" : "Send message"}
        >
          <Send size={19} />
        </button>

      </div>

    </div>
  );
}