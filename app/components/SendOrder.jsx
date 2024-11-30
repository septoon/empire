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

const SendOrder = ({ reservedDates }) => {
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

  // Проверяем, занято ли выбранное время
  const isDateTimeReserved = useMemo(() => {
    if (!dateTime || !endDateTime) return false;
    return reservedDates.some((reservation) => {
      return hasOverlap(
        `${currentYear}-${dateTime}`,
        endDateTime,
        reservation.startDate,
        reservation.endDate,
      );
    });
  }, [dateTime, endDateTime, reservedDates, currentYear]);

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

    if (isDateTimeReserved) {
      console.error('Выбранное время уже занято!');
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

    const startDateTime = `${currentYear}-${dateTime}`;

    const newReservation = {
      id: Date.now().toString(),
      startDate: startDateTime, // Время начала в формате 'YYYY-MM-DDTHH:mm'
      endDate: endDateTime, // Время окончания
    };

    try {
      // Получаем текущие бронирования
      const response = await axios.get('https://api.imperia-siyaniya.ru/reservations.json');
      const currentReservations = Array.isArray(response.data) ? response.data : [];

      // Добавляем новое бронирование
      const updatedReservations = [...currentReservations, newReservation];

      // Отправляем обновленный массив на сервер
      await axios.put(
        'https://api.imperia-siyaniya.ru/api/save/reservations.json',
        updatedReservations,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      // Отправляем сообщение в Telegram
      await sendOrder(dateTime, dayjs, currentYear, phone, name, selectedServices, comment);

      // Показываем уведомление
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
        disabled={!isFormValid || isDateTimeReserved}
        loading={isLoadingBtn}
        fullWidth
        color="#3ab7bf"
      >
        {isDateTimeReserved ? 'Это время занято' : 'Отправить'}
      </Button>
      {isDateTimeReserved && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          Выбранное время уже занято. Пожалуйста, выберите другое время.
        </div>
      )}
    </>
  );
};

export default SendOrder;