import { createSliderTemplate, correctSettings, EventEmitter } from "../../app/utilities.js";

describe('Utilities', () => {
  describe('Functions', () => {
    describe('createSliderTemplate', () => {
      it('returns string type', () => {
        const settings = {};

        assert.isString(createSliderTemplate(settings));
      });

      it("string has settings' theme", () => {
        const settings = { theme: 'aqua' };

        const template = createSliderTemplate(settings);

        assert.notEqual(template.indexOf(settings.theme), -1);
      });

      it('string has not handle__to--hidden if settings.range: true', () => {
        const settings = { range: true };

        const template = createSliderTemplate(settings);

        assert.equal(template.indexOf('lrs__handle--hidden'), -1);
      });
    });

    describe('correctSettings', () => {
      it('return object', () => {
        const settings = {
          from: 0,
          min: 0,
          max: 100,
          step: 1,
          range: false,
          view: 'horizontal',
          hideTip: true,
          theme: 'aqua',
        };
        const correctedSettings = correctSettings(settings);

        assert.isObject(correctedSettings);
      });

      it("change type from string to number on 'from, min, max, step, to'", () => {
        const settings = {
          from: '0',
          min: '0',
          max: '100',
          step: '1',
          range: true,
          to: '3',
          view: 'horizontal',
          hideTip: true,
          theme: 'aqua',
        };
        const correctedSettings = correctSettings(settings);

        assert.isNumber(correctedSettings.from);
        assert.isNumber(correctedSettings.to);
        assert.isNumber(correctedSettings.min);
        assert.isNumber(correctedSettings.max);
        assert.isNumber(correctedSettings.step);
      });

      it("'from' equal 'min' if 'from' less 'min' and 'range' is false", () => {
        const settings = {
          from: -13,
          min: 0,
          max: 100,
          step: 1,
          range: false,
          view: 'horizontal',
          hideTip: true,
          theme: 'aqua',
        };
        const correctedSettings = correctSettings(settings);

        assert.equal(correctedSettings.min, correctedSettings.from);
      });

      it("'from' equal 'max' if 'from' more 'max' and 'range' is false", () => {
        const settings = {
          from: 101,
          min: 0,
          max: 100,
          step: 1,
          range: false,
          view: 'horizontal',
          hideTip: true,
          theme: 'aqua',
        };
        const correctedSettings = correctSettings(settings);

        assert.equal(settings.max, correctedSettings.from);
      });

      it("'from' equal 'min' if 'range' is true and 'from' less 'min'", () => {
        const settings = {
          from: 9,
          min: 10,
          max: 100,
          step: 1,
          range: true,
          to: 20,
          view: 'horizontal',
          hideTip: true,
          theme: 'asdasdasd',
        };
        const correctedSettings = correctSettings(settings);

        assert.equal(correctedSettings.from, correctedSettings.min);
      });

      it("'from' equal 'to' if 'range' is true and 'from' more 'to'", () => {
        const settings = {
          from: 16,
          min: 10,
          max: 100,
          step: 1,
          range: true,
          to: 15,
          view: 'horizontal',
          hideTip: true,
          theme: 'asdasdasd',
        };
        const correctedSettings = correctSettings(settings);

        assert.equal(correctedSettings.from, correctedSettings.to);
      });

      it("'to' equal 'from' if 'range' is true and 'to' less 'from'", () => {
        const settings = {
          from: 10,
          min: 10,
          max: 100,
          step: 1,
          range: true,
          to: 5,
          view: 'horizontal',
          hideTip: true,
          theme: 'asdasdasd',
        };
        const correctedSettings = correctSettings(settings);

        assert.equal(correctedSettings.to, correctedSettings.from);
      });

      it("'to' equal 'max' if 'range' is true and 'to' more 'max'", () => {
        const settings = {
          from: 10,
          min: 10,
          max: 100,
          step: 1,
          range: true,
          to: 500,
          view: 'horizontal',
          hideTip: true,
          theme: 'asdasdasd',
        };
        const correctedSettings = correctSettings(settings);

        assert.equal(correctedSettings.to, correctedSettings.max);
      });

      it("return theme 'aqua' if 'theme' doesn't equal 'red' or 'aqua'", () => {
        const settings = {
          from: 101,
          min: 0,
          max: 100,
          step: 1,
          range: false,
          view: 'horizontal',
          hideTip: true,
          theme: 'asdasdasd',
        };
        const correctedSettings = correctSettings(settings);

        assert.equal(correctedSettings.theme, 'aqua');
      });

      it("'step' equal 1 if 'step' less 0", () => {
        const settings = {
          from: 0,
          min: 0,
          max: 100,
          step: -13,
          range: false,
          view: 'horizontal',
          hideTip: true,
          theme: 'asdasdasd',
        };
        const correctedSettings = correctSettings(settings);

        assert.equal(correctedSettings.step, 1);
      });
    });
  });

  describe('Classes', () => {
    describe('EventEmitter', () => {
      it('attach callback to event', () => {
        const events = new EventEmitter();
        const typeEvent = 'drag';
        const callback = () => "It's me";

        events.on(typeEvent, callback);

        assert.equal(callback, events.events[typeEvent]);
      });
    });
  });
});

mocha.run();
