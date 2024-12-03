'use client'

import React, { useEffect } from 'react'
import { IconMapPin } from '@tabler/icons-react';
import { IconPhone } from '@tabler/icons-react';
import { IconMail } from '@tabler/icons-react';
import { IconClock } from '@tabler/icons-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContacts } from '../GlobalRedux/Features/contacts/contactsSlice';

const FooterComponent = () => {
  const dispatch = useDispatch();
  const { address, phoneNumber, mail, scheduleStart, scheduleEnd, everyday } = useSelector(
    (state) => state.contacts
  );

  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);
  return (
    <div className='w-full bg-tahiti px-8 pt-8 pb-4 mt-8 flex flex-col flex-wrap items-start justify-center rounded-tl-2xl rounded-tr-2xl'>
      <div className='flex'>
      <IconMapPin stroke={2} />
      <p className='ml-1'>Наш офис:</p>
      </div>
      <p className='font-bold mb-2'>{address}</p>
      <div className='flex mb-2'>
        <IconPhone stroke={2} />
        <p className='font-bold ml-1'><a href="tel:+79788419089">{phoneNumber}</a></p>
      </div>
      <div className='flex mb-2'>
        <IconMail stroke={2} />
        <a className='font-bold ml-1' href="mailto:gasparyan.vi9@gmail.com">{mail}</a>
      </div>
      <div className='flex mb-2'>
        <IconClock stroke={2} />
        <p className='ml-1'>График работы:</p>
      </div>
      <p className='font-bold'>{everyday ? 'Ежедневно' : 'Пн-Пт'} с {scheduleStart}:00 - {scheduleEnd}:00</p>
      <p className='self-center mt-8'>© 2023 Империя сияния</p>
    </div>
  )
}

export default FooterComponent