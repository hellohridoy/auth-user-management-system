import { Injectable, signal } from '@angular/core';

export interface Toast {
    id: string;
    type: 'success' | 'error' | 'info';
    message: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
    toasts = signal<Toast[]>([]);

    show(type: Toast['type'], message: string, duration = 4000): void {
        const id = Math.random().toString(36).substr(2, 9);
        const toast: Toast = { id, type, message };
        this.toasts.update(t => [...t, toast]);
        setTimeout(() => this.remove(id), duration);
    }

    success(message: string): void { this.show('success', message); }
    error(message: string): void { this.show('error', message); }
    info(message: string): void { this.show('info', message); }

    remove(id: string): void {
        this.toasts.update(t => t.filter(toast => toast.id !== id));
    }
}
