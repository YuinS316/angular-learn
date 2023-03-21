import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SingletonService {
  private targetMap = new Map<string, any>();

  constructor() {}

  registerByKey(key: string, target: any) {
    const isRegistered = this.targetMap.has(key);

    if (!isRegistered) {
      this.targetMap.set(key, target);
    }
  }

  getSingletonByKey(key: string) {
    const isRegistered = this.targetMap.has(key);

    return isRegistered ? this.targetMap.get(key) : null;
  }
}
