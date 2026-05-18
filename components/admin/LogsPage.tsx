// app/admin/logs/page.tsx
'use client';
import { useEffect, useState } from 'react';
import styles from '@/components/admin/LogsPage.module.css';
import { LogEntry } from '@/types/log';

export default function LogsPage() {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');

    useEffect(() => {
        loadLogs();
    }, []);

    const loadLogs = async () => {
        try {
            const response = await fetch('/api/logs');
            const data = await response.json();
            if (data.success) {
                setLogs(data.logs);
            }
        } catch (error) {
            console.error('Ошибка загрузки логов:', error);
        } finally {
            setLoading(false);
        }
    };

    const clearLogs = async () => {
        if (confirm('Очистить все логи?')) {
            await fetch('/api/logs', { method: 'DELETE' });
            await loadLogs();
        }
    };

    const getLevelIcon = (level: string) => {
        switch (level) {
            case 'success': return '✅';
            case 'error': return '❌';
            case 'warning': return '⚠️';
            default: return 'ℹ️';
        }
    };

    const filteredLogs = filter === 'all'
        ? logs
        : logs.filter(log => log.level === filter);

    if (loading) {
        return <div className={styles.loading}>Загрузка логов...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>📋 Логи парсинга</h1>
                <div className={styles.controls}>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className={styles.filter}
                    >
                        <option value="all">Все</option>
                        <option value="info">ℹ️ Инфо</option>
                        <option value="success">✅ Успех</option>
                        <option value="warning">⚠️ Предупреждения</option>
                        <option value="error">❌ Ошибки</option>
                    </select>
                    <button onClick={clearLogs} className={styles.clearButton}>
                        🗑️ Очистить
                    </button>
                    <button onClick={loadLogs} className={styles.refreshButton}>
                        🔄 Обновить
                    </button>
                </div>
            </div>

            <div className={styles.stats}>
                Всего: {logs.length} |
                По фильтру: {filteredLogs.length}
            </div>

            <div className={styles.logsList}>
                {filteredLogs.length === 0 ? (
                    <div className={styles.empty}>Логов нет</div>
                ) : (
                    filteredLogs.map((log) => (
                        <div key={log.id} className={`${styles.logEntry} ${styles[log.level]}`}>
                            <div className={styles.logHeader}>
                                <span className={styles.logIcon}>{getLevelIcon(log.level)}</span>
                                <span className={styles.logTime}>
                                    {new Date(log.timestamp).toLocaleString()}
                                </span>
                                <span className={styles.logSource}>[{log.source}]</span>
                            </div>
                            <div className={styles.logMessage}>{log.message}</div>
                            {log.details && (
                                <details className={styles.logDetails}>
                                    <summary>Детали</summary>
                                    <pre>{JSON.stringify(log.details, null, 2)}</pre>
                                </details>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}