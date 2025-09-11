import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function CommentBoard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const [text, setText] = useState('');
  const [comments, setComments] = useState([]);
  const [error, setError] = useState('');

  const fetchComments = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/comments`);
      setComments(res.data);
    } catch (err) {
      setError('Failed to load comments');
    }
  };

  const submitComment = async () => {
    if (!text.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/comments`,
        {
          text,
          email: user.email,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setText('');
      setError('');
      fetchComments();
    } catch (err) {
      setError('Failed to submit comment');
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div>
      <h2>Comment Board</h2>
      <textarea
        placeholder="Your comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={submitComment}>Submit</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        {comments.map((c) => (
          <div key={c._id} className="comment">
            <p>
              <strong>{c.user?.name || c.email}</strong> said:
            </p>
            <p>{c.text}</p>
            <small>{new Date(c.createdAt).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}