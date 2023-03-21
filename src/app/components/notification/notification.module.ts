import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponentComponent } from './notification-component/notification-component.component';
import { NotificationContainerComponent } from './notification-container/notification-container.component';

@NgModule({
  declarations: [
    NotificationComponentComponent,
    NotificationContainerComponent,
  ],
  imports: [CommonModule],
  exports: [NotificationComponentComponent, NotificationContainerComponent],
})
export class NotificationModule {}
