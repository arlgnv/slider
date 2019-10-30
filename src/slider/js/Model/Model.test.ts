import Model from './Model';
import IParameters from '../Interfaces/IParameters';

test("Model's state is an empty object by default", () => {
  const model: Model = new Model();
  const state: IParameters = model.getState();

  expect(Object.keys(state).length).toBe(0);
});

test("Model's state equals to parameters", () => {
  const parameters = { theme: 'aqua', lala: 'lala' };
  const model = new Model(parameters);
  const state: IParameters = model.getState();

  expect(state).toEqual(parameters);
});

// import correctSettings from './utilities';

// test('from equals min (from < min)', () => {
//   const correctedSettings = correctSettings({ from: -1, min: 0 });

//   expect(correctedSettings.from).toBe(correctedSettings.min);
// });

// test('from equals max (from > max, hasInterval = false)', () => {
//   const correctedSettings = correctSettings({ from: 11, max: 10 });

//   expect(correctedSettings.from).toBe(correctedSettings.max);
// });

// test('from between min and max (from > min, from < max, hasInterval = false)', () => {
//   const correctedSettings = correctSettings({
//     min: 0, from: 10, max: 20, hasInterval: false,
//   });

//   expect(correctedSettings.from).toBe(10);
// });

// test('from equals min (from > max, hasInterval = true)', () => {
//   const correctedSettings = correctSettings({
//     max: 100, from: 101, hasInterval: true,
//   });

//   expect(correctedSettings.from).toBe(correctedSettings.min);
// });

// test('to equals max (to > max, hasInterval = true)', () => {
//   const correctedSettings = correctSettings({
//     max: 100, to: 101, hasInterval: true,
//   });

//   expect(correctedSettings.to).toBe(correctedSettings.max);
// });

// test('to equals max (to < min, hasInterval = true)', () => {
//   const correctedSettings = correctSettings({
//     min: 0, to: -1, hasInterval: true,
//   });

//   expect(correctedSettings.to).toBe(correctedSettings.max);
// });

// test('from and to switch places (from > to, hasInterval = true)', () => {
//   const correctedSettings = correctSettings({
//     min: 0, max: 100, from: 30, to: 20, hasInterval: true,
//   });

//   expect(correctedSettings.from).toBe(20);
//   expect(correctedSettings.to).toBe(30);
// });

// test('return theme aqua (theme != red, theme != aqua)', () => {
//   const correctedSettings = correctSettings({ theme: 'lalala' });

//   expect(correctedSettings.theme).toBe('aqua');
// });

// test('return isVertical = false (isVertical != true, isVertical != false)', () => {
//   const correctedSettings = correctSettings({ isVertical: 'lalala' });

//   expect(correctedSettings.isVertical).toBe(false);
// });

// test('return hasInterval false (hasInterval != true, hasInterval != false)', () => {
//   const correctedSettings = correctSettings({ hasInterval: 'lalala' });

//   expect(correctedSettings.hasInterval).toBe(false);
// });

// test('step equal 1 (step < 0)', () => {
//   const correctedSettings = correctSettings({ step: -13 });

//   expect(correctedSettings.step).toBe(1);
// });
