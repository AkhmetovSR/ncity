// app/@modal/(.)card/[...id]/page.tsx
'use client';

import React from 'react';
import { useParams } from 'next/navigation'; // Импортируем клиентский хук
import StoreCard from '@/components/StoreCard';
import VacancyList from '@/components/Home/Job/VacancyList/VacancyList';

export default function InterceptorModalPage() {
    const params = useParams();

    // Перехватчик [...id] возвращает массив. Достаем первый элемент.
    // Если id нет в URL, params.id будет undefined
    const idArray = params?.id;
    const id = Array.isArray(idArray) ? idArray[0] : idArray;

    if (!id) return null;

    return (
        <StoreCard id={id}>
            {/*{id === 'vacancy' && <VacancyList />}*/}
        </StoreCard>
    );
}
