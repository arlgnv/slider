/* global test expect */

import EventEmitter from './EventEmitter';

test('attach callback to event', () => {
  const eventEmitter = new EventEmitter();
  const typeEvent = 'drag';
  eventEmitter.subscribe(typeEvent, () => "It's me");

  expect(eventEmitter.events[typeEvent].length).toBe(1);
});
