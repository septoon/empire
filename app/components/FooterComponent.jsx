'use client'

import React from 'react'
import { IconMapPin } from '@tabler/icons-react';
import { IconPhone } from '@tabler/icons-react';
import { IconMail } from '@tabler/icons-react';
import { IconClock } from '@tabler/icons-react';

const FooterComponent = () => {
  return (
    <div className='w-full bg-tahiti px-8 pt-8 pb-4 mt-8 flex flex-col flex-wrap items-start justify-center rounded-tl-2xl rounded-tr-2xl'>
      <div className='flex'>
      <IconMapPin stroke={2} />
      <p className='ml-1'>Наш офис:</p>
      </div>
      <p className='font-bold mb-1'>Алушта, улица Багликова 8А</p>
      <p className='font-bold mb-2'>Гостиница "Южная ночь", 1 этаж, 1 кабинет</p>
      <div className='flex mb-2'>
        <IconPhone stroke={2} />
        <p className='font-bold ml-1'><a href="tel:+79788419089">+7 (978)-841-90-89</a></p>
      </div>
      <div className='flex mb-2'>
        <IconMail stroke={2} />
        <a className='font-bold ml-1' href="mailto:gasparyan.vi9@gmail.com">gasparyan.vi9@gmail.com</a>
      </div>
      <div className='flex mb-2'>
        <IconClock stroke={2} />
        <p className='ml-1'>График работы:</p>
      </div>
      <p className='font-bold'>ежедневно с 9:00 - 22:00</p>
      <p className='self-center mt-8'>© 2023 Империя сияния</p>
    </div>
  )
}

export default FooterComponent