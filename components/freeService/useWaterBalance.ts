import { useState, useMemo, useCallback } from "react";
import { WaterBalanceInputs, FormErrors } from "./types";
import { calculateWaterBalance, generateDocxTemplate } from "@/components/freeService/calculator";

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
        } else if (digitsOnly.length < 10) {
            newErrors.phone = "Номер должен содержать минимум 10 цифр";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [inputs.organization, inputs.fio, inputs.address, inputs.phone]);

    const handleInputChange = useCallback((key: keyof WaterBalanceInputs, value: string | number | boolean) => {
        setInputs((prev) => ({ ...prev, [key]: value }));
        setErrors((prev) => prev[key as keyof FormErrors] ? { ...prev, [key]: undefined } : prev);
    }, []);

    const openPreview = useCallback(() => {
        if (validateForm()) setIsPreviewOpen(true);
    }, [validateForm]);

    const closePreview = useCallback(() => setIsPreviewOpen(false), []);

    const handleDownloadDocx = useCallback(() => {
        if (!validateForm()) return;

        const currentDate = new Date().toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' });
        const htmlContent = generateDocxTemplate(inputs, results, currentDate);
        const blob = new Blob(['\ufeff' + htmlContent], { type: 'application/msword;charset=utf-8' });

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `БВВ_Нягань_${inputs.fio.replace(/\s+/g, '_') || 'документ'}.doc`;

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, [inputs, results, validateForm]);

    return {
        inputs,
        results,
        errors,
        isPreviewOpen,
        handleInputChange,
        openPreview,
        closePreview,
        handleDownloadDocx
    };
}
