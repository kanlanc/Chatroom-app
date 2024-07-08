// ChatRoom.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Message, { MessageProps } from './Message';
import { useLocation, useNavigate } from 'react-router-dom';
import './ChatRoom.css';

const Chatroom: React.FC = () => {
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const location = useLocation();
  const username = location.state?.username;
  const token = localStorage.getItem('token');
  const [validToken, setValidToken] = useState(true);
  const navigate = useNavigate();
  const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://127.0.0.1:8080';

  useEffect(() => {
    const fetchDataAndSetInterval = async () => {
      try {
        if (token) {
          // Fetch message history
          const response = await axios.get(`${serverUrl}/api/messages`, {
            params: { username: username },
            headers: { Authorization: token },
          });
          setMessages(response.data);

          // Set up interval for fetching new messages
          const fetchMessagesInterval = setInterval(async () => {
            const newResponse = await axios.get(`${serverUrl}/api/messages`, {
              params: { username: username },
              headers: { Authorization: token },
            });
            setMessages(newResponse.data);
          }, 5000); // Fetch messages every 5 seconds

          // Clean up interval on component unmount
          return () => clearInterval(fetchMessagesInterval);
        }
      } catch (error) {
        console.error('Error fetching message history:', error);
        setValidToken(false);
      }
    };

    fetchDataAndSetInterval();
  }, [username, token, serverUrl]);

  const sendMessage = async () => {
    try {
      if (!messageInput.trim()) {
        alert("Message can't be empty");
        return;
      }
      const response = await axios.post(
        `${serverUrl}/api/messages`,
        { username: username, content: messageInput },
        { headers: { Authorization: token } }
      );
      setMessages([...messages, response.data]);
      setMessageInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleVote = async (messageId: string, voteType: 'upvote' | 'downvote', userVote: 'upvote' | 'downvote' | 'none') => {
    try {
      await axios.put(
        `${serverUrl}/api/messages/${messageId}`,
        { voteType: voteType, userVote: userVote },
        { headers: { Authorization: token } }
      );

      const updatedMessages = messages.map((message: any) => {
        if (message._id === messageId) {
          let upvoteInc = 0;
          let downvoteInc = 0;

          if (userVote === 'upvote') {
            if (voteType === 'downvote') downvoteInc = 1;
            upvoteInc = -1;
          } else if (userVote === 'downvote') {
            if (voteType === 'upvote') upvoteInc = 1;
            downvoteInc = -1;
          } else {
            if (voteType === 'upvote') upvoteInc = 1;
            else downvoteInc = 1;
          }

          return {
            ...message,
            upvotes: message.upvotes + upvoteInc,
            downvotes: message.downvotes + downvoteInc,
            userVote: userVote === voteType ? 'none' : voteType,
          };
        }
        return message;
      });

      setMessages(updatedMessages);
    } catch (error) {
      console.error('Error voting on message:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!token || !validToken) {
    navigate('/login');
    return null; // Add return null to prevent rendering before redirect
  }

  return (
    <div className="chatroom-container">
      <div className="header">
        <h2 className="chatroom-heading">Chatroom</h2>
        <button className="logout-button" onClick={logout}>
          Logout
        </button>
      </div>
      <div className="messages">
        {messages.map((message: any) => (
          <Message key={message._id} message={message} onVote={handleVote} />
        ))}
      </div>
      <div className="message-input">
        <input type="text" value={messageInput} onChange={(e) => setMessageInput(e.target.value)} />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chatroom;
