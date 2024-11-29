'use client'

import { Modal, Button, InputBase, Textarea } from '@mantine/core';
import { IMaskInput } from 'react-imask';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal, openModal } from '../GlobalRedux/Features/modal/modalSlice';
import SelectServices from './SelectServices';
import { DateTimePicker } from '@mantine/dates';
import 'dayjs/locale/ru';

function DialogForm() {
    const dispatch = useDispatch();
    const isModalOpen = useSelector((state) => state.modal.isOpen);

    const handleOpen = () => {
        dispatch(openModal());
      };
    const handleClose = () => {
      dispatch(closeModal());
    };

  return (
    <>
      <Modal
        opened={isModalOpen}
        onClose={handleClose}
        title="Записаться на приём"
      >
        <form>
          <InputBase
            label="Ваше имя"
            placeholder="Введите ваше имя"
            required
            mb="md"
          />
          <InputBase
            label="Номер телефона"
            component={IMaskInput}
            mask="+7 (000) 000-00-00"
            placeholder="Введите номер телефона"
            required
            mb="md"
          />
          <DateTimePicker
            valueFormat="DD MMM YYYY HH:mm"
            locale='ru'
            label="Дата и время"
            minDate={new Date()} 
            // value={new Date()}
            placeholder="Выберите дату и время"
            />
          <SelectServices />
          <Textarea
            label="Комментарий"
            placeholder="Дополнительная информация"
            mb="md"
          />
          <Button type="submit" onClick={handleOpen}>Отправить</Button>
        </form>
      </Modal>
      <button className="w-full py-2 text-xl font-bold bg-tahiti text-white rounded-lg" onClick={handleOpen}>Заисаться</button>
        
    </>
  );
}

export default DialogForm;