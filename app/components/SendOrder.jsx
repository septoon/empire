'use client'

import React, { useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { clearForm } from '../GlobalRedux/Features/form/formSlice';
import { clearSelectedServices } from '../GlobalRedux/Features/modal/selectedServicesSlice';
import { closeModal } from '../GlobalRedux/Features/modal/modalSlice';

import dayjs from 'dayjs';
import 'dayjs/locale/ru';

dayjs.locale('ru');

const SendOrder = () => {
  const { name, phone, dateTime, comment } = useSelector((state) => state.form);
  const selectedServices = useSelector((state) => state.selectedServices.selectedServices);
  const formattedDateTime = dateTime ? dayjs(dateTime).format('DD MMM HH:mm') : 'Не указано';
  const formattedPhone = phone.replace(/\s/g, '');
  const dispatch = useDispatch();

  const onClickClearOrder = () => {
    dispatch(clearForm());
    dispatch(clearSelectedServices());
    dispatch(closeModal());
  };

  const sendOrder = async (
  ) => {
    const message =
    `Имя: ${name}
    \nНомер телефона: ${formattedPhone}
    \nДата и время: ${formattedDateTime}
    \nУслуги: ${selectedServices.join(', ')}
    \nКомментарий: ${comment}`

    try {
      await axios.post(`https://api.telegram.org/bot${process.env.NEXT_PUBLIC_TOKEN}/sendMessage`, {
        chat_id: process.env.NEXT_PUBLIC_CHAT_ID,
        text: message,
      });
      console.log(message)
      onClickClearOrder();
    } catch (err) {
      console.warn(err);
    }
  };

  const isFormValid = useMemo(() => {
    return name.trim() && phone.trim() && dateTime && selectedServices.length > 0;
  }, [name, phone, dateTime, selectedServices]);

  return (
    <button onClick={sendOrder} className={`w-full py-2 text-xl font-bold ${
        isFormValid ? 'bg-tahiti' : 'bg-red'} text-white rounded-lg`}>Отправить</button>
  )
}

export default SendOrder