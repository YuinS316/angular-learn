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
import { SingletonService } from '@components/message/singleton.service';
import { MessageContainerComponent } from '@components/message/message-container/message-container.component';
import type { MessageType, MessageData, MessageOptions } from './typings';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  protected keyInSingleton = 'u-message';

  protected container?: MessageContainerComponent;

  static globalCountId = 0;

  constructor(
    protected singletonService: SingletonService,
    protected overlay: Overlay,
    protected injector: Injector
  ) {}

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

    this.container.create({
      ...message,
      ...{
        createdAt: new Date(),
        messageId: this.getInstanceId(),
        options,
      },
    });
  }

  protected getInstanceId() {
    return `${this.keyInSingleton}-${MessageService.globalCountId++}`;
  }

  /**
   * 返回用Portal包裹过的container实例
   *
   * @param ctor
   * @returns
   */
  protected withContainer<T extends MessageContainerComponent>(
    ctor: ComponentType<T>
  ): T {
    let containerInstance = this.singletonService.getSingletonByKey(
      this.keyInSingleton
    );
    if (containerInstance) {
      return containerInstance;
    }

    const overlayRef = this.overlay.create({
      hasBackdrop: false,
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      positionStrategy: this.overlay.position().global(),
    });

    const componentPortal = new ComponentPortal(ctor, null, this.injector);
    const componentRef = overlayRef.attach(componentPortal);
    const overlayPane = overlayRef.overlayElement;
    overlayPane.style.zIndex = '999';

    if (!containerInstance) {
      containerInstance = componentRef.instance;
      this.singletonService.registerByKey(
        this.keyInSingleton,
        containerInstance
      );
    }

    return containerInstance;
  }
}
