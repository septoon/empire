'use client'

import React, { useMemo } from 'react';
import { MultiSelect } from '@mantine/core';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedServices } from '../GlobalRedux/Features/modal/selectedServicesSlice';
import { selectNodes } from '../GlobalRedux/Selectors/servicesSelectors';
import { trackAdd, trackRemove } from '../common/ecommerceTracking';

const SelectServices = () => {
  const nodes = useSelector(selectNodes);
  const selectedServices = useSelector((state) => state.selectedServices.selectedServices);
  const dispatch = useDispatch();
  const servicesByName = useMemo(() => {
    const map = new Map();
    nodes.forEach((service) => {
      if (!service?.name) return;
      map.set(service.name, service);
    });
    return map;
  }, [nodes]);

  const handleChange = (selected) => {
    const previousSet = new Set(selectedServices);
    const nextSet = new Set(selected);

    const addedProducts = selected
      .filter((name) => !previousSet.has(name))
      .map((name) => servicesByName.get(name) ?? { id: name, name, price: 0, quantity: 1 })
      .filter(Boolean);

    const removedProducts = selectedServices
      .filter((name) => !nextSet.has(name))
      .map((name) => servicesByName.get(name) ?? { id: name, name, price: 0, quantity: 1 })
      .filter(Boolean);

    if (addedProducts.length) {
      trackAdd(addedProducts, { list: 'booking_modal_services' });
    }

    if (removedProducts.length) {
      trackRemove(removedProducts, { list: 'booking_modal_services' });
    }

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
      searchable={false}
      clearable
      required
      classNames={{
        dropdown: 'max-h-[300px] overflow-y-auto',
      }}
      mb="md"
      styles={{
        input: {
          fontSize: '16px',
        },
      }}
    />
  );
};

export default React.memo(SelectServices);
