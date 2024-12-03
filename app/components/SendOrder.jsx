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
  const nodes = useSelector(selectNodes);
  const [isLoadingBtn, setIsLoadingBtn] = useState(false);
  const dispatch = useDispatch();

  const currentYear = dayjs().year();

  // Рассчитываем общую длительность выбранных услуг
  const totalDuration = useMemo(() => {
    let duration = 0;
    selectedServices.forEach((serviceName) => {
      const service = nodes.find((node) => node.name === serviceName);
      if (service) {
        duration += service.duration || 0;
      }
    });
    return duration; // длительность в минутах
  }, [selectedServices, nodes]);

  // Рассчитываем время окончания бронирования
  const endDateTime = useMemo(() => {
    if (dateTime) {
      const dateWithYear = `${currentYear}-${dateTime}`;
      let end = dayjs(dateWithYear, 'YYYY-MM-DDTHH:mm');

      if (totalDuration > 0) {
        end = end.add(totalDuration, 'minute');
      } else {
        // Если длительность 0, добавляем минимальную длительность (например, 1 минута)
        end = end.add(1, 'minute');
      }

      return end.format('YYYY-MM-DDTHH:mm');
    }
    return null;
  }, [dateTime, totalDuration, currentYear]);

  // Функция для проверки пересечения интервалов
  const hasOverlap = (start1, end1, start2, end2) => {
    const s1 = dayjs(start1, 'YYYY-MM-DDTHH:mm');
    const e1 = dayjs(end1, 'YYYY-MM-DDTHH:mm');
    const s2 = dayjs(start2, 'YYYY-MM-DDTHH:mm');
    const e2 = dayjs(end2, 'YYYY-MM-DDTHH:mm');

    return s1.isBefore(e2) && e1.isAfter(s2);
  };

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
  
    const startDateTime = `${currentYear}-${dateTime}${selectedTime}`;
  
    const newReservation = {
      id: Date.now().toString(), // Уникальный идентификатор
      startDate: startDateTime, // Время начала
    };
  
    try {
      // Шаг 1: Получаем текущие бронирования
      const response = await axios.get('https://api.imperia-siyaniya.ru/reservations.json');
      const currentReservations = Array.isArray(response.data) ? response.data : [];
  
      // Шаг 2: Добавляем новую запись
      const updatedReservations = [...currentReservations, newReservation];
  
      // Шаг 3: Отправляем обновленный массив обратно на сервер
      await axios.put(
        'https://api.imperia-siyaniya.ru/api/save/reservations.json',
        updatedReservations,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      // Шаг 4: Отправляем сообщение в Telegram
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
      dispatch(fetchReservations())
    } catch (error) {
      console.error('Ошибка при обновлении данных бронирования:', error);
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
        color="#3ab7bf"
      >
        Отправить
      </Button>
    </>
  );
};

export default SendOrder;