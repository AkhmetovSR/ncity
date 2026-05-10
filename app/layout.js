import {Geist, Geist_Mono} from "next/font/google";
import "@/app/globals.css";
import Menu from "../components/Menu/Menu.tsx";
// import Providers from '@/components/Providers/Providers';
// import main from "@/components/Main/Home/Menu.module.css";
// import Menu from "@/components/Main/Menu/Menu";
import s from "./layout.module.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

// export const metadata = {
//     title: "Вакансии Нягань",
//     description: "Работа в Нягани",
// };

export default function RootLayout({children}) {
    return (
        <html lang="ru">
        <head title="Job">
            <title>Нягань портал</title>
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"/>
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {/*<Providers>*/}
            <div className={s.Main}>
                <div >
                    {children}
                </div>
                <div >
                    <Menu/>
                </div>
                <div >Для просмотра, пожалуйста <br/>переверните устройство.</div>
            </div>
        {/*</Providers>*/}
        </body>
        </html>
    );
}