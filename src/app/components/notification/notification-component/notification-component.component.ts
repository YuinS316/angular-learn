import { UComponent } from '@/components/message/base-component.directive';
import { notificationMotion } from '@/components/shared/notification-animation';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { NotificationData } from '../typings';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'u-notification',
  templateUrl: './notification-component.component.html',
  styleUrls: ['./notification-component.component.sass'],
  animations: [notificationMotion],
})
export class NotificationComponentComponent extends UComponent {
  @Input() override instance: NotificationData;
  @Output() override readonly destroyed = new EventEmitter<{
    id: string;
    userAction: boolean;
  }>();

  constructor(cdr: ChangeDetectorRef) {
    super(cdr);
  }

  close(): void {
    this.destroy(true);
  }
}
