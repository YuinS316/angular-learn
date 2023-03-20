import { Injectable, ChangeDetectorRef, Directive, EventEmitter, Injector, OnDestroy, OnInit } from "@angular/core";
import { ComponentType, Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {SingletonService} from "@components/message/singleton.service";
import {MessageContainerComponent} from "@components/message/message-container/message-container.component";

export type MessageType = 'success' | 'info' | 'warning' | 'error' | 'loading';

export interface MessageData {
  type?: MessageType | string;
  content?: string;
  messageId?: string;
  createdAt?: Date;
  onClose?: Function;
}

@Injectable()
export class MessageService {

  public keyInSingleton = "u-message"

  public container?: MessageContainerComponent;

  static globalCountId = 0;

  constructor(
    public singletonService: SingletonService,
    public overlay: Overlay,
    private injector: Injector
  ) {
  }

  success(content: string) {
    return this.createInstance({
      type: "success",
      content
    });
  }

  error(content: string) {
    return this.createInstance({
      type: "error",
      content
    });
  }

  info(content: string) {
    return this.createInstance({
      type: "info",
      content
    });
  }

  warning(content: string) {
    return this.createInstance({
      type: "warning",
      content
    });
  }

  loading(content: string) {
    return this.createInstance({
      type: "loading",
      content
    });
  }

  create(type: MessageType | string, content: string) {
    return this.createInstance({ type, content });
  }

  /**
   * 创建实例
   * @private
   */
  private createInstance(message: MessageData) {
    this.container = this.withContainer(MessageContainerComponent);

    this.container.create({
      ...message,
      ...{
        createdAt: new Date(),
        messageId: this.getInstanceId(),
      }
    })
  }

  getInstanceId() {
    return `${this.keyInSingleton}-${MessageService.globalCountId++}`
  }

  withContainer<T extends MessageContainerComponent>(ctor: ComponentType<T>): T {
    let containerInstance = this.singletonService.getSingletonByKey(this.keyInSingleton);
    if (containerInstance) {
      return containerInstance;
    }

    const overlayRef = this.overlay.create({
      hasBackdrop: false,
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      positionStrategy: this.overlay.position().global()
    });

    const componentPortal = new ComponentPortal(ctor, null, this.injector);
    const componentRef = overlayRef.attach(componentPortal);
    const overlayPane = overlayRef.overlayElement;
    overlayPane.style.zIndex = '999';

    if (!containerInstance) {
      containerInstance = componentRef.instance;
      this.singletonService.registerByKey(this.keyInSingleton, containerInstance);
    }

    return containerInstance;
  }
}
