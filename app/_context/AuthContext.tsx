// app/_context/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    isAnonymous?: boolean;
}

interface AuthContextType {
    user: User | null;
    loading: boolean; // Добавляем сеньорский флаг загрузки сессии
    refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // Функция запроса текущей сессии с сервера
    const refreshSession = async () => {
        try {
            const res = await fetch('/vacancy/api/auth/me');
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            }
        } catch (err) {
            console.error('Ошибка проверки сессии:', err);
        } finally {
            setLoading(false);
        }
    };

    // Проверяем скрытую анонимную куку сразу при холодном старте приложения в браузере
    useEffect(() => {
        void refreshSession();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, refreshSession }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth должен использоваться внутри AuthProvider');
    }
    return context;
}
