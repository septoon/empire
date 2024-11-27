'use client'


import React, { useState } from "react";
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import SelectServices from "./SelectServices";

export default function DialogForm() {
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState('center');
    const footerContent = (
        <div>
            <button className="w-full py-2 text-xl font-bold bg-primary text-white rounded-lg" onClick={() => setVisible(false)}>Отправить</button>
        </div>
    );

    const show = (position) => {
        setPosition(position);
        setVisible(true);
    };

    return (
        <div className="">
            <button className="w-full py-2 px-4 text-xl font-bold bg-primary rounded-lg" onClick={() => show('bottom')}>Записаться</button>
            <Dialog header="Запись" visible={visible} position={position} style={{ width: '100vw' }} onHide={() => {if (!visible) return; setVisible(false); }} footer={footerContent} draggable={false} resizable={false}>
                <h1 className="mb-2">Выберите услугу:</h1>
                <SelectServices />
                <h1 className="my-6">Выберите дату:</h1>
                <h1 className="mb-2">Ваш номер:</h1>

            </Dialog>
        </div>
    )
}
        