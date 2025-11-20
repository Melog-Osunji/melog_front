import type {ToastType} from './Toast';

type ShowHandler = (message: string, type?: ToastType) => void;
let handler: ShowHandler | null = null;

export const registerToastHandler = (h: ShowHandler | null) => {
  handler = h;
};

export const showToast = (message: string, type: ToastType = 'none') => {
  handler?.(message, type);
};
