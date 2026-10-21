'use client';

export default function Chatbot() {
  return (
    <div className="chatbot-modal" id="chatbotModal">
      <div className="chatbot-header">
        <div className="chatbot-title">
        <img
  src="https://res.cloudinary.com/djaonuvzx/image/upload/v1792352038/WhatsApp_Image_2026-10-19_at_12.29.45_AM-removebg-preview_zaza5i.png"
  alt="Pawsitive Clinic"
  width={28}
  height={28}
  style={{
    objectFit: 'cover',
    borderRadius: '50%',
    flexShrink: 0,
    display: 'inline-block',
    verticalAlign: 'middle'
  }}
/>
          Pawsitive Assistant
        </div>
        <button className="chatbot-close" onClick={() => window.closeChatbot()}>
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div className="chatbot-body" id="chatbotBody">
        <div className="chat-message bot">
          <div className="chat-avatar">
           <img
  src="https://res.cloudinary.com/djaonuvzx/image/upload/v1792352038/WhatsApp_Image_2026-10-19_at_12.29.45_AM-removebg-preview_zaza5i.png"
  alt="Pawsitive Clinic"
  width={28}
  height={28}
  style={{
    objectFit: 'cover',
    borderRadius: '50%',
    flexShrink: 0,
    display: 'inline-block',
    verticalAlign: 'middle'
  }}
/>
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
