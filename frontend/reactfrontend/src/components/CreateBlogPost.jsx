// src/components/CreateBlogPost.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateBlogPost.css';

const CreateBlogPost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Assuming the JWT token is stored in localStorage after login
  const token = localStorage.getItem('token');

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if title and content are provided
    if (!title || !content) {
      alert('Please provide both title and content.');
      return;
    }

    fetch('http://127.0.0.1:5000/blog/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Include the JWT token in the Authorization header
      },
      body: JSON.stringify({ title, content }),
    })
      .then((response) => {
        if (response.ok) {
          alert('Blog post created successfully!');
          setTitle('');
          setContent('');
          navigate('/'); // Redirect to the blog list page after successful creation
        } else {
          // Handle error responses
          return response.json().then((data) => {
            alert(`Error: ${data.message}`);
          });
        }
      })
      .catch((error) => {
        console.error('Error creating blog post:', error);
        alert('An error occurred while creating the blog post.');
      });
  };

  return (
    <div className="create-blog-post">
      <h2>Create a New Blog Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter the title of your post"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your content here..."
            required
          ></textarea>
        </div>
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
};

export default CreateBlogPost;