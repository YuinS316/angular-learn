import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageComponent } from './message-component/message.component';
import {
  MessagePageComponent,
  MessageSub,
} from '@/pages/message-page/message-page.component';
import { MessageContainerComponent } from './message-container/message-container.component';

import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
  declarations: [
    MessageComponent,
    MessagePageComponent,
    MessageContainerComponent,
    MessageSub,
  ],
  imports: [CommonModule, OverlayModule, BrowserAnimationsModule],
  exports: [MessageComponent, MessagePageComponent],
})
export class MessageModule {}
