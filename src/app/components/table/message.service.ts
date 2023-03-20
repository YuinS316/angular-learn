import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class MessageService {
  public subject = new BehaviorSubject(null);

  setMessage(value: any) {
    this.subject.next(value);
  }
}
