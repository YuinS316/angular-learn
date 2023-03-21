import { UContainerComponent } from '@/components/message/base-container.directive';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { NotificationData } from '../typings';

@Component({
  selector: 'u-notification-container',
  templateUrl: './notification-container.component.html',
  styleUrls: ['./notification-container.component.sass'],
})
export class NotificationContainerComponent
  extends UContainerComponent
  implements OnInit
{
  public override instances: NotificationData[] = [];

  public override config = {
    duration: 4500,
    maxStack: 7,
    pauseOnHover: false,
  };

  constructor(cdr: ChangeDetectorRef) {
    super(cdr);
  }

  override create(data: NotificationData): NotificationData {
    const instance = this.beforeCreateInstance(data);

    const key = instance.options.key;

    const notificationWithSameKey = this.instances.find(
      (ins) => ins.options.key === instance.options.key
    );

    if (key && notificationWithSameKey) {
      //  如果指明了key且key存在，说明是更新notification的内容
      this.updateNotification(notificationWithSameKey, instance);
    } else {
      //  超过最大容量，就移除掉第一个
      if (this.instances.length >= this.config.maxStack) {
        this.instances = this.instances.slice(1);
      }

      this.instances = [...this.instances, instance];
    }

    this.readyInstances();

    return instance;
  }

  protected override beforeCreateInstance(
    instance: NotificationData
  ): NotificationData {
    instance.options = this.mergeOptions(instance.options);
    instance.onClose = new Subject<boolean>();
    return instance;
  }

  /**
   * 更新notification
   */
  protected updateNotification(
    oldInstance: NotificationData,
    newInstance: NotificationData
  ) {
    const updateKeys: Array<keyof NotificationData> = [
      'title',
      'content',
      'template',
      'type',
      'options',
    ];

    updateKeys.forEach((key) => {
      const value: any = newInstance[key];
      oldInstance[key] = value;
    });
  }
}
