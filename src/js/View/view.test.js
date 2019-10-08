/* global test expect describe afterEach document */

import View from './View';

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

describe('changeHandlePosition', () => {
  afterEach(() => {
    view.handleFrom.style.cssText = '';
    view.handleTo.style.cssText = '';
  });

  test('move right handle', () => {
    view.changeHandlePosition(view.handleFrom, 100, 'left');
    expect(parseFloat(view.handleFrom.style.left)).toBe(100);

    view.changeHandlePosition(view.handleTo, 100, 'left');
    expect(parseFloat(view.handleTo.style.left)).toBe(100);
  });

  test('move handle to right direction', () => {
    view.changeHandlePosition(view.handleFrom, 100, 'left');
    expect(parseFloat(view.handleFrom.style.left)).toBe(100);

    view.changeHandlePosition(view.handleFrom, 100, 'bottom');
    expect(parseFloat(view.handleFrom.style.bottom)).toBe(100);
  });
});

describe('changeTipPosition', () => {
  afterEach(() => {
    view.tipFrom.style.cssText = '';
    view.tipTo.style.cssText = '';
  });

  test('move right tip', () => {
    view.changeTipPosition(view.tipFrom, 100, 'left');
    expect(parseFloat(view.tipFrom.style.left)).toBe(100);

    view.changeTipPosition(view.tipTo, 100, 'left');
    expect(parseFloat(view.tipTo.style.left)).toBe(100);
  });

  test('move tip to right direction', () => {
    view.changeTipPosition(view.tipFrom, 100, 'left');
    expect(parseFloat(view.tipFrom.style.left)).toBe(100);

    view.changeTipPosition(view.tipFrom, 100, 'bottom');
    expect(parseFloat(view.tipFrom.style.bottom)).toBe(100);
  });
});

describe('changeTipText', () => {
  afterEach(() => {
    view.tipFrom.textContent = '';
  });

  test('change text on tip', () => {
    view.changeTipText(view.tipFrom, 'lalala');
    expect(view.tipFrom.textContent).toBe('lalala');
  });
});

describe('changeBarFilling', () => {
  afterEach(() => {
    view.bar.style.cssText = '';
  });

  test('correct fill bar', () => {
    view.changeBarFilling(10, 100, ['left', 'right']);

    expect(parseFloat(view.bar.style.left)).toBe(10);
    expect(parseFloat(view.bar.style.right)).toBe(100);
  });
});

describe('changeValue', () => {
  test('correct change value with 1 arg', () => {
    view.changeValue([50]);
    expect(view.input.value).toBe('50');

    view.changeValue([50, 300]);
    expect(view.input.value).toBe('50 - 300');
  });
});
