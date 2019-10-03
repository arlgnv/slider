/* eslint-disable import/extensions */
/* global document describe it assert mocha afterEach */
import View from '../../app/mvp/view.js';

const view = new View(document.querySelector('.range'), '<span class="lrs lrs_aqua"><span class="lrs__handle lrs__handle_from"></span><span class="lrs__tip lrs__tip_from"></span><span class="lrs__bar"></span><span class="lrs__handle lrs__handle_to"></span><span class="lrs__tip lrs__tip_to"></span></span>');

describe('View', () => {
  describe('Methods', () => {
    describe('changeHandlePosition', () => {
      afterEach(() => {
        view.handleFrom.style.cssText = '';
      });

      it('change property on right handle', () => {
        const position = 100;

        view.changeHandlePosition(view.handleFrom, position);

        assert.notEqual(position, parseFloat(view.handleTo.style.left));
      });

      it('change left property if view doesn\'t equal vertical', () => {
        view.changeHandlePosition(view.handleFrom, 100);

        assert.equal(100, parseFloat(view.handleFrom.style.left));
      });

      it('change bottom property if view equal vertical', () => {
        view.changeHandlePosition(view.handleFrom, 100, 'vertical');

        assert.equal(100, parseFloat(view.handleFrom.style.bottom));
      });
    });

    describe('changeTipPosition', () => {
      afterEach(() => {
        view.tipFrom.style.cssText = '';
      });

      it('change property on right handle', () => {
        const position = 100;

        view.changeTipPosition(view.tipFrom, position);

        assert.notEqual(position, parseFloat(view.tipTo.style.left));
      });

      it('change left property if view doesn\'t equal vertical', () => {
        view.changeTipPosition(view.tipFrom, 100);

        assert.equal(100, parseFloat(view.tipFrom.style.left));
      });

      it('change bottom property if view equal vertical', () => {
        view.changeTipPosition(view.tipFrom, 100, 'vertical');

        assert.equal(100, parseFloat(view.tipFrom.style.bottom));
      });
    });

    describe('changeTipText', () => {
      afterEach(() => {
        view.tipFrom.textContent = '';
      });

      it('change text on tip', () => {
        const text = 'lalala';

        view.changeTipText(view.tipFrom, text);

        assert.equal(view.tipFrom.textContent, text);
      });
    });

    describe('changeBarFilling', () => {
      afterEach(() => {
        view.bar.style.cssText = '';
      });

      it('change left property if view doesn\'t equal vertical', () => {
        view.changeBarFilling(10, 100);

        assert.equal(parseFloat(view.bar.style.left), 10);
        assert.equal(parseFloat(view.bar.style.right), 100);
      });

      it('change bottom property if view equal vertical', () => {
        view.changeBarFilling(10, 100, 'vertical');

        assert.equal(parseFloat(view.bar.style.bottom), 10);
        assert.equal(parseFloat(view.bar.style.top), 100);
      });
    });

    describe('changeValue', () => {
      it('correct change value with 1 arg', () => {
        const value = 500;

        view.changeValue(value);

        assert.equal(value, view.input.value);
      });

      it('correct change value with 2 args', () => {
        const value1 = 12;
        const value2 = 17;

        view.changeValue(value1, value2);

        assert.equal(view.input.value, `${value1} - ${value2}`);
      });
    });
  });
});

mocha.run();
