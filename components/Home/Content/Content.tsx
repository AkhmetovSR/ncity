'use client';
import s from "@/components/Home/Content/Content.module.css"
import { motion } from "framer-motion";
import React from "react";
import Lottie from 'lottie-react';
import tapAnimation from '@/public/lottie/business-analysis1.json';
import Link from 'next/link';


export default function Content() {
    // Пример массива с данными
    const items = [
        { id: 1, title: "Item 1", description: "Description 1 asdas das asd asd asd asd asd asd asd asd as dasd asd asd asdddddd asd asd asd asd asd asd asd asd asd asd asdasdasdas  asdasdasd sadasdasdasda asd" },
        { id: 2, title: "Item 1", description: "Description 1 asdas das asd asd asd asd asd asd asd asd as dasd asd asd asdddddd asd asd asd asd asd asd asd asd asd asd asdasdasdas  asdasdasd sadasdasdasda asd" },
        { id: 3, title: "Item 1", description: "Description 1 asdas das asd asd asd asd asd asd asd asd as dasd asd asd asdddddd asd asd asd asd asd asd asd asd asd asd asdasdasdas  asdasdasd sadasdasdasda asd" },
        { id: 4, title: "Item 1", description: "Description 1 asdas das asd asd asd asd asd asd asd asd as dasd asd asd asdddddd asd asd asd asd asd asd asd asd asd asd asdasdasdas  asdasdasd sadasdasdasda asd" },
        { id: 5, title: "Item 1", description: "Description 1 asdas das asd asd asd asd asd asd asd asd as dasd asd asd asdddddd asd asd asd asd asd asd asd asd asd asd asdasdasdas  asdasdasd sadasdasdasda asd" },
        { id: 6, title: "Item 1", description: "Description 1 asdas das asd asd asd asd asd asd asd asd as dasd asd asd asdddddd asd asd asd asd asd asd asd asd asd asd asdasdasdas  asdasdasd sadasdasdasda asd" },
        { id: 7, title: "Item 1", description: "Description 1 asdas das asd asd asd asd asd asd asd asd as dasd asd asd asdddddd asd asd asd asd asd asd asd asd asd asd asdasdasdas  asdasdasd sadasdasdasda asd" },
        { id: 8, title: "Item 1", description: "Description 1 asdas das asd asd asd asd asd asd asd asd as dasd asd asd asdddddd asd asd asd asd asd asd asd asd asd asd asdasdasdas  asdasdasd sadasdasdasda asd" },
        { id: 9, title: "Item 1", description: "Description 1 asdas das asd asd asd asd asd asd asd asd as dasd asd asd asdddddd asd asd asd asd asd asd asd asd asd asd asdasdasdas  asdasdasd sadasdasdasda asd" },
        { id: 10, title: "Item 1", description: "Description 1 asdas das asd asd asd asd asd asd asd asd as dasd asd asd asdddddd asd asd asd asd asd asd asd asd asd asd asdasdasdas  asdasdasd sadasdasdasda asd" },
        { id: 11, title: "Item 1", description: "Description 1 asdas das asd asd asd asd asd asd asd asd as dasd asd asd asdddddd asd asd asd asd asd asd asd asd asd asd asdasdasdas  asdasdasd sadasdasdasda asd" },
        { id: 12, title: "Item 1", description: "Description 1 asdas das asd asd asd asd asd asd asd asd as dasd asd asd asdddddd asd asd asd asd asd asd asd asd asd asd asdasdasdas  asdasdasd sadasdasdasda asd" },
        { id: 13, title: "Item 1", description: "Description 1 asdas das asd asd asd asd asd asd asd asd as dasd asd asd asdddddd asd asd asd asd asd asd asd asd asd asd asdasdasdas  asdasdasd sadasdasdasda asd" },
        { id: 14, title: "Item 1", description: "Description 1 asdas das asd asd asd asd asd asd asd asd as dasd asd asd asdddddd asd asd asd asd asd asd asd asd asd asd asdasdasdas  asdasdasd sadasdasdasda asd" },
        { id: 15, title: "Item 1", description: "Description 1 asdas das asd asd asd asd asd asd asd asd as dasd asd asd asdddddd asd asd asd asd asd asd asd asd asd asd asdasdasdas  asdasdasd sadasdasdasda asd" },
        { id: 16, title: "Item 1", description: "Description 1 asdas das asd asd asd asd asd asd asd asd as dasd asd asd asdddddd asd asd asd asd asd asd asd asd asd asd asdasdasdas  asdasdasd sadasdasdasda asd" },
        { id: 17, title: "Item 1", description: "Description 1 asdas das asd asd asd asd asd asd asd asd as dasd asd asd asdddddd asd asd asd asd asd asd asd asd asd asd asdasdasdas  asdasdasd sadasdasdasda asd" },
        { id: 18, title: "Item 1", description: "Description 1 asdas das asd asd asd asd asd asd asd asd as dasd asd asd asdddddd asd asd asd asd asd asd asd asd asd asd asdasdasdas  asdasdasd sadasdasdasda asd" },
        { id: 19, title: "Item 1", description: "Description 1 asdas das asd asd asd asd asd asd asd asd as dasd asd asd asdddddd asd asd asd asd asd asd asd asd asd asd asdasdasdas  asdasdasd sadasdasdasda asd" },
        { id: 20, title: "Item 1", description: "Description 1 asdas das asd asd asd asd asd asd asd asd as dasd asd asd asdddddd asd asd asd asd asd asd asd asd asd asd asdasdasdas  asdasdasd sadasdasdasda asd" },
        { id: 21, title: "Item 1", description: "Description 1 asdas das asd asd asd asd asd asd asd asd as dasd asd asd asdddddd asd asd asd asd asd asd asd asd asd asd asdasdasdas  asdasdasd sadasdasdasda asd" }
    ];

    return (
        <motion.div
            className={s.ContentServ}
            layoutId="content"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.2}}
            exit={{opacity: 0}}
        >
            {items.map((item) => (
                <div key={item.id} className={s.Div}>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                </div>
            ))}
        </motion.div>
    );
}