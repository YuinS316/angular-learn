import type { Subject } from 'rxjs';

export type MessageType = 'success' | 'info' | 'warning' | 'error' | 'loading';

export interface MessageData {
  type?: MessageType | string;
  content?: string;
  messageId?: string;
  //  创建时间
  createdAt?: Date;
  onClose?: Subject<boolean>;
  //  动画状态
  state?: 'enter' | 'leave';
  options?: MessageOptions;
}

export interface MessageOptions {
  //  保留多久会被消除
  duration?: number;
  //  鼠标在上面的时候暂停该实例被销毁
  pauseOnHover?: boolean;
}
