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

dayjs.locale('ru');

const DialogForm = () => {
  const dispatch = useDispatch();
  const isModalOpen = useSelector((state) => state.modal.isOpen);
  const { name, phone, dateTime, comment } = useSelector((state) => state.form);
  const [reservedDates, setReservedDates] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get('https://api.imperia-siyaniya.ru/reservations.json');
        const reservationsData = response.data || [];

        setReservedDates(
          reservationsData
            .map((reservation) => {
              if (reservation.startDate && reservation.endDate) {
                return {
                  startDate: reservation.startDate,
                  endDate: reservation.endDate,
                };
              }
              return null;
            })
            .filter((reservation) => reservation !== null)
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

  const currentYear = dayjs().year();

  // Проверяем валидность dateTime
  const dateTimeValue = dateTime
    ? dayjs(`${currentYear}-${dateTime}`, 'YYYY-MM-DDTHH:mm')
    : null;

  const isValidDateTime = dateTimeValue && dateTimeValue.isValid();

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
            styles={{
              input: { fontSize: '16px' },
            }}
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
            styles={{
              input: { fontSize: '16px' },
            }}
            mb="md"
          />
          <SelectServices />
          <DateTimePicker
            valueFormat="DD MMM HH:mm"
            locale="ru"
            label="Дата и время"
            timeInputProps={{ step: 10 }}
            minDate={new Date()}
            value={
              isValidDateTime
                ? dateTimeValue.toDate()
                : null
            }
            onChange={(value) => {
              const formattedDate = value ? dayjs(value).format('MM-DDTHH:mm') : null;
              dispatch(setDateTime(formattedDate));
            }}
            placeholder="Выберите дату и время"
          />
          <Textarea
            label="Комментарий"
            placeholder="Дополнительная информация"
            value={comment}
            onChange={(e) => dispatch(setComment(e.target.value))}
            mb="md"
            styles={{
              input: { fontSize: '16px' },
              body: { fontSize: '16px' },
            }}
          />
        </form>
        <SendOrder reservedDates={reservedDates} />
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