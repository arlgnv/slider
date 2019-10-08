/* eslint-disable no-new */
/* global test expect document */

import App from './App';

test('template is initialized on the page', () => {
  const input = document.createElement('input');
  document.body.appendChild(input);

  new App(input, {});

  expect(document.querySelector('.lrs')).toBeTruthy();
});
