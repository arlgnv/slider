import App from '../../app/app.js';

describe('App', () => {
  it('template is initialized on the page', () => {
    const input = document.createElement('input');
    input.classList.add('range');
    document.body.appendChild(input);

    new App(input, {});

    assert.isOk(document.querySelectorAll('.lrs'));
  });
});

mocha.run();
