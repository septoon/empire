'use client';

import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './Preloader/LaserLoader.css'
import { trackPromoClick, trackPromoView } from '../common/ecommerceTracking';

const Carousel = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const promoViewSent = useRef(false);

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

  useEffect(() => {
    if (!posts.length || promoViewSent.current) return;

    const promotions = posts.map((post, index) => ({
      id: post.id ?? post.title ?? `promo-${index + 1}`,
      name: post.title ?? `Промо ${index + 1}`,
      creative: 'carousel',
      position: String(index + 1),
    }));

    const pushed = trackPromoView(promotions);
    if (pushed) {
      promoViewSent.current = true;
    }
  }, [posts]);

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
          role="button"
          tabIndex={0}
          onClick={() =>
            trackPromoClick({
              id: post.id ?? post.title ?? `promo-${index + 1}`,
              name: post.title ?? `Промо ${index + 1}`,
              creative: 'carousel',
              position: String(index + 1),
            })
          }
          onKeyDown={(event) => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
            trackPromoClick({
              id: post.id ?? post.title ?? `promo-${index + 1}`,
              name: post.title ?? `Промо ${index + 1}`,
              creative: 'carousel',
              position: String(index + 1),
            });
          }}
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
