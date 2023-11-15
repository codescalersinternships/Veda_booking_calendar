import { ToastOptions, ToastType, createToast } from 'mosha-vue-toastify';
import 'mosha-vue-toastify/dist/style.css';

export enum NotificationType {
  error = 'danger',
  warn = 'warning',
  success = 'success',
  info = 'info',
}

export class Notification {
  private static notify(text: string, options: ToastOptions) {
    options.position = 'bottom-center';
    options.hideProgressBar = true;
    options.timeout = 3000;

    return createToast(text, options);
  }
  static error(text: string, options: ToastOptions) {
    return this.notify(text, { ...options, type: NotificationType.error, toastBackgroundColor: '#d40000' });
  }

  static warn(text: string, options: ToastOptions) {
    return this.notify(text, { ...options, type: NotificationType.warn, toastBackgroundColor: '#ae9929' });
  }

  static info(text: string, options: ToastOptions) {
    return this.notify(text, { ...options, type: NotificationType.info, toastBackgroundColor: '#ae9929' });
  }
}
