import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewEncapsulation,
  OnInit,
} from '@angular/core';
import type { MessageType, MessageData, MessageOptions } from '../typings';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'u-message-container',
  templateUrl: './message-container.component.html',
  styleUrls: ['./message-container.component.sass'],
})
export class MessageContainerComponent implements OnInit {
  public instances: MessageData[] = [];

  private config = {
    duration: 3000,
    maxStack: 7,
    pauseOnHover: false,
  };

  constructor(public cdr: ChangeDetectorRef) {}

  ngOnInit(): void {}

  /**
   * 更新视图
   */
  readyInstances(): void {
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
  beforeCreateInstance(instance: MessageData) {
    instance.options = this.mergeOptions(instance.options);

    return instance;
  }

  /**
   * 合并一些默认选项
   *
   * @param options
   * @returns
   */
  mergeOptions(options: MessageOptions) {
    return {
      ...this.config,
      ...options,
    };
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
    this.instances = [];
    this.readyInstances();
  }
}
