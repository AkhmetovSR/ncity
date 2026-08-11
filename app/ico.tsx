import { ImageResponse } from 'next/og';

// Конфигурация иконок: Next.js автоматически вызовет этот файл
// для генерации размеров 32x32, 192x192 и 512x512
export const size = {
    width: 512,
    height: 512,
};
export const contentType = 'image/png';

export default function Ico() {
    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: 240,
                    background: '#09090b', // Тёмный фон вашего приложения
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '24%', // Идеальное скругление для Android (maskable)
                    color: '#ffffff',
                    fontWeight: 'bold',
                    fontFamily: 'sans-serif',
                }}
            >
                💼 {/* Сюда можно поставить любой эмодзи или букву вашего бренда */}
            </div>
        ),
        {
            ...size,
        }
    );
}
