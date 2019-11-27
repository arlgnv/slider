type events = 'dispatchedParameters' | 'updatedState' | 'movedRunner' | 'selectedValue';
type subscribes = { [event in events]?: Function[] };

interface IObserver {
  subscribe(type: events, cb: Function): void;
  unsubscribe(type: events, cb: Function): void;
  notify(type: events, arg?: Object): void;
}

export { IObserver, subscribes, events };
