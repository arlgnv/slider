// import Model from '../../js/model.js';
// import View from '../../js/view.js';
// import Presenter from '../../js/presenter.js';

// const model = new Model({
//   min: 0,
//   max: 100,
//   step: 1,
//   from: 0,
//   range: true,
//   to: 100,
//   view: 'horizontal',
//   tip: true,
//   theme: 'aqua',
// });
// const view = new View(document.querySelector('.range'), '<span class="lrs lrs_aqua"><span class="lrs__handle lrs__handle_from"></span><span class="lrs__tip lrs__tip_from"></span><span class="lrs__bar"></span><span class="lrs__handle lrs__handle_to"></span><span class="lrs__tip lrs__tip_to"></span></span>');
// const presenter = new Presenter(model, view);

// describe('Presenter', () => {
//   describe('Methods', () => {
//     describe('correctExtremeHandlePositions', () => {
//       it('return 0 (handle = handleFrom, handlePosition < 0, range = false, view = horizontal)', () => {
//         assert.equal(presenter.correctExtremeHandlePositions(-1, view.handleFrom), 0);
//       });

//       it("return max-handle's-position (handle = handleFrom, handlePosition > max-handle's-position, range = false, view = horizontal)", () => {
//         const maxHandlePosition = view.slider.offsetWidth - view.handleFrom.offsetWidth;

//         assert.equal(presenter.correctExtremeHandlePositions(maxHandlePosition + 1, view.handleFrom), maxHandlePosition);
//       });

//       it("returns handle's position (handle = handleFrom, handlePosition > 0 and < max handle's position, range = false)", () => {
//         const maxHandlePosition = view.slider.offsetWidth - view.handleFrom.offsetWidth;
//         const handlePosition = Math.floor(Math.random() * (maxHandlePosition - 0 + 1)) + 0;

//         assert.equal(presenter.correctExtremeHandlePositions(handlePosition, view.handleFrom), handlePosition);
//       });

//       it('returns 0 (handle = handleFrom, handlePosition < 0, range = true)', () => {
//         model.state.range = true;

//         assert.equal(presenter.correctExtremeHandlePositions(-1, view.handleFrom), 0);
//       });

//       it("returns handleTo's position (handle = handleFrom, handlePosition > handleTo's position, range = true)", () => {
//         model.state.range = true;
//         const handleToPosition = parseFloat(view.handleTo.style.left);

//         assert.equal(presenter.correctExtremeHandlePositions(handleToPosition + 1, view.handleFrom), handleToPosition);
//       });

//       it("returns handle's position (handle = handleFrom, handlePosition > 0 and < handleTo's position, range = true)", () => {
//         model.state.range = true;
//         const handleToPosition = parseFloat(view.handleTo.style.left);
//         const handlePosition = Math.floor(Math.random() * (handleToPosition - 0 + 1)) + 0;

//         assert.equal(presenter.correctExtremeHandlePositions(handlePosition, view.handleFrom), handlePosition);
//       });

//       it("returns handleFrom's position (handle = handleTo, handlePosition < handleFrom's position, range = true)", () => {
//         model.state.range = true;
//         const minHandlePosition = parseFloat(view.handleFrom.style.left);

//         assert.equal(presenter.correctExtremeHandlePositions(minHandlePosition - 1, view.handleTo), minHandlePosition);
//       });

//       it("returns max handle's position (handle = handleTo, handlePosition > max handle's position, range = true)", () => {
//         model.state.range = true;
//         const maxHandlePosition = view.slider.offsetWidth - view.handleTo.offsetWidth;

//         assert.equal(presenter.correctExtremeHandlePositions(maxHandlePosition + 1, view.handleTo), maxHandlePosition);
//       });

//       it("returns handle's position (handle = handleTo, handlePosition > handleFrom's position and < max handle's position, range = true)", () => {
//         model.state.range = true;
//         const minHandlePosition = parseFloat(view.handleFrom.style.left);
//         const maxHandlePosition = view.slider.offsetWidth - view.handleTo.offsetWidth;
//         const handlePosition = Math.floor(Math.random() * (maxHandlePosition - minHandlePosition + 1))
//           + minHandlePosition;

//         assert.equal(presenter.correctExtremeHandlePositions(handlePosition, view.handleTo), handlePosition);
//       });
//     });

//     describe('correctValueWithStep', () => {
//       it('return value (value = min-value or value = max-value)', () => {
//         assert.equal(presenter.correctValueWithStep(model.state.min), model.state.min);
//         assert.equal(presenter.correctValueWithStep(model.state.max), model.state.max);
//       });

//       it('return correct value (value > min-value and value < max-value)', () => {
//         model.state.min = 9;
//         model.state.step = 3;
//         const value = 11;
//         const neededValue = 12;

//         assert.equal(presenter.correctValueWithStep(value), neededValue);
//       });
//     });
//   });
// });

// mocha.run();
