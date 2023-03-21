import { Component, OnInit } from '@angular/core';
import { MessageService } from '@components/message/message.service';
import { concatMap } from 'rxjs';

@Component({
  selector: 'app-message-page',
  templateUrl: './message-page.component.html',
  styleUrls: ['./message-page.component.sass'],
})
export class MessagePageComponent implements OnInit {
  constructor(public messageService: MessageService) {}

  ngOnInit(): void {}

  handleSuccess() {
    this.messageService
      .success(' test success', { duration: 100 })
      .onClose.pipe(
        concatMap(() => this.messageService.info(' test info').onClose),
        concatMap(() => this.messageService.info(' test info').onClose)
      )
      .subscribe(() => {
        console.log('done');
      });
  }
}

@Component({
  selector: 'app-message-sub',
  template: `
    <div>
      <h5>message-sub</h5>
      <button class="rounded border p-2" (click)="handleSuccess()">info</button>
    </div>
  `,
})
export class MessageSub {
  constructor(public messageService: MessageService) {}
  handleSuccess() {
    this.messageService.success('info');
  }
}
