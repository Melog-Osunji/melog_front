import type {ToastType, ToastPosition} from './Toast';

// 별도 파라미터 방식
type ShowHandler = (
  message: string,
  type?: ToastType,
  position?: ToastPosition,
  offset?: number,
) => void;
let handler: ShowHandler | null = null;

export const registerToastHandler = (h: ShowHandler | null) => {
  handler = h;
};

export const showToast = (
  message: string,
  type: ToastType = 'none',
  position: ToastPosition = 'top',
  offset: number = 82,
) => {
  handler?.(message, type, position, offset);
};
