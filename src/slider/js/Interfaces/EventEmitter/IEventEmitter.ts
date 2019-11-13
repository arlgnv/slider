export default interface IEventEmitter {
  subscribe(type: string, cb: Function): void;
  unsubscribe(type: string, cb: Function): void;
  notify(type: string, arg?: Object): void;
}
