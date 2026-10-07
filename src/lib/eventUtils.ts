import type { Event as EventModel } from '../store/useStore';

export interface Countdown {
  status: 'future' | 'today' | 'past';
  days: number;
  hours: number;
  minutes: number;
}

export const eventTypeMeta: Record<EventModel['type'], { label: string; emoji: string }> = {
  casamento: { label: 'Casamento', emoji: '💒' },
  '15 anos': { label: 'Festa de 15 anos', emoji: '🎉' },
  aniversario: { label: 'Aniversário', emoji: '🎂' },
  corporativo: { label: 'Corporativo', emoji: '🏢' },
  outro: { label: 'Outro', emoji: '✨' },
};

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function normalizeName(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ');
}

export function safeHex(value: string, fallback: string): string {
  return /^#[0-9a-fA-F]{6}$/.test(value) ? value : fallback;
}

export function getCountdown(date: string, time?: string, now: Date = new Date()): Countdown {
  if (!date) {
    return { status: 'past', days: 0, hours: 0, minutes: 0 };
  }
  const target = new Date(`${date}T${time || '00:00'}:00`);
  if (Number.isNaN(target.getTime())) {
    return { status: 'past', days: 0, hours: 0, minutes: 0 };
  }
  const diff = target.getTime() - now.getTime();
  if (diff > 0) {
    return {
      status: 'future',
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    };
  }
  const sameCivilDay =
    target.getFullYear() === now.getFullYear() &&
    target.getMonth() === now.getMonth() &&
    target.getDate() === now.getDate();
  if (sameCivilDay) {
    return { status: 'today', days: 0, hours: 0, minutes: 0 };
  }
  return { status: 'past', days: 0, hours: 0, minutes: 0 };
}

export function timeAgo(iso?: string): string {
  if (!iso) return '';
  const then = new Date(iso);
  if (Number.isNaN(then.getTime())) return '';
  const diffMs = Date.now() - then.getTime();
  const minutes = Math.floor(diffMs / (1000 * 60));
  if (minutes < 1) return 'agora há pouco';
  if (minutes < 60) return `há ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `há ${hours} h`;
  return then.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

export function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function parsePrice(input: string): number {
  let s = input.replace(/R\$/gi, '').replace(/\s/g, '');
  if (!s) return NaN;
  const hasDot = s.includes('.');
  const hasComma = s.includes(',');
  if (hasDot && hasComma) {
    s = s.replace(/\./g, '').replace(',', '.');
  } else if (hasComma) {
    s = s.replace(',', '.');
  } else if (hasDot && /^\d{1,3}(\.\d{3})+$/.test(s)) {
    s = s.replace(/\./g, '');
  }
  return Number(s);
}

export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // tenta o fallback abaixo
  }
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const MAX_RESULT_BYTES = 500 * 1024;
const MAX_WIDTH = 1280;

function approxDataUrlBytes(dataUrl: string): number {
  const comma = dataUrl.indexOf(',');
  const payload = comma >= 0 ? dataUrl.length - comma - 1 : dataUrl.length;
  return Math.round((payload * 3) / 4);
}

export function compressImage(file: File): Promise<string> {
  if (file.size > MAX_UPLOAD_BYTES) {
    return Promise.reject(new Error('Imagem muito grande. Escolha um arquivo de até 8 MB.'));
  }
  if (!file.type.startsWith('image/')) {
    return Promise.reject(new Error('O arquivo selecionado não é uma imagem.'));
  }
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      try {
        const naturalW = img.naturalWidth || MAX_WIDTH;
        const naturalH = img.naturalHeight || MAX_WIDTH;
        const needsResize = naturalW > MAX_WIDTH;
        let width = needsResize ? MAX_WIDTH : naturalW;
        let height = needsResize ? Math.round((naturalH * MAX_WIDTH) / naturalW) : naturalH;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Não foi possível processar a imagem.'));
          return;
        }
        let quality = 0.75;
        const draw = () => {
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          return canvas.toDataURL('image/jpeg', quality);
        };
        let dataUrl = draw();
        let guard = 0;
        while (approxDataUrlBytes(dataUrl) > MAX_RESULT_BYTES && guard < 8) {
          guard += 1;
          if (quality > 0.35) {
            quality = Math.max(0.35, quality - 0.15);
          } else if (width > 640) {
            width = Math.max(640, Math.round(width * 0.75));
            height = Math.max(1, Math.round((naturalH * width) / naturalW));
          } else {
            break;
          }
          dataUrl = draw();
        }
        resolve(dataUrl);
      } catch {
        reject(new Error('Não foi possível processar a imagem.'));
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Não foi possível ler a imagem.'));
    };
    img.src = objectUrl;
  });
}

