'use client';

import React, { useEffect, useState } from 'react';
import { Modal, InputBase, Textarea, Button, Group } from '@mantine/core';
import { IMaskInput } from 'react-imask';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal, openModal } from '../GlobalRedux/Features/modal/modalSlice';
import SelectServices from './SelectServices';
import { DatePicker } from '@mantine/dates';
import 'dayjs/locale/ru';
import SendOrder from './SendOrder';
import { setComment, setDateTime, setName, setPhone } from '../GlobalRedux/Features/form/formSlice';

import dayjs from 'dayjs';
import { fetchReservations } from '../GlobalRedux/Features/modal/reservationsSlice';
import { fetchAvailableTimes } from '../GlobalRedux/Features/modal/availableTimesSlice';

dayjs.locale('ru');

const DialogForm = () => {
  const dispatch = useDispatch();
  const isModalOpen = useSelector((state) => state.modal.isOpen);
  const { name, phone, dateTime, comment } = useSelector((state) => state.form);
  const { reservedDates } = useSelector((state) => state.reservations)
  const { times } = useSelector((state) => state.availableTimes)

  const [selectedTime, setSelectedTime] = useState(null);
  
  useEffect(() => {
    const today = dayjs().format('MM-DDT');
    dispatch(setDateTime(today));
    dispatch(fetchReservations())
    dispatch(fetchAvailableTimes())
  }, [dispatch]);

  const handleOpen = () => {
    dispatch(openModal());
  };
  const handleClose = () => {
    dispatch(closeModal());
  };

  const currentYear = dayjs().year();
  const currentHour = new Date().getHours()

  const isValidDateTime = dateTime && dayjs(`${currentYear}-${dateTime}`, 'YYYY-MM-DD').isValid();

  const isDateTimeReserved = (time) => {
    if (!dateTime || typeof time !== 'number') return false;
  
    // Формируем строку для выбранного времени
    const selectedDateTimeString = `${currentYear}-${dateTime}${time.toString().padStart(2, '0')}:00`.trim();
  
    // Проверяем совпадение строк с забронированными датами
    const isReserved = reservedDates.some((reservation) => reservation.startDate === selectedDateTimeString);
  
    // Проверяем, если выбранная дата совпадает с сегодняшним днем
    const isToday = dayjs(`${currentYear}-${dateTime}`, 'YYYY-MM-DD').isSame(dayjs(), 'day');
  
    // Проверяем, если время меньше текущего часа только для сегодняшнего дня
    const isPastTimeToday = isToday && time <= currentHour;
  
    return isReserved || isPastTimeToday;
  };

  const handleDateChange = (value) => {
    const formattedDate = value ? dayjs(value).format('MM-DDT') : null;
    dispatch(setDateTime(formattedDate));
    setSelectedTime(times[0]);
  };

  return (
    <>
      <Modal returnFocus={false} opened={isModalOpen} onClose={handleClose} title="Записаться на процедуру">
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
          <p className=' text-xm'>Дата и время *</p>
          <div className='w-full flex flex-col items-center my-4'>
          <DatePicker
            value={isValidDateTime ? dayjs(`${currentYear}-${dateTime}`, 'YYYY-MM-DD').toDate() : null}
            onChange={handleDateChange}
            locale="ru"
            label="Дата"
            minDate={new Date()}
            placeholder="Выберите дату"
          />
          <Group align="center" justify="center" spacing="xs" mt="md">
          {times.map((timeObj) => (
        <Button
          key={timeObj.time}
          variant={selectedTime === timeObj.time ? 'light' : isDateTimeReserved(timeObj.time) ? 'outline' : 'filled'}
          color={isDateTimeReserved(timeObj.time) ? 'red' : 'blue'}
          onClick={() => setSelectedTime(timeObj.time)}
          disabled={isDateTimeReserved(timeObj.time)}
          size="sm"
        >
          {timeObj.time}:00
        </Button>
      ))}
          </Group>
          </div>
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
        <SendOrder selectedTime={selectedTime} />
      </Modal>
      <Button
        variant="filled"
        onClick={handleOpen}
        fullWidth
        color="#3ab7bf"
        radius={10}
        size='xl'
        style={{
          boxShadow: '4px 4px 18px rgba(0, 0, 0, 0.2)',
        }}
      >
        Записаться
      </Button>
    </>
  );
};

export default DialogForm;