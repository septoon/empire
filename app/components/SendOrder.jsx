'use client';

import React, { useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { clearForm } from '../GlobalRedux/Features/form/formSlice';
import { clearSelectedServices } from '../GlobalRedux/Features/modal/selectedServicesSlice';
import { closeModal } from '../GlobalRedux/Features/modal/modalSlice';
import { notifications } from '@mantine/notifications';

import dayjs from 'dayjs';
import 'dayjs/locale/ru';

dayjs.locale('ru');

import { selectNodes } from '../GlobalRedux/Selectors/servicesSelectors';
import { Button } from '@mantine/core';
import { sendOrder } from '../common/sendOrder';
import { fetchReservations } from '../GlobalRedux/Features/modal/reservationsSlice';

const SendOrder = ({ selectedTime }) => {
  const { name, phone, dateTime, comment } = useSelector((state) => state.form);
  const selectedServices = useSelector((state) => state.selectedServices.selectedServices);
  const [isLoadingBtn, setIsLoadingBtn] = useState(false);
  const dispatch = useDispatch();

  const currentYear = dayjs().year();

  // Обновленное условие валидности формы
  const isFormValid = useMemo(() => {
    return name.trim() && phone.trim() && dateTime;
  }, [name, phone, dateTime]);

  const onClickClearOrder = () => {
    dispatch(clearForm());
    dispatch(clearSelectedServices());
    dispatch(closeModal());
  };

  const sendReservation = async () => {
    setIsLoadingBtn(true);
  
    if (!dateTime) {
      console.error('Дата и время не указаны!');
      setIsLoadingBtn(false);
      return;
    }
  
    if (selectedServices.length === 0) {
      notifications.show({
        title: 'Ошибка',
        message: 'Пожалуйста, выберите хотя бы одну услугу.',
        color: 'red',
        position: 'bottom-center',
      });
      setIsLoadingBtn(false);
      return;
    }
  
    const startDateTime = `${currentYear}-${dateTime}${selectedTime}:00`;
  
    const newReservation = {
      id: Date.now().toString(),
      startDate: startDateTime,
    };
  
    try {
      // Отправляем новую запись на сервер
      await axios.post(
        'https://api.imperia-siyaniya.ru/api/reservations',
        newReservation,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      // Отправляем сообщение в Telegram
      await sendOrder(dateTime, selectedTime, dayjs, currentYear, phone, name, selectedServices, comment);
  
      // Показываем уведомление об успехе
      notifications.show({
        title: 'Ваша запись принята!',
        message: 'Ожидайте смс с подтверждением.',
        position: 'bottom-center',
        color: '#ba7b6a',
        autoClose: 6000,
      });
  
      // Очищаем форму и закрываем модальное окно
      onClickClearOrder();
      setIsLoadingBtn(false);
      dispatch(fetchReservations());
    } catch (error) {
      console.error('Ошибка при добавлении бронирования:', error);
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось записаться. Пожалуйста, попробуйте позже.',
        color: 'red',
        position: 'bottom-center',
      });
      setIsLoadingBtn(false);
    }
  };

  return (
    <>
      <Button
        variant="filled"
        onClick={sendReservation}
        disabled={!isFormValid || !selectedTime}
        loading={isLoadingBtn}
        fullWidth
      >
        Отправить
      </Button>
    </>
  );
};

export default SendOrder;