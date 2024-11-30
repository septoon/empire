'use client';

import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { clearForm } from '../GlobalRedux/Features/form/formSlice';
import { clearSelectedServices } from '../GlobalRedux/Features/modal/selectedServicesSlice';
import { closeModal } from '../GlobalRedux/Features/modal/modalSlice';

import dayjs from 'dayjs';
import 'dayjs/locale/ru';

dayjs.locale('ru');

const SendOrder = ({ reservedDates, isDateTimeReserved }) => {
  const { name, phone, dateTime, comment } = useSelector((state) => state.form);
  const selectedServices = useSelector((state) => state.selectedServices.selectedServices);
  const formattedDateTime = dateTime ? dayjs(dateTime).format('DD MMM YYYY HH:mm') : 'Не указано';
  const formattedPhone = phone.replace(/\s/g, '');
  const dispatch = useDispatch();

  const onClickClearOrder = () => {
    dispatch(clearForm());
    dispatch(clearSelectedServices());
    dispatch(closeModal());
  };

  const sendOrder = async () => {
    const message = `Имя: ${name}
Номер телефона: ${formattedPhone}
Дата и время: ${formattedDateTime}
Услуги: ${selectedServices.join(', ')}
Комментарий: ${comment}`;

    try {
      await axios.post(`https://api.telegram.org/bot${process.env.NEXT_PUBLIC_TOKEN}/sendMessage`, {
        chat_id: process.env.NEXT_PUBLIC_CHAT_ID,
        text: message,
      });
      console.log('Сообщение отправлено в Telegram:', message);
      onClickClearOrder();
    } catch (err) {
      console.warn('Ошибка отправки сообщения в Telegram:', err);
    }
  };

  const sendReservation = async () => {
    if (!dateTime) {
      console.error('Дата и время не указаны!');
      return;
    }

    // Проверяем, не занято ли выбранное время
    const selectedTime = new Date(dateTime).getTime();
    const isReserved = reservedDates.some((reservedDate) => {
      return selectedTime === reservedDate.getTime();
    });

    if (isReserved) {
      console.error('Выбранное время уже занято!');
      return;
    }

    // Создаем новый объект бронирования
    const newReservation = {
      id: Date.now().toString(), // Уникальный идентификатор
      date: new Date(dateTime).toISOString(), // Сохраняем дату в формате ISO
    };

    try {
      // Получаем текущие бронирования
      const response = await axios.get('https://api.imperia-siyaniya.ru/reservations.json');
      const currentReservations = Array.isArray(response.data) ? response.data : [];

      // Добавляем новое бронирование
      const updatedReservations = [...currentReservations, newReservation];

      // Отправляем обновленный массив на сервер
      await axios.put('https://api.imperia-siyaniya.ru/api/save/reservations.json', updatedReservations, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Успешное бронирование:', newReservation);
      sendOrder(); // Отправляем данные в Telegram
    } catch (error) {
      console.error('Ошибка при обновлении данных бронирования:', error);
    }
  };

  const isFormValid = useMemo(() => {
    return name.trim() && phone.trim() && dateTime && selectedServices.length > 0;
  }, [name, phone, dateTime, selectedServices]);

  return (
    <button
      onClick={sendReservation}
      className={`w-full py-2 text-xl font-bold ${
        isFormValid && !isDateTimeReserved ? 'bg-tahiti' : 'bg-gray'
      } text-white rounded-lg`}
      disabled={!isFormValid || isDateTimeReserved}
    >
      {isDateTimeReserved ? 'Это время занято' : 'Отправить'}
    </button>
  );
};

export default SendOrder;