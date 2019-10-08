/* global test expect */

import Model from './Model';

test("Model's state is an empty object by default", () => {
  const model = new Model();

  expect(Object.keys(model.state).length).toBe(0);
});

test("Model's state equals to parameters", () => {
  const parameters = { theme: 'aqua', lala: 'lala' };
  const model = new Model(parameters);

  expect(model.state).toBe(parameters);
});
