/* eslint-disable import/extensions */
/* global describe it assert mocha */
import EventEmitter from '../../app/event-emitter.js';

describe('EventEmitter', () => {
  it('attach callback to event', () => {
    const eventEmitter = new EventEmitter();
    const typeEvent = 'drag';
    eventEmitter.subscribe(typeEvent, () => "It's me");

    assert.equal(eventEmitter.events[typeEvent].length, 1);
  });
});

mocha.run();
