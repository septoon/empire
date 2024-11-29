'use client'
import React from 'react'

const SendOrder = () => {
  const sendOrder = async (
  ) => {
    const message =
    `Заказ # ${ordersCount}\n\n${orderType}\n\n${dishes}\n\nСумма: ${paid ? totalWithDeliveryPrice : totalPrice} ₽\nАдрес Доставки: ${address}\nНомер телефона: ${phoneNumber}\n\n${
      checked
        ? `Дата доставки: ${shortDate}\nВремя доставки: ${shortTime}`
        : `Дата доставки: Сегодня\nВремя доставки: Сейчас`
    }\nКомментарий: ${comment}\nСпособ оплаты: ${pay ? pay : 'Не выбран'}`
    setOrderValues({
    });

    try {
      await axios.post(`https://api.telegram.org/bot${process.env.NEXT_PUBLIC_TOKEN}/sendMessage`, {
        chat_id: process.env.NEXT_PUBLIC_CHAT_ID,
        text: message,
      });
      onClickClearCart();
    } catch (err) {
      console.warn(err);
    }
  };
  return (
    <button onClick={sendOrder} className="w-full py-2 text-xl font-bold bg-tahiti text-white rounded-lg">Отправить</button>
  )
}

export default SendOrder