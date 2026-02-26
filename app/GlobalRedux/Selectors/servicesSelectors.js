import { createSelector } from 'reselect';

// Исходные данные из Redux-состояния
const selectServicesData = (state) => state.services.data;

// Меморизованный селектор
export const selectNodes = createSelector(
  [selectServicesData],
  (data) => {
    return data.flatMap((category) =>
      (category.items || []).map((item, index) => ({
        ...item,
        category: category.category || 'Услуги',
        list: category.category || 'Услуги',
        position: index + 1,
      }))
    );
  }
);
