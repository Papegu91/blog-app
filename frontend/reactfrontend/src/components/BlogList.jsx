// src/components/BlogList.jsx
import React, { useEffect, useState } from 'react';
import './BlogList.css';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetch('/api/blogs')
      .then((response) => response.json())
      .then((data) => setBlogs(data))
      .catch((error) => console.error('Error fetching blogs:', error));
  }, []);

  return (
    <div className="blog-list">
      <h1>Blog Posts</h1>
      <ul>
        {blogs.map((blog) => (
          <li key={blog.id}>
            <a href={`/blog/${blog.id}`}>{blog.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogList;
