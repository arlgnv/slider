import Observer from './Observer';

test('attach callback to event', () => {
  const eventEmitter: Observer = new Observer();
  const typeEvent: string = 'drag';
  const callback = (arg: any): void => console.log(arg);

  eventEmitter.subscribe(typeEvent, callback);
  eventEmitter.notify(typeEvent, 1);

  // expect(eventEmitter.events[typeEvent].length).toBe(1);
});
