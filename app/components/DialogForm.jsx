'use client';
import React from 'react';
import { Modal, InputBase, Textarea } from '@mantine/core';
import { IMaskInput } from 'react-imask';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal, openModal } from '../GlobalRedux/Features/modal/modalSlice';
import SelectServices from './SelectServices';
import { DateTimePicker } from '@mantine/dates';
import 'dayjs/locale/ru';
import SendOrder from './SendOrder';
import {
  setComment,
  setDateTime,
  setName,
  setPhone,
} from '../GlobalRedux/Features/form/formSlice';

const DialogForm = () => {
  const dispatch = useDispatch();
  const isModalOpen = useSelector((state) => state.modal.isOpen);
  const { name, phone, dateTime, comment } = useSelector((state) => state.form);

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
            valueFormat="DD MMM HH:mm"
            locale="ru"
            label="Дата и время"
            minDate={new Date()}
            value={dateTime ? new Date(dateTime) : null}
            onChange={(value) => {
              const isoDate = value ? value.toISOString() : null;
              dispatch(setDateTime(isoDate));
            }}
            placeholder="Выберите дату и время"
          />
          <Textarea
            label="Комментарий"
            placeholder="Дополнительная информация"
            value={comment}
            onChange={(e) => dispatch(setComment(e.target.value))}
            mb="md"
          />
        </form>
          <SendOrder />
      </Modal>
      <button
        className="w-full py-2 text-xl font-bold bg-tahiti text-white rounded-lg"
        onClick={handleOpen}>
        Заисаться
      </button>
    </>
  );
};

export default DialogForm;
