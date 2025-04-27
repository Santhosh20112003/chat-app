import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css'; // Tailwind CSS should be used instead in real projects

const socket = io("https://chat-app-uoqs.onrender.com");


function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    socket.on('message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socket.on('onlineUsers', (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off('message');
      socket.off('onlineUsers');
    };
  }, []);

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      const data = { username, message };
      socket.emit('message', data);
      setMessage('');
    }
  };

  const handleLogin = () => {
    if (username.trim() !== '') {
      socket.emit('join', username);
      setIsLoggedIn(true);
    } else {
      alert('Enter your name to join the chat!');
    }
  };

  return (
    <div className="wa-app-bg">
      {!isLoggedIn ? (
        <div className="wa-login-card wa-fade-in">
          <h2 className="wa-login-title">Chat Login</h2>
          <input
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="wa-input"
          />
          <button onClick={handleLogin} className="wa-btn wa-btn-green">
            Join Chat
          </button>
        </div>
      ) : (
        <div className="wa-chat-container wa-fade-in">
          {/* Sidebar */}
          <div className="wa-sidebar">
            <div className="wa-sidebar-header">Online Users</div>
            <ul className="wa-user-list">
              {onlineUsers.map((user) => (
                <li key={user.id} className="wa-user-list-item wa-slide-in">
                  <span className="wa-user-dot"></span>
                  <span>{user.username}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="wa-main-chat">
            <div className="wa-chat-header">
              <div className="wa-chat-header-left">
                <div className="wa-avatar">{username[0]}</div>
                <span className="wa-chat-title">Group Chat</span>
              </div>
              <span className="wa-online-count">{onlineUsers.length} online</span>
            </div>
            <div className="wa-messages">
              {messages.length > 0 ? (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`wa-message-row wa-message-in ${
                      msg.username === username ? 'wa-message-own' : ''
                    }`}
                  >
                    <div
                      className={`wa-message-bubble ${
                        msg.username === username ? 'wa-message-bubble-own' : ''
                      }`}
                    >
                      <div className="wa-message-username">{msg.username}</div>
                      <div>{msg.message}</div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="wa-no-messages">No messages yet. Start the conversation!</p>
              )}
            </div>
            <div className="wa-chat-input">
              <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="wa-input wa-input-message"
              />
              <button onClick={handleSendMessage} className="wa-btn wa-btn-green">
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
