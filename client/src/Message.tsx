// Message.tsx
import React from 'react';
import './Message.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

/**
 * Props interface for the Message component.
 */
export interface MessageProps {
  message: {
    _id: string;
    username: string;
    content: string;
    upvotes: number;
    downvotes: number;
    userVote?: 'upvote' | 'downvote';
  };
  /**
   * Function to handle voting on a message.
   * 
   * @param {string} messageId - The ID of the message to vote on.
   * @param {'upvote' | 'downvote'} voteType - The type of vote ('upvote' or 'downvote').
   * @param {'upvote' | 'downvote' | 'none'} userVote - The current user's vote status on the message.
   */
  onVote: (messageId: string, voteType: 'upvote' | 'downvote', userVote: 'upvote' | 'downvote' | 'none') => void;
}

/**
 * Message component displays a single message in the chat.
 * It includes the username, message content, and voting buttons.
 * 
 * @param {MessageProps} message - The message object containing message details.
 * @param {(messageId: string, voteType: 'upvote' | 'downvote', userVote: 'upvote' | 'downvote' | 'none') => void} onVote - Function to handle voting on the message.
 */
const Message: React.FC<MessageProps> = ({ message, onVote }) => {
  /**
   * Handles voting on the message.
   * 
   * @param {'upvote' | 'downvote'} voteType - The type of vote ('upvote' or 'downvote').
   */
  const handleVote = (voteType: 'upvote' | 'downvote') => {
    const userVote = message.userVote || 'none'; 
    onVote(message._id, voteType, userVote);
  };

  return (
    <div className="message">
      <p><strong>{message.username}</strong>: </p>
      <div className="message-content-container">
        <p className="message-content">{message.content}</p>
      </div>
      <div className="message-actions">
        <span className="votes">{message.upvotes}</span>
        <button
          className={`vote-btn upvote-btn ${message.userVote === 'upvote' ? 'active' : ''}`}
          onClick={() => handleVote('upvote')}
        >
          <FontAwesomeIcon icon={faThumbsUp} />
        </button>
        <span className="votes">{message.downvotes}</span>
        <button
          className={`vote-btn downvote-btn ${message.userVote === 'downvote' ? 'active' : ''}`}
          onClick={() => handleVote('downvote')}
        >
          <FontAwesomeIcon icon={faThumbsDown} />
        </button>
      </div>
    </div>
  );
};

export default Message;
