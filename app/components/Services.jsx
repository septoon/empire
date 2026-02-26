'use client'

import { useDispatch, useSelector } from "react-redux";
import { fetchServices } from "../GlobalRedux/Features/services/servicesSlice";
import { useEffect, useRef } from "react";
import Loader from "./Preloader/Loader";
import { trackImpressions } from "../common/ecommerceTracking";

const Services = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.services);
  const sentImpressions = useRef(new Set());

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  useEffect(() => {
    if (!Array.isArray(data) || !data.length) return;

    data.forEach((category) => {
      const listName = category.category || "Услуги";
      const products = (category.items || []).map((item, index) => ({
        ...item,
        category: listName,
        list: listName,
        position: index + 1,
        quantity: 1,
      }));

      if (!products.length) return;

      const signature = `${listName}:${products
        .map((item) => item.id ?? item.name ?? "")
        .join("|")}`;

      if (sentImpressions.current.has(signature)) return;

      const pushed = trackImpressions(products, { list: listName });
      if (pushed) {
        sentImpressions.current.add(signature);
      }
    });
  }, [data]);

  if (loading) return <Loader/>;
  if (error) return <p className="text-center text-lg text-red-500">Ошибка: {error}</p>;

  return (
    <div className="services container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Услуги и Цены</h1>
      {data.map((category) => (
        <div key={category.category} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{category.category}</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-dark  text-silverAdmin shadow-md rounded-lg overflow-hidden">
              <thead className="bg-dark ">
                <tr className="">
                  <th className="p-3 text-left font-medium text-gray-700">Наименование</th>
                  <th className="p-3 text-right font-medium text-gray-700">Цена</th>
                </tr>
              </thead>
              <tbody className="bg-dark">
                {category.items.map((item) => (
                  <tr key={item.name} className='bg-darkAdmin text-silverAdmin'>
                    <td className="p-3 text-left">{item.name}</td>
                    <td className="p-3 text-right">{item.price}₽</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Services;
