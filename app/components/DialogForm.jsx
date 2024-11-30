'use client';

import React, { useEffect, useState } from 'react';
import { Modal, InputBase, Textarea } from '@mantine/core';
import { IMaskInput } from 'react-imask';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal, openModal } from '../GlobalRedux/Features/modal/modalSlice';
import SelectServices from './SelectServices';
import { DateTimePicker } from '@mantine/dates';
import 'dayjs/locale/ru';
import SendOrder from './SendOrder';
import { setComment, setDateTime, setName, setPhone } from '../GlobalRedux/Features/form/formSlice';
import axios from 'axios';
import dayjs from 'dayjs';

const DialogForm = () => {
  const dispatch = useDispatch();
  const isModalOpen = useSelector((state) => state.modal.isOpen);
  const { name, phone, dateTime, comment } = useSelector((state) => state.form);
  const [reservedDates, setReservedDates] = useState([]);
  const [isDateTimeReserved, setIsDateTimeReserved] = useState(false);

  const checkIfDateTimeIsReserved = (value) => {
    if (!value) {
      setIsDateTimeReserved(false);
      return;
    }

    const selectedTime = value.getTime();

    const isReserved = reservedDates.some((reservedDate) => {
      return selectedTime === reservedDate.getTime();
    });

    setIsDateTimeReserved(isReserved);
  };

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get('https://api.imperia-siyaniya.ru/reservations.json');
        const reservationsData = response.data || [];

        setReservedDates(
          reservationsData
            .map((reservation) => {
              const date = new Date(reservation.date);
              return isNaN(date.getTime()) ? null : date;
            })
            .filter((date) => date !== null)
        );
      } catch (error) {
        console.error('Ошибка загрузки забронированных дат:', error);
      }
    };

    fetchReservations();
  }, []);

  const handleOpen = () => {
    dispatch(openModal());
  };
  const handleClose = () => {
    dispatch(closeModal());
  };

  return (
    <>
      <Modal opened={isModalOpen} onClose={handleClose} title="Записаться на приём">
        <form>
          <InputBase
            label="Ваше имя"
            placeholder="Введите ваше имя"
            value={name}
            onChange={(e) => dispatch(setName(e.target.value))}
            required
            mb="md"
          />
          <InputBase
            label="Номер телефона"
            component={IMaskInput}
            mask="+7 (000) 000-00-00"
            placeholder="Введите номер телефона"
            value={phone}
            onAccept={(value) => dispatch(setPhone(value))}
            inputMode="numeric"
            required
            mb="md"
          />
          <SelectServices />
          <DateTimePicker
            valueFormat="DD MMM YYYY HH:mm"
            locale="ru"
            label="Дата и время"
            minDate={new Date()}
            value={dateTime ? new Date(dateTime) : null}
            onChange={(value) => {
              const isoDate = value ? value.toISOString() : null;
              dispatch(setDateTime(isoDate));
              checkIfDateTimeIsReserved(value);
            }}
            placeholder="Выберите дату и время"
          />

          {/* Отображение сообщения об ошибке */}
          {isDateTimeReserved && (
            <div style={{ color: 'red', marginTop: '10px' }}>
              Выбранное время уже занято. Пожалуйста, выберите другое время.
            </div>
          )}
          <Textarea
            label="Комментарий"
            placeholder="Дополнительная информация"
            value={comment}
            onChange={(e) => dispatch(setComment(e.target.value))}
            mb="md"
          />
        </form>
        <SendOrder reservedDates={reservedDates} isDateTimeReserved={isDateTimeReserved} />
      </Modal>
      <button
        className="w-full py-2 text-xl font-bold bg-tahiti text-white rounded-lg"
        onClick={handleOpen}
      >
        Записаться
      </button>
    </>
  );
};

export default DialogForm;