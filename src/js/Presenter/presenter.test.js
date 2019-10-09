/* eslint-disable max-len */
/* global document describe test expect */

import Model from '../Model/Model';
import View from '../View/View';
import Presenter from './Presenter';

const model = new Model({
  min: 0,
  max: 100,
  step: 1,
  from: 0,
  hasInterval: true,
  to: 100,
  isVertical: true,
  hasTip: true,
  theme: 'aqua',
});
document.body.innerHTML = `
<span class="lrs lrs_aqua">
  <span class="lrs__handle"></span>
  <span class="lrs__tip"></span>
  <span class="lrs__bar"></span>
  <span class="lrs__handle"></span>
  <span class="lrs__tip"></span>
</span>
<input class="range">
`;
const view = new View(document.querySelector('.range'));
const presenter = new Presenter(model, view);

describe('correctExtremeHandlePositions', () => {
  test('return 0 (handle = handleFrom, handlePosition < 0, hasInterval = false, isVertical = false)', () => {
    expect(presenter.correctExtremeHandlePositions(-1, view.handleFrom)).toBe(0);
  });

  test("return max-handle's-position (handle = handleFrom, handlePosition > max-handle's-position, hasInterval = false, isVertical= horizontal)", () => {
    const maxHandlePosition = view.slider.offsetWidth - view.handleFrom.offsetWidth;

    expect(presenter.correctExtremeHandlePositions(maxHandlePosition + 1, view.handleFrom)).toBe(maxHandlePosition);
  });

  test("returns handle's position (handle = handleFrom, handlePosition > 0 and < max handle's position, hasInterval = false)", () => {
    const maxHandlePosition = view.slider.offsetWidth - view.handleFrom.offsetWidth;
    const handlePosition = Math.floor(Math.random() * (maxHandlePosition - 0 + 1)) + 0;

    expect(presenter.correctExtremeHandlePositions(handlePosition, view.handleFrom)).toBe(handlePosition);
  });

  test('returns 0 (handle = handleFrom, handlePosition < 0, hasInterval = true)', () => {
    model.state.hasInterval = true;

    expect(presenter.correctExtremeHandlePositions(-1, view.handleFrom)).toBe(0);
  });

  test("returns handleTo's position (handle = handleFrom, handlePosition > handleTo's position, hasInterval = true)", () => {
    model.state.hasInterval = true;
    const handleToPosition = parseFloat(view.handleTo.style.left);

    expect(presenter.correctExtremeHandlePositions(handleToPosition + 1, view.handleFrom)).toBe(handleToPosition);
  });

  test("returns handle's position (handle = handleFrom, handlePosition > 0 and < handleTo's position, hasInterval = true)", () => {
    model.state.hasInterval = true;
    const handleToPosition = parseFloat(view.handleTo.style.left);
    const handlePosition = Math.floor(Math.random() * (handleToPosition - 0 + 1)) + 0;

    expect(presenter.correctExtremeHandlePositions(handlePosition, view.handleFrom)).toBe(handlePosition);
  });

  test("returns handleFrom's position (handle = handleTo, handlePosition < handleFrom's position, hasInterval = true)", () => {
    model.state.hasInterval = true;
    const minHandlePosition = parseFloat(view.handleFrom.style.left);

    expect(presenter.correctExtremeHandlePositions(minHandlePosition - 1, view.handleTo)).toBe(minHandlePosition);
  });

  test("returns max handle's position (handle = handleTo, handlePosition > max handle's position, hasInterval = true)", () => {
    model.state.hasInterval = true;
    const maxHandlePosition = view.slider.offsetWidth - view.handleTo.offsetWidth;

    expect(presenter.correctExtremeHandlePositions(maxHandlePosition + 1, view.handleTo)).toBe(maxHandlePosition);
  });

  test("returns handle's position (handle = handleTo, handlePosition > handleFrom's position and < max handle's position, hasInterval = true)", () => {
    model.state.hasInterval = true;
    const minHandlePosition = parseFloat(view.handleFrom.style.left);
    const maxHandlePosition = view.slider.offsetWidth - view.handleTo.offsetWidth;
    const handlePosition = Math.floor(Math.random() * (maxHandlePosition - minHandlePosition + 1))
          + minHandlePosition;

    expect(presenter.correctExtremeHandlePositions(handlePosition, view.handleTo)).toBe(handlePosition);
  });
});

describe('correctValueWithStep', () => {
  test('return value (value = min-value or value = max-value)', () => {
    expect(presenter.correctValueWithStep(model.state.min)).toBe(model.state.min);
    expect(presenter.correctValueWithStep(model.state.max)).toBe(model.state.max);
  });

  test('return correct value (value > min-value and value < max-value)', () => {
    model.state.min = 9;
    model.state.step = 3;
    const value = 11;
    const neededValue = 12;

    expect(presenter.correctValueWithStep(value)).toBe(neededValue);
  });
});
