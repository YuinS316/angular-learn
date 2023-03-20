import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  public timer: number | null = null;

  getRxjsData() {
    return new Observable<number>((observer) => {
      let count = 0;
      this.timer = setInterval(() => {
        observer.next(++count);
      }, 1000);

      setTimeout(() => {
        if (this.timer) {
          clearInterval(this.timer);
          this.timer = null;
        }
      }, 4001);
    });
  }
}
