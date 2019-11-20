import IObserver from '../Interfaces/Observer/IObserver';
import IEvents from '../Interfaces/Observer/IEvents';

export default class Observer implements IObserver {
  private events: IEvents = {};

  public subscribe(type: string, cb: Function): void {
    this.events[type] = this.events[type] ? [...this.events[type], cb] : [cb];
  }

  public unsubscribe(type: string, cb: Function): void {
    if (this.events[type]) {
      this.events[type] = this.events[type].filter(callback => callback !== cb);
    }
  }

  public notify(type: string, arg?: Object): void {
    if (this.events[type]) {
      this.events[type].forEach(cb => cb(arg));
    }
  }
}
