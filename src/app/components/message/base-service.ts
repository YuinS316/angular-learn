import { ComponentType, Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injector } from '@angular/core';
import { SingletonService } from '../shared/singleton.service';
import { UContainerComponent } from './base-container.directive';

let globalCountId = 0;

export abstract class UMessageBaseService {
  protected container;
  protected abstract keyInSingleton: string;

  constructor(
    protected singletonService: SingletonService,
    protected overlay: Overlay,
    protected injector: Injector
  ) {}

  remove(id?: string) {
    if (this.container) {
      if (id) {
        this.container.remove(id);
      } else {
        this.container.removeAll();
      }
    }
  }

  protected getInstanceId() {
    return `${this.keyInSingleton}-${globalCountId++}`;
  }

  /**
   * 返回用Portal包裹过的container实例
   *
   * @param ctor
   * @returns
   */
  protected withContainer<T extends UContainerComponent>(
    ctor: ComponentType<T>
  ): T {
    let containerInstance: T = this.singletonService.getSingletonByKey(
      this.keyInSingleton
    );
    if (containerInstance) {
      return containerInstance as T;
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

    return containerInstance as T;
  }
}
