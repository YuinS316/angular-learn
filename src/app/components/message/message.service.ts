import {
  Injectable,
  ChangeDetectorRef,
  Directive,
  EventEmitter,
  Injector,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ComponentType, Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { SingletonService } from '@components/shared/singleton.service';
import { MessageContainerComponent } from '@components/message/message-container/message-container.component';
import type { MessageType, MessageData, MessageOptions } from './typings';
import { UMessageBaseService } from './base-service';

@Injectable({
  providedIn: 'root',
})
export class MessageService extends UMessageBaseService {
  protected keyInSingleton = 'u-message';

  constructor(
    protected override singletonService: SingletonService,
    protected override overlay: Overlay,
    protected override injector: Injector
  ) {
    super(singletonService, overlay, injector);
  }

  success(content: string, options?: MessageOptions) {
    return this.createInstance(
      {
        type: 'success',
        content,
      },
      options
    );
  }

  error(content: string, options?: MessageOptions) {
    return this.createInstance(
      {
        type: 'error',
        content,
      },
      options
    );
  }

  info(content: string, options?: MessageOptions) {
    return this.createInstance(
      {
        type: 'info',
        content,
      },
      options
    );
  }

  warning(content: string, options?: MessageOptions) {
    return this.createInstance(
      {
        type: 'warning',
        content,
      },
      options
    );
  }

  loading(content: string, options?: MessageOptions) {
    return this.createInstance(
      {
        type: 'loading',
        content,
      },
      options
    );
  }

  create(
    type: MessageType | string,
    content: string,
    options?: MessageOptions
  ) {
    return this.createInstance({ type, content }, options);
  }

  /**
   * 创建实例
   * @private
   */
  private createInstance(message: MessageData, options?: MessageOptions) {
    this.container = this.withContainer(MessageContainerComponent);

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
