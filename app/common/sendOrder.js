import axios from "axios";

export const sendOrder = async (dateTime, dayjs, currentYear, phone, name, selectedServices, comment) => {
  const formattedDateTime = dateTime
    ? dayjs(`${currentYear}-${dateTime}`, 'YYYY-MM-DDTHH:mm').format('DD MMM HH:mm')
    : 'Не указано';
  const formattedPhone = phone.replace(/\s/g, '');

  const message = `Имя: ${name}
    \nНомер телефона: ${formattedPhone}
    \nДата и время: ${formattedDateTime}
    \nУслуги: ${selectedServices.join(', ')}
    \nКомментарий: ${comment}`;

  try {
    await axios.post(`https://api.telegram.org/bot${process.env.NEXT_PUBLIC_TOKEN}/sendMessage`, {
      chat_id: process.env.NEXT_PUBLIC_CHAT_ID,
      text: message,
    });
    console.log('Сообщение отправлено в Telegram:', message);
  } catch (err) {
    console.warn('Ошибка отправки сообщения в Telegram:', err);
  }
};