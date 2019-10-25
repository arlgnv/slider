import IEvents from './IEvents';

export default class EventEmitter {
  private events: IEvents = {};

  subscribe(type: string, callback: Function): void {
    this.events[type] = this.events[type] || [];
    this.events[type].push(callback);
  }

  notify(type: string, arg: any): void {
    if (this.events[type]) {
      this.events[type].forEach(callback => callback(arg));
    }
  }
}
