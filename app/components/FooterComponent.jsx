'use client'

import React from 'react'

const FooterComponent = () => {
  return (
    <div className='w-full bg-tahiti p-8 mt-8 flex flex-col flex-wrap items-start justify-center '>
      <p>Наш офис:</p>
      <p className='font-bold mb-1'>Алушта, улица Багликова 8А</p>
      <p className='font-bold mb-1'>Гостиница "Южная ночь", 1 этаж, 1 кабинет</p>
      <p className='font-bold mb-1'><a href="tel:+79788419089">+7 (978)-841-90-89</a></p>
      <a className='font-bold mb-1' href="mailto:gasparyan.vi9@gmail.com">gasparyan.vi9@gmail.com</a>
      <p className=''>Время работы:</p>
      <p className='font-bold'>с 9 до 22:00</p>
      <p className='self-center mt-8'>© 2023 Империя сияния</p>
    </div>
  )
}

export default FooterComponent