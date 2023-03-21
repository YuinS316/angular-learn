import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { filter, Subject, take } from 'rxjs';
import { moveUpMotion } from '@components/shared/move-animation';
import type { MessageType, MessageData, MessageOptions } from '../typings';
import { AnimationEvent } from '@angular/animations';
import { UComponent } from '../base-component.directive';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'u-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.sass'],
  animations: [moveUpMotion],
})
export class MessageComponent extends UComponent implements OnInit, OnDestroy {
  @Input() override instance: MessageData;
  @Output() override readonly destroyed = new EventEmitter<{
    id: string;
    userAction: boolean;
  }>();

  constructor(public override cdr: ChangeDetectorRef) {
    super(cdr);
  }
}
