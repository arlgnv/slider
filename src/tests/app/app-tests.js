/* eslint-disable import/extensions */
/* global document describe it assert mocha */
import App from '../../app/app.js';

describe('App', () => {
  it('template is initialized on the page', () => {
    const input = document.createElement('input');
    document.body.appendChild(input);

    new App(input, {});

    assert.isOk(document.querySelector('.lrs'));
  });
});

mocha.run();
