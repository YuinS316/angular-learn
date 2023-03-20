import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewEncapsulation, OnInit } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'u-message-container',
  templateUrl: './message-container.component.html',
  styleUrls: ['./message-container.component.sass']
})
export class MessageContainerComponent implements OnInit {

  public instances = [];

  constructor(
    public cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
  }

  readyInstances(): void {
    this.cdr.detectChanges();
  }

  create(data) {

  }
}
