// app/components/Preloader.jsx
import React from 'react';

const Preloader = () => {
  return (
    <div className="flex flex-col items-center justify-center ">
      <div className="relative w-48 h-48">
        {/* Лазерная сетка */}
        <div className="absolute inset-0 flex flex-wrap">
          {/* Вертикальные линии */}
          {[...Array(10)].map((_, i) => (
            <div
              key={`v-${i}`}
              className="w-0.5 h-full bg-pink-500 opacity-50 animate-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            ></div>
          ))}
          {/* Горизонтальные линии */}
          {[...Array(10)].map((_, i) => (
            <div
              key={`h-${i}`}
              className="absolute left-0 w-full h-0.5 bg-pink-500 opacity-50 animate-pulse"
              style={{ top: `${i * 10}%`, animationDelay: `${i * 0.1}s` }}
            ></div>
          ))}
        </div>
        {/* Сканирующий лазер */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-pink-300 animate-scan"></div>
        </div>
      </div>
      <p className="mt-6 text-lg ">Загружаем услуги и цены...</p>
    </div>
  );
};

export default Preloader;