export default interface IEventEmitter {
  subscribe(type: string, callback: Function): void;
  unsubscribe(type: string, callback: Function): void;
  notify(type: string, arg: object): void;
}
