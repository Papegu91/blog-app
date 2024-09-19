// src/components/BlogDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './BlogDetail.css';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]); // State to store comments
  const [commentContent, setCommentContent] = useState(''); // State for new comment
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State for authentication

  // Get the JWT token, assuming it's stored in localStorage after login
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Check if user is authenticated
    setIsAuthenticated(!!token);

    // Fetch blog post details
    fetch(`http://127.0.0.1:5000/blog/posts/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch blog post.');
        }
        return response.json();
      })
      .then((data) => {
        setBlog(data);
      })
      .catch((error) => console.error('Error fetching post details:', error));

    // Fetch comments for the blog post
    fetch(`http://127.0.0.1:5000/blog/posts/${id}/comments`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch comments.');
        }
        return response.json();
      })
      .then((data) => {
        setComments(data);
      })
      .catch((error) => console.error('Error fetching comments:', error));
  }, [id, token]);

  if (!blog) {
    return <div>Loading...</div>;
  }

  const handleCommentSubmit = (e) => {
    e.preventDefault();

    if (!commentContent) {
      alert('Please enter a comment.');
      return;
    }

    fetch(`http://127.0.0.1:5000/blog/posts/${id}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Include JWT token in headers
      },
      body: JSON.stringify({ content: commentContent }),
    })
      .then((response) => {
        if (response.ok) {
          // Clear the comment input
          setCommentContent('');
          // Fetch the updated list of comments
          return fetch(`http://127.0.0.1:5000/blog/posts/${id}/comments`);
        } else {
          return response.json().then((data) => {
            throw new Error(data.message || 'Failed to add comment.');
          });
        }
      })
      .then((response) => response.json())
      .then((data) => {
        setComments(data);
      })
      .catch((error) => {
        console.error('Error adding comment:', error);
        alert(error.message);
      });
  };

  return (
    <div className="blog-detail">
      <h1>{blog.title}</h1>
      <p>{blog.content}</p>

      <hr />

      <div className="comments-section">
        <h2>Comments</h2>
        {comments.length > 0 ? (
          <ul className="comments-list">
            {comments.map((comment) => (
              <li key={comment.id}>
                <p>{comment.content}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No comments yet. Be the first to comment!</p>
        )}

        {isAuthenticated ? (
          <div className="add-comment">
            <h3>Add a Comment</h3>
            <form onSubmit={handleCommentSubmit}>
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Write your comment here..."
                required
              ></textarea>
              <button type="submit">Post Comment</button>
            </form>
          </div>
        ) : (
          <p>You need to log in to add a comment.</p>
        )}
      </div>
    </div>
  );
};

export default BlogDetail;