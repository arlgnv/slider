import IEventEmitter from '../Interfaces/EventEmitter/IEventEmitter';
import IEvents from '../Interfaces/EventEmitter/IEvents';

export default class EventEmitter implements IEventEmitter {
  private events: IEvents = {};

  public subscribe(type: string, cb: Function): void {
    this.events[type] = this.events[type] || [];

    this.events[type] = [...this.events[type], cb];
  }

  public unsubscribe(type: string, cb: Function): void {
    if (this.events[type]) {
      this.events[type] = this.events[type].filter(callback => callback !== cb);
    }
  }

  public notify(type: string, arg: object): void {
    if (this.events[type]) this.events[type].forEach(cb => cb(arg));
  }
}
