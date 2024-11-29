'use client'

import React from 'react';
import { MultiSelect } from '@mantine/core';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedServices } from '../GlobalRedux/Features/modal/selectedServicesSlice';
import { selectNodes } from '../GlobalRedux/Selectors/servicesSelectors';

const SelectServices = () => {
  const nodes = useSelector(selectNodes);
  const selectedServices = useSelector((state) => state.selectedServices.selectedServices);
  const dispatch = useDispatch();

  const handleChange = (selected) => {
    dispatch(setSelectedServices(selected));
  };

  const mSelectPlaceholder = !selectedServices.length ? "Выберите услуги" : ""
  return (
    <MultiSelect
      label="Услуги"
      placeholder={mSelectPlaceholder}
      data={nodes.map((node) => ({
        value: node.name,
        label: `${node.name} (${node.price || ''}₽)`,
      }))}
      value={selectedServices}
      onChange={handleChange}
      searchable
      clearable
      required
      classNames={{
        dropdown: 'max-h-[300px] overflow-y-auto',
      }}
      mb="md"
    />
  );
};

export default React.memo(SelectServices);