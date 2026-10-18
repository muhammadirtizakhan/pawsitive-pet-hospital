'use client';

export default function Chatbot() {
  return (
    <div className="chatbot-modal" id="chatbotModal">
      <div className="chatbot-header">
        <div className="chatbot-title">
          <i className="fa-solid fa-paw"></i>
          Pawsitive Assistant
        </div>
        <button className="chatbot-close" onClick={() => window.closeChatbot()}>
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div className="chatbot-body" id="chatbotBody">
        <div className="chat-message bot">
          <div className="chat-avatar">
            <i className="fa-solid fa-paw"></i>
          </div>
          <div className="chat-bubble">
            <p>
              Hi! 👋 I'm here to help with anything about Pawsitive Clinic — services, shop, or your order.
              What can I help you with?
            </p>{' '}
            <span className="chat-time" id="chatbotWelcomeTime"></span>
          </div>
        </div>
      </div>
      <div className="chatbot-footer">
        <input
          type="text"
          id="chatbotInput"
          placeholder="Type your message..."
          onKeyPress={(e) => {
            const event = e.nativeEvent;
            if (event.key === 'Enter') window.sendChatMessage();
          }}
        />
        <button onClick={() => window.sendChatMessage()}>
          <i className="fa-solid fa-paper-plane"></i>
        </button>
      </div>
    </div>
  );
}
