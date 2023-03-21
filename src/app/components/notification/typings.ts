import { TemplateRef } from '@angular/core';
import type { Subject } from 'rxjs';

export type NotificationType =
  | 'success'
  | 'info'
  | 'warning'
  | 'error'
  | 'blank';

export interface NotificationData {
  type?: NotificationType | string;
  //  标题
  title?: string;
  //  内容
  content?: string;
  messageId?: string;
  //  创建时间
  createdAt?: Date;
  onClose?: Subject<boolean>;
  //  动画状态
  state?: 'enter' | 'leave';
  options?: NoticationOptions;
  //  自定义模板
  template?: TemplateRef<{}>;
}

export interface NoticationOptions<T = {}> {
  //  保留多久会被消除
  duration?: number;
  //  鼠标在上面的时候暂停该实例被销毁
  pauseOnHover?: boolean;
  //  上下文数据
  data?: T;
  //  自定义样式
  customStyle?: Record<string, any>;
  //  自定义类名
  customClass?: string;
}
