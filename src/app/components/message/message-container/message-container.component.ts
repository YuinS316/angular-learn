import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewEncapsulation,
  OnInit,
} from '@angular/core';
import { Subject } from 'rxjs';
import { UContainerComponent } from '../base-container.directive';
import type { MessageType, MessageData, MessageOptions } from '../typings';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'u-message-container',
  templateUrl: './message-container.component.html',
  styleUrls: ['./message-container.component.sass'],
})
export class MessageContainerComponent
  extends UContainerComponent
  implements OnInit
{
  constructor(public override cdr: ChangeDetectorRef) {
    super(cdr);
  }
}
