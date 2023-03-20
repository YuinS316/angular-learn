import { Component, OnInit } from '@angular/core';
import { MessageService } from '@components/message/message.service';

@Component({
  selector: 'app-image-page',
  templateUrl: './image-page.component.html',
  styleUrls: ['./image-page.component.sass'],
})
export class ImagePageComponent implements OnInit {
  constructor(public messageService: MessageService) {}

  ngOnInit(): void {
    this.messageService.info('test');
  }

  handleClick() {}
}
