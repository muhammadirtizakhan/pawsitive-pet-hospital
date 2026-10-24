'use client';

import { useEffect, useState } from 'react';

export default function FloatingIcons() {
  const [chatReady, setChatReady] = useState(false);

  useEffect(() => {
    const isReady = () =>
      typeof window.openChatbot === 'function' &&
      typeof window.closeChatbot === 'function' &&
      typeof window.sendChatMessage === 'function';

    if (isReady()) {
      setChatReady(true);
      return;
    }

    const timer = window.setInterval(() => {
      if (isReady()) {
        setChatReady(true);
        window.clearInterval(timer);
      }
    }, 200);

    return () => window.clearInterval(timer);
  }, []);

  function openChat() {
    if (typeof window.openChatbot === 'function') {
      window.openChatbot();
    }
  }

  return (
    <div className="floating-icons">
      <a
        href="https://wa.me/923343601699"
        target="_blank"
        rel="noopener noreferrer"
        className="float-icon whatsapp"
        aria-label="Chat on WhatsApp"
      >
        <i className="fa-brands fa-whatsapp"></i>
        <span className="float-tooltip">
          Chat on WhatsApp
        </span>
      </a>

      <button
        type="button"
        className="float-icon chatbot"
        onClick={openChat}
        disabled={!chatReady}
        aria-busy={!chatReady}
        aria-label={
          chatReady ? 'Chat with AI' : 'Chat is loading'
        }
        style={{
          opacity: chatReady ? 1 : 0.6,
          cursor: chatReady ? 'pointer' : 'wait'
        }}
      >
        <i className="fa-solid fa-robot"></i>
        <span className="float-tooltip">
          {chatReady ? 'Chat with AI' : 'Loading chat…'}
        </span>
      </button>
    </div>
  );
}
