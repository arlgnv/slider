import EventEmitter from './EventEmitter';

test('attach callback to event', () => {
  const eventEmitter: EventEmitter = new EventEmitter();
  const typeEvent: string = 'drag';
  const callback = (arg: any): void => console.log(arg);

  eventEmitter.subscribe(typeEvent, callback);
  eventEmitter.notify(typeEvent, 1);

  // expect(eventEmitter.events[typeEvent].length).toBe(1);
});
