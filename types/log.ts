// types/log.ts
export interface LogEntry {
    id: string;
    timestamp: string;
    level: 'info' | 'success' | 'error' | 'warning';
    message: string;
    details?: any;
    source: string; // 'parser' | 'api' | 'system'
}