import View from "../../app/mvc/view.js";

const view = new View(document.querySelector('.range'), document.querySelector('.lrs'));

describe('View', () => {
  describe('Constructor', () => {});

  describe('Methods', () => {
    describe('changeHandlePosition', () => {
      it('correct change postition with random value', () => {
        const position = Math.floor(Math.random() * (1000 - 0 + 1)) + 0;

        view.changeHandlePosition(position, view.handleFrom);

        assert.equal(position, parseFloat(view.handleFrom.style.left));
      });
    });

    describe('changeTipPosition', () => {
      it('correct change postition with random value', () => {
        const position = Math.floor(Math.random() * (1000 - 0 + 1)) + 0;

        view.changeTipPosition(position, view.tipFrom);

        assert.equal(position, parseFloat(view.tipFrom.style.left));
      });

      it("doesn't change postition on hidden tip", () => {
        view.tipTo.style.left = '0px';
        const tipToPosition = parseFloat(view.tipTo.style.left);

        const position = Math.floor(Math.random() * (1000 - 0 + 1)) + 0;
        view.changeTipPosition(position, view.tipTo);

        assert.equal(tipToPosition, parseFloat(view.tipTo.style.left));
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
