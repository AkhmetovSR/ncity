export default function ModalLoading() {
    // Возвращает null. Next.js мгновенно переключит URL, откроет слот модалки
    // и запустит анимацию layoutId, не дожидаясь серверных компонентов.
    return null;
}
