export default class EventEmitter {
  constructor() {
    this.events = {};
  }

  subscribe(type, callback) {
    this.events[type] = this.events[type] || [];
    this.events[type].push(callback);
  }

  notify(type, arg) {
    if (this.events[type]) {
      this.events[type].forEach((callback) => callback(arg));
    }
  }
}
