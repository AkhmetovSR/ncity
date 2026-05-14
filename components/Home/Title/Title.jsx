import Image from "next/image";
import Mountain from "@/public/images/forest1.webp";
import s from "@/components/Home/Title/Title.module.css";

export default function Title() {
    return (
        <div className={s.Title}>
            <div className={s.TitleContent}>
                <div className={s.Label}>
                    <div className={s.MountainImg}>
                        <Image src={Mountain} alt={"Mountain"} className={s.iconImage}/>
                    </div>
                    <div className={s.TitleCity}>НЯГАНЬ</div>
                    {/*<div className={s.SearchAll}>#НАЙДЕТСЯВСЕ</div>*/}
                </div>
                <div className={s.Dobro}>
                    Разработано при поддержке добра =)
                </div>
            </div>
        </div>
    );
}