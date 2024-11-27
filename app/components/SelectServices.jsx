'use client'

import React, { useState, useEffect } from 'react';
import { TreeSelect } from 'primereact/treeselect';
import { useSelector } from 'react-redux';

export default function SelectServices() {
  const [nodes, setNodes] = useState([]);
  const [selectedNodeKeys, setSelectedNodeKeys] = useState(null);
  const { data } = useSelector((state) => state.services);

  useEffect(() => {
    if (data.length > 0) {
      const formattedData = data.map((category, catIndex) => ({
        key: `cat_${catIndex}`,
        label: category.category,
        children: category.items.map((item, itemIndex) => ({
          key: `cat_${catIndex}_item_${itemIndex}`,
          label: `${item.name} - ${item.price}₽`,
          data: item
        }))
      }));
      setNodes(formattedData);
    }
  }, [data]);

  return (
    <div className="card flex justify-content-center">
      <TreeSelect
        value={selectedNodeKeys}
        onChange={(e) => setSelectedNodeKeys(e.value)}
        options={nodes}
        metaKeySelection={false}
        className="md:w-20rem w-full"
        selectionMode="multiple"
        placeholder="Выбрать"
      />
    </div>
  );
}