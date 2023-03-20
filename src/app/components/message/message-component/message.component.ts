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
import { moveUpMotion } from '../move-animation';
import type { MessageType, MessageData, MessageOptions } from '../typings';
import { AnimationEvent } from '@angular/animations';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'u-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.sass'],
  animations: [moveUpMotion],
})
export class MessageComponent implements OnInit, OnDestroy {
  @Input() instance: MessageData;
  @Output() readonly destroyed = new EventEmitter<{
    id: string;
    userAction: boolean;
  }>();

  public options?: MessageOptions;
  public animationStateChanged: Subject<AnimationEvent> =
    new Subject<AnimationEvent>();

  //  通知container去销毁实例的定时器
  public closeTimer?: number;

  //  剩下多少时间关闭
  public eraseTimeLeft?: number;
  //  计算开始时间
  public eraseTimeStart?: number;
  //  计时器
  public eraseTimer?: number;

  constructor(public cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.options = this.instance.options;

    this.instance.state = 'enter';
    this.animationStateChanged
      .pipe(
        filter(
          (event) => event.phaseName === 'done' && event.toState === 'leave'
        ),
        take(1)
      )
      .subscribe(() => {
        clearTimeout(this.closeTimer);
        this.destroyed.next({ id: this.instance.messageId, userAction: false });
      });

    this.initErase();
    this.startEraseTimeout();
  }

  ngOnDestroy(): void {
    this.clearEraseTimeout();
    this.animationStateChanged.complete();
  }

  /**
   * 鼠标进入之后，暂停掉计时，并把之前消耗的时间记录下来
   */
  onEnter() {
    this.clearEraseTimeout();
    this.updateEraseTimeLeft();
  }

  /**
   * 鼠标离开之后，重新开始计时
   */
  onLeave() {
    this.startEraseTimeout();
  }

  /**
   * 销毁实例
   */
  destroy() {
    this.instance.state = 'leave';
    this.cdr.detectChanges();
    this.closeTimer = setTimeout(() => {
      this.closeTimer = null;
      //  通知container移除自己
      this.destroyed.next({
        id: this.instance.messageId,
        userAction: false,
      });
    }, 200);
  }

  /**
   * 初始化定时关闭相关的任务
   */
  initErase() {
    this.eraseTimeLeft = this.options.duration;
    this.eraseTimeStart = Date.now();
  }

  updateEraseTimeLeft() {
    this.eraseTimeLeft -= Date.now() - this.eraseTimeStart;
  }

  /**
   * 开始计时
   */
  startEraseTimeout() {
    if (this.eraseTimeLeft > 0) {
      this.clearEraseTimeout();
      this.eraseTimer = setTimeout(() => this.destroy(), this.eraseTimeLeft);
      this.eraseTimeStart = Date.now();
    } else {
      //  已经过期了清除
      this.destroy();
    }
  }

  /**
   * 清除定时器
   */
  clearEraseTimeout() {
    if (this.eraseTimer !== null) {
      clearTimeout(this.eraseTimer);
      this.eraseTimer = null;
    }
  }
}
