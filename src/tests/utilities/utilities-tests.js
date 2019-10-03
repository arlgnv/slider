/* eslint-disable import/extensions */
/* global describe it assert mocha */
import { createSliderTemplate, correctSettings } from '../../app/utilities.js';

describe('Utilities', () => {
  describe('Functions', () => {
    describe('createSliderTemplate', () => {
      it('returns string type', () => {
        assert.isString(createSliderTemplate({}));
      });

      it("string has settings' theme", () => {
        const settings = { theme: 'aqua' };
        const template = createSliderTemplate(settings);

        assert.notEqual(template.indexOf(settings.theme), -1);
      });

      it('string has tip if settings tip = true', () => {
        const settings = { tip: true };

        const template = createSliderTemplate(settings);

        assert.notEqual(template.indexOf('lrs__tip'), -1);
      });

      it('string has second handle if settings range = true', () => {
        const settings = { range: true };

        const template = createSliderTemplate(settings);

        assert.notEqual(template.indexOf('lrs__handle_to'), -1);
      });
    });

    describe('correctSettings', () => {
      it('return object', () => {
        const correctedSettings = correctSettings({});

        assert.isObject(correctedSettings);
      });

      it('from equals min (from < min)', () => {
        const correctedSettings = correctSettings({ from: -1, min: 0 });

        assert.equal(correctedSettings.min, correctedSettings.from);
      });

      it('from equals max (from > max, range = false)', () => {
        const correctedSettings = correctSettings({ from: 11, max: 10 });

        assert.equal(correctedSettings.max, correctedSettings.from);
      });

      it('from between min and max (from > min, from < max, range = false)', () => {
        const correctedSettings = correctSettings({
          min: 0, from: 10, max: 20, range: false,
        });

        assert.equal(correctedSettings.from, 10);
      });

      it('from equals min (from > max, range = true)', () => {
        const correctedSettings = correctSettings({
          max: 100, from: 101, range: true,
        });

        assert.equal(correctedSettings.from, correctedSettings.min);
      });

      it('to equals max (to > max, range = true)', () => {
        const correctedSettings = correctSettings({
          max: 100, to: 101, range: true,
        });

        assert.equal(correctedSettings.to, correctedSettings.max);
      });

      it('to equals max (to < min, range = true)', () => {
        const correctedSettings = correctSettings({
          min: 0, to: -1, range: true,
        });

        assert.equal(correctedSettings.to, correctedSettings.max);
      });

      it('from and to switch places (from > to, range = true)', () => {
        const correctedSettings = correctSettings({
          min: 0, max: 100, from: 30, to: 20, range: true,
        });

        assert.equal(correctedSettings.from, 20);
        assert.equal(correctedSettings.to, 30);
      });

      it('return theme aqua (theme != red, theme != aqua)', () => {
        const correctedSettings = correctSettings({ theme: 'lalala' });

        assert.equal(correctedSettings.theme, 'aqua');
      });

      it('return view horizontal (view != horizontal, view != vertical)', () => {
        const correctedSettings = correctSettings({ view: 'lalala' });

        assert.equal(correctedSettings.view, 'horizontal');
      });

      it('return range false (range != true, range != false)', () => {
        const correctedSettings = correctSettings({ range: 'lalala' });

        assert.isFalse(correctedSettings.range);
      });

      it('step equal 1 (step < 0)', () => {
        const correctedSettings = correctSettings({ step: -13 });

        assert.equal(correctedSettings.step, 1);
      });
    });
  });
});

mocha.run();
