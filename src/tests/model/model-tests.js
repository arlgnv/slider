/* eslint-disable import/extensions */
/* global describe it assert mocha */
import Model from '../../app/mvp/model.js';

describe('Model', () => {
  describe('Constructor', () => {
    it("Model's state is an empty object by default", () => {
      const model = new Model();

      assert.isObject(model.state);
      assert.isEmpty(model.state);
    });

    it("Model's state equals to parameters", () => {
      const parameters = { theme: 'aqua', lala: 'lala' };

      const model = new Model(parameters);

      assert.strictEqual(parameters, model.state);
    });
  });
});

mocha.run();
