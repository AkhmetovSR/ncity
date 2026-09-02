// app/vacancy/_schemas/vacancyValidation.ts
import { z } from 'zod';

/**
 * Собственная функция экранирования HTML-тегов для защиты от XSS.
 * Превращает опасные символы в безопасные HTML-сущности.
 */
function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}

// Базовый валидатор: очищает пробелы, проверяет тип, а в конце экранирует HTML
const safeString = z.string().trim();

export const vacancyCreateSchema = z.object({
    // Сначала проверяем длину строки, а затем трансформируем её через .transform()
    profession: safeString
        .min(3, { message: 'Название должности слишком короткое (минимум 3 символа)' })
        .max(100, { message: 'Название должности не должно превышать 100 символов' })
        .transform(escapeHtml),

    organization: safeString
        .min(2, { message: 'Название компании слишком короткое (минимум 2 символа)' })
        .max(100, { message: 'Название компании не должно превышать 100 символов' })
        .transform(escapeHtml),

    description: safeString
        .min(10, { message: 'Описание обязанностей должно быть более подробным (минимум 10 символов)' })
        .max(3000, { message: 'Описание не должно превышать 3000 символов' })
        .transform(escapeHtml),

    // Необязательные поля: если строка передана, проверяем длину и экранируем
    salary: safeString
        .max(30, { message: 'Зарплата слишком длинная (максимум 30 символов)' })
        .transform(escapeHtml)
        .optional(),

    district: safeString
        .max(100, { message: 'Название района слишком длинное (максимум 100 символов)' })
        .transform(escapeHtml)
        .optional(),

    schedule: safeString
        .max(50, { message: 'График работы слишком длинный (максимум 50 символов)' })
        .transform(escapeHtml)
        .optional(),

    requirements: safeString
        .max(2000, { message: 'Требования не должны превышать 2000 символов' })
        .transform(escapeHtml)
        .optional(),
});

// Типизация для бэкенда
export type VacancyCreateInput = z.infer<typeof vacancyCreateSchema>;
