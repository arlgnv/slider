export default interface IObserver {
  subscribe(type: string, cb: Function): void;
  unsubscribe(type: string, cb: Function): void;
  notify(type: string, arg?: Object): void;
}
