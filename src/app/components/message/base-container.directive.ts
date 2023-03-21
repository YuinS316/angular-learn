import { ChangeDetectorRef, Directive, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { MessageData, MessageOptions } from './typings';

@Directive()
export abstract class UContainerComponent implements OnInit, OnDestroy {
  public instances: MessageData[] = [];

  public config = {
    duration: 3000,
    maxStack: 7,
    pauseOnHover: false,
  };

  protected readonly destroy$ = new Subject<void>();

  constructor(public cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * 更新视图
   */
  protected readyInstances(): void {
    this.cdr.detectChanges();
  }

  /**
   * 创建新实例
   *
   * @param data
   * @returns
   */
  create(data: MessageData) {
    const instance = this.beforeCreateInstance(data);

    this.instances = [...this.instances, instance];

    this.readyInstances();

    return instance;
  }

  /**
   * 在创建实例之前做一些包装
   */
  protected beforeCreateInstance(instance: MessageData) {
    instance.options = this.mergeOptions(instance.options);
    instance.onClose = new Subject<boolean>();
    return instance;
  }

  /**
   * 合并一些默认选项
   *
   * @param options
   * @returns
   */
  protected mergeOptions(options: MessageOptions) {
    return {
      ...this.config,
      ...options,
    };
  }

  protected onRemove(instance: MessageData, userAction: boolean) {
    instance.onClose.next(userAction);
    instance.onClose.complete();
  }

  /**
   * 移除单个实例
   *
   * @param id
   * @param userAction
   */
  remove(id: string, userAction = false) {
    this.instances.some((instance, index) => {
      if (instance.messageId === id) {
        this.instances.splice(index, 1);
        this.instances = [...this.instances];
        this.onRemove(instance, userAction);
        this.readyInstances();
        return true;
      }
      return false;
    });
  }

  /**
   * 清空全部实例
   */
  removeAll() {
    this.instances.forEach((instance) => this.onRemove(instance, false));
    this.instances = [];
    this.readyInstances();
  }
}
