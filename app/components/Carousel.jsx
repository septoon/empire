'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Preloader/LaserLoader.css'

const Carousel = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/posts.json`);
        const data = response.data;

        if (Array.isArray(data)) {
          setPosts(data);
        } else {
          setError('Полученные данные не являются массивом.');
        }
      } catch (err) {
        setError('Ошибка при загрузке постов. Попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div className='laser-loader opacity-60'></div>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!posts || posts.length === 0) {
    return <p>Посты не найдены.</p>;
  }

  return (
    <div className="flex w-full overflow-x-scroll space-x-4 py-4">
      {posts.map((post, index) => (
        <div
          key={index}
          className="flex-shrink-0 flex flex-col items-start w-64 bg-dark rounded-xl shadow-lg p-4"
        >
          <h2 className="text-xl font-bold text-gray300 mb-4">{post.title}</h2>
          <ul className="space-y-2">
            {post.content.map((item, idx) => (
              <li key={idx} className="text-gray500 text-sm">{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Carousel;