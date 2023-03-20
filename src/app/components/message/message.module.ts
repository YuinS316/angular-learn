import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageComponent } from './message-component/message.component';
import {MessagePageComponent} from "@/pages/message-page/message-page.component";
import { MessageContainerComponent } from './message-container/message-container.component';



@NgModule({
  declarations: [
    MessageComponent,
    MessagePageComponent,
    MessageContainerComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MessageComponent,
    MessagePageComponent
  ]
})
export class MessageModule { }
