import { IObserver, ISubscribes, events } from '../Interfaces/Observer/IObserver';

export default class Observer implements IObserver {
  private events: ISubscribes = {};

  public subscribe(type: events, cb: Function): void {
    this.events[type] = this.events[type] ? [...this.events[type], cb] : [cb];
  }

  public unsubscribe(type: events, cb: Function): void {
    if (this.events[type]) {
      this.events[type] = this.events[type].filter(callback => callback !== cb);
    }
  }

  public notify(type: events, arg?: Object): void {
    if (this.events[type]) {
      this.events[type].forEach(cb => cb(arg));
    }
  }
}
