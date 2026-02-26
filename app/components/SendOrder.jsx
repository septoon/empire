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
import { trackPurchase } from '../common/ecommerceTracking';

const SendOrder = ({ selectedTime }) => {
  const { name, phone, dateTime, comment } = useSelector((state) => state.form);
  const selectedServices = useSelector((state) => state.selectedServices.selectedServices);
  const serviceNodes = useSelector(selectNodes);
  const { dates: blackoutDates, loading: blackoutsLoading } = useSelector((s) => s.bookingBlackouts);
  const [isLoadingBtn, setIsLoadingBtn] = useState(false);
  const dispatch = useDispatch();

  const currentYear = dayjs().year();
  const servicesByName = useMemo(() => {
    const map = new Map();
    serviceNodes.forEach((service) => {
      if (!service?.name) return;
      map.set(service.name, service);
    });
    return map;
  }, [serviceNodes]);

  const purchaseProducts = useMemo(() => {
    return selectedServices
      .map((serviceName, index) => {
        const serviceData = servicesByName.get(serviceName);
        if (!serviceData) {
          return { id: serviceName, name: serviceName, price: 0, quantity: 1, position: index + 1 };
        }

        return {
          ...serviceData,
          quantity: 1,
          position: index + 1,
          list: serviceData.list || 'booking_modal_services',
        };
      })
      .filter(Boolean);
  }, [selectedServices, servicesByName]);

  const purchaseRevenue = useMemo(() => {
    return purchaseProducts.reduce((sum, product) => {
      const numericPrice = Number(product.price);
      return Number.isFinite(numericPrice) ? sum + numericPrice * (product.quantity || 1) : sum;
    }, 0);
  }, [purchaseProducts]);

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
    if (isLoadingBtn) return;

    setIsLoadingBtn(true);

    if (blackoutsLoading) {
      notifications.show({
        title: 'Подождите',
        message: 'Загружаем ограничения по датам. Попробуйте еще раз через секунду.',
        color: 'yellow',
        position: 'bottom-center',
      });
      setIsLoadingBtn(false);
      return;
    }
  
    if (!dateTime) {
      console.error('Дата и время не указаны!');
      setIsLoadingBtn(false);
      return;
    }

    const ymd = dayjs(`${dayjs().year()}-${dateTime?.replace('T', '')}`).format('YYYY-MM-DD');
    if (!ymd || ymd === 'Invalid Date') {
      notifications.show({
        title: 'Ошибка',
        message: 'Некорректная дата. Пожалуйста, выберите дату заново.',
        color: 'red',
        position: 'bottom-center',
      });
      setIsLoadingBtn(false);
      return;
    }

    if (blackoutDates.includes(ymd)) {
      notifications.show({
        title: 'Запись закрыта',
        message: 'На выбранную дату запись закрыта',
        color: 'red',
        position: 'bottom-center',
      });
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
      const reservationResponse = await axios.post(
        'https://api.imperia-siyaniya.ru/api/reservations',
        newReservation,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const orderIdFromApi =
        reservationResponse?.data?.id ||
        reservationResponse?.data?.reservationId ||
        reservationResponse?.data?.orderId ||
        newReservation.id;

      trackPurchase({
        orderId: String(orderIdFromApi),
        products: purchaseProducts,
        revenue: purchaseRevenue,
        affiliation: 'imperia-siyaniya.ru',
        list: 'booking_modal_services',
      });
  
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
        disabled={!isFormValid || !selectedTime || blackoutsLoading}
        loading={isLoadingBtn}
        fullWidth
      >
        Отправить
      </Button>
    </>
  );
};

export default SendOrder;
