import React, { useState, useEffect } from 'react';
import { MultiSelect } from '@mantine/core';

export default function SelectServices() {
  const [selectedServices, setSelectedServices] = useState([]);
  const [serviceOptions, setServiceOptions] = useState([]);

  useEffect(() => {
    // Пример данных для услуг
    const data = [
      { category: 'Эпиляция', items: [{ name: 'Лицо', price: 300 }, { name: 'Ноги', price: 500 }] },
    ];

    if (data && Array.isArray(data) && data.length > 0) {
      const options = data.flatMap((category) =>
        category.items.map((item) => ({
          value: item.name,
          label: `${category.category} – ${item.name} (${item.price}₽)`,
        }))
      );
      setServiceOptions(options);
    }
  }, []);

  return (
    <MultiSelect
  label="Услуги"
  placeholder="Выберите услуги"
  data={serviceOptions}
  value={selectedServices}
  onChange={setSelectedServices}
  searchable
  nothingFound={<span>Услуги не найдены</span>}
  clearable
  required
  classNames={{
    dropdown: 'max-h-[300px] overflow-y-auto',
  }}
  mb="md"
/>
  );
}