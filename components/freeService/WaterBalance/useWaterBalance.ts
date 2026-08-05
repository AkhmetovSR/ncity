import { useState, useMemo, useCallback } from "react";
import { WaterBalanceInputs, FormErrors } from "./types";
import { calculateWaterBalance, generateDocxTemplate } from "./calculator";

const initialInputs: WaterBalanceInputs = {
    organization: "МКП г. Нягани \"НРК\"",
    fio: "",
    address: "",
    phone: "",
    residents: 3,
    gardenArea: 0,
    hasBanya: false,
    hasPool: false,
    poolVolume: 10,
};

export function useWaterBalance() {
    const [inputs, setInputs] = useState<WaterBalanceInputs>(initialInputs);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const results = useMemo(() => calculateWaterBalance(inputs), [inputs]);

    const validateForm = useCallback((): boolean => {
        const newErrors: FormErrors = {};

        if (!inputs.organization.trim()) newErrors.organization = "Пожалуйста, укажите организацию";
        if (!inputs.fio.trim()) newErrors.fio = "Пожалуйста, введите ФИО собственника";
        if (!inputs.address.trim()) newErrors.address = "Укажите адрес объекта в Нягани";

        const digitsOnly = (inputs.phone || "").replace(/\D/g, "");
        if (!inputs.phone.trim()) {
            newErrors.phone = "Введите контактный телефон";
        } else if (digitsOnly.length < 11) {
            newErrors.phone = "Номер должен содержать 11 цифр";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [inputs.organization, inputs.fio, inputs.address, inputs.phone]);

    // НАВТИВНАЯ Senior-маска телефона прямо во время ввода: +7 (9XX) XXX-XX-XX
    const handlePhoneInputChange = useCallback((rawValue: string): string => {
        let input = rawValue.replace(/\D/g, "");
        if (!input) return "";

        if (input[0] === "7" || input[0] === "8") input = input.substring(1);
        input = input.substring(0, 10);

        let formatted = "+7 ";
        if (input.length > 0) formatted += "(" + input.substring(0, 3);
        if (input.length >= 3) formatted += ") ";
        if (input.length > 3) formatted += input.substring(3, 6);
        if (input.length >= 6) formatted += "-";
        if (input.length > 6) formatted += input.substring(6, 8);
        if (input.length >= 8) formatted += "-";
        if (input.length > 8) formatted += input.substring(8, 10);

        return formatted.trim();
    }, []);

    const handleInputChange = useCallback((key: keyof WaterBalanceInputs, value: string | number | boolean) => {
        let finalValue = value;
        if (key === 'phone' && typeof value === 'string') {
            finalValue = handlePhoneInputChange(value);
        }

        setInputs((prev) => ({ ...prev, [key]: finalValue }));
        setErrors((prev) => prev[key as keyof FormErrors] ? { ...prev, [key]: undefined } : prev);
    }, [handlePhoneInputChange]);

    const openPreview = useCallback(() => { if (validateForm()) setIsPreviewOpen(true); }, [validateForm]);
    const closePreview = useCallback(() => setIsPreviewOpen(false), []);

    const handlePrintPDF = useCallback(() => {
        if (!validateForm()) return;

        // 1. Находим наш готовый скрытый print-portal-root в DOM
        const printElement = document.getElementById("print-portal-root");
        if (!printElement) return;

        // 2. Создаем невидимый iframe на лету
        const iframe = document.createElement("iframe");
        iframe.style.position = "fixed";
        iframe.style.right = "0";
        iframe.style.bottom = "0";
        iframe.style.width = "0";
        iframe.style.height = "0";
        iframe.style.border = "none";
        iframe.style.visibility = "hidden";

        document.body.appendChild(iframe);

        const iframeDoc = iframe.contentWindow?.document;
        if (!iframeDoc) return;

        // 3. Записываем в iframe чистый HTML документа и базовые стили Times New Roman
        iframeDoc.open();
        iframeDoc.write(`
    <html lang="ru">
      <head>
        <title>Баланс БВВ Нягань</title>
        <style>
          body { font-family: "Times New Roman", Times, serif; font-size: 14px; line-height: 1.4; color: #000000; padding: 20px; }
          /* Копируем критические стили таблиц, чтобы они не зависели от CSS-модулей экрана */
          table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13px; table-layout: fixed; }
          th, td { border: 1px solid #000000; padding: 8px 6px; vertical-align: middle; word-wrap: break-word; }
          th { background-color: #f2f2f2; font-weight: bold; }
          h1 { font-size: 18px; font-weight: bold; text-transform: uppercase; text-align: center; margin: 0; }
          p { text-align: justify; }
          /* Стили шапки и подписей */
          .doc-header { display: flex; flex-direction: column; align-items: flex-end; margin-bottom: 40px; text-align: left; }
          .signatures { display: flex; justify-content: space-between; margin-top: 40px; }
        </style>
      </head>
      <body>
        ${printElement.innerHTML}
      </body>
    </html>
  `);
        iframeDoc.close();

        // 4. Ждем, пока iframe полностью загрузит контент в память устройства, и вызываем печать
        iframe.contentWindow?.focus();

        // КРИТИЧЕСКИЙ ТАКТИЛЬНЫЙ ФИКС ДЛЯ iPHONE:
        // Даем мобильному Safari 250мс, чтобы гарантированно построить внутренний DOM iFrame
        setTimeout(() => {
            iframe.contentWindow?.print();

            // После закрытия окна печати аккуратно удаляем iframe, чтобы не текла память
            setTimeout(() => {
                document.body.removeChild(iframe);
            }, 1000);
        }, 250);

    }, [validateForm]);



    const handleDownloadDocx = useCallback(() => {
        if (!validateForm()) return;

        const currentDate = new Date().toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' });
        const htmlContent = generateDocxTemplate(inputs, results, currentDate);
        const blob = new Blob(['\ufeff' + htmlContent], { type: 'application/octet-stream;charset=utf-8' });

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `BBV_Nyagan_${inputs.fio.replace(/\s+/g, '_') || 'document'}.doc`;
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, [inputs, results, validateForm]);

    return { inputs, results, errors, isPreviewOpen, handleInputChange, openPreview, closePreview, handlePrintPDF, handleDownloadDocx };
}
