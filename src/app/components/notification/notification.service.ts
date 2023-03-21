import { Overlay } from '@angular/cdk/overlay';
import { Injectable, Injector, TemplateRef } from '@angular/core';
import { UMessageBaseService } from '../message/base-service';
import { SingletonService } from '../shared/singleton.service';
import { NotificationContainerComponent } from './notification-container/notification-container.component';
import {
  NotificationData,
  NoticationOptions,
  NotificationType,
} from './typings';
@Injectable({
  providedIn: 'root',
})
export class NotificationService extends UMessageBaseService {
  protected keyInSingleton = 'u-notification';

  constructor(
    protected override singletonService: SingletonService,
    protected override overlay: Overlay,
    protected override injector: Injector
  ) {
    super(singletonService, overlay, injector);
  }

  success(title: string, content: string, options?: NoticationOptions) {
    return this.createInstance(
      {
        type: 'success',
        title,
        content,
      },
      options
    );
  }

  error(title: string, content: string, options?: NoticationOptions) {
    return this.createInstance(
      {
        type: 'error',
        title,
        content,
      },
      options
    );
  }

  info(title: string, content: string, options?: NoticationOptions) {
    return this.createInstance(
      {
        type: 'info',
        title,
        content,
      },
      options
    );
  }

  warning(title: string, content: string, options?: NoticationOptions) {
    return this.createInstance(
      {
        type: 'warning',
        title,
        content,
      },
      options
    );
  }

  blank(title: string, content: string, options?: NoticationOptions) {
    return this.createInstance(
      {
        type: 'blank',
        title,
        content,
      },
      options
    );
  }

  template(template: TemplateRef<{}>, options?: NoticationOptions) {
    return this.createInstance({ template }, options);
  }

  create(
    type: NotificationType | string,
    title: string,
    content: string,
    options?: NoticationOptions
  ) {
    return this.createInstance({ type, title, content }, options);
  }

  /**
   * 创建实例
   * @private
   */
  private createInstance(
    message: NotificationData,
    options?: NoticationOptions
  ) {
    this.container = this.withContainer(NotificationContainerComponent);

    return this.container.create({
      ...message,
      ...{
        createdAt: new Date(),
        messageId: this.getInstanceId(),
        options,
      },
    });
  }
}
